'use strict';

const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const tls = require('tls');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

admin.initializeApp();
const db = admin.firestore();
const fbAuth = admin.auth();

// ── Express app ──────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: true, credentials: true }));
// `verify` captures the raw request body so we can validate the Paystack
// webhook's HMAC signature later without adding a second body parser.
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

// ── Firestore helpers ─────────────────────────────────────────────────────────
const toDoc = (snap) => (snap.exists ? { id: snap.id, ...snap.data() } : null);
const toDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));
const now = () => admin.firestore.Timestamp.now();

// ── Auth middleware ───────────────────────────────────────────────────────────
const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    req.user = await fbAuth.verifyIdToken(header.split(' ')[1]);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const adminOnly = (req, res, next) => {
  const role = req.user?.role;
  if (role !== 'OMEGA' && role !== 'ADMIN') {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};

const DEFAULT_SITE_SETTINGS = {
  companyName: 'Stormglide Technologies',
  logoUrl: '/logo.png',
  // Uploaded from Admin > Website settings — a data: URI stored inline so no
  // Cloud Storage bucket is required. Empty until an admin uploads a logo.
  logoDataUri: '',
  faviconUrl: '/icon.png',
  primaryColor: '#2563EB',
  secondaryColor: '#0F172A',
  accentColor: '#F5A623',
  backgroundColor: '#0B0F19',
  foregroundColor: '#FFFFFF',
  heroHeadline: 'Software systems built for serious growth.',
  heroSubtext: 'Web platforms, mobile products, and business systems designed and engineered in Accra.',
  contactEmail: 'john@stormglide.io',
  contactPhone: '',
  invoiceCompanyName: 'Stormglide.io',
  invoiceAddress: 'Accra, Ghana',
  invoiceTaxId: '',
  bankPrimaryName: 'Absa Bank',
  bankPrimaryAccountName: 'Stormglide',
  bankPrimaryAccountNumber: '0041131632',
  bankPrimaryBranch: 'East Legon Branch',
  bankSecondaryName: 'Stanbic Bank',
  bankSecondaryAccountName: 'Stormglide',
  bankSecondaryAccountNumber: '9040012518859',
  bankSecondaryBranch: 'University of Ghana',
  invoiceTerms: 'Payment is due by the due date shown on this invoice. Amounts are quoted in the currency stated and are non-refundable once services have commenced or products have been delivered, except as required by law. Invoices unpaid 14 days past the due date may attract a 5% late fee and paused delivery until settled.',
  invoiceWarranty: 'Stormglide.io warrants that delivered software will perform substantially as agreed for 30 days from delivery, covering defects in workmanship only. This warranty does not cover changes to third-party services, misuse, or modifications made after delivery. Third-party or licensed products are covered under their original vendor warranty where applicable.',
  twitterUrl: '',
  linkedinUrl: 'https://www.linkedin.com/company/stormglide-io/',
  githubUrl: '',
};

const SITE_SETTING_FIELDS = new Set(Object.keys(DEFAULT_SITE_SETTINGS));

// logoDataUri holds an inline base64 image (no Cloud Storage bucket needed);
// every other setting is a short display string.
const LOGO_DATA_URI_MAX_LENGTH = 700_000; // ~525KB decoded, well under Firestore's 1MB doc limit
const isValidLogoDataUri = (value) => /^data:image\/(png|jpeg|jpg);base64,[A-Za-z0-9+/=]+$/.test(value);

const sanitizeSiteSettings = (value) => Object.fromEntries(
  Object.entries(value || {})
    .filter(([key, setting]) => SITE_SETTING_FIELDS.has(key) && typeof setting === 'string')
    .map(([key, setting]) => {
      if (key === 'logoDataUri') {
        const trimmed = setting.trim();
        if (!trimmed) return [key, ''];
        return [key, isValidLogoDataUri(trimmed) && trimmed.length <= LOGO_DATA_URI_MAX_LENGTH ? trimmed : null];
      }
      return [key, setting.trim().slice(0, 1000)];
    })
    .filter(([, setting]) => setting !== null)
);

const sanitizeTeamMember = (value) => {
  const body = value || {};
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
  if (!name) return null;

  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 120) : '';
  const bio = typeof body.bio === 'string' ? body.bio.trim().slice(0, 600) : '';
  const linkedinUrl = typeof body.linkedinUrl === 'string' ? body.linkedinUrl.trim().slice(0, 300) : '';

  let photoDataUri = '';
  if (typeof body.photoDataUri === 'string' && body.photoDataUri.trim()) {
    const trimmed = body.photoDataUri.trim();
    if (isValidLogoDataUri(trimmed) && trimmed.length <= LOGO_DATA_URI_MAX_LENGTH) {
      photoDataUri = trimmed;
    }
  }

  const order = Number.isFinite(body.order) ? body.order : 0;

  return { name, title, bio, linkedinUrl, photoDataUri, order };
};

// ── Email via Resend ──────────────────────────────────────────────────────────
const sendEmail = (to, subject, html) => {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.warn('RESEND_API_KEY not set — email skipped'); return Promise.resolve(); }

  const body = JSON.stringify({
    from: process.env.FROM_EMAIL || 'noreply@stormglide.io',
    to, subject, html,
  });
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'api.resend.com', path: '/emails', method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => { res.resume(); resolve(); }
    );
    req.on('error', (e) => { console.error('Email error:', e.message); resolve(); });
    req.write(body);
    req.end();
  });
};

const emailMagicLink = (to, url) => sendEmail(to, 'Your Stormglide Portal Access Link',
  `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;padding:32px">
    <div style="font-size:22px;font-weight:700;margin-bottom:8px;color:#22D3EE">Stormglide.io</div>
    <h2 style="font-size:18px;font-weight:600;margin:0 0 16px">Your secure login link</h2>
    <p style="color:#9ca3af;margin-bottom:24px">Click below to access your client portal. Expires in 60 minutes.</p>
    <a href="${url}" style="display:inline-block;background:#22D3EE;color:#04181f;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none">Access Portal →</a>
    <p style="color:#6b7280;font-size:11px;margin-top:24px">Didn't request this? You can safely ignore it.</p>
  </div>`
);

const emailInvoice = (to, inv) => sendEmail(to,
  `Invoice ${inv.invoiceNumber} — ${inv.currency} ${Number(inv.amount).toLocaleString()}`,
  `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;padding:32px">
    <div style="font-size:22px;font-weight:700;margin-bottom:8px;color:#22D3EE">Stormglide.io</div>
    <h2 style="font-size:18px;margin:0 0 24px">Invoice ${inv.invoiceNumber}</h2>
    ${Array.isArray(inv.items) && inv.items.length ? `
    <div style="border:1px solid #1f2937;border-radius:12px;overflow:hidden;margin-bottom:20px">
      ${inv.items.map((item) => `
        <div style="display:flex;justify-content:space-between;gap:12px;padding:12px 16px;border-bottom:1px solid #1f2937">
          <span style="color:#e5e7eb;font-size:13px">${item.description}${item.quantity > 1 ? ` × ${item.quantity}` : ''}</span>
          <span style="color:#9ca3af;font-size:13px;white-space:nowrap">${inv.currency} ${(item.quantity * item.unitPrice).toLocaleString()}</span>
        </div>`).join('')}
    </div>` : ''}
    <div style="background:#111827;border-radius:12px;padding:20px;margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="color:#9ca3af">Amount Due</span>
        <strong style="font-size:20px">${inv.currency} ${Number(inv.amount).toLocaleString()}</strong>
      </div>
      <div style="display:flex;justify-content:space-between">
        <span style="color:#9ca3af">Due Date</span><span>${inv.dueDate}</span>
      </div>
    </div>
    ${inv.paymentLink ? `<a href="${inv.paymentLink}" style="display:inline-block;background:#22D3EE;color:#04181f;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none">Pay Now →</a>` : ''}
    <p style="color:#6b7280;font-size:12px;margin-top:24px">Questions? Reply to this email.</p>
  </div>`
);

// Separate from ADMIN_EMAIL (which also gates admin login, see
// getAllowedAdminEmails below) — this is just where lead/estimator
// notifications and the daily analytics digest go.
const LEAD_NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || 'admin@stormglide.io';

const emailNewLead = (lead) => sendEmail(
  LEAD_NOTIFY_EMAIL,
  `New ${lead.source === 'price_estimator' ? 'estimate request' : 'lead'} — ${lead.name}`,
  `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;padding:32px">
    <div style="font-size:22px;font-weight:700;margin-bottom:16px;color:#22D3EE">Stormglide.io — New Lead</div>
    <div style="padding:16px;border-radius:8px;background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.25);margin-bottom:20px">
      <h3 style="margin:0 0 4px;color:#fff">${lead.name}</h3>
      <p style="margin:0;color:#9ca3af;font-size:13px">${lead.email}${lead.phone ? ' · ' + lead.phone : ''}</p>
    </div>
    ${lead.organization ? `<p style="color:#9ca3af;margin:0 0 8px"><strong style="color:#fff">Organization:</strong> ${lead.organization}</p>` : ''}
    ${lead.missionScope ? `<p style="color:#9ca3af;margin:0 0 8px"><strong style="color:#fff">Project:</strong> ${lead.missionScope}</p>` : ''}
    ${lead.budget ? `<p style="color:#9ca3af;margin:0 0 8px"><strong style="color:#fff">Estimated budget:</strong> ${lead.budget}</p>` : ''}
    ${lead.timeline ? `<p style="color:#9ca3af;margin:0 0 8px"><strong style="color:#fff">Timeline:</strong> ${lead.timeline}</p>` : ''}
    ${lead.details ? `<p style="color:#9ca3af;margin:16px 0 0;white-space:pre-wrap">${lead.details}</p>` : ''}
    <p style="color:#6b7280;font-size:11px;margin-top:24px">Source: ${lead.source || 'unknown'} · <a href="${process.env.FRONTEND_URL || 'https://stormglide.io'}" style="color:#22D3EE">View in Mission Control</a></p>
  </div>`
);

const emailAlert = (alert) => sendEmail(
  process.env.ADMIN_EMAIL || 'admin@stormglide.io',
  `[${(alert.severity || '').toUpperCase()}] ${alert.title}`,
  `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;padding:32px">
    <div style="font-size:22px;font-weight:700;margin-bottom:16px;color:#22D3EE">Stormglide.io — Alert</div>
    <div style="padding:12px 16px;border-radius:8px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);margin-bottom:20px">
      <span style="font-size:11px;font-weight:700;letter-spacing:2px;color:#f87171">${(alert.severity || '').toUpperCase()}</span>
      <h3 style="margin:4px 0 0;color:#fff">${alert.title}</h3>
    </div>
    <p style="color:#9ca3af">${alert.description}</p>
    ${alert.clientName ? `<p style="color:#6b7280;font-size:12px">Client: ${alert.clientName}</p>` : ''}
  </div>`
);

const emailPhase = (to, d) => sendEmail(to, `Project Update: ${d.projectName} — ${d.newPhase}`,
  `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;padding:32px">
    <div style="font-size:22px;font-weight:700;margin-bottom:8px;color:#22D3EE">Stormglide.io</div>
    <h2 style="font-size:18px;margin:0 0 16px">Project Phase Update</h2>
    <p style="color:#9ca3af">Hi ${d.clientName},</p>
    <p style="color:#9ca3af">Your project <strong style="color:#fff">${d.projectName}</strong> has advanced to the <strong style="color:#22D3EE">${d.newPhase}</strong> phase.</p>
    <a href="${d.portalUrl}" style="display:inline-block;background:#22D3EE;color:#04181f;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;margin-top:16px">View in Portal →</a>
  </div>`
);

// ── Audit log helper ──────────────────────────────────────────────────────────
// Fire-and-forget so a logging failure never blocks the actual mutation.
const logAudit = (req, action, entityType, entityId, details) => {
  db.collection('auditLogs').add({
    action, entityType, entityId: entityId || null,
    adminId: req.user.uid, adminEmail: req.user.email || null,
    details: details || null, createdAt: now(),
  }).catch((e) => console.error('Audit log write failed:', e.message));
};

// ── Deduplicating alert helper ────────────────────────────────────────────────
const createAlertIfNew = async (clientId, type, severity, title, description, clientName) => {
  const existing = await db.collection('alertRecords')
    .where('clientId', '==', clientId)
    .where('type', '==', type)
    .where('title', '==', title)
    .where('resolved', '==', false)
    .limit(1).get();
  if (!existing.empty) return;

  await db.collection('alertRecords').add({
    type, severity, title, description,
    clientId, clientName: clientName || null,
    resolved: false, resolvedAt: null, resolvedBy: null,
    createdAt: now(), updatedAt: now(),
  });

  if (severity === 'critical' || severity === 'high') {
    await emailAlert({ title, description, severity, clientName });
  }
};

// ── Paystack payment link ─────────────────────────────────────────────────────
// `callbackPath` defaults to the client portal for backward compatibility with
// existing callers; the public invoice pay flow passes its own return path.
const paystackLink = (invoice, email, callbackPath = '/portal') => new Promise((resolve) => {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) return resolve(null);
  const body = JSON.stringify({
    email, amount: Math.round(Number(invoice.amount) * 100),
    currency: invoice.currency, reference: invoice.invoiceNumber,
    callback_url: `${process.env.FRONTEND_URL || 'https://stormglide.io'}${callbackPath}`,
  });
  const req = https.request(
    {
      hostname: 'api.paystack.co', path: '/transaction/initialize', method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    },
    (res) => {
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => { try { resolve(JSON.parse(d).data?.authorization_url || null); } catch { resolve(null); } });
    }
  );
  req.on('error', () => resolve(null));
  req.write(body);
  req.end();
});

// Verifies Paystack's `x-paystack-signature` header: HMAC-SHA512 of the raw
// request body, keyed with the Paystack secret key.
const verifyPaystackSignature = (req) => {
  const key = process.env.PAYSTACK_SECRET_KEY;
  const signature = req.headers['x-paystack-signature'];
  if (!key || !signature || !req.rawBody) return false;
  const hash = crypto.createHmac('sha512', key).update(req.rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  } catch {
    return false;
  }
};

// ── Invoice line items ────────────────────────────────────────────────────────
const INVOICE_ITEM_TYPES = new Set(['PRODUCT', 'SERVICE']);

const sanitizeInvoiceItems = (rawItems) => {
  if (!Array.isArray(rawItems) || !rawItems.length) return null;
  const items = rawItems.map((item) => {
    const quantity = Math.max(0, Number(item?.quantity) || 0);
    const unitPrice = Math.max(0, Number(item?.unitPrice) || 0);
    // `name` is the required bold title; `description` is optional detail text.
    // Falls back to the legacy single `description` field for older clients.
    const name = String(item?.name || item?.description || '').trim().slice(0, 200);
    const description = String(item?.description && item?.name ? item.description : '').trim().slice(0, 500);
    const type = INVOICE_ITEM_TYPES.has(item?.type) ? item.type : 'SERVICE';
    if (!name || quantity <= 0) return null;
    return { type, name, description, quantity, unitPrice };
  }).filter(Boolean);
  return items.length ? items : null;
};

const computeInvoiceTotals = (items, taxPercent, discountPercent) => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = Math.max(0, Number(taxPercent) || 0);
  const discount = Math.max(0, Number(discountPercent) || 0);
  const discountAmount = round2(subtotal * (discount / 100));
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = round2(taxableAmount * (tax / 100));
  const amount = round2(taxableAmount + taxAmount);
  return { subtotal: round2(subtotal), taxPercent: tax, discountPercent: discount, taxAmount, discountAmount, amount };
};

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

// ── Branded PDF invoice ────────────────────────────────────────────────────────
let cachedLogoBytes = null;
const getLogoBytes = () => {
  if (cachedLogoBytes) return cachedLogoBytes;
  try {
    cachedLogoBytes = fs.readFileSync(path.join(__dirname, 'assets', 'logo.png'));
  } catch {
    cachedLogoBytes = null;
  }
  return cachedLogoBytes;
};

// Greedy word-wrap: packs words into lines no wider than maxWidth at the given font/size.
const wrapText = (text, textFont, size, maxWidth) => {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (textFont.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
};

// Parses a #rrggbb hex string into a pdf-lib rgb() color; falls back to the
// Stormglide teal if the value is missing or malformed.
const hexToRgb = (hex, rgbFn, fallback = [0.13, 0.83, 0.93]) => {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!match) return rgbFn(...fallback);
  const int = parseInt(match[1], 16);
  return rgbFn(((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255);
};

const buildInvoicePdf = async (invoice, client, settings) => {
  const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4
  const firstPage = page;
  const { width, height } = page.getSize();
  const PAGE_BOTTOM_MARGIN = 64;
  const newPage = () => {
    page = pdfDoc.addPage([width, height]);
    return height - 56;
  };
  const ensureSpace = (currentY, needed) => (currentY - needed < PAGE_BOTTOM_MARGIN ? newPage() : currentY);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const ink = rgb(0.07, 0.09, 0.13);
  const muted = rgb(0.45, 0.48, 0.53);
  const line = rgb(0.88, 0.9, 0.93);
  const brand = hexToRgb(settings.primaryColor, rgb, [0.13, 0.83, 0.93]);
  const brand2 = hexToRgb(settings.secondaryColor, rgb, [0.09, 0.53, 1]);
  const brandTint = hexToRgb(settings.primaryColor, (r, g, b) => rgb(r + (1 - r) * 0.9, g + (1 - g) * 0.9, b + (1 - b) * 0.9), [0.13, 0.83, 0.93]);

  // Top gradient bar — segmented rectangles blending brand -> brand2 across the page width.
  const GRADIENT_SEGMENTS = 24;
  const barHeight = 7;
  for (let i = 0; i < GRADIENT_SEGMENTS; i++) {
    const t = i / (GRADIENT_SEGMENTS - 1);
    const segColor = rgb(
      brand.red + (brand2.red - brand.red) * t,
      brand.green + (brand2.green - brand.green) * t,
      brand.blue + (brand2.blue - brand.blue) * t,
    );
    page.drawRectangle({ x: (width / GRADIENT_SEGMENTS) * i, y: height - barHeight, width: width / GRADIENT_SEGMENTS + 1, height: barHeight, color: segColor });
  }

  let y = height - 56 - barHeight / 2;

  // Prefer a logo uploaded via Website Settings; fall back to the bundled default.
  let logoImage = null;
  const uploadedMatch = /^data:image\/(png|jpe?g);base64,(.+)$/.exec(settings.logoDataUri || '');
  if (uploadedMatch) {
    try {
      const bytes = Buffer.from(uploadedMatch[2], 'base64');
      logoImage = uploadedMatch[1] === 'png' ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
    } catch {
      logoImage = null;
    }
  }
  if (!logoImage) {
    const logoBytes = getLogoBytes();
    if (logoBytes) logoImage = await pdfDoc.embedPng(logoBytes);
  }
  let logoH = 0;
  if (logoImage) {
    const logoW = 190;
    logoH = (logoImage.height / logoImage.width) * logoW;
    page.drawImage(logoImage, { x: 48, y: y - logoH + 10, width: logoW, height: logoH });
  } else {
    page.drawText(settings.invoiceCompanyName || 'Stormglide.io', { x: 48, y, size: 16, font: bold, color: ink });
  }

  page.drawText('INVOICE', { x: width - 200, y, size: 22, font: bold, color: brand });
  page.drawText(invoice.invoiceNumber, { x: width - 200, y: y - 20, size: 11, font, color: muted });

  // Header gap scales with the logo's actual rendered height so a large or
  // unusually tall/wide uploaded logo never collides with the next section.
  y -= Math.max(70, logoH + 20);
  page.drawLine({ start: { x: 48, y }, end: { x: width - 48, y }, thickness: 1.5, color: brand });
  y -= 24;

  // From / Bill To / Details — three columns
  const colFrom = 48;
  const colBillTo = 230;
  const colDetails = 400;

  page.drawText('FROM', { x: colFrom, y, size: 8, font: bold, color: brand });
  page.drawText('BILL TO', { x: colBillTo, y, size: 8, font: bold, color: brand });
  page.drawText('DETAILS', { x: colDetails, y, size: 8, font: bold, color: brand });
  y -= 16;

  const fromLines = [
    settings.invoiceCompanyName || 'Stormglide.io',
    settings.invoiceAddress || 'Accra, Ghana',
    settings.contactEmail || '',
    settings.contactPhone || '',
    settings.invoiceTaxId ? `TIN: ${settings.invoiceTaxId}` : '',
  ].filter(Boolean);

  const billToLines = [
    client?.companyName || 'Client',
    client?.contactName || '',
    client?.email || '',
  ].filter(Boolean);

  const STATUS_COLORS = {
    DRAFT: muted, SENT: brand2, PAID: rgb(0.13, 0.7, 0.4), OVERDUE: rgb(0.86, 0.2, 0.2), VOID: muted,
  };

  const drawColumn = (lines, x, startY) => {
    let cy = startY;
    lines.forEach((text, i) => {
      page.drawText(text, { x, y: cy, size: 10, font: i === 0 ? bold : font, color: i === 0 ? ink : muted });
      cy -= 14;
    });
    return cy;
  };

  const afterFrom = drawColumn(fromLines, colFrom, y);
  const afterBillTo = drawColumn(billToLines, colBillTo, y);
  page.drawText(`Issued: ${formatPdfDate(invoice.issuedAt || invoice.createdAt)}`, { x: colDetails, y, size: 10, font, color: muted });
  page.drawText(`Due: ${formatPdfDate(invoice.dueDate)}`, { x: colDetails, y: y - 14, size: 10, font, color: muted });
  const statusColor = STATUS_COLORS[invoice.status] || muted;
  const statusLabel = String(invoice.status);
  const statusWidth = bold.widthOfTextAtSize(statusLabel, 8);
  page.drawRectangle({ x: colDetails, y: y - 32, width: statusWidth + 16, height: 15, color: statusColor, opacity: 0.14 });
  page.drawText(statusLabel, { x: colDetails + 8, y: y - 28, size: 8, font: bold, color: statusColor });
  const afterDetails = y - 32 - 14;
  y = Math.min(afterFrom, afterBillTo, afterDetails) - 24;

  // Items table
  const drawItemsHeader = (headerY) => {
    page.drawRectangle({ x: 48, y: headerY - 20, width: width - 96, height: 24, color: brand });
    page.drawText('ITEM', { x: 56, y: headerY - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
    page.drawText('TYPE', { x: 300, y: headerY - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
    page.drawText('QTY', { x: 370, y: headerY - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
    page.drawText('UNIT PRICE', { x: 420, y: headerY - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
    page.drawText('TOTAL', { x: width - 100, y: headerY - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
    return headerY - 20;
  };
  y = drawItemsHeader(y);

  const items = Array.isArray(invoice.items) ? invoice.items : [];
  const descMaxWidth = 235;
  items.forEach((item, i) => {
    // Wrap the full name and description — never silently truncate real
    // invoice content. Rows grow to fit; pagination below handles overflow.
    const nameLines = wrapText(item.name, bold, 9.5, descMaxWidth);
    const descLines = item.description ? wrapText(item.description, italic, 8.5, descMaxWidth) : [];
    const nameBlockHeight = nameLines.length * 13;
    const descBlockHeight = descLines.length * 12;
    const rowHeight = 10 + nameBlockHeight + descBlockHeight;

    // Break to a new page (with a fresh header) if this row won't fit.
    if (y - rowHeight < PAGE_BOTTOM_MARGIN) {
      y = newPage();
      y = drawItemsHeader(y);
    }

    y -= rowHeight;
    if (i % 2 === 1) {
      page.drawRectangle({ x: 48, y: y - 2, width: width - 96, height: rowHeight, color: rgb(0.97, 0.98, 0.99) });
    }
    const rowTop = y + rowHeight - 14;
    nameLines.forEach((l, li) => {
      page.drawText(l, { x: 56, y: rowTop - li * 13, size: 9.5, font: bold, color: ink });
    });
    const descTop = rowTop - nameBlockHeight;
    descLines.forEach((l, li) => {
      page.drawText(l, { x: 56, y: descTop - li * 12, size: 8.5, font: italic, color: muted });
    });
    page.drawText(item.type === 'PRODUCT' ? 'Product' : 'Service', { x: 300, y: rowTop, size: 9.5, font, color: muted });
    page.drawText(String(item.quantity), { x: 370, y: rowTop, size: 9.5, font, color: muted });
    page.drawText(money2(item.unitPrice), { x: 420, y: rowTop, size: 9.5, font, color: muted });
    const lineTotal = money2(item.quantity * item.unitPrice);
    const totalWidth = font.widthOfTextAtSize(lineTotal, 9.5);
    page.drawText(lineTotal, { x: width - 56 - totalWidth, y: rowTop, size: 9.5, font: bold, color: ink });
  });

  y -= 20;
  page.drawLine({ start: { x: 48, y }, end: { x: width - 48, y }, thickness: 1, color: line });
  y -= 20;

  // Totals block, right-aligned
  const totalsX = width - 220;
  const drawTotalRow = (label, value, isFinal, finalColor) => {
    const rowColor = isFinal ? (finalColor || ink) : muted;
    page.drawText(label, { x: totalsX, y, size: isFinal ? 11 : 9.5, font: isFinal ? bold : font, color: rowColor });
    const valStr = `${invoice.currency} ${value}`;
    const valWidth = (isFinal ? bold : font).widthOfTextAtSize(valStr, isFinal ? 11 : 9.5);
    page.drawText(valStr, { x: width - 56 - valWidth, y, size: isFinal ? 11 : 9.5, font: isFinal ? bold : font, color: rowColor });
    y -= isFinal ? 22 : 16;
  };

  drawTotalRow('Subtotal', money2(invoice.subtotal ?? invoice.amount));
  if (invoice.discountAmount) drawTotalRow(`Discount (${invoice.discountPercent || 0}%)`, `-${money2(invoice.discountAmount)}`);
  if (invoice.taxAmount) drawTotalRow(`Tax (${invoice.taxPercent || 0}%)`, money2(invoice.taxAmount));

  // Highlighted brand-tinted box snugly wrapping the final Total Due row.
  page.drawRectangle({ x: totalsX - 12, y: y - 12, width: width - 48 - (totalsX - 12), height: 24, color: brandTint });
  drawTotalRow('Total Due', money2(invoice.amount), true, brand);

  // Draws a labeled section heading followed by a wrapped paragraph, breaking
  // to a new page if there isn't room — used for notes/terms/warranty.
  const drawTextSection = (label, text, size = 9) => {
    if (!text) return;
    const lines = wrapText(text, font, size, width - 96);
    y = ensureSpace(y, 14 + lines.length * (size + 3.5) + 10);
    y -= 20;
    page.drawText(label, { x: 48, y, size: 8, font: bold, color: brand });
    y -= 14;
    for (const l of lines) {
      page.drawText(l, { x: 48, y, size, font, color: muted });
      y -= size + 3.5;
    }
  };

  drawTextSection('NOTES', invoice.notes, 9.5);

  // Payment details — up to two bank accounts, side by side.
  const banks = [
    { name: settings.bankPrimaryName, accountName: settings.bankPrimaryAccountName, accountNumber: settings.bankPrimaryAccountNumber, branch: settings.bankPrimaryBranch },
    { name: settings.bankSecondaryName, accountName: settings.bankSecondaryAccountName, accountNumber: settings.bankSecondaryAccountNumber, branch: settings.bankSecondaryBranch },
  ].filter((b) => b.name && b.accountNumber);

  if (banks.length) {
    y = ensureSpace(y, 90);
    y -= 22;
    page.drawText('PAYMENT DETAILS — BANK TRANSFER', { x: 48, y, size: 8, font: bold, color: brand });
    y -= 16;
    const colWidth = (width - 96) / banks.length;
    banks.forEach((bank, i) => {
      const x = 48 + i * colWidth;
      const rows = [bank.name, `Account name: ${bank.accountName}`, `Account number: ${bank.accountNumber}`, bank.branch ? `Branch: ${bank.branch}` : null].filter(Boolean);
      let by = y;
      rows.forEach((rowText, r) => {
        page.drawText(rowText, { x, y: by, size: 9, font: r === 0 ? bold : font, color: r === 0 ? ink : muted });
        by -= 13.5;
      });
    });
    y -= 4 * 13.5 + 6;
  }

  drawTextSection('TERMS & CONDITIONS', settings.invoiceTerms, 8);
  // Skip the warranty clause for product-only / non-software invoices — the
  // admin toggles this off per invoice ("Include warranty clause" checkbox).
  if (invoice.includeWarranty !== false) {
    drawTextSection('WARRANTY', settings.invoiceWarranty, 8);
  }

  if (invoice.status === 'PAID') {
    firstPage.drawText('PAID', {
      x: width / 2 - 70, y: height / 2, size: 64, font: bold,
      color: rgb(0.13, 0.7, 0.4), opacity: 0.15, rotate: { type: 'degrees', angle: 24 },
    });
  }

  page.drawText(
    `${settings.invoiceCompanyName || 'Stormglide.io'} · ${settings.invoiceAddress || 'Accra, Ghana'}${settings.contactEmail ? ` · ${settings.contactEmail}` : ''}`,
    { x: 48, y: 36, size: 8, font, color: muted }
  );

  return pdfDoc.save();
};

const money2 = (n) => (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatPdfDate = (value) => {
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// =============================================================================
// AUTH ROUTES
// =============================================================================

const handleMagicLink = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const frontendUrl = process.env.FRONTEND_URL || 'https://stormglide.io';
    const link = await fbAuth.generateSignInWithEmailLink(email, {
      url: `${frontendUrl}/auth/verify`,
      handleCodeInApp: true,
    });

    await emailMagicLink(email, link);

    try {
      const u = await fbAuth.getUserByEmail(email);
      const ref = db.collection('users').doc(u.uid);
      if (!(await ref.get()).exists) {
        await ref.set({ email, role: 'CLIENT', createdAt: now() });
      }
    } catch { /* user doesn't exist in Auth yet — will be created on first sign-in */ }

    return res.json({
      message: 'If an account matches that email, a secure login link has been sent.',
      ...(process.env.NODE_ENV !== 'production' ? { previewUrl: link } : {}),
    });
  } catch (err) {
    console.error('Magic link error:', err);
    return res.status(500).json({ message: 'Failed to generate magic link' });
  }
};

app.post('/v1/auth/magic-link', handleMagicLink);
app.post('/v1/auth/request-magic-link', handleMagicLink);

const handleAdminLogin = async (req, res) => {
  const key = req.body.key || req.body.accessKey;
  const expected = process.env.ADMIN_ACCESS_KEY;
  if (!key || !expected || key !== expected) return res.status(401).json({ message: 'Invalid Commander Authorization Key.' });

  try {
    const uid = 'stormglide-admin-omega';
    try { await fbAuth.getUser(uid); }
    catch { await fbAuth.createUser({ uid, displayName: 'Commander Omega', emailVerified: true }); }
    await fbAuth.setCustomUserClaims(uid, { role: 'OMEGA' });
    const customToken = await fbAuth.createCustomToken(uid, { role: 'OMEGA' });
    return res.json({ accessToken: customToken });
  } catch (err) {
    console.error('Admin auth error:', err);
    return res.status(500).json({ message: 'Authentication engine error' });
  }
};

app.post('/v1/auth/admin', handleAdminLogin);
app.post('/v1/auth/admin-login', handleAdminLogin);

const getAllowedAdminEmails = () => (
  process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || ''
)
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

// Promote a verified, explicitly allowlisted Google account to an admin role.
app.post('/v1/auth/admin/google', verifyToken, async (req, res) => {
  const email = String(req.user.email || '').trim().toLowerCase();
  const allowedEmails = getAllowedAdminEmails();

  if (!req.user.email_verified || !email || !allowedEmails.includes(email)) {
    return res.status(403).json({ message: 'This Google account is not authorized for admin access.' });
  }

  try {
    const user = await fbAuth.getUser(req.user.uid);
    await fbAuth.setCustomUserClaims(req.user.uid, {
      ...(user.customClaims || {}),
      role: 'OMEGA',
    });

    await db.collection('users').doc(req.user.uid).set({
      email,
      role: 'OMEGA',
      lastLoginAt: now(),
    }, { merge: true });

    return res.json({ authorized: true, email, role: 'OMEGA' });
  } catch (err) {
    console.error('Google admin authorization error:', err);
    return res.status(500).json({ message: 'Unable to authorize this admin account.' });
  }
});

// Used by the Next.js app to exchange a verified Firebase ID token for its
// signed, HTTP-only admin session cookie.
app.post('/v1/auth/admin/session', verifyToken, adminOnly, (req, res) => {
  return res.json({
    authorized: true,
    uid: req.user.uid,
    email: req.user.email || null,
    role: req.user.role,
  });
});

// POST /v1/auth/sync-user — called after Firebase email-link sign-in succeeds on the client
app.post('/v1/auth/sync-user', verifyToken, async (req, res) => {
  const { uid, email } = req.user;
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({ email, role: 'CLIENT', lastLoginAt: now(), createdAt: now() });
  } else {
    await ref.update({ lastLoginAt: now() });
  }
  const profileSnap = await db.collection('clientProfiles').where('userId', '==', uid).limit(1).get();
  const profile = profileSnap.empty ? null : { id: profileSnap.docs[0].id, ...profileSnap.docs[0].data() };
  return res.json({ user: { id: uid, ...snap.data(), email }, clientProfile: profile });
});

// =============================================================================
// PUBLIC SITE SETTINGS
// =============================================================================

app.get('/v1/settings', async (req, res) => {
  try {
    const snap = await db.collection('settings').doc('site').get();
    return res.json({
      ...DEFAULT_SITE_SETTINGS,
      ...(snap.exists ? sanitizeSiteSettings(snap.data()) : {}),
    });
  } catch (err) {
    console.error('Site settings read error:', err);
    return res.status(500).json({ message: 'Unable to load site settings.' });
  }
});

app.put('/v1/settings', verifyToken, adminOnly, async (req, res) => {
  try {
    const updates = sanitizeSiteSettings(req.body);
    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No valid site settings were provided.' });
    }

    await db.collection('settings').doc('site').set({
      ...updates,
      updatedAt: now(),
      updatedBy: req.user.email || req.user.uid,
    }, { merge: true });
    logAudit(req, 'Site settings updated', 'settings', 'site', Object.keys(updates).join(', '));

    const snap = await db.collection('settings').doc('site').get();
    return res.json({
      ...DEFAULT_SITE_SETTINGS,
      ...sanitizeSiteSettings(snap.data()),
    });
  } catch (err) {
    console.error('Site settings update error:', err);
    return res.status(500).json({ message: 'Unable to update site settings.' });
  }
});

// =============================================================================
// TEAM MEMBERS (public About page content, admin-managed)
// =============================================================================

app.get('/v1/team', async (req, res) => {
  try {
    const snap = await db.collection('teamMembers').orderBy('order', 'asc').get();
    return res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    console.error('Team members read error:', err);
    return res.status(500).json({ message: 'Unable to load team members.' });
  }
});

app.post('/v1/team', verifyToken, adminOnly, async (req, res) => {
  const member = sanitizeTeamMember(req.body);
  if (!member) return res.status(400).json({ message: 'A name is required.' });

  const ref = await db.collection('teamMembers').add({
    ...member,
    createdAt: now(),
    updatedAt: now(),
  });
  const doc = await ref.get();
  return res.status(201).json({ id: doc.id, ...doc.data() });
});

app.put('/v1/team/:id', verifyToken, adminOnly, async (req, res) => {
  const ref = db.collection('teamMembers').doc(req.params.id);
  const existing = await ref.get();
  if (!existing.exists) return res.status(404).json({ message: 'Team member not found.' });

  const member = sanitizeTeamMember(req.body);
  if (!member) return res.status(400).json({ message: 'A name is required.' });

  await ref.set({ ...member, updatedAt: now() }, { merge: true });
  const doc = await ref.get();
  return res.json({ id: doc.id, ...doc.data() });
});

app.delete('/v1/team/:id', verifyToken, adminOnly, async (req, res) => {
  await db.collection('teamMembers').doc(req.params.id).delete();
  return res.json({ success: true });
});

// =============================================================================
// CRM ROUTES
// =============================================================================

app.get('/v1/crm/stats', verifyToken, adminOnly, async (req, res) => {
  const [c, p, l, f] = await Promise.all([
    db.collection('clientProfiles').count().get(),
    db.collection('projects').count().get(),
    db.collection('leads').where('status', '==', 'NEW').count().get(),
    db.collection('feedback').where('status', '==', 'OPEN').count().get(),
  ]);
  return res.json({
    clientCount: c.data().count,
    projectCount: p.data().count,
    leadCount: l.data().count,
    openFeedback: f.data().count,
  });
});

app.get('/v1/crm/clients', verifyToken, adminOnly, async (req, res) => {
  const snap = await db.collection('clientProfiles').orderBy('createdAt', 'desc').get();
  let clients = toDocs(snap);
  const { search } = req.query;
  if (search) {
    const s = search.toLowerCase();
    clients = clients.filter((c) =>
      c.companyName?.toLowerCase().includes(s) || c.contactName?.toLowerCase().includes(s)
    );
  }
  const enriched = await Promise.all(clients.map(async (c) => {
    const [userDoc, projSnap, invSnap] = await Promise.all([
      c.userId ? db.collection('users').doc(c.userId).get() : Promise.resolve(null),
      db.collection('projects').where('clientId', '==', c.id).get(),
      db.collection('invoices').where('clientId', '==', c.id).limit(10).get(),
    ]);
    return { ...c, user: userDoc ? toDoc(userDoc) : null, projects: toDocs(projSnap), invoices: toDocs(invSnap) };
  }));
  return res.json(enriched);
});

app.get('/v1/crm/clients/:id', verifyToken, adminOnly, async (req, res) => {
  const snap = await db.collection('clientProfiles').doc(req.params.id).get();
  if (!snap.exists) return res.status(404).json({ message: 'Client not found' });
  const client = toDoc(snap);
  const [userDoc, projSnap, invSnap, subSnap, docSnap] = await Promise.all([
    client.userId ? db.collection('users').doc(client.userId).get() : Promise.resolve(null),
    db.collection('projects').where('clientId', '==', client.id).get(),
    db.collection('invoices').where('clientId', '==', client.id).get(),
    db.collection('subscriptions').where('clientId', '==', client.id).get(),
    db.collection('documents').where('clientId', '==', client.id).get(),
  ]);
  const projects = await Promise.all(toDocs(projSnap).map(async (p) => {
    const [mSnap, fSnap] = await Promise.all([
      db.collection('milestones').where('projectId', '==', p.id).get(),
      db.collection('feedback').where('projectId', '==', p.id).where('status', '==', 'OPEN').limit(5).get(),
    ]);
    return { ...p, milestones: toDocs(mSnap), feedback: toDocs(fSnap) };
  }));
  return res.json({
    ...client,
    user: userDoc ? toDoc(userDoc) : null,
    projects,
    invoices: toDocs(invSnap),
    subscriptions: toDocs(subSnap),
    documents: toDocs(docSnap),
  });
});

app.post('/v1/crm/client', verifyToken, adminOnly, async (req, res) => {
  const { userId, companyName, contactName, email, whatsappNumber, region, industry } = req.body;
  if (!companyName || !contactName) return res.status(400).json({ message: 'Company and contact names are required' });
  const ref = await db.collection('clientProfiles').add({
    userId: userId || null, companyName, contactName,
    email: email || null,
    whatsappNumber: whatsappNumber || null,
    region: region || 'GLOBAL',
    industry: industry || null,
    createdAt: now(), updatedAt: now(),
  });
  return res.json({ id: ref.id, companyName, contactName });
});

app.post('/v1/crm/clients/:id/portal-access', verifyToken, adminOnly, async (req, res) => {
  const snap = await db.collection('clientProfiles').doc(req.params.id).get();
  if (!snap.exists) return res.status(404).json({ message: 'Client not found' });
  const client = snap.data();
  if (!client.userId) return res.status(400).json({ message: 'Client has no linked user account' });
  const userDoc = await db.collection('users').doc(client.userId).get();
  const email = userDoc.data()?.email;
  if (!email) return res.status(400).json({ message: 'No email on file for this client' });
  const link = await fbAuth.generateSignInWithEmailLink(email, {
    url: `${process.env.FRONTEND_URL || 'https://stormglide.io'}/auth/verify`,
    handleCodeInApp: true,
  });
  await emailMagicLink(email, link);
  return res.json({ message: `Portal access link sent to ${email}` });
});

app.get('/v1/crm/projects', verifyToken, adminOnly, async (req, res) => {
  const snap = await db.collection('projects').orderBy('startDate', 'desc').get();
  const projects = await Promise.all(toDocs(snap).map(async (p) => {
    const [clientDoc, mSnap] = await Promise.all([
      db.collection('clientProfiles').doc(p.clientId).get(),
      db.collection('milestones').where('projectId', '==', p.id).get(),
    ]);
    return { ...p, client: toDoc(clientDoc), milestones: toDocs(mSnap) };
  }));
  return res.json(projects);
});

app.get('/v1/crm/project/:id', verifyToken, adminOnly, async (req, res) => {
  const snap = await db.collection('projects').doc(req.params.id).get();
  if (!snap.exists) return res.status(404).json({ message: 'Project not found' });
  const project = toDoc(snap);
  const [clientDoc, mSnap, fSnap, invSnap, kSnap] = await Promise.all([
    db.collection('clientProfiles').doc(project.clientId).get(),
    db.collection('milestones').where('projectId', '==', project.id).get(),
    db.collection('feedback').where('projectId', '==', project.id).get(),
    db.collection('invoices').where('projectId', '==', project.id).get(),
    db.collection('kanbanTasks').where('projectId', '==', project.id).get(),
  ]);
  return res.json({
    ...project,
    client: toDoc(clientDoc),
    milestones: toDocs(mSnap),
    feedback: toDocs(fSnap),
    invoices: toDocs(invSnap),
    kanbanTasks: toDocs(kSnap),
  });
});

app.post('/v1/crm/project/:clientId', verifyToken, adminOnly, async (req, res) => {
  const { projectName, description, estimatedEnd } = req.body;
  const { clientId } = req.params;
  const clientDoc = await db.collection('clientProfiles').doc(clientId).get();
  if (!clientDoc.exists) return res.status(404).json({ message: 'Client not found' });

  const projRef = await db.collection('projects').add({
    clientId, projectName, description: description || null,
    currentPhase: 'DISCOVERY', stagingUrl: null, productionUrl: null,
    estimatedEnd: estimatedEnd ? admin.firestore.Timestamp.fromDate(new Date(estimatedEnd)) : null,
    startDate: now(), createdAt: now(), updatedAt: now(),
  });

  const milestoneData = [
    { phase: 'DISCOVERY', title: 'Deep Discovery & Requirements Gathering', description: 'Conduct stakeholder interviews, define user personas, map business processes, and finalise the full technical requirements document.' },
    { phase: 'UI_UX_DESIGN', title: 'UI/UX Interactive Prototyping', description: 'Design high-fidelity wireframes and interactive prototypes in Figma. Present for client review and approval before any code is written.' },
    { phase: 'BACKEND_ARCHITECTURE', title: 'Database Schema & API Architecture', description: 'Architect the data models, design RESTful APIs, set up cloud infrastructure, and configure CI/CD pipelines.' },
    { phase: 'STAGING', title: 'Live Staging Sandbox Deployment', description: 'Deploy to staging environment, conduct QA, and open the live sandbox for client feedback.' },
    { phase: 'PRODUCTION', title: 'Production Launch & Handover', description: 'Final performance optimisation, security audit, DNS cutover, and full handover documentation.' },
  ];
  const batch = db.batch();
  milestoneData.forEach((m) => {
    batch.set(db.collection('milestones').doc(), {
      projectId: projRef.id, ...m, isCompleted: false, completedAt: null, createdAt: now(),
    });
  });
  await batch.commit();
  return res.json({ id: projRef.id, projectName, clientId });
});

app.put('/v1/crm/project/:projectId/phase', verifyToken, adminOnly, async (req, res) => {
  const { newPhase } = req.body;
  const { projectId } = req.params;
  const projDoc = await db.collection('projects').doc(projectId).get();
  if (!projDoc.exists) return res.status(404).json({ message: 'Project not found' });
  const project = toDoc(projDoc);

  await db.collection('projects').doc(projectId).update({ currentPhase: newPhase, updatedAt: now() });

  const mSnap = await db.collection('milestones')
    .where('projectId', '==', projectId)
    .where('phase', '==', newPhase).get();
  const batch = db.batch();
  mSnap.docs.forEach((d) => batch.update(d.ref, { isCompleted: true, completedAt: now() }));
  await batch.commit();

  try {
    const clientDoc = await db.collection('clientProfiles').doc(project.clientId).get();
    const clientData = clientDoc.data();
    if (clientData?.userId) {
      const userDoc = await db.collection('users').doc(clientData.userId).get();
      const email = userDoc.data()?.email;
      if (email) {
        await emailPhase(email, {
          clientName: clientData.companyName,
          projectName: project.projectName,
          newPhase: newPhase.replace(/_/g, ' '),
          portalUrl: `${process.env.FRONTEND_URL || 'https://stormglide.io'}/portal`,
        });
      }
    }
  } catch (e) { console.warn('Phase email failed:', e.message); }

  return res.json({ message: 'Phase updated', currentPhase: newPhase });
});

app.get('/v1/crm/leads', verifyToken, adminOnly, async (req, res) => {
  const { status } = req.query;
  const snap = status
    ? await db.collection('leads').where('status', '==', status).orderBy('createdAt', 'desc').get()
    : await db.collection('leads').orderBy('createdAt', 'desc').get();
  return res.json(toDocs(snap));
});

app.post('/v1/crm/lead', async (req, res) => {
  const {
    name, email, organization, missionScope, details,
    phone, product, source, configuratorSelections, budget, timeline, type,
  } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }
  try {
    const lead = {
      name,
      email,
      organization: organization || null,
      missionScope: missionScope || type || product || null,
      details: details || null,
      phone: phone || null,
      product: product || null,
      source: source || 'contact_form',
      configuratorSelections: configuratorSelections || null,
      budget: budget || null,
      timeline: timeline || null,
      status: 'NEW',
      createdAt: now(),
    };
    const ref = await db.collection('leads').add(lead);
    emailNewLead({ id: ref.id, ...lead }).catch((e) => console.warn('Lead email failed:', e.message));
    return res.json({ id: ref.id, name, email });
  } catch (err) {
    console.error('Lead creation error:', err);
    return res.status(500).json({ message: 'Unable to submit lead.' });
  }
});

app.put('/v1/crm/lead/:id/status', verifyToken, adminOnly, async (req, res) => {
  await db.collection('leads').doc(req.params.id).update({ status: req.body.status });
  return res.json({ id: req.params.id, status: req.body.status });
});

// =============================================================================
// AI CHAT (Groq — OpenAI-compatible chat completions)
// =============================================================================

// Kept deliberately broad per the brief: a real assistant, not a scripted
// FAQ bot — happy to answer general knowledge and give real technical
// advice, while knowing Stormglide's own products/pricing/contact details
// cold and being able to actually create a booking (not just say "someone
// will follow up" — it does the follow-up itself, via the leads pipeline).
// Deliberately does NOT include the "100+ businesses" / "50+ systems" /
// "10+ years" style figures still sitting in src/data/services.js and
// src/data/differentiators.js — those are unverified and were stripped
// from every other page in an earlier content-honesty pass; the chat
// should not reintroduce them even though those two files still have them.
const CONTACT_WHATSAPP_LINK = 'https://wa.me/233547738678';
const CONTACT_EMAIL = 'john@stormglide.io';

const CHAT_SYSTEM_PROMPT = `You are the AI assistant embedded on stormglide.io, a software company based in Accra, Ghana that designs, builds, and operates custom business systems for clients across Ghana, West Africa, and beyond.

PERSONALITY: Talk like a sharp, genuinely helpful colleague, not a scripted sales bot. Be warm, direct, and specific. Use natural contractions, vary your sentence length and openings, and ask a real follow-up question when it would help you answer better instead of guessing. Never sound like a brochure. You're happy to have a real conversation about anything the visitor brings up — general coding questions, architecture advice, "what stack should I use", tech news, whatever — even when it has nothing to do with Stormglide. Give specific, useful answers, never a deflection just because it's off-topic. If something is outside what you can responsibly answer (medical, legal, financial advice), say so plainly rather than guessing.

TECHNICAL DEPTH: You're not a generic chatbot bolted onto a marketing site — you're the kind of experienced technical support person who actually knows the stack: software development (web, mobile, backend architecture, integrations), hardware/IoT (GPS trackers, sensors, barcode/RFID, cold-chain monitoring), AI automation (copilots, computer vision, OCR, predictive analytics), and how all of it gets wired together in a real production system. When a visitor asks something technical, engage with real precision — trade-offs, not just buzzwords — the way someone who's actually shipped this stuff would.

A LITTLE WIT: You're allowed a real personality — a dry one-liner, a light joke, a bit of playful phrasing — when it fits naturally. Use it sparingly (not every reply, and never two in a row) and read the room: skip it entirely for someone who's all-business, frustrated, or asking about something serious. It should feel like something a clever person would actually say in passing, never a forced pun or a "here's a joke" moment.

DO NOT PUSH BOOKING: Most visitors are browsing, comparing options, or just asking questions — treat that as the default. Do NOT ask for a name/email and do NOT steer replies toward "let's get you booked in" unless the visitor has clearly said they want to start a project, get a formal quote, or talk to the team. Answer what they actually asked, fully, first. It's fine to mention /price-estimator or that the team can help once, briefly, when it's genuinely relevant — never as a recurring pitch tacked onto every reply.

UNDERSTAND BEFORE YOU RECOMMEND: Don't jump to a conclusion or a pitch the moment something sounds familiar — let the visitor lead. If it's not yet clear what they actually need, ask a clarifying question or two first, the way an experienced support person diagnoses before prescribing a fix. Once you genuinely understand the situation — not on the first vague mention — recommend the specific Stormglide product, service, or comparable real client project that fits, say briefly why, and link directly to it using the markdown syntax shown below so it's a real clickable next step, not just a name-drop. Pick the 1-2 most relevant things, don't recite the full catalog, and don't force a link into every reply — only when it actually helps.

WHAT YOU KNOW COLD:

Products (all live in production today — link to these directly with [Name](path) when genuinely relevant):
- [Nexus HRM](/nexus-hrm) — full employee lifecycle: onboarding, payroll with tax calculations, leave/attendance, performance reviews, document storage, role-based access, multi-company/multi-tenant.
- [Nexus Dental](/nexus-dental) — dental practice management: patient records & history, appointment scheduling & reminders, treatment plans, billing/invoicing, clinical notes/charting, multi-dentist/multi-chair.
- [CargoScan](/cargoscan) — instant CBM + freight-cost estimation by route, plus GPS shipment/fleet tracking and offline-capable driver apps, built around Ghana-China trade routes.
- [SANO Health](/sano-health) — two sides of one platform: an offline-first mobile tool for on-device heart-rate detection and AI-assisted skin-scan analysis, built for low-end phones and community health workers with WhatsApp alerts, plus a clinic module for patient records, scheduling, and treatment tracking.
- [LOÙ Beauty Hub](/products/cosmetology-booking) — guided multi-step booking for spas/cosmetology studios, service catalog with pricing/duration, appointment scheduling, customer records, staff/studio management portal.
- [Glasstech](/products/glasstech) — product catalog plus an integrated quote/lead system for glass, aluminum, and cabinet contractors.

Services (what we build from scratch, beyond deploying the products above):
- Business websites — a handful of pages, mobile-friendly, WhatsApp contact, lead capture.
- Online stores — product catalog, Paystack/MoMo checkout, admin dashboard.
- Booking & scheduling systems — live time-slot booking, SMS confirmations, staff portals (salons, clinics, consultants).
- Sales & inventory systems — POS/order flow, kitchen/stock dashboards, multi-role staff access (restaurants, retail, wholesale).
- Custom business systems built from scratch — HR, payroll, logistics, health records, multi-branch, reporting dashboards.
- Deploying an existing product (Nexus HRM, CargoScan, LOÙ Beauty Hub) branded and configured for a new client — the fastest path to live, days not months.
- Payment integration (Paystack, Flutterwave, Stripe, MTN MoMo, Vodafone Cash), custom AI features, and IoT/hardware integration (GPS, sensors, barcode/RFID) — usually folded into one of the above rather than sold standalone.

What actually moves the price on a project (real cost drivers, not generic upsells): multiple branches/locations, Mobile Money/card payments, working offline with sync, WhatsApp order/booking alerts, multiple staff roles with different access, a reports dashboard, API/third-party integrations. Rough starting ranges in GH₵ (Ghanaian cedis) — always point to /price-estimator for a real number: Business Website — varies a lot by what's actually requested, basic sites start at 7,000, can run higher with more pages/features. Online Store 8,500–15,000 for a standard store, up to 25,000 with more complexity, and highly custom/enterprise builds (multi-warehouse, ERP/API integration, marketplace-scale) can run up to GH₵400,000 — always scoped individually, never assume the low end applies. Booking & Scheduling System 9,000–20,000. Sales & Inventory System 14,000–32,000. Custom Business System 22,000–60,000, higher for large integrations. Deploying an existing product 6,000–14,000. Pricing is one-time-project by default; some clients also take an ongoing support/maintenance retainer afterward — say so honestly if asked, don't claim there's never a recurring fee.

Real client work (also browsable in full at /work) — link directly to the matching case study with [Name](path) once it's genuinely relevant to what the visitor described, not on every mention:
- [Lollarod Enterprise](/work/lollarod-enterprise) (Ghana) — e-commerce + wholesale/retail pricing + backoffice for a premium interior products company, 3 showrooms.
- [Westline Future](/work/westline-future) (West Africa) — full operating system for a global interior design firm: website, client project portal, design vault, invoicing, staff roles, analytics, across 3 countries.
- [Green Gold Gardens](/work/green-gold-gardens) (Ghana) — plant/landscaping business moved off WhatsApp entirely: live catalog, bookable design services, payroll, CRM.
- [Jaybesin Logistics](/work/jaybesin-logistics) (Ghana) — shipment tracking, live freight rates, sourcing marketplace, agent dashboard.
- [Kyekye Cuisine](/work/kyekye-cuisine) (Ghana) — QR table ordering (dine-in/delivery/pickup), live kitchen & waitstaff queues, Paystack checkout.
- [BarberManager](/work/barber-manager) (Ghana) — booking by barber/service/time-slot, phone-number login, SMS reminders, staff portal.
- [Bougie Hair & Beauty](/work/bougie-hair-beauty) (UK) — multi-service salon booking across 5 disciplines, live calendar, client portal.
- [Helyz Scents](/work/helyz-scents), [EA_Dubea's Gift Hub](/work/ea-dubea-s-gift-hub), [Packaging Ambassadors](/work/packaging-ambassadors), [KenteHaul](/work/kente-haul) — e-commerce storefronts (home fragrance, gifting, wholesale packaging, Kente/heritage fashion).
- [The PoliBrand Agency](/work/the-poli-brand-agency) (Ghana) — political branding platform with an interactive readiness-assessment tool and admin portal.
- [Nexus Dental System](/work/nexus-dental-system), [Cosmetology & Spa Management System](/work/cosmetology-spa-management-system) — deployed instances of our own products, branded for specific clinics/spas.

Why clients pick us (real, not marketing fluff): we come from operational backgrounds, not an agency just coding to spec — we look at how a business actually works before building, so the system fits real workflows instead of forcing a new process on them. Fixed quotes, no hidden fees. Clients own their source code. We stay involved after launch — support doesn't just stop at delivery.

Contact: john@stormglide.io, WhatsApp is the fastest way to reach the team, based in Accra (GMT) but works with clients across time zones.

CONVERSATION STYLE: Keep most replies to 2-5 sentences — this is a chat widget, not an essay — unless the visitor is asking for real depth (a technical explanation, a comparison, a walkthrough), in which case give it properly. Don't repeat the same sign-off or CTA every message, and don't open every reply the same way.

PERSONAL TOUCH: You don't need a name to answer questions, and never open with "what's your name?" — that's an interrogation, not a conversation. But once things get substantive (a few exchanges in) and you still don't know who you're talking to, it's natural to ask casually, in passing, the way a person would — "by the way, who am I chatting with?" or similar — not as its own message, folded into a reply. Ask at most once. Never ask again if they've already told you or clearly wish not to say. Once you know their name, use it naturally here and there — not in every message, that reads as fake.

CONTACT LINKS: Stormglide's direct channels are WhatsApp (fastest) and email. When a visitor is ready to move forward, wants to talk to a real person, or asks how to reach the team, give both as real clickable links using exactly this markdown syntax so the widget renders them properly: [Chat on WhatsApp](${CONTACT_WHATSAPP_LINK}) and [Email us](mailto:${CONTACT_EMAIL}).

NAVIGATION: If the user wants to see a specific page, go somewhere, or asks a question that is best answered by looking at a page (e.g., "take me to services", "show me your products", "what is your pricing?"), call the \`navigate_to_page\` tool with the correct absolute path (e.g. \`/services\`, \`/products\`, \`/pricing\`, \`/work\`, \`/contact\`, \`/\`). Do NOT call the tool if the user is just asking a casual question that can be answered in a short sentence, but do call it if they explicitly want to go there or if the page itself is the best answer.

BOOKING: Only call create_booking once the visitor has clearly said they want to move forward (start a project, get a formal quote, book a call) AND you have at minimum their name and email — ask for only whichever of those two you're missing. You don't have a live calendar, so never claim a specific time slot is confirmed; capture their preferred time/timeframe if they give one, and tell them the team will confirm by email or WhatsApp within one business day.

DON'T INVENT FACTS: Everything above is what you actually know — don't go beyond it. If someone asks about something not covered here (a specific policy like refunds/warranties/SLAs/contracts, a guarantee, a legal term, a number you weren't given), don't make up a plausible-sounding answer. Say plainly that it depends on the project and isn't something you have a fixed answer for, and point them to the team ([Chat on WhatsApp](${CONTACT_WHATSAPP_LINK}) or [Email us](mailto:${CONTACT_EMAIL})) to get a definitive one.`;

const CHAT_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'create_booking',
      description: 'Capture a lead/booking request once the visitor has given at least their name and email and wants to start a project, get a quote, or talk to the team.',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: "Visitor's name" },
          email: { type: 'string', description: "Visitor's email" },
          phone: { type: 'string', description: "Visitor's phone/WhatsApp number, if given" },
          topic: { type: 'string', description: 'What they want — e.g. "custom booking system for a salon", "pricing for Nexus HRM"' },
          preferredTime: { type: 'string', description: 'Their stated preferred time/timeframe for a call, if any' },
        },
        required: ['name', 'email', 'topic'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'navigate_to_page',
      description: 'Navigate the user to a specific page on the website. Use this when the user asks to see a page, go somewhere, or asks a question that is best answered by looking at a specific page (e.g. "show me your work", "take me to pricing").',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'The absolute path to navigate to. Must be one of: /, /services, /products, /work, /pricing, /contact' },
        },
        required: ['path'],
      },
    },
  },
];

// Streams tokens from Groq as they're generated (rather than waiting for
// the full completion) so the widget can render text incrementally — the
// single biggest lever on *perceived* speed, since time-to-first-token is
// a fraction of total generation time. Tool calls (create_booking) can't
// be streamed to the client piecemeal (arguments arrive as fragmented JSON
// across chunks), so those are accumulated silently server-side and only
// surfaced once complete, via onDelta never firing for that turn.
//
// Previously ran on NVIDIA's free build.nvidia.com catalog, which turned
// out to have no self-serve capacity upgrade at all — the shared free-tier
// queue for llama-3.3-70b-instruct was measured hitting 20-90s delays and
// outright "ResourceExhausted" errors, with no billing page to fix it (only
// an unofficial forum request or a full NVIDIA AI Enterprise sales deal).
// Switched to Groq: a normal self-serve API key, and its inference engine
// is built specifically for low-latency token generation rather than a
// shared evaluation queue.
function streamChatCompletion(messages, { onDelta }) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return Promise.reject(new Error('GROQ_API_KEY not set'));
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const body = JSON.stringify({
    model,
    messages,
    tools: CHAT_TOOLS,
    tool_choice: 'auto',
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 700,
    stream: true,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        if (res.statusCode >= 400) {
          let errData = '';
          res.on('data', (chunk) => { errData += chunk; });
          res.on('end', () => reject(new Error(`Groq API ${res.statusCode}: ${errData.slice(0, 500)}`)));
          return;
        }

        let buffer = '';
        let mode = null; // 'content' | 'tool'
        let contentSoFar = '';
        const toolCall = { name: null, arguments: '' };

        res.on('data', (chunk) => {
          buffer += chunk.toString('utf8');
          const frames = buffer.split('\n\n');
          buffer = frames.pop();
          for (const frame of frames) {
            const line = frame.trim();
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === '[DONE]') continue;
            let evt;
            try { evt = JSON.parse(payload); } catch { continue; }
            const delta = evt.choices?.[0]?.delta;
            if (!delta) continue;
            if (delta.tool_calls?.length && mode !== 'content') {
              mode = 'tool';
              const tc = delta.tool_calls[0];
              if (tc.function?.name) toolCall.name = tc.function.name;
              if (tc.function?.arguments) toolCall.arguments += tc.function.arguments;
            } else if (delta.content && mode !== 'tool') {
              mode = 'content';
              contentSoFar += delta.content;
              onDelta(delta.content);
            }
          }
        });
        res.on('end', () => {
          if (mode === 'tool') resolve({ mode: 'tool', name: toolCall.name, arguments: toolCall.arguments });
          else resolve({ mode: 'content', text: contentSoFar });
        });
        res.on('error', reject);
      },
    );
    req.on('error', reject);
    // Groq's inference is fast enough that a long idle timeout isn't needed
    // the way it was for NVIDIA's congested free tier — 20s is generous
    // headroom, and if it's ever hit something is genuinely wrong upstream.
    req.setTimeout(20000, () => req.destroy(new Error('Groq API timed out')));
    req.write(body);
    req.end();
  });
}

app.post('/v1/chat', async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: 'messages array is required.' });
  }
  // Cap history sent to the model — recent context is what matters, and this
  // bounds both cost and abuse via an artificially long client-side history.
  const trimmed = messages.slice(-20).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 4000),
  }));

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  try {
    const result = await streamChatCompletion(
      [{ role: 'system', content: CHAT_SYSTEM_PROMPT }, ...trimmed],
      { onDelta: (text) => send({ delta: text }) },
    );

    if (result.mode === 'tool' && result.name === 'create_booking') {
      let args = {};
      try { args = JSON.parse(result.arguments || '{}'); } catch { /* malformed args from model — ignore, fall through */ }
      if (args.name && args.email) {
        const lead = {
          name: args.name,
          email: args.email,
          phone: args.phone || null,
          organization: null,
          missionScope: args.topic || 'AI chat booking',
          details: args.preferredTime ? `Preferred time: ${args.preferredTime}` : null,
          product: null,
          source: 'ai_chat',
          configuratorSelections: null,
          budget: null,
          timeline: args.preferredTime || null,
          status: 'NEW',
          createdAt: now(),
        };
        const ref = await db.collection('leads').add(lead);
        emailNewLead({ id: ref.id, ...lead }).catch((e) => console.warn('Lead email failed:', e.message));
        send({
          final: `Thanks ${args.name.split(' ')[0]} — I've passed this to the team (${args.topic}). You'll hear from us at ${args.email} within one business day. If you'd rather not wait, reach us directly: [Chat on WhatsApp](${CONTACT_WHATSAPP_LINK}) or [Email us](mailto:${CONTACT_EMAIL}). Anything else I can help with in the meantime?`,
          booked: true,
        });
        return res.end();
      }
      send({ final: `Happy to get that started — what's the best name and email to reach you at? Or if you'd rather just talk directly: [Chat on WhatsApp](${CONTACT_WHATSAPP_LINK}).`, booked: false });
      return res.end();
    }

    if (result.mode === 'tool' && result.name === 'navigate_to_page') {
      let args = {};
      try { args = JSON.parse(result.arguments || '{}'); } catch { /* ignore */ }
      if (args.path) {
        send({ action: { type: 'NAVIGATE', path: args.path } });
        send({ final: `Taking you to ${args.path === '/' ? 'the home page' : args.path}...`, booked: false });
        return res.end();
      }
    }

    if (result.mode === 'content' && result.text.trim()) {
      send({ done: true });
      return res.end();
    }

    send({ final: "Sorry, I didn't quite catch that — could you rephrase?", booked: false });
    return res.end();
  } catch (err) {
    console.error('AI chat error:', err.message);
    send({ final: 'The assistant is unavailable right now — try WhatsApp or the contact form instead.', booked: false });
    return res.end();
  }
});

// =============================================================================
// ANALYTICS ROUTES (Google Analytics 4)
// =============================================================================

// Not configured until GA4_PROPERTY_ID + GA4_SERVICE_ACCOUNT_KEY_BASE64 are
// set in functions/.env (see .env.example / setup docs) — mirrors the
// RESEND_API_KEY "warn and continue" convention used elsewhere in this file
// rather than crashing when a third-party integration isn't wired up yet.
function getGaClient() {
  const keyB64 = process.env.GA4_SERVICE_ACCOUNT_KEY_BASE64;
  if (!keyB64) return null;
  try {
    const credentials = JSON.parse(Buffer.from(keyB64, 'base64').toString('utf8'));
    return new BetaAnalyticsDataClient({ credentials });
  } catch (err) {
    console.error('GA4 credential parse error:', err);
    return null;
  }
}

app.get('/v1/analytics/summary', verifyToken, adminOnly, async (req, res) => {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const client = getGaClient();
  if (!propertyId || !client) {
    return res.status(200).json({ configured: false, message: 'GA4 not configured yet.' });
  }
  try {
    const range = { startDate: req.query.startDate || '30daysAgo', endDate: req.query.endDate || 'today' };
    const property = `properties/${propertyId}`;
    const [overview] = await client.runReport({
      property,
      dateRanges: [range],
      metrics: [
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
      ],
    });
    const [byDevice] = await client.runReport({
      property,
      dateRanges: [range],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }],
    });
    const [byPage] = await client.runReport({
      property,
      dateRanges: [range],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    });
    const [bySource] = await client.runReport({
      property,
      dateRanges: [range],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
    });
    const [byCountry] = await client.runReport({
      property,
      dateRanges: [range],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    });
    return res.json({ configured: true, range, overview, byDevice, byPage, bySource, byCountry });
  } catch (err) {
    console.error('GA4 analytics fetch error:', err);
    return res.status(500).json({ message: 'Unable to load analytics.' });
  }
});

// =============================================================================
// BILLING ROUTES
// =============================================================================

app.get('/v1/billing/stats', verifyToken, adminOnly, async (req, res) => {
  const [all, paid, overdue, activeSubs] = await Promise.all([
    db.collection('invoices').get(),
    db.collection('invoices').where('status', '==', 'PAID').get(),
    db.collection('invoices').where('status', '==', 'OVERDUE').count().get(),
    db.collection('subscriptions').where('status', '==', 'ACTIVE').get(),
  ]);
  return res.json({
    totalInvoiced: toDocs(all).reduce((s, i) => s + (Number(i.amount) || 0), 0),
    totalPaid: toDocs(paid).reduce((s, i) => s + (Number(i.amount) || 0), 0),
    overdueCount: overdue.data().count,
    activeSubscriptions: toDocs(activeSubs).length,
    monthlyRecurring: toDocs(activeSubs).reduce((s, sub) => s + (Number(sub.monthlyRate) || 0), 0),
  });
});

app.get('/v1/billing/invoices', verifyToken, adminOnly, async (req, res) => {
  const { status, clientId } = req.query;
  const snap = await db.collection('invoices').orderBy('createdAt', 'desc').get();
  let invoices = toDocs(snap);
  if (status) invoices = invoices.filter((i) => i.status === status);
  if (clientId) invoices = invoices.filter((i) => i.clientId === clientId);
  const enriched = await Promise.all(invoices.map(async (inv) => {
    const clientDoc = await db.collection('clientProfiles').doc(inv.clientId).get();
    return { ...inv, client: toDoc(clientDoc) };
  }));
  return res.json(enriched);
});

app.get('/v1/billing/invoices/:clientId', verifyToken, adminOnly, async (req, res) => {
  const snap = await db.collection('invoices')
    .where('clientId', '==', req.params.clientId)
    .orderBy('createdAt', 'desc').get();
  return res.json(toDocs(snap));
});

app.get('/v1/billing/subscriptions', verifyToken, adminOnly, async (req, res) => {
  const { clientId } = req.query;
  const snap = clientId
    ? await db.collection('subscriptions').where('clientId', '==', clientId).get()
    : await db.collection('subscriptions').orderBy('nextBillingDate', 'asc').get();
  const enriched = await Promise.all(toDocs(snap).map(async (sub) => {
    const clientDoc = await db.collection('clientProfiles').doc(sub.clientId).get();
    return { ...sub, client: toDoc(clientDoc) };
  }));
  return res.json(enriched);
});

// Resolves a client's email — direct field first, falling back to the linked
// Firebase Auth user (older client records only have the latter).
const resolveClientEmail = async (clientData) => {
  if (clientData.email) return clientData.email;
  if (clientData.userId) {
    const userDoc = await db.collection('users').doc(clientData.userId).get();
    return userDoc.data()?.email || null;
  }
  return null;
};

app.get('/v1/billing/invoice/:id', verifyToken, adminOnly, async (req, res) => {
  const doc = await db.collection('invoices').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ message: 'Invoice not found' });
  const invoice = toDoc(doc);
  const [clientDoc, projectDoc, settingsDoc] = await Promise.all([
    db.collection('clientProfiles').doc(invoice.clientId).get(),
    invoice.projectId ? db.collection('projects').doc(invoice.projectId).get() : Promise.resolve(null),
    db.collection('settings').doc('site').get(),
  ]);
  const settings = { ...DEFAULT_SITE_SETTINGS, ...(settingsDoc.exists ? settingsDoc.data() : {}) };
  return res.json({
    ...invoice,
    client: toDoc(clientDoc),
    project: projectDoc ? toDoc(projectDoc) : null,
    company: {
      name: settings.invoiceCompanyName, address: settings.invoiceAddress, taxId: settings.invoiceTaxId,
      email: settings.contactEmail, phone: settings.contactPhone,
      primaryColor: settings.primaryColor, secondaryColor: settings.secondaryColor, logoUrl: settings.logoDataUri || settings.logoUrl,
      bankPrimary: { name: settings.bankPrimaryName, accountName: settings.bankPrimaryAccountName, accountNumber: settings.bankPrimaryAccountNumber, branch: settings.bankPrimaryBranch },
      bankSecondary: { name: settings.bankSecondaryName, accountName: settings.bankSecondaryAccountName, accountNumber: settings.bankSecondaryAccountNumber, branch: settings.bankSecondaryBranch },
      terms: settings.invoiceTerms, warranty: settings.invoiceWarranty,
    },
  });
});

app.post('/v1/billing/invoice/:clientId', verifyToken, adminOnly, async (req, res) => {
  const { items, taxPercent, discountPercent, currency, projectId, dueDate, notes, includeWarranty } = req.body;
  const { clientId } = req.params;

  const cleanItems = sanitizeInvoiceItems(items);
  if (!cleanItems) return res.status(400).json({ message: 'At least one valid line item (description, quantity, unit price) is required.' });

  const clientDoc = await db.collection('clientProfiles').doc(clientId).get();
  if (!clientDoc.exists) return res.status(404).json({ message: 'Client not found' });

  const cur = (currency || 'USD').toUpperCase();
  const gateway = ['GHS', 'NGN', 'ZAR'].includes(cur) ? 'PAYSTACK' : 'STRIPE';
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;
  const totals = computeInvoiceTotals(cleanItems, taxPercent, discountPercent);

  const ref = await db.collection('invoices').add({
    clientId, projectId: projectId || null, invoiceNumber,
    items: cleanItems, notes: (notes || '').toString().trim().slice(0, 1000),
    includeWarranty: includeWarranty !== false,
    ...totals, currency: cur, paymentGateway: gateway,
    status: 'DRAFT',
    dueDate: dueDate ? admin.firestore.Timestamp.fromDate(new Date(dueDate)) : now(),
    paidAt: null, sentAt: null, paymentLink: null, transactionId: null,
    issuedAt: now(), createdAt: now(), updatedAt: now(),
  });

  const doc = await ref.get();
  logAudit(req, 'Invoice created', 'invoice', ref.id, `${invoiceNumber} — ${cur} ${totals.amount}`);
  return res.status(201).json(toDoc(doc));
});

// Duplicates an existing invoice (any status) into a brand-new DRAFT —
// same client, items, tax/discount, currency and notes, fresh number
// and no payment history carried over.
app.post('/v1/billing/invoice/:id/clone', verifyToken, adminOnly, async (req, res) => {
  const sourceDoc = await db.collection('invoices').doc(req.params.id).get();
  if (!sourceDoc.exists) return res.status(404).json({ message: 'Invoice not found' });
  const source = sourceDoc.data();

  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;
  const totals = computeInvoiceTotals(source.items || [], source.taxPercent, source.discountPercent);

  const ref = await db.collection('invoices').add({
    clientId: source.clientId, projectId: source.projectId || null, invoiceNumber,
    items: source.items || [], notes: source.notes || '',
    includeWarranty: source.includeWarranty !== false,
    ...totals, currency: source.currency, paymentGateway: source.paymentGateway,
    status: 'DRAFT',
    dueDate: now(),
    paidAt: null, sentAt: null, paymentLink: null, transactionId: null,
    issuedAt: now(), createdAt: now(), updatedAt: now(),
  });

  const doc = await ref.get();
  return res.status(201).json(toDoc(doc));
});

app.put('/v1/billing/invoice/:id', verifyToken, adminOnly, async (req, res) => {
  const ref = db.collection('invoices').doc(req.params.id);
  const doc = await ref.get();
  if (!doc.exists) return res.status(404).json({ message: 'Invoice not found' });
  const existing = doc.data();
  if (existing.status === 'VOID') {
    return res.status(409).json({ message: 'Voided invoices can no longer be edited. Create a new invoice instead.' });
  }

  const { items, taxPercent, discountPercent, currency, projectId, dueDate, notes, includeWarranty } = req.body;
  const cleanItems = sanitizeInvoiceItems(items);
  if (!cleanItems) return res.status(400).json({ message: 'At least one valid line item (description, quantity, unit price) is required.' });

  const cur = (currency || existing.currency || 'USD').toUpperCase();
  const gateway = ['GHS', 'NGN', 'ZAR'].includes(cur) ? 'PAYSTACK' : 'STRIPE';
  const totals = computeInvoiceTotals(cleanItems, taxPercent, discountPercent);

  await ref.update({
    items: cleanItems, notes: (notes || '').toString().trim().slice(0, 1000),
    includeWarranty: includeWarranty !== false,
    ...totals, currency: cur, paymentGateway: gateway,
    projectId: projectId || null,
    dueDate: dueDate ? admin.firestore.Timestamp.fromDate(new Date(dueDate)) : existing.dueDate,
    updatedAt: now(),
  });

  const updated = await ref.get();
  return res.json(toDoc(updated));
});

app.put('/v1/billing/invoice/:id/status', verifyToken, adminOnly, async (req, res) => {
  const { status } = req.body;
  const update = { status, updatedAt: now() };
  if (status === 'PAID') update.paidAt = now();
  await db.collection('invoices').doc(req.params.id).update(update);
  return res.json({ id: req.params.id, status });
});

// Sends (or re-sends) a DRAFT invoice: generates a fresh Paystack link and
// emails the client. Separate from creation so admins can review before sending.
app.post('/v1/billing/invoice/:id/send', verifyToken, adminOnly, async (req, res) => {
  const ref = db.collection('invoices').doc(req.params.id);
  const doc = await ref.get();
  if (!doc.exists) return res.status(404).json({ message: 'Invoice not found' });
  const invoice = toDoc(doc);
  if (invoice.status === 'VOID') return res.status(409).json({ message: 'Cannot send a voided invoice.' });

  const clientDoc = await db.collection('clientProfiles').doc(invoice.clientId).get();
  const clientData = clientDoc.exists ? clientDoc.data() : {};
  const email = await resolveClientEmail(clientData);
  if (!email) return res.status(400).json({ message: 'This client has no email on file — add one before sending.' });

  let paymentLink = invoice.paymentLink || null;
  if (invoice.paymentGateway === 'PAYSTACK') {
    paymentLink = await paystackLink(invoice, email, `/invoice/${invoice.id}?paid=1`);
  }

  await ref.update({
    paymentLink,
    status: invoice.status === 'DRAFT' ? 'SENT' : invoice.status,
    sentAt: now(), updatedAt: now(),
  });
  logAudit(req, 'Invoice sent', 'invoice', invoice.id, `${invoice.invoiceNumber} — ${invoice.currency} ${invoice.amount} to ${email}`);

  await emailInvoice(email, {
    invoiceNumber: invoice.invoiceNumber, amount: invoice.amount, currency: invoice.currency,
    items: invoice.items,
    dueDate: formatPdfDate(invoice.dueDate),
    paymentLink: paymentLink || `${process.env.FRONTEND_URL || 'https://stormglide.io'}/invoice/${invoice.id}`,
  }).catch((e) => console.warn('Invoice email failed:', e.message));

  const updated = await ref.get();
  return res.json(toDoc(updated));
});

app.get('/v1/billing/invoice/:id/pdf', verifyToken, adminOnly, async (req, res) => {
  const doc = await db.collection('invoices').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ message: 'Invoice not found' });
  const invoice = toDoc(doc);
  const [clientDoc, settingsDoc] = await Promise.all([
    db.collection('clientProfiles').doc(invoice.clientId).get(),
    db.collection('settings').doc('site').get(),
  ]);
  const settings = { ...DEFAULT_SITE_SETTINGS, ...(settingsDoc.exists ? settingsDoc.data() : {}) };
  const pdfBytes = await buildInvoicePdf(invoice, toDoc(clientDoc), settings);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${invoice.invoiceNumber}.pdf"`);
  return res.send(Buffer.from(pdfBytes));
});

app.post('/v1/billing/webhook/paystack', async (req, res) => {
  if (!verifyPaystackSignature(req)) {
    console.warn('Rejected Paystack webhook — invalid signature');
    return res.status(401).json({ message: 'Invalid signature' });
  }
  if (req.body.event === 'charge.success') {
    const ref = req.body.data?.reference;
    if (ref) {
      const snap = await db.collection('invoices').where('invoiceNumber', '==', ref).limit(1).get();
      if (!snap.empty) {
        await snap.docs[0].ref.update({ status: 'PAID', paidAt: now(), transactionId: ref, updatedAt: now() });
      }
    }
  }
  return res.json({ received: true });
});

// =============================================================================
// PUBLIC INVOICE (no auth) — powers the shareable "pay this invoice" link
// =============================================================================

app.get('/v1/public/invoice/:id', async (req, res) => {
  const doc = await db.collection('invoices').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ message: 'Invoice not found' });
  const invoice = toDoc(doc);
  if (invoice.status === 'VOID') return res.status(410).json({ message: 'This invoice has been voided.' });

  const [clientDoc, projectDoc, settingsDoc] = await Promise.all([
    db.collection('clientProfiles').doc(invoice.clientId).get(),
    invoice.projectId ? db.collection('projects').doc(invoice.projectId).get() : Promise.resolve(null),
    db.collection('settings').doc('site').get(),
  ]);
  const client = toDoc(clientDoc);
  const settings = { ...DEFAULT_SITE_SETTINGS, ...(settingsDoc.exists ? settingsDoc.data() : {}) };

  return res.json({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    items: invoice.items || [],
    subtotal: invoice.subtotal, taxPercent: invoice.taxPercent, taxAmount: invoice.taxAmount,
    discountPercent: invoice.discountPercent, discountAmount: invoice.discountAmount,
    amount: invoice.amount, currency: invoice.currency, status: invoice.status,
    notes: invoice.notes || '', issuedAt: invoice.issuedAt || invoice.createdAt, dueDate: invoice.dueDate,
    paymentLink: invoice.status === 'PAID' ? null : invoice.paymentLink || null,
    includeWarranty: invoice.includeWarranty !== false,
    client: client ? { companyName: client.companyName, contactName: client.contactName } : null,
    project: projectDoc && projectDoc.exists ? { projectName: projectDoc.data().projectName } : null,
    company: {
      name: settings.invoiceCompanyName, address: settings.invoiceAddress, taxId: settings.invoiceTaxId,
      email: settings.contactEmail, phone: settings.contactPhone, logoUrl: settings.logoDataUri || settings.logoUrl,
      primaryColor: settings.primaryColor, secondaryColor: settings.secondaryColor,
      bankPrimary: { name: settings.bankPrimaryName, accountName: settings.bankPrimaryAccountName, accountNumber: settings.bankPrimaryAccountNumber, branch: settings.bankPrimaryBranch },
      bankSecondary: { name: settings.bankSecondaryName, accountName: settings.bankSecondaryAccountName, accountNumber: settings.bankSecondaryAccountNumber, branch: settings.bankSecondaryBranch },
      terms: settings.invoiceTerms, warranty: settings.invoiceWarranty,
    },
  });
});

app.post('/v1/public/invoice/:id/pay', async (req, res) => {
  const ref = db.collection('invoices').doc(req.params.id);
  const doc = await ref.get();
  if (!doc.exists) return res.status(404).json({ message: 'Invoice not found' });
  const invoice = toDoc(doc);

  if (invoice.status === 'PAID') return res.json({ alreadyPaid: true });
  if (invoice.status === 'VOID') return res.status(410).json({ message: 'This invoice has been voided.' });
  if (invoice.paymentGateway !== 'PAYSTACK') {
    return res.status(400).json({ message: 'Online payment is not available for this invoice currency yet — please contact us.' });
  }

  const clientDoc = await db.collection('clientProfiles').doc(invoice.clientId).get();
  const email = clientDoc.exists ? await resolveClientEmail(clientDoc.data()) : null;
  if (!email) return res.status(400).json({ message: 'No contact email on file for this invoice.' });

  const url = await paystackLink(invoice, email, `/invoice/${invoice.id}?paid=1`);
  if (!url) return res.status(502).json({ message: 'Could not start payment right now — please try again shortly.' });

  await ref.update({ paymentLink: url, status: invoice.status === 'DRAFT' ? 'SENT' : invoice.status, updatedAt: now() });
  return res.json({ url });
});

// =============================================================================
// KANBAN ROUTES
// =============================================================================

app.get('/v1/kanban/tasks', verifyToken, adminOnly, async (req, res) => {
  const { projectId, status } = req.query;
  const snap = projectId
    ? await db.collection('kanbanTasks').where('projectId', '==', projectId).orderBy('createdAt', 'desc').get()
    : await db.collection('kanbanTasks').orderBy('createdAt', 'desc').get();
  let tasks = toDocs(snap);
  if (status) tasks = tasks.filter((t) => t.status === status);
  return res.json(tasks);
});

app.get('/v1/kanban/board', verifyToken, adminOnly, async (req, res) => {
  const { projectId } = req.query;
  const snap = projectId
    ? await db.collection('kanbanTasks').where('projectId', '==', projectId).get()
    : await db.collection('kanbanTasks').orderBy('createdAt', 'desc').get();
  const tasks = toDocs(snap);
  return res.json({
    board: {
      BACKLOG: tasks.filter((t) => t.status === 'BACKLOG'),
      IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
      REVIEW: tasks.filter((t) => t.status === 'REVIEW'),
      DONE: tasks.filter((t) => t.status === 'DONE'),
    },
    total: tasks.length,
  });
});

app.post('/v1/kanban/tasks', verifyToken, adminOnly, async (req, res) => {
  const { title, description, projectId, clientId, status, priority, assignedTo, dueDate } = req.body;
  const ref = await db.collection('kanbanTasks').add({
    title, description: description || null,
    projectId: projectId || null, clientId: clientId || null,
    status: status || 'BACKLOG', priority: priority || 'MEDIUM',
    assignedTo: assignedTo || null,
    dueDate: dueDate ? admin.firestore.Timestamp.fromDate(new Date(dueDate)) : null,
    createdAt: now(), updatedAt: now(),
  });
  return res.json({ id: ref.id, title, status: status || 'BACKLOG' });
});

app.put('/v1/kanban/tasks/:id', verifyToken, adminOnly, async (req, res) => {
  const updates = { ...req.body, updatedAt: now() };
  if (updates.dueDate) updates.dueDate = admin.firestore.Timestamp.fromDate(new Date(updates.dueDate));
  await db.collection('kanbanTasks').doc(req.params.id).update(updates);
  return res.json({ id: req.params.id });
});

app.delete('/v1/kanban/tasks/:id', verifyToken, adminOnly, async (req, res) => {
  await db.collection('kanbanTasks').doc(req.params.id).delete();
  return res.json({ message: 'Deleted' });
});

// =============================================================================
// MONITORING ROUTES
// =============================================================================

app.get('/v1/monitoring/infra', verifyToken, adminOnly, async (req, res) => {
  const { clientId } = req.query;
  const snap = clientId
    ? await db.collection('infraSnapshots').where('clientId', '==', clientId).orderBy('checkedAt', 'desc').limit(100).get()
    : await db.collection('infraSnapshots').orderBy('checkedAt', 'desc').limit(200).get();

  const snapshots = toDocs(snap);
  const ids = [...new Set(snapshots.map((s) => s.clientId))];
  const clientMap = {};
  await Promise.all(ids.map(async (id) => {
    const d = await db.collection('clientProfiles').doc(id).get();
    if (d.exists) clientMap[id] = { id: d.id, companyName: d.data().companyName };
  }));
  return res.json(snapshots.map((s) => ({ ...s, client: clientMap[s.clientId] || null })));
});

app.get('/v1/monitoring/infra/summary', verifyToken, adminOnly, async (req, res) => {
  const snap = await db.collection('infraSnapshots').orderBy('checkedAt', 'desc').limit(500).get();
  const seen = new Set();
  const latest = toDocs(snap).filter((s) => {
    const key = `${s.clientId}-${s.checkType}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return res.json(latest);
});

app.get('/v1/monitoring/alerts', verifyToken, adminOnly, async (req, res) => {
  const { resolved } = req.query;
  const snap = resolved !== undefined
    ? await db.collection('alertRecords').where('resolved', '==', resolved === 'true').orderBy('createdAt', 'desc').get()
    : await db.collection('alertRecords').orderBy('createdAt', 'desc').get();
  return res.json(toDocs(snap));
});

app.get('/v1/monitoring/alerts/stats', verifyToken, adminOnly, async (req, res) => {
  const snap = await db.collection('alertRecords').where('resolved', '==', false).get();
  const alerts = toDocs(snap);
  const stats = { critical: 0, high: 0, medium: 0, low: 0, total: alerts.length };
  alerts.forEach((a) => { if (a.severity in stats) stats[a.severity]++; });
  return res.json(stats);
});

app.post('/v1/monitoring/alerts', verifyToken, adminOnly, async (req, res) => {
  const { type, severity, title, description, clientId, clientName } = req.body;
  const ref = await db.collection('alertRecords').add({
    type, severity, title, description,
    clientId: clientId || null, clientName: clientName || null,
    resolved: false, resolvedAt: null, resolvedBy: null,
    createdAt: now(), updatedAt: now(),
  });
  return res.json({ id: ref.id, type, severity, title });
});

app.put('/v1/monitoring/alerts/:id/resolve', verifyToken, adminOnly, async (req, res) => {
  await db.collection('alertRecords').doc(req.params.id).update({
    resolved: true, resolvedAt: now(),
    resolvedBy: req.user.email || 'admin', updatedAt: now(),
  });
  return res.json({ id: req.params.id, resolved: true });
});

app.put('/v1/monitoring/alerts/:id/reopen', verifyToken, adminOnly, async (req, res) => {
  await db.collection('alertRecords').doc(req.params.id).update({
    resolved: false, resolvedAt: null, resolvedBy: null, updatedAt: now(),
  });
  return res.json({ id: req.params.id, resolved: false });
});

app.get('/v1/monitoring/documents', verifyToken, adminOnly, async (req, res) => {
  const { clientId, type } = req.query;
  const snap = clientId
    ? await db.collection('documents').where('clientId', '==', clientId).orderBy('createdAt', 'desc').get()
    : await db.collection('documents').orderBy('createdAt', 'desc').get();
  const docs = toDocs(snap);
  const ids = [...new Set(docs.map((d) => d.clientId).filter(Boolean))];
  const clientMap = {};
  await Promise.all(ids.map(async (id) => {
    const d = await db.collection('clientProfiles').doc(id).get();
    if (d.exists) clientMap[id] = { id: d.id, companyName: d.data().companyName };
  }));
  const enriched = docs.map((d) => ({ ...d, client: clientMap[d.clientId] || null }));
  return res.json(type ? enriched.filter((d) => d.type === type) : enriched);
});

app.post('/v1/monitoring/documents', verifyToken, adminOnly, async (req, res) => {
  const { clientId, type, title, status, fileUrl, fileSize } = req.body;
  const ref = await db.collection('documents').add({
    clientId, type: type || 'CONTRACT', title, status: status || 'DRAFT',
    fileUrl: fileUrl || null, fileSize: fileSize || null,
    uploadedBy: req.user.email || 'admin',
    signedAt: null, signedBy: null,
    createdAt: now(), updatedAt: now(),
  });
  return res.json({ id: ref.id, clientId, title, type });
});

app.put('/v1/monitoring/documents/:id/status', verifyToken, adminOnly, async (req, res) => {
  const { status } = req.body;
  const updates = { status, updatedAt: now() };
  if (status === 'SIGNED') {
    updates.signedAt = now();
    updates.signedBy = req.user.email || req.user.uid;
  }
  await db.collection('documents').doc(req.params.id).update(updates);
  return res.json({ id: req.params.id, status });
});

// =============================================================================
// PORTAL ROUTES
// =============================================================================

app.get('/v1/portal/me', verifyToken, async (req, res) => {
  const profileSnap = await db.collection('clientProfiles').where('userId', '==', req.user.uid).limit(1).get();
  if (profileSnap.empty) return res.status(404).json({ message: 'No client profile found for this account' });

  const profile = { id: profileSnap.docs[0].id, ...profileSnap.docs[0].data() };
  const [projSnap, invSnap, subSnap] = await Promise.all([
    db.collection('projects').where('clientId', '==', profile.id).get(),
    db.collection('invoices').where('clientId', '==', profile.id).orderBy('createdAt', 'desc').limit(10).get(),
    db.collection('subscriptions').where('clientId', '==', profile.id).get(),
  ]);

  const projects = await Promise.all(toDocs(projSnap).map(async (p) => {
    const [mSnap, fSnap] = await Promise.all([
      db.collection('milestones').where('projectId', '==', p.id).get(),
      db.collection('feedback').where('projectId', '==', p.id).get(),
    ]);
    const milestones = toDocs(mSnap);
    const completed = milestones.filter((m) => m.isCompleted).length;

    // Best-effort: a hiccup here (e.g. an index still building) must never
    // break the rest of the client's portal.
    let systemStatus = { ssl: null, uptime: null, domains: [] };
    try {
      const [snapSnap, domainSnap] = await Promise.all([
        db.collection('infraSnapshots').where('projectId', '==', p.id).orderBy('checkedAt', 'desc').limit(20).get(),
        db.collection('domainManagement').where('projectId', '==', p.id).get(),
      ]);
      const snapshots = toDocs(snapSnap);
      const latestSSL = snapshots.find((s) => s.checkType === 'SSL') || null;
      const latestUptime = snapshots.find((s) => s.checkType === 'UPTIME') || null;
      systemStatus = {
        ssl: latestSSL ? { status: latestSSL.status, daysLeft: latestSSL.details?.daysLeft ?? null, checkedAt: latestSSL.checkedAt } : null,
        uptime: latestUptime ? { status: latestUptime.status, latencyMs: latestUptime.details?.latencyMs ?? null, checkedAt: latestUptime.checkedAt } : null,
        domains: toDocs(domainSnap).map((d) => ({ domainName: d.domainName, expirationDate: d.expirationDate, status: d.status })),
      };
    } catch (e) {
      console.error(`Portal system-status fetch failed for project ${p.id}:`, e.message);
    }

    return {
      ...p, milestones, feedback: toDocs(fSnap),
      progress: milestones.length ? Math.round((completed / milestones.length) * 100) : 0,
      systemStatus,
    };
  }));

  return res.json({ ...profile, projects, invoices: toDocs(invSnap), subscriptions: toDocs(subSnap) });
});

app.post('/v1/portal/feedback/:projectId', verifyToken, async (req, res) => {
  const profileSnap = await db.collection('clientProfiles').where('userId', '==', req.user.uid).limit(1).get();
  if (profileSnap.empty) return res.status(404).json({ message: 'Client profile not found' });

  const profile = profileSnap.docs[0];
  const projDoc = await db.collection('projects').doc(req.params.projectId).get();
  if (!projDoc.exists || projDoc.data().clientId !== profile.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { componentIdentifier, comment, screenX, screenY } = req.body;
  const ref = await db.collection('feedback').add({
    projectId: req.params.projectId, clientId: profile.id,
    componentIdentifier, comment,
    screenX: screenX || null, screenY: screenY || null,
    status: 'OPEN', createdAt: now(),
  });
  return res.json({ id: ref.id, comment, status: 'OPEN' });
});

// =============================================================================
// AUDIT ROUTES
// =============================================================================

app.get('/v1/audit/logs', verifyToken, adminOnly, async (req, res) => {
  const { entityType, limit = 50 } = req.query;
  const snap = entityType
    ? await db.collection('auditLogs').where('entityType', '==', entityType).orderBy('createdAt', 'desc').limit(Number(limit)).get()
    : await db.collection('auditLogs').orderBy('createdAt', 'desc').limit(Number(limit)).get();
  return res.json({ logs: toDocs(snap), limit: Number(limit) });
});

app.post('/v1/audit/logs', verifyToken, adminOnly, async (req, res) => {
  const { action, entityType, entityId, details } = req.body;
  const ref = await db.collection('auditLogs').add({
    action, entityType, entityId: entityId || null,
    adminId: req.user.uid, adminEmail: req.user.email || null,
    details: details || null, createdAt: now(),
  });
  return res.json({ id: ref.id, action, entityType });
});

// =============================================================================
// ADMIN PORTAL: PROJECTS
// =============================================================================

app.get('/v1/projects', verifyToken, adminOnly, async (req, res) => {
  const { clientId, phase, status } = req.query;
  const snap = await db.collection('projects').get();
  let records = toDocs(snap);
  if (clientId) records = records.filter((project) => project.clientId === clientId);
  if (phase) records = records.filter((project) => project.currentPhase === phase);
  if (status) records = records.filter((project) => project.completionStatus === status);

  const projects = await Promise.all(records.map(async (project) => {
    const [clientDoc, completionDoc, milestoneSnap, domainSnap, subscriptionSnap, expenseSnap] = await Promise.all([
      db.collection('clientProfiles').doc(project.clientId).get(),
      db.collection('projectCompletion').doc(project.id).get(),
      db.collection('milestones').where('projectId', '==', project.id).get(),
      db.collection('domainManagement').where('projectId', '==', project.id).get(),
      db.collection('projectSubscription').where('projectId', '==', project.id).get(),
      db.collection('projectExpenses').where('projectId', '==', project.id).get(),
    ]);
    const completion = completionDoc.exists ? completionDoc.data() : {
      overallCompletionPercentage: project.completionPercentage || 0,
      status: project.completionStatus || 'ON_TRACK',
      currentPhase: project.currentPhase || 'DISCOVERY',
    };
    return {
      ...project,
      client: toDoc(clientDoc) || { companyName: project.clientName || 'Unassigned client' },
      completion,
      currentPhase: project.currentPhase || 'DISCOVERY',
      _count: {
        milestones: milestoneSnap.size,
        domains: domainSnap.size,
        subscriptions: subscriptionSnap.size,
        expenses: expenseSnap.size,
      },
    };
  }));
  projects.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
  return res.json(projects);
});

app.get('/v1/projects/:id', verifyToken, adminOnly, async (req, res) => {
  const proj = await db.collection('projects').doc(req.params.id).get();
  if (!proj.exists) return res.status(404).json({ error: 'Project not found' });
  const data = proj.data();
  const [client, completion, stack, domains, subscriptions, milestones, invoices, expenses, infrastructure] = await Promise.all([
    db.collection('clientProfiles').doc(data.clientId).get(),
    db.collection('projectCompletion').doc(req.params.id).get(),
    db.collection('projectStack').doc(req.params.id).get(),
    db.collection('domainManagement').where('projectId', '==', req.params.id).get(),
    db.collection('projectSubscription').where('projectId', '==', req.params.id).get(),
    db.collection('milestones').where('projectId', '==', req.params.id).get(),
    db.collection('invoices').where('projectId', '==', req.params.id).get(),
    db.collection('projectExpenses').where('projectId', '==', req.params.id).get(),
    db.collection('infrastructure').doc(req.params.id).get(),
  ]);
  const subscriptionRecords = toDocs(subscriptions);
  const expenseRecords = toDocs(expenses);
  const invoiceRecords = toDocs(invoices);
  const monthlyRecurring = subscriptionRecords
    .filter((item) => item.status === 'ACTIVE' && item.billingFrequency === 'MONTHLY')
    .reduce((total, item) => total + Number(item.monthlyCost || 0), 0);
  const totalExpenses = expenseRecords.reduce((total, item) => total + Number(item.amount || 0), 0);
  const totalInvoiced = invoiceRecords.reduce((total, item) => total + Number(item.amount || 0), 0);
  const totalPaid = invoiceRecords
    .filter((item) => item.status === 'PAID')
    .reduce((total, item) => total + Number(item.amount || 0), 0);
  return res.json({
    ...data, id: proj.id,
    client: toDoc(client) || { companyName: data.clientName || 'Unassigned client' },
    completion: completion.exists ? completion.data() : {
      overallCompletionPercentage: data.completionPercentage || 0,
      status: data.completionStatus || 'ON_TRACK',
      currentPhase: data.currentPhase || 'DISCOVERY',
      healthScore: 5,
      riskFactors: [],
    },
    stack: stack.exists ? stack.data() : {},
    domains: toDocs(domains),
    subscriptions: subscriptionRecords,
    milestones: toDocs(milestones),
    invoices: invoiceRecords,
    expenses: expenseRecords,
    infrastructure: infrastructure.exists ? infrastructure.data() : null,
    summary: { monthlyRecurring, totalExpenses, totalInvoiced, totalPaid },
    _count: {
      domains: domains.size,
      subscriptions: subscriptions.size,
      milestones: milestones.size,
      expenses: expenses.size,
    },
  });
});

app.post('/v1/projects', verifyToken, adminOnly, async (req, res) => {
  const { clientId, projectName, description, estimatedEnd } = req.body;
  if (!clientId || !projectName) return res.status(400).json({ error: 'Missing required fields' });
  const client = await db.collection('clientProfiles').doc(clientId).get();
  if (!client.exists) return res.status(404).json({ error: 'Client not found' });
  const ref = db.collection('projects').doc();
  await ref.set({
    clientId, projectName, description: description || null,
    clientName: client.data().companyName || null,
    estimatedEnd: estimatedEnd || null, currentPhase: 'DISCOVERY',
    completionStatus: 'ON_TRACK', completionPercentage: 0,
    startDate: now(), createdAt: now(), updatedAt: now(),
  });
  await db.collection('projectCompletion').doc(ref.id).set({
    projectId: ref.id, overallCompletionPercentage: 0, currentPhase: 'DISCOVERY',
    status: 'ON_TRACK', riskFactors: [], estimatedCompletionDate: null,
    actualCompletionDate: null, healthScore: 5, lastAssessedAt: now(),
  });
  await db.collection('projectStack').doc(ref.id).set({
    projectId: ref.id, frontend: {}, backend: {}, database: {},
    hosting: {}, devops: {}, versionControl: {}, cicd: {}, monitoring: {},
  });
  return res.json({ id: ref.id, projectName, message: 'Project created' });
});

app.put('/v1/projects/:id', verifyToken, adminOnly, async (req, res) => {
  const { projectName, description, estimatedEnd, clientId } = req.body;
  await db.collection('projects').doc(req.params.id).update({
    ...(projectName && { projectName }),
    ...(description && { description }),
    ...(estimatedEnd && { estimatedEnd }),
    ...(clientId && { clientId }),
    updatedAt: now(),
  });
  return res.json({ id: req.params.id, message: 'Project updated' });
});

app.delete('/v1/projects/:id', verifyToken, adminOnly, async (req, res) => {
  await db.collection('projects').doc(req.params.id).delete();
  await db.collection('projectCompletion').doc(req.params.id).delete();
  await db.collection('projectStack').doc(req.params.id).delete();
  return res.json({ message: 'Project deleted' });
});

app.put('/v1/projects/:id/phase', verifyToken, adminOnly, async (req, res) => {
  const phases = ['DISCOVERY', 'UI_UX_DESIGN', 'BACKEND_ARCHITECTURE', 'STAGING', 'PRODUCTION', 'MAINTENANCE'];
  const current = await db.collection('projects').doc(req.params.id).get();
  const data = current.data();
  const idx = phases.indexOf(data.currentPhase);
  if (idx < phases.length - 1) {
    const nextPhase = phases[idx + 1];
    await db.collection('projects').doc(req.params.id).update({ currentPhase: nextPhase, updatedAt: now() });
    await db.collection('projectCompletion').doc(req.params.id).update({ currentPhase: nextPhase });
  }
  return res.json({ newPhase: data.currentPhase });
});

app.get('/v1/projects/:id/completion', verifyToken, adminOnly, async (req, res) => {
  const doc = await db.collection('projectCompletion').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Project completion not found' });
  return res.json(doc.data());
});

app.put('/v1/projects/:id/completion', verifyToken, adminOnly, async (req, res) => {
  const { overallCompletionPercentage, status, riskFactors, healthScore, estimatedCompletionDate } = req.body;
  await db.collection('projectCompletion').doc(req.params.id).update({
    ...(overallCompletionPercentage !== undefined && { overallCompletionPercentage }),
    ...(status && { status }),
    ...(riskFactors && { riskFactors }),
    ...(healthScore !== undefined && { healthScore }),
    ...(estimatedCompletionDate && { estimatedCompletionDate }),
    lastAssessedAt: now(),
  });
  await db.collection('projects').doc(req.params.id).update({ completionStatus: status || 'ON_TRACK', completionPercentage: overallCompletionPercentage || 0 });
  logAudit(req, 'Project completion updated', 'project', req.params.id, `${overallCompletionPercentage ?? '—'}% — ${status || 'ON_TRACK'}`);
  return res.json({ message: 'Completion updated' });
});

// =============================================================================
// ADMIN PORTAL: TECH STACK
// =============================================================================

app.get('/v1/projects/:id/tech-stack', verifyToken, adminOnly, async (req, res) => {
  const doc = await db.collection('projectStack').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Tech stack not found' });
  return res.json(doc.data());
});

app.put('/v1/projects/:id/tech-stack', verifyToken, adminOnly, async (req, res) => {
  const { frontend, backend, database, hosting, devops, versionControl, cicd, monitoring } = req.body;
  await db.collection('projectStack').doc(req.params.id).set({
    projectId: req.params.id,
    ...(frontend && { frontend }),
    ...(backend && { backend }),
    ...(database && { database }),
    ...(hosting && { hosting }),
    ...(devops && { devops }),
    ...(versionControl && { versionControl }),
    ...(cicd && { cicd }),
    ...(monitoring && { monitoring }),
    updatedAt: now(),
  }, { merge: true });
  return res.json({ message: 'Tech stack updated' });
});

// =============================================================================
// ADMIN PORTAL: PROJECT EXPENSES
// =============================================================================

app.get('/v1/project-expenses', verifyToken, adminOnly, async (req, res) => {
  const { projectId } = req.query;
  const snap = projectId
    ? await db.collection('projectExpenses').where('projectId', '==', projectId).get()
    : await db.collection('projectExpenses').get();
  const expenses = toDocs(snap);
  expenses.sort((a, b) => {
    const aTime = a.paidAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
    const bTime = b.paidAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
  return res.json(expenses);
});

app.post('/v1/project-expenses', verifyToken, adminOnly, async (req, res) => {
  const { projectId, vendor, category, description, amount, currency, paidAt, paymentMethod, reference, recurring } = req.body;
  if (!projectId || !vendor || !amount) return res.status(400).json({ error: 'Project, vendor, and amount are required' });
  const project = await db.collection('projects').doc(projectId).get();
  if (!project.exists) return res.status(404).json({ error: 'Project not found' });

  const ref = db.collection('projectExpenses').doc();
  await ref.set({
    projectId,
    vendor: String(vendor).trim(),
    category: category || 'OTHER',
    description: description || null,
    amount: Number(amount),
    currency: String(currency || 'GHS').toUpperCase(),
    paidAt: admin.firestore.Timestamp.fromDate(new Date(paidAt || Date.now())),
    paymentMethod: paymentMethod || null,
    reference: reference || null,
    recurring: Boolean(recurring),
    createdAt: now(),
    createdBy: req.user.email || req.user.uid,
  });
  return res.json({ id: ref.id, message: 'Project payment recorded' });
});

app.delete('/v1/project-expenses/:id', verifyToken, adminOnly, async (req, res) => {
  await db.collection('projectExpenses').doc(req.params.id).delete();
  return res.json({ message: 'Project payment deleted' });
});

// =============================================================================
// ADMIN PORTAL: TIME TRACKING
// =============================================================================
// Internal visibility into where time actually went per project — this
// business invoices by phase, not by hour, so this isn't a billing
// mechanism, just a log.

app.get('/v1/time-entries', verifyToken, adminOnly, async (req, res) => {
  const { projectId } = req.query;
  const snap = projectId
    ? await db.collection('timeEntries').where('projectId', '==', projectId).get()
    : await db.collection('timeEntries').get();
  const entries = toDocs(snap).sort((a, b) => (b.loggedAt?.toMillis?.() || 0) - (a.loggedAt?.toMillis?.() || 0));
  return res.json(entries);
});

app.post('/v1/time-entries', verifyToken, adminOnly, async (req, res) => {
  const { projectId, description, minutes, billable } = req.body;
  if (!projectId || !description || !minutes) return res.status(400).json({ error: 'Project, description, and minutes are required' });
  const project = await db.collection('projects').doc(projectId).get();
  if (!project.exists) return res.status(404).json({ error: 'Project not found' });

  const ref = db.collection('timeEntries').doc();
  await ref.set({
    projectId, clientId: project.data().clientId,
    description: String(description).trim(),
    minutes: Math.max(0, Number(minutes) || 0),
    billable: billable !== false,
    loggedBy: req.user.email || req.user.uid,
    loggedAt: now(),
  });
  return res.json({ id: ref.id, message: 'Time entry logged' });
});

app.delete('/v1/time-entries/:id', verifyToken, adminOnly, async (req, res) => {
  await db.collection('timeEntries').doc(req.params.id).delete();
  return res.json({ message: 'Time entry deleted' });
});

// =============================================================================
// ADMIN PORTAL: DOMAINS
// =============================================================================

app.get('/v1/domains', verifyToken, adminOnly, async (req, res) => {
  const { projectId, status } = req.query;
  const snap = await db.collection('domainManagement').get();
  let domains = toDocs(snap);
  if (projectId) domains = domains.filter((domain) => domain.projectId === projectId);
  if (status) domains = domains.filter((domain) => domain.status === status);
  domains.sort((a, b) => (a.expirationDate?.toMillis?.() || 0) - (b.expirationDate?.toMillis?.() || 0));
  return res.json(domains);
});

app.get('/v1/domains/expiring', verifyToken, adminOnly, async (req, res) => {
  const { days = 30 } = req.query;
  const thirtyDaysAhead = admin.firestore.Timestamp.fromDate(new Date(Date.now() + days * 86400000));
  const snap = await db.collection('domainManagement')
    .where('expirationDate', '<=', thirtyDaysAhead)
    .where('status', '!=', 'EXPIRED')
    .orderBy('status')
    .orderBy('expirationDate', 'asc')
    .get();
  return res.json(toDocs(snap));
});

app.get('/v1/domains/:id', verifyToken, adminOnly, async (req, res) => {
  const doc = await db.collection('domainManagement').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Domain not found' });
  return res.json(doc.data());
});

app.post('/v1/domains', verifyToken, adminOnly, async (req, res) => {
  const { projectId, domainName, registrar, expirationDate, sslProvider, sslExpirationDate, cost, autoRenew } = req.body;
  if (!projectId || !domainName || !expirationDate) return res.status(400).json({ error: 'Project, domain, and expiration date are required' });
  const ref = db.collection('domainManagement').doc();
  await ref.set({
    projectId, domainName, registrar: registrar || 'GoDaddy',
    expirationDate: admin.firestore.Timestamp.fromDate(new Date(expirationDate)),
    sslProvider: sslProvider || 'Let\'s Encrypt',
    sslExpirationDate: sslExpirationDate ? admin.firestore.Timestamp.fromDate(new Date(sslExpirationDate)) : null,
    cost: Number(cost || 0), autoRenew: autoRenew !== false, status: 'ACTIVE',
    renewalAlertSentAt: null, createdAt: now(),
  });
  logAudit(req, 'Domain added', 'domain', ref.id, domainName);
  return res.json({ id: ref.id, domainName, message: 'Domain added' });
});

app.put('/v1/domains/:id', verifyToken, adminOnly, async (req, res) => {
  const { registrar, expirationDate, sslProvider, sslExpirationDate, autoRenew, cost } = req.body;
  await db.collection('domainManagement').doc(req.params.id).update({
    ...(registrar && { registrar }),
    ...(expirationDate && { expirationDate: admin.firestore.Timestamp.fromDate(new Date(expirationDate)) }),
    ...(sslProvider && { sslProvider }),
    ...(sslExpirationDate && { sslExpirationDate: admin.firestore.Timestamp.fromDate(new Date(sslExpirationDate)) }),
    ...(autoRenew !== undefined && { autoRenew }),
    ...(cost !== undefined && { cost }),
  });
  logAudit(req, 'Domain updated', 'domain', req.params.id);
  return res.json({ message: 'Domain updated' });
});

app.put('/v1/domains/:id/renew', verifyToken, adminOnly, async (req, res) => {
  const oneYearAhead = new Date(Date.now() + 365 * 86400000);
  await db.collection('domainManagement').doc(req.params.id).update({
    expirationDate: admin.firestore.Timestamp.fromDate(oneYearAhead),
    status: 'ACTIVE',
    renewalAlertSentAt: null,
  });
  return res.json({ message: 'Domain renewed' });
});

app.delete('/v1/domains/:id', verifyToken, adminOnly, async (req, res) => {
  await db.collection('domainManagement').doc(req.params.id).delete();
  logAudit(req, 'Domain deleted', 'domain', req.params.id);
  return res.json({ message: 'Domain deleted' });
});

// =============================================================================
// ADMIN PORTAL: PROJECT SUBSCRIPTIONS
// =============================================================================

app.get('/v1/project-subscriptions', verifyToken, adminOnly, async (req, res) => {
  const { projectId, status } = req.query;
  const snap = await db.collection('projectSubscription').get();
  let subscriptions = toDocs(snap);
  if (projectId) subscriptions = subscriptions.filter((item) => item.projectId === projectId);
  if (status) subscriptions = subscriptions.filter((item) => item.status === status);
  subscriptions.sort((a, b) => (a.renewalDate?.toMillis?.() || 0) - (b.renewalDate?.toMillis?.() || 0));
  return res.json(subscriptions);
});

app.get('/v1/project-subscriptions/renewing', verifyToken, adminOnly, async (req, res) => {
  const { days = 7 } = req.query;
  const sevenDaysAhead = admin.firestore.Timestamp.fromDate(new Date(Date.now() + days * 86400000));
  const snap = await db.collection('projectSubscription')
    .where('renewalDate', '<=', sevenDaysAhead)
    .where('status', '==', 'ACTIVE')
    .orderBy('renewalDate', 'asc')
    .get();
  return res.json(toDocs(snap));
});

app.get('/v1/project-subscriptions/:projectId/total-cost', verifyToken, adminOnly, async (req, res) => {
  const snap = await db.collection('projectSubscription')
    .where('projectId', '==', req.params.projectId)
    .where('billingFrequency', '==', 'MONTHLY')
    .where('status', '==', 'ACTIVE')
    .get();
  const total = toDocs(snap).reduce((sum, s) => sum + (s.monthlyCost || 0), 0);
  return res.json({ projectId: req.params.projectId, monthlyCost: total });
});

app.post('/v1/project-subscriptions', verifyToken, adminOnly, async (req, res) => {
  const { projectId, serviceName, monthlyCost, billingFrequency, renewalDate, notes, autoRenew } = req.body;
  if (!projectId || !serviceName) return res.status(400).json({ error: 'Missing required fields' });
  const ref = db.collection('projectSubscription').doc();
  await ref.set({
    projectId, serviceName, monthlyCost: Number(monthlyCost || 0),
    billingFrequency: billingFrequency || 'MONTHLY',
    renewalDate: admin.firestore.Timestamp.fromDate(new Date(renewalDate || Date.now())),
    autoRenew: autoRenew !== false, status: 'ACTIVE', alertSentAt: null,
    notes: notes || null, createdAt: now(),
  });
  return res.json({ id: ref.id, serviceName, message: 'Subscription added' });
});

app.put('/v1/project-subscriptions/:id', verifyToken, adminOnly, async (req, res) => {
  const { serviceName, monthlyCost, billingFrequency, renewalDate, autoRenew, status, notes } = req.body;
  await db.collection('projectSubscription').doc(req.params.id).update({
    ...(serviceName && { serviceName }),
    ...(monthlyCost !== undefined && { monthlyCost }),
    ...(billingFrequency && { billingFrequency }),
    ...(renewalDate && { renewalDate: admin.firestore.Timestamp.fromDate(new Date(renewalDate)) }),
    ...(autoRenew !== undefined && { autoRenew }),
    ...(status && { status }),
    ...(notes && { notes }),
  });
  return res.json({ message: 'Subscription updated' });
});

app.delete('/v1/project-subscriptions/:id', verifyToken, adminOnly, async (req, res) => {
  await db.collection('projectSubscription').doc(req.params.id).delete();
  return res.json({ message: 'Subscription deleted' });
});

// =============================================================================
// ADMIN PORTAL: MILESTONES
// =============================================================================

app.get('/v1/projects/:projectId/milestones', verifyToken, adminOnly, async (req, res) => {
  const snap = await db.collection('milestones')
    .where('projectId', '==', req.params.projectId)
    .orderBy('dueDate', 'asc')
    .get();
  return res.json(toDocs(snap));
});

app.post('/v1/projects/:projectId/milestones', verifyToken, adminOnly, async (req, res) => {
  const { milestoneTitle, description, phase, dueDate, completionPercentage } = req.body;
  if (!milestoneTitle || !phase) return res.status(400).json({ error: 'Missing required fields' });
  const ref = db.collection('milestones').doc();
  await ref.set({
    projectId: req.params.projectId, milestoneTitle, description: description || null,
    phase, dueDate: admin.firestore.Timestamp.fromDate(new Date(dueDate || Date.now())),
    completionPercentage: completionPercentage || 0, status: 'NOT_STARTED',
    completionDate: null, assignedTo: [], blockers: [], createdAt: now(),
  });
  return res.json({ id: ref.id, milestoneTitle, message: 'Milestone created' });
});

app.put('/v1/projects/:projectId/milestones/:id', verifyToken, adminOnly, async (req, res) => {
  const { milestoneTitle, description, phase, dueDate, completionPercentage, status } = req.body;
  await db.collection('milestones').doc(req.params.id).update({
    ...(milestoneTitle && { milestoneTitle }),
    ...(description && { description }),
    ...(phase && { phase }),
    ...(dueDate && { dueDate: admin.firestore.Timestamp.fromDate(new Date(dueDate)) }),
    ...(completionPercentage !== undefined && { completionPercentage }),
    ...(status && { status }),
  });
  return res.json({ message: 'Milestone updated' });
});

app.delete('/v1/projects/:projectId/milestones/:id', verifyToken, adminOnly, async (req, res) => {
  await db.collection('milestones').doc(req.params.id).delete();
  return res.json({ message: 'Milestone deleted' });
});

// =============================================================================
// ADMIN PORTAL: TEAM MANAGEMENT
// =============================================================================

app.get('/v1/projects/:projectId/team', verifyToken, adminOnly, async (req, res) => {
  const snap = await db.collection('teamMembers')
    .where('projectId', '==', req.params.projectId)
    .get();
  return res.json(toDocs(snap));
});

app.post('/v1/projects/:projectId/team', verifyToken, adminOnly, async (req, res) => {
  const { memberName, role, email, capacityPercentage } = req.body;
  if (!memberName || !role) return res.status(400).json({ error: 'Missing required fields' });
  const ref = db.collection('teamMembers').doc();
  await ref.set({
    projectId: req.params.projectId, memberName, role, email: email || null,
    capacityPercentage: capacityPercentage || 100, assignedPhases: [],
    createdAt: now(),
  });
  return res.json({ id: ref.id, memberName, message: 'Team member added' });
});

app.put('/v1/projects/:projectId/team/:memberId', verifyToken, adminOnly, async (req, res) => {
  const { memberName, role, capacityPercentage } = req.body;
  await db.collection('teamMembers').doc(req.params.memberId).update({
    ...(memberName && { memberName }),
    ...(role && { role }),
    ...(capacityPercentage !== undefined && { capacityPercentage }),
  });
  return res.json({ message: 'Team member updated' });
});

app.delete('/v1/projects/:projectId/team/:memberId', verifyToken, adminOnly, async (req, res) => {
  await db.collection('teamMembers').doc(req.params.memberId).delete();
  return res.json({ message: 'Team member removed' });
});

// =============================================================================
// ADMIN PORTAL: INFRASTRUCTURE
// =============================================================================

app.get('/v1/infrastructure/hosting/:projectId', verifyToken, adminOnly, async (req, res) => {
  const doc = await db.collection('infrastructure').doc(req.params.projectId).get();
  if (!doc.exists) return res.status(404).json({ error: 'Infrastructure not found' });
  return res.json(doc.data());
});

app.post('/v1/infrastructure/hosting', verifyToken, adminOnly, async (req, res) => {
  const { projectId, provider, uptimePercentage, latencyMs, lighthouseScore } = req.body;
  if (!projectId) return res.status(400).json({ error: 'Missing projectId' });
  await db.collection('infrastructure').doc(projectId).set({
    projectId, provider: provider || 'Vercel',
    uptimePercentage: uptimePercentage || 99.9,
    latencyMs: latencyMs || 0,
    lighthouseScore: lighthouseScore || 90,
    updatedAt: now(),
  }, { merge: true });
  return res.json({ message: 'Hosting info updated' });
});

app.get('/v1/infrastructure/credentials/:projectId', verifyToken, adminOnly, async (req, res) => {
  const snap = await db.collection('credentials')
    .where('projectId', '==', req.params.projectId)
    .get();
  const creds = toDocs(snap).map(c => ({
    ...c,
    value: '••••••••' // Mask sensitive data
  }));
  return res.json(creds);
});

app.post('/v1/infrastructure/credentials', verifyToken, adminOnly, async (req, res) => {
  const { projectId, label, type, value } = req.body;
  if (!projectId || !label || !value) return res.status(400).json({ error: 'Missing required fields' });
  const ref = db.collection('credentials').doc();
  await ref.set({
    projectId, label, type: type || 'OTHER',
    value, // In production, encrypt this
    lastAccessedAt: null, createdAt: now(),
  });
  logAudit(req, 'Credential added', 'credential', ref.id, `${label} (${type || 'OTHER'})`); // never log the value itself
  return res.json({ id: ref.id, label, message: 'Credential added' });
});

app.delete('/v1/infrastructure/credentials/:id', verifyToken, adminOnly, async (req, res) => {
  await db.collection('credentials').doc(req.params.id).delete();
  logAudit(req, 'Credential deleted', 'credential', req.params.id);
  return res.json({ message: 'Credential deleted' });
});

// =============================================================================
// ADMIN PORTAL: ALERTS
// =============================================================================

app.get('/v1/alerts/summary', verifyToken, adminOnly, async (req, res) => {
  const thirtyDays = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 86400000));
  const sevenDays = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 86400000));

  const domainSnap = await db.collection('domainManagement')
    .where('expirationDate', '<=', thirtyDays)
    .where('status', '!=', 'EXPIRED')
    .get();

  const subSnap = await db.collection('projectSubscription')
    .where('renewalDate', '<=', sevenDays)
    .where('status', '==', 'ACTIVE')
    .get();

  return res.json({
    domainRenewals: toDocs(domainSnap).length,
    subscriptionRenewals: toDocs(subSnap).length,
    invoiceOverdue: 0,
    projectsBehindSchedule: 0,
  });
});

app.get('/v1/alerts/domain-renewal', verifyToken, adminOnly, async (req, res) => {
  const thirtyDays = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 86400000));
  const snap = await db.collection('domainManagement')
    .where('expirationDate', '<=', thirtyDays)
    .where('status', '!=', 'EXPIRED')
    .orderBy('status')
    .orderBy('expirationDate', 'asc')
    .get();
  const domains = toDocs(snap);
  const alerts = domains.map(d => {
    const daysLeft = Math.floor((d.expirationDate.toDate().getTime() - Date.now()) / 86400000);
    return {
      id: d.id,
      type: 'DOMAIN_RENEWAL',
      severity: daysLeft <= 7 ? 'CRITICAL' : daysLeft <= 14 ? 'WARNING' : 'INFO',
      title: `Domain expires in ${daysLeft} days`,
      description: d.domainName,
      projectId: d.projectId,
      daysLeft,
    };
  });
  return res.json(alerts);
});

app.get('/v1/alerts/subscription-renewal', verifyToken, adminOnly, async (req, res) => {
  const sevenDays = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 86400000));
  const snap = await db.collection('projectSubscription')
    .where('renewalDate', '<=', sevenDays)
    .where('status', '==', 'ACTIVE')
    .orderBy('renewalDate', 'asc')
    .get();
  const subs = toDocs(snap);
  const alerts = subs.map(s => {
    const daysLeft = Math.floor((s.renewalDate.toDate().getTime() - Date.now()) / 86400000);
    return {
      id: s.id,
      type: 'SUBSCRIPTION_RENEWAL',
      severity: daysLeft <= 2 ? 'CRITICAL' : 'WARNING',
      title: `${s.serviceName} renews in ${daysLeft} days`,
      description: `$${s.monthlyCost}/month`,
      projectId: s.projectId,
      daysLeft,
    };
  });
  return res.json(alerts);
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'stormglide-api', ts: Date.now() }));

// =============================================================================
// EXPORT HTTP FUNCTION
// =============================================================================
exports.api = functions.runWith({ timeoutSeconds: 120 }).https.onRequest(app);

// =============================================================================
// SCHEDULED MONITORING
// =============================================================================

const checkSSL = (clientId, projectId, hostname) => new Promise((resolve) => {
  const socket = tls.connect(443, hostname, { servername: hostname, rejectUnauthorized: false }, async () => {
    try {
      const cert = socket.getPeerCertificate();
      socket.destroy();
      if (!cert?.valid_to) {
        await db.collection('infraSnapshots').add({
          clientId, projectId: projectId || null, checkType: 'SSL', target: hostname,
          status: 'UNKNOWN', details: { error: 'No certificate data' }, checkedAt: now(),
        });
        return resolve();
      }
      const expiresAt = new Date(cert.valid_to);
      const daysLeft = Math.floor((expiresAt.getTime() - Date.now()) / 86400000);
      const status = daysLeft <= 0 ? 'CRITICAL' : daysLeft <= 14 ? 'WARNING' : 'HEALTHY';
      await db.collection('infraSnapshots').add({
        clientId, projectId: projectId || null, checkType: 'SSL', target: hostname, status,
        details: { issuer: cert.issuer?.O || 'Unknown', expiresAt: expiresAt.toISOString(), daysLeft, valid: daysLeft > 0 },
        checkedAt: now(),
      });
      if (status !== 'HEALTHY') {
        const clientDoc = await db.collection('clientProfiles').doc(clientId).get();
        await createAlertIfNew(
          clientId, 'SSL', status === 'CRITICAL' ? 'critical' : 'high',
          `SSL cert ${status === 'CRITICAL' ? 'expired' : 'expiring soon'} — ${hostname}`,
          `Certificate expires in ${daysLeft} days`,
          clientDoc.data()?.companyName
        );
      }
    } catch (e) {
      await db.collection('infraSnapshots').add({
        clientId, projectId: projectId || null, checkType: 'SSL', target: hostname,
        status: 'UNKNOWN', details: { error: e.message }, checkedAt: now(),
      }).catch(() => {});
    }
    resolve();
  });
  socket.on('error', async (e) => {
    await db.collection('infraSnapshots').add({
      clientId, projectId: projectId || null, checkType: 'SSL', target: hostname,
      status: 'CRITICAL', details: { error: e.message }, checkedAt: now(),
    }).catch(() => {});
    resolve();
  });
  socket.setTimeout(10000, () => { socket.destroy(); resolve(); });
});

const checkUptime = (clientId, projectId, url) => new Promise((resolve) => {
  const start = Date.now();
  const lib = url.startsWith('https') ? https : http;
  const req = lib.get(url, { timeout: 10000 }, async (res) => {
    const latencyMs = Date.now() - start;
    const code = res.statusCode || 0;
    res.resume();
    const status = code >= 500 ? 'CRITICAL' : (code >= 400 || latencyMs > 3000) ? 'WARNING' : 'HEALTHY';
    await db.collection('infraSnapshots').add({
      clientId, projectId: projectId || null, checkType: 'UPTIME', target: url, status,
      details: { statusCode: code, latencyMs }, checkedAt: now(),
    });
    if (status !== 'HEALTHY') {
      const clientDoc = await db.collection('clientProfiles').doc(clientId).get();
      await createAlertIfNew(
        clientId, 'UPTIME', status === 'CRITICAL' ? 'critical' : 'medium',
        `${status === 'CRITICAL' ? 'Site down' : 'Slow response'} — ${new URL(url).hostname}`,
        `Status ${code}, latency ${latencyMs}ms`,
        clientDoc.data()?.companyName
      );
    }
    resolve();
  });
  req.on('error', async (e) => {
    await db.collection('infraSnapshots').add({
      clientId, projectId: projectId || null, checkType: 'UPTIME', target: url,
      status: 'CRITICAL', details: { error: e.message }, checkedAt: now(),
    }).catch(() => {});
    resolve();
  });
  req.on('timeout', () => { req.destroy(); resolve(); });
});

exports.monitoringCycle = functions.pubsub.schedule('0 */6 * * *').onRun(async () => {
  const snap = await db.collection('projects').get();
  const projects = toDocs(snap).filter((p) => p.stagingUrl || p.productionUrl);
  for (const p of projects) {
    const urls = [p.productionUrl, p.stagingUrl].filter(Boolean);
    for (const url of urls) {
      try {
        const hostname = new URL(url).hostname;
        await Promise.all([checkSSL(p.clientId, p.id, hostname), checkUptime(p.clientId, p.id, url)]);
      } catch (e) { console.error(`Monitor error for ${url}:`, e.message); }
    }
  }
  return null;
});

// Note: there used to be a checkDomainExpiry scheduled function here that
// checked for infraSnapshots with checkType:'DOMAIN' — but nothing anywhere
// ever wrote one, so it just fired a useless "monitoring gap" alert every
// single day, forever. Removed the dead stub. Real domain/subscription
// renewal alerting is the scheduled function below — GET /v1/alerts/domain-
// renewal and GET /v1/alerts/subscription-renewal compute the same data on
// request but nothing ever called them proactively, so they never actually
// alerted anyone; this closes that gap by pushing through createAlertIfNew.
exports.renewalAlertsCycle = functions.pubsub.schedule('0 8 * * *').timeZone('UTC').onRun(async () => {
  const thirtyDays = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 86400000));
  const sevenDays = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 86400000));

  const [domainSnap, subSnap] = await Promise.all([
    db.collection('domainManagement').where('expirationDate', '<=', thirtyDays).where('status', '!=', 'EXPIRED').get(),
    db.collection('projectSubscription').where('renewalDate', '<=', sevenDays).where('status', '==', 'ACTIVE').get(),
  ]);

  for (const doc of toDocs(domainSnap)) {
    const project = await db.collection('projects').doc(doc.projectId).get();
    if (!project.exists) continue;
    const { clientId } = project.data();
    const clientDoc = await db.collection('clientProfiles').doc(clientId).get();
    const daysLeft = Math.floor((doc.expirationDate.toDate().getTime() - Date.now()) / 86400000);
    await createAlertIfNew(
      clientId, 'DOMAIN_RENEWAL', daysLeft <= 7 ? 'critical' : daysLeft <= 14 ? 'high' : 'medium',
      `Domain expires in ${daysLeft} days — ${doc.domainName}`,
      `Registrar: ${doc.registrar || 'Unknown'}`,
      clientDoc.data()?.companyName
    );
  }

  for (const doc of toDocs(subSnap)) {
    const project = await db.collection('projects').doc(doc.projectId).get();
    if (!project.exists) continue;
    const { clientId } = project.data();
    const clientDoc = await db.collection('clientProfiles').doc(clientId).get();
    const daysLeft = Math.floor((doc.renewalDate.toDate().getTime() - Date.now()) / 86400000);
    await createAlertIfNew(
      clientId, 'SUBSCRIPTION_RENEWAL', daysLeft <= 2 ? 'critical' : 'high',
      `${doc.serviceName} renews in ${daysLeft} days`,
      `GHS ${doc.monthlyCost}/month`,
      clientDoc.data()?.companyName
    );
  }

  return null;
});

// =============================================================================
// GCP BILLING BUDGET ALERTS
// =============================================================================

// Static per-client monthly cloud budget config. `budgetId` links a Cloud
// Billing budget to its Stormglide client for the Pub/Sub handler below —
// needed because a billing account can hold other, unrelated budgets (e.g.
// Firebase's own auto-created ones) that must never be attributed to a
// client here. Entries with `budgetId: null` have no budget yet (billing
// isn't enabled on that GCP project) — kept here so the dashboard can show
// that honestly instead of silently omitting the client.
const CLIENT_BUDGETS = [
  { budgetId: '0c7f594f-8755-4874-a827-141654a44f79', clientId: 'LlosgTAKe0VadqlMQodi', clientName: 'MC-Bauchemie Ghana', budgetAmount: 13, currencyCode: 'USD' },
  { budgetId: '7814d375-5bd1-4a5c-8659-f0d3d50b55ee', clientId: '2COI4GEerQCu3E2zVFsf', clientName: 'Green Gold Gardens', budgetAmount: 13, currencyCode: 'USD' },
  { budgetId: '9e4eac84-2ead-49ff-ac2d-7ba10163203f', clientId: 'LpFjSLGn7vXJccGHrbvA', clientName: 'Westline Future', budgetAmount: 13, currencyCode: 'USD' },
  { budgetId: null, clientId: 'cISlC5fm1rzxG6d9LUe9', clientName: 'Glasstech Fab', budgetAmount: null, currencyCode: null },
];
const BUDGET_ID_MAP = Object.fromEntries(CLIENT_BUDGETS.filter((b) => b.budgetId).map((b) => [b.budgetId, b]));

exports.billingBudgetAlert = functions.pubsub.topic('billing-budget-alerts').onPublish(async (message) => {
  const budgetId = message.attributes?.budgetId;
  const client = BUDGET_ID_MAP[budgetId];
  if (!client) {
    console.log(`Ignoring billing budget notification for untracked budget ${budgetId}`);
    return null;
  }

  let payload;
  try {
    payload = message.json;
  } catch (e) {
    console.error('Malformed billing budget notification payload:', e.message);
    return null;
  }

  const costAmount = Number(payload.costAmount) || 0;
  const budgetAmount = Number(payload.budgetAmount) || 0;
  const currencyCode = payload.currencyCode || 'USD';
  const pct = Math.round((Number(payload.alertThresholdExceeded) || (budgetAmount ? costAmount / budgetAmount : 0)) * 100);
  // Every configured threshold (50/90/100%) is treated as high-or-above so it
  // emails immediately rather than waiting for the budget to be exhausted.
  const severity = pct >= 100 ? 'critical' : 'high';

  await db.collection('budgetStatus').doc(client.clientId).set({
    clientId: client.clientId, clientName: client.clientName,
    costAmount, budgetAmount, currencyCode, pct, updatedAt: now(),
  }, { merge: true });

  await createAlertIfNew(
    client.clientId, 'BUDGET', severity,
    `${client.clientName} — ${pct}% of monthly cloud budget spent`,
    `${currencyCode} ${costAmount.toFixed(2)} of ${currencyCode} ${budgetAmount.toFixed(2)} this billing period`,
    client.clientName
  );

  return null;
});

app.get('/v1/monitoring/budgets', verifyToken, adminOnly, async (req, res) => {
  const statusSnap = await db.collection('budgetStatus').get();
  const statusMap = {};
  statusSnap.forEach((d) => { statusMap[d.id] = d.data(); });
  const budgets = CLIENT_BUDGETS.map((b) => ({
    clientId: b.clientId,
    clientName: b.clientName,
    budgetAmount: b.budgetAmount,
    currencyCode: b.currencyCode,
    configured: !!b.budgetId,
    latest: statusMap[b.clientId] || null,
  }));
  return res.json(budgets);
});

// Daily visits + growth-trend digest — yesterday vs the day before, and vs
// the same weekday the prior week (single-day GA4 numbers are noisy day to
// day; the week-over-week comparison is what actually reads as a trend).
// No-ops (like everything else GA4-dependent here) until GA4_PROPERTY_ID +
// GA4_SERVICE_ACCOUNT_KEY_BASE64 are set.
exports.dailyAnalyticsDigest = functions.pubsub.schedule('0 7 * * *').timeZone('UTC').onRun(async () => {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const client = getGaClient();
  if (!propertyId || !client) {
    console.warn('GA4 not configured — daily digest skipped');
    return null;
  }

  const property = `properties/${propertyId}`;
  const metrics = [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'screenPageViews' }];

  try {
    const [yesterday] = await client.runReport({ property, dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }], metrics });
    const [dayBefore] = await client.runReport({ property, dateRanges: [{ startDate: '2daysAgo', endDate: '2daysAgo' }], metrics });
    const [lastWeek] = await client.runReport({ property, dateRanges: [{ startDate: '8daysAgo', endDate: '8daysAgo' }], metrics });
    const [topPages] = await client.runReport({
      property,
      dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 5,
    });

    const val = (report, i) => Number(report?.rows?.[0]?.metricValues?.[i]?.value || 0);
    const pct = (curr, prev) => (prev === 0 ? (curr > 0 ? '+∞' : '0') : `${curr >= prev ? '+' : ''}${Math.round(((curr - prev) / prev) * 100)}%`);

    const sessions = val(yesterday, 0), users = val(yesterday, 1), views = val(yesterday, 2);
    const sessionsPrevDay = val(dayBefore, 0), sessionsPrevWeek = val(lastWeek, 0);

    const dateLabel = new Date(Date.now() - 86400000).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    const pagesHtml = (topPages?.rows || []).map((r) => (
      `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
        <span style="color:#9ca3af">${r.dimensionValues[0].value}</span>
        <span style="color:#fff;font-weight:600">${r.metricValues[0].value}</span>
      </div>`
    )).join('') || '<p style="color:#6b7280;font-size:12px">No pageview data.</p>';

    await sendEmail(
      LEAD_NOTIFY_EMAIL,
      `Daily visits — ${dateLabel}: ${sessions} sessions (${pct(sessions, sessionsPrevDay)} vs prev day)`,
      `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;padding:32px">
        <div style="font-size:22px;font-weight:700;margin-bottom:4px;color:#22D3EE">Stormglide.io — Daily Traffic</div>
        <p style="color:#6b7280;font-size:13px;margin:0 0 24px">${dateLabel}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:24px">
          <div style="background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.25);border-radius:10px;padding:14px;text-align:center">
            <div style="font-size:22px;font-weight:700">${sessions}</div>
            <div style="font-size:11px;color:#9ca3af">Sessions</div>
          </div>
          <div style="background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.25);border-radius:10px;padding:14px;text-align:center">
            <div style="font-size:22px;font-weight:700">${users}</div>
            <div style="font-size:11px;color:#9ca3af">Users</div>
          </div>
          <div style="background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.25);border-radius:10px;padding:14px;text-align:center">
            <div style="font-size:22px;font-weight:700">${views}</div>
            <div style="font-size:11px;color:#9ca3af">Pageviews</div>
          </div>
        </div>
        <p style="color:#9ca3af;margin:0 0 6px"><strong style="color:#fff">${pct(sessions, sessionsPrevDay)}</strong> vs the day before</p>
        <p style="color:#9ca3af;margin:0 0 20px"><strong style="color:#fff">${pct(sessions, sessionsPrevWeek)}</strong> vs the same day last week</p>
        <div style="margin-bottom:8px;font-size:12px;font-weight:700;letter-spacing:1px;color:#6b7280;text-transform:uppercase">Top pages yesterday</div>
        ${pagesHtml}
      </div>`
    );
  } catch (err) {
    console.error('Daily analytics digest error:', err);
  }
  return null;
});

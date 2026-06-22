'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const tls = require('tls');

admin.initializeApp();
const db = admin.firestore();
const fbAuth = admin.auth();

// ── Express app ──────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

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
const paystackLink = (invoice, email) => new Promise((resolve) => {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) return resolve(null);
  const body = JSON.stringify({
    email, amount: Math.round(Number(invoice.amount) * 100),
    currency: invoice.currency, reference: invoice.invoiceNumber,
    callback_url: `${process.env.FRONTEND_URL || 'https://stormglide.io'}/portal`,
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
  const expected = process.env.ADMIN_ACCESS_KEY || 'stormglide-2026';
  if (key !== expected) return res.status(401).json({ message: 'Invalid Commander Authorization Key.' });

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
  const { userId, companyName, contactName, whatsappNumber, region, industry } = req.body;
  const ref = await db.collection('clientProfiles').add({
    userId: userId || null, companyName, contactName,
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
  const { name, email, organization, missionScope, details } = req.body;
  const ref = await db.collection('leads').add({
    name, email, organization: organization || null,
    missionScope, details, status: 'NEW', createdAt: now(),
  });
  return res.json({ id: ref.id, name, email });
});

app.put('/v1/crm/lead/:id/status', verifyToken, adminOnly, async (req, res) => {
  await db.collection('leads').doc(req.params.id).update({ status: req.body.status });
  return res.json({ id: req.params.id, status: req.body.status });
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

app.post('/v1/billing/invoice/:clientId', verifyToken, adminOnly, async (req, res) => {
  const { amount, currency, projectId, dueDate } = req.body;
  const { clientId } = req.params;
  const clientDoc = await db.collection('clientProfiles').doc(clientId).get();
  if (!clientDoc.exists) return res.status(404).json({ message: 'Client not found' });

  const cur = (currency || 'USD').toUpperCase();
  const gateway = ['GHS', 'NGN', 'ZAR'].includes(cur) ? 'PAYSTACK' : 'STRIPE';
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`;

  const ref = await db.collection('invoices').add({
    clientId, projectId: projectId || null, invoiceNumber,
    amount: Number(amount), currency: cur, paymentGateway: gateway,
    status: 'DRAFT',
    dueDate: dueDate ? admin.firestore.Timestamp.fromDate(new Date(dueDate)) : now(),
    paidAt: null, paymentLink: null, transactionId: null,
    createdAt: now(), updatedAt: now(),
  });

  const clientData = clientDoc.data();
  let email = null;
  if (clientData.userId) {
    const userDoc = await db.collection('users').doc(clientData.userId).get();
    email = userDoc.data()?.email;
  }

  let paymentLink = null;
  const invoice = { id: ref.id, invoiceNumber, amount, currency: cur };
  if (gateway === 'PAYSTACK' && email) paymentLink = await paystackLink(invoice, email);

  if (paymentLink) await ref.update({ paymentLink, status: 'SENT' });

  if (email) {
    emailInvoice(email, {
      invoiceNumber, amount, currency: cur,
      dueDate: dueDate
        ? new Date(dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'N/A',
      paymentLink,
    }).catch((e) => console.warn('Invoice email failed:', e.message));
  }

  return res.json({ ...invoice, paymentLink });
});

app.put('/v1/billing/invoice/:id/status', verifyToken, adminOnly, async (req, res) => {
  const { status } = req.body;
  const update = { status, updatedAt: now() };
  if (status === 'PAID') update.paidAt = now();
  await db.collection('invoices').doc(req.params.id).update(update);
  return res.json({ id: req.params.id, status });
});

app.post('/v1/billing/webhook/paystack', async (req, res) => {
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
  return res.json(type ? docs.filter((d) => d.type === type) : docs);
});

app.post('/v1/monitoring/documents', verifyToken, adminOnly, async (req, res) => {
  const { clientId, type, title, status, fileUrl, fileSize } = req.body;
  const ref = await db.collection('documents').add({
    clientId, type: type || 'CONTRACT', title, status: status || 'DRAFT',
    fileUrl: fileUrl || null, fileSize: fileSize || null,
    uploadedBy: req.user.email || 'admin',
    createdAt: now(), updatedAt: now(),
  });
  return res.json({ id: ref.id, clientId, title, type });
});

app.put('/v1/monitoring/documents/:id/status', verifyToken, adminOnly, async (req, res) => {
  await db.collection('documents').doc(req.params.id).update({ status: req.body.status, updatedAt: now() });
  return res.json({ id: req.params.id, status: req.body.status });
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
    return {
      ...p, milestones, feedback: toDocs(fSnap),
      progress: milestones.length ? Math.round((completed / milestones.length) * 100) : 0,
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
    adminId: req.user.uid, details: details || null, createdAt: now(),
  });
  return res.json({ id: ref.id, action, entityType });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'stormglide-api', ts: Date.now() }));

// =============================================================================
// EXPORT HTTP FUNCTION
// =============================================================================
exports.api = functions.https.onRequest(app);

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

exports.checkDomainExpiry = functions.pubsub.schedule('0 0 * * *').onRun(async () => {
  const sevenDaysAgo = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7 * 86400000));
  const clientsSnap = await db.collection('clientProfiles').get();
  for (const clientDoc of clientsSnap.docs) {
    const recentSnap = await db.collection('infraSnapshots')
      .where('clientId', '==', clientDoc.id)
      .where('checkType', '==', 'DOMAIN')
      .where('checkedAt', '>=', sevenDaysAgo)
      .limit(1).get();
    if (recentSnap.empty) {
      await createAlertIfNew(
        clientDoc.id, 'DOMAIN', 'medium',
        `Domain monitoring gap — ${clientDoc.data().companyName}`,
        'No domain check recorded in the last 7 days.',
        clientDoc.data().companyName
      );
    }
  }
  return null;
});

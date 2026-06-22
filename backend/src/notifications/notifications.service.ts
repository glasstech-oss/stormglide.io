import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    private readonly resendApiKey = process.env.RESEND_API_KEY;
    private readonly fromEmail = process.env.FROM_EMAIL || 'noreply@stormglide.io';
    private readonly adminEmail = process.env.ADMIN_EMAIL || 'admin@stormglide.io';
    private readonly frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    private async sendEmail(to: string, subject: string, html: string): Promise<void> {
        if (!this.resendApiKey) {
            this.logger.warn(`[EMAIL SKIPPED — no RESEND_API_KEY] To: ${to} | Subject: ${subject}`);
            return;
        }

        try {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.resendApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ from: this.fromEmail, to, subject, html }),
            });

            if (!res.ok) {
                const err = await res.text();
                this.logger.error(`Resend error: ${err}`);
            } else {
                this.logger.log(`Email sent to ${to}: ${subject}`);
            }
        } catch (err) {
            this.logger.error(`Failed to send email to ${to}`, err);
        }
    }

    async sendMagicLink(email: string, magicLinkUrl: string): Promise<void> {
        const html = `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;overflow:hidden">
                <div style="background:linear-gradient(135deg,#22D3EE,#A855F7);padding:2px">
                    <div style="background:#0d1117;padding:40px 32px">
                        <h1 style="font-size:24px;font-weight:700;margin:0 0 8px">Your Portal Access Link</h1>
                        <p style="color:#9ca3af;margin:0 0 32px">Click the button below to securely access your project portal. This link expires in 15 minutes.</p>
                        <a href="${magicLinkUrl}" style="display:inline-block;background:#22D3EE;color:#04181f;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">
                            Access My Portal →
                        </a>
                        <p style="color:#6b7280;font-size:12px;margin-top:24px">If you didn't request this link, you can safely ignore this email.</p>
                        <p style="color:#374151;font-size:11px;font-family:monospace;margin-top:32px;word-break:break-all">${magicLinkUrl}</p>
                    </div>
                </div>
            </div>
        `;
        await this.sendEmail(email, 'Your Stormglide Portal Access Link', html);
    }

    async sendAlertNotification(alert: { title: string; description: string; severity: string; clientName?: string }): Promise<void> {
        const severityColor = alert.severity === 'critical' ? '#ef4444' : alert.severity === 'high' ? '#f97316' : '#f59e0b';
        const html = `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;padding:32px">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
                    <div style="width:12px;height:12px;border-radius:50%;background:${severityColor}"></div>
                    <span style="font-size:11px;font-family:monospace;text-transform:uppercase;color:#9ca3af;letter-spacing:2px">${alert.severity} Alert</span>
                </div>
                <h2 style="font-size:20px;font-weight:700;margin:0 0 12px">${alert.title}</h2>
                <p style="color:#9ca3af;margin:0 0 8px">${alert.description}</p>
                ${alert.clientName ? `<p style="color:#6b7280;font-size:13px">Client: <strong style="color:#e5e7eb">${alert.clientName}</strong></p>` : ''}
                <a href="${this.frontendUrl}/admin/dashboard" style="display:inline-block;margin-top:24px;background:#22D3EE;color:#04181f;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px">
                    Open Alert Center →
                </a>
                <p style="color:#374151;font-size:11px;font-family:monospace;margin-top:24px">STORMGLIDE MISSION CONTROL</p>
            </div>
        `;
        await this.sendEmail(this.adminEmail, `[${alert.severity.toUpperCase()}] ${alert.title}`, html);
    }

    async sendInvoiceNotification(to: string, invoice: { invoiceNumber: string; amount: number; currency: string; dueDate: string; paymentLink?: string }): Promise<void> {
        const html = `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;padding:32px">
                <h2 style="font-size:20px;font-weight:700;margin:0 0 24px">Invoice ${invoice.invoiceNumber}</h2>
                <div style="background:#111827;border-radius:12px;padding:20px;margin-bottom:24px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                        <span style="color:#9ca3af">Amount Due</span>
                        <strong style="font-size:20px">${invoice.currency} ${invoice.amount.toLocaleString()}</strong>
                    </div>
                    <div style="display:flex;justify-content:space-between">
                        <span style="color:#9ca3af">Due Date</span>
                        <span>${invoice.dueDate}</span>
                    </div>
                </div>
                ${invoice.paymentLink ? `
                    <a href="${invoice.paymentLink}" style="display:inline-block;background:#22D3EE;color:#04181f;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">
                        Pay Now →
                    </a>
                ` : ''}
                <p style="color:#6b7280;font-size:12px;margin-top:24px">Questions? Reply to this email or reach us on WhatsApp.</p>
            </div>
        `;
        await this.sendEmail(to, `Invoice ${invoice.invoiceNumber} — ${invoice.currency} ${invoice.amount.toLocaleString()}`, html);
    }

    async sendPhaseAdvanceNotification(to: string, data: { clientName: string; projectName: string; newPhase: string; portalUrl: string }): Promise<void> {
        const phaseLabels: Record<string, string> = {
            UI_UX_DESIGN: 'UI/UX Design', BACKEND_ARCHITECTURE: 'Backend Architecture',
            STAGING: 'Live Staging', PRODUCTION: 'Production Launch', MAINTENANCE: 'Maintenance',
        };
        const html = `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d1117;color:#fff;border-radius:16px;padding:32px">
                <div style="margin-bottom:24px">
                    <span style="font-size:11px;font-family:monospace;text-transform:uppercase;color:#22D3EE;letter-spacing:2px">Project Update</span>
                </div>
                <h2 style="font-size:20px;font-weight:700;margin:0 0 12px">Your project has advanced to ${phaseLabels[data.newPhase] || data.newPhase}</h2>
                <p style="color:#9ca3af;margin:0 0 8px">${data.projectName} is now entering a new milestone phase.</p>
                <a href="${data.portalUrl}" style="display:inline-block;margin-top:24px;background:#22D3EE;color:#04181f;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px">
                    View Progress →
                </a>
            </div>
        `;
        await this.sendEmail(to, `Project Update: ${data.projectName} → ${phaseLabels[data.newPhase] || data.newPhase}`, html);
    }
}

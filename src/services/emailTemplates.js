/**
 * Custom branded email templates for StormGlide
 * Uses brand colors, logos, and professional design
 */

// Brand colors
const BRAND_COLORS = {
  primary: '#0891b2', // Cyan/Teal
  accent: '#06b6d4', // Light cyan
  success: '#10b981', // Green
  warning: '#f59e0b', // Amber
  danger: '#ef4444', // Red
  dark: '#0f172a', // Dark blue
  light: '#f8fafc', // Light gray
}

/**
 * Client Onboarding Welcome Email
 */
export const getWelcomeEmailTemplate = (clientData, projectData) => {
  const loginUrl = 'https://stormglideio.web.app/client/login'
  const dashboardUrl = 'https://stormglideio.web.app/client/dashboard'

  return {
    subject: `Welcome to StormGlide! Your ${projectData.packageName} is ready`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: ${BRAND_COLORS.dark}; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent}); padding: 40px 20px; text-align: center; color: white; }
            .logo { font-size: 28px; font-weight: 800; margin-bottom: 10px; letter-spacing: -0.03em; }
            .content { padding: 40px 20px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: 700; margin-bottom: 15px; color: ${BRAND_COLORS.dark}; }
            .section-text { font-size: 14px; color: #475569; line-height: 1.8; margin-bottom: 12px; }
            .highlight { background: #f0f9ff; padding: 20px; border-left: 4px solid ${BRAND_COLORS.primary}; border-radius: 6px; margin: 20px 0; }
            .cta-button { display: inline-block; padding: 12px 24px; background: ${BRAND_COLORS.primary}; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .credentials { background: ${BRAND_COLORS.light}; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .credential-item { margin: 10px 0; font-size: 14px; }
            .credential-label { font-weight: 600; color: ${BRAND_COLORS.dark}; }
            .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .feature-box { padding: 15px; background: ${BRAND_COLORS.light}; border-radius: 8px; }
            .feature-icon { font-size: 24px; margin-bottom: 8px; }
            .feature-title { font-weight: 600; font-size: 14px; color: ${BRAND_COLORS.dark}; }
            .footer { background: ${BRAND_COLORS.light}; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
            .social-links { margin: 15px 0; }
            .social-link { display: inline-block; margin: 0 10px; }
            .divider { height: 1px; background: #e2e8f0; margin: 30px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="logo">⚡ StormGlide</div>
              <p style="margin: 0; font-size: 16px; opacity: 0.95;">Your Project is Ready</p>
            </div>

            <!-- Main Content -->
            <div class="content">
              <div class="section">
                <p style="margin: 0 0 15px 0;">Hi <strong>${clientData.contactPerson}</strong>,</p>
                <p class="section-text">
                  Welcome to <strong>StormGlide</strong>! We're thrilled to have you on board. Your <strong>${projectData.packageName}</strong> project has been set up and is ready for launch.
                </p>
              </div>

              <!-- Quick Stats -->
              <div class="highlight">
                <p style="margin: 0; font-size: 16px; font-weight: 700; color: ${BRAND_COLORS.primary}; margin-bottom: 12px;">✓ Your Project is Live</p>
                <div class="credential-item">
                  <span class="credential-label">Project:</span> ${projectData.name}
                </div>
                <div class="credential-item">
                  <span class="credential-label">Domain:</span> ${projectData.domain || 'Not set'}
                </div>
                <div class="credential-item">
                  <span class="credential-label">Package:</span> ${projectData.packageName}
                </div>
                <div class="credential-item">
                  <span class="credential-label">Monthly Cost:</span> <strong>GHS ${parseFloat(projectData.clientPaymentMonthly).toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong>
                </div>
              </div>

              <!-- What's Included -->
              <div class="section">
                <p class="section-title">What's Included in Your Package</p>
                <div class="feature-grid">
                  <div class="feature-box">
                    <div class="feature-icon">🗄️</div>
                    <div class="feature-title">${projectData.stacks?.length || 0} Infrastructure Services</div>
                  </div>
                  <div class="feature-box">
                    <div class="feature-icon">📊</div>
                    <div class="feature-title">Real-time Monitoring</div>
                  </div>
                  <div class="feature-box">
                    <div class="feature-icon">🔐</div>
                    <div class="feature-title">Security & Uptime</div>
                  </div>
                  <div class="feature-box">
                    <div class="feature-icon">⚙️</div>
                    <div class="feature-title">Maintenance Included</div>
                  </div>
                </div>
              </div>

              <!-- Access Instructions -->
              <div class="section">
                <p class="section-title">🔑 Access Your Dashboard</p>
                <p class="section-text">
                  Log in to your client dashboard to:
                </p>
                <ul style="margin: 10px 0; padding-left: 20px; font-size: 14px; color: #475569;">
                  <li>View your project details and progress</li>
                  <li>See all infrastructure services and costs</li>
                  <li>Monitor service uptime and health</li>
                  <li>Track expiration dates for renewals</li>
                  <li>View invoices and make payments</li>
                  <li>Submit support tickets</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <center>
                <a href="${dashboardUrl}" class="cta-button">
                  Access Your Dashboard →
                </a>
              </center>

              <div class="divider"></div>

              <!-- Login Details -->
              <div class="section">
                <p class="section-title">📱 How to Login</p>
                <div class="credentials">
                  <div class="credential-item">
                    <span class="credential-label">Phone:</span> +${clientData.contactPhone?.replace(/\D/g, '') || 'Your registered phone'}
                  </div>
                  <div class="credential-item">
                    <span class="credential-label">Method:</span> Phone Number + One-Time Password (OTP)
                  </div>
                </div>
                <p class="section-text" style="margin-top: 15px;">
                  1. Go to <a href="${loginUrl}" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">${loginUrl}</a><br>
                  2. Enter your phone number<br>
                  3. You'll receive an SMS with a 6-digit code<br>
                  4. Enter the code to log in
                </p>
              </div>

              <!-- What to Expect -->
              <div class="section">
                <p class="section-title">🎯 What to Expect</p>
                <p class="section-text">
                  <strong>Your project is currently in the <span style="color: ${BRAND_COLORS.primary};">setup & configuration</span> phase.</strong> Our team is working to ensure everything runs smoothly. You'll see:
                </p>
                <ul style="margin: 10px 0; padding-left: 20px; font-size: 14px; color: #475569;">
                  <li><strong>Real-time updates</strong> on project progress</li>
                  <li><strong>Service status</strong> for all infrastructure</li>
                  <li><strong>Upcoming renewals</strong> with 30-day notices</li>
                  <li><strong>Invoice notifications</strong> for billing</li>
                </ul>
              </div>

              <!-- Infrastructure Details -->
              ${projectData.stacks && projectData.stacks.length > 0 ? `
                <div class="section">
                  <p class="section-title">🔧 Your Infrastructure</p>
                  <p class="section-text">Your project uses these services (view full details in your dashboard):</p>
                  <div style="background: ${BRAND_COLORS.light}; padding: 15px; border-radius: 6px; margin: 15px 0;">
                    ${projectData.stacks.map(stack => `
                      <div style="padding: 8px 0; border-bottom: 1px solid #cbd5e1; font-size: 14px;">
                        <strong>${stack.name}</strong> — GHS ${parseFloat(stack.costPerMonth).toFixed(2)}/mo
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Support -->
              <div class="section">
                <p class="section-title">💬 Need Help?</p>
                <p class="section-text">
                  Our team is here to help! You can:
                </p>
                <ul style="margin: 10px 0; padding-left: 20px; font-size: 14px; color: #475569;">
                  <li>Submit a support ticket in your dashboard</li>
                  <li>Email us: <a href="mailto:support@stormglide.io" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">support@stormglide.io</a></li>
                  <li>Check our documentation and guides</li>
                </ul>
              </div>

              <!-- Next Steps -->
              <div class="highlight" style="background: #f0fdf4; border-left-color: ${BRAND_COLORS.success};">
                <p style="margin: 0; font-size: 16px; font-weight: 700; color: ${BRAND_COLORS.success}; margin-bottom: 12px;">✓ Next Steps</p>
                <ol style="margin: 10px 0; padding-left: 20px; font-size: 14px; color: #475569;">
                  <li>Log in to your dashboard</li>
                  <li>Review your project details</li>
                  <li>Check your infrastructure services</li>
                  <li>Set up any additional configurations</li>
                  <li>Contact support if you need assistance</li>
                </ol>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="margin: 0 0 15px 0;">
                <strong>StormGlide Technologies</strong> | Building Practical Software
              </p>
              <p style="margin: 0 0 15px 0;">
                📍 Accra, Ghana | 🌐 stormglide.io
              </p>
              <div class="social-links">
                <a href="https://linkedin.com/company/stormglide" class="social-link" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">LinkedIn</a>
                •
                <a href="https://twitter.com/stormglide" class="social-link" style="color: ${BRAND_COLORS.primary}; text-decoration: none;">Twitter</a>
              </div>
              <p style="margin: 15px 0 0 0; font-size: 11px; color: #94a3b8;">
                This is an automated message. Please don't reply to this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to StormGlide!

Hi ${clientData.contactPerson},

Your ${projectData.packageName} project "${projectData.name}" is now live and ready to use.

PROJECT DETAILS:
- Project: ${projectData.name}
- Domain: ${projectData.domain || 'Not set'}
- Package: ${projectData.packageName}
- Monthly Cost: GHS ${parseFloat(projectData.clientPaymentMonthly).toLocaleString('en-US', { maximumFractionDigits: 2 })}

LOG IN TO YOUR DASHBOARD:
1. Visit: https://stormglideio.web.app/client/login
2. Enter your phone: +${clientData.contactPhone?.replace(/\D/g, '')}
3. Enter the 6-digit OTP you receive via SMS
4. Access your dashboard and project details

WHAT YOU CAN DO:
✓ View project progress and status
✓ Monitor all infrastructure services
✓ Check service uptime and health
✓ View invoices and billing
✓ Submit support tickets

WHAT'S INCLUDED:
${projectData.stacks?.map(s => `• ${s.name} (GHS ${parseFloat(s.costPerMonth).toFixed(2)}/mo)`).join('\n')}

NEED HELP?
Email: support@stormglide.io
Dashboard Support Tickets: https://stormglideio.web.app/client/support-tickets

Best regards,
StormGlide Technologies
Accra, Ghana
    `,
  }
}

/**
 * Project Progress Update Email
 */
export const getProjectUpdateEmailTemplate = (clientData, projectData, progressData) => {
  return {
    subject: `📊 ${projectData.name} - Project Update (${progressData.completionPercentage}% Complete)`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: ${BRAND_COLORS.dark}; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent}); padding: 30px 20px; text-align: center; color: white; }
            .content { padding: 30px 20px; }
            .progress-bar { width: 100%; height: 20px; background: #e2e8f0; border-radius: 10px; overflow: hidden; margin: 20px 0; }
            .progress-fill { height: 100%; background: linear-gradient(90deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent}); width: ${progressData.completionPercentage}%; }
            .deliverable { padding: 12px; background: ${BRAND_COLORS.light}; margin: 8px 0; border-radius: 6px; border-left: 3px solid ${progressData.completionPercentage === 100 ? BRAND_COLORS.success : BRAND_COLORS.primary}; }
            .section { margin: 25px 0; }
            .footer { background: ${BRAND_COLORS.light}; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0 0 10px 0;">Project Progress Update</h2>
              <p style="margin: 0; font-size: 14px; opacity: 0.95;">Your ${projectData.name} is ${progressData.completionPercentage}% complete</p>
            </div>

            <div class="content">
              <p>Hi ${clientData.contactPerson},</p>

              <p>Great news! Here's the latest update on your <strong>${projectData.name}</strong> project:</p>

              <div class="section">
                <h3 style="margin: 0 0 15px 0; color: ${BRAND_COLORS.primary};">Overall Progress</h3>
                <div style="text-align: center; margin: 20px 0;">
                  <p style="font-size: 32px; font-weight: 700; color: ${BRAND_COLORS.primary}; margin: 0;">${progressData.completionPercentage}%</p>
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                  <p style="font-size: 12px; color: #64748b; margin: 10px 0 0 0;">${progressData.completedTasks} of ${progressData.totalTasks} tasks completed</p>
                </div>
              </div>

              <div class="section">
                <h3 style="margin: 0 0 15px 0;">Completed Deliverables</h3>
                ${progressData.deliverables?.filter(d => d.status === 'completed').map(d => `
                  <div class="deliverable">
                    <strong style="color: ${BRAND_COLORS.success};">✓ ${d.name}</strong>
                  </div>
                `).join('')}
              </div>

              <div class="section">
                <h3 style="margin: 0 0 15px 0;">In Progress</h3>
                ${progressData.deliverables?.filter(d => d.status === 'in-progress').map(d => `
                  <div class="deliverable" style="border-left-color: ${BRAND_COLORS.warning};">
                    <strong style="color: ${BRAND_COLORS.warning};">⏳ ${d.name}</strong>
                  </div>
                `).join('')}
              </div>

              <div class="section">
                <h3 style="margin: 0 0 15px 0;">Upcoming</h3>
                ${progressData.deliverables?.filter(d => d.status === 'pending').map(d => `
                  <div class="deliverable" style="border-left-color: #cbd5e1; opacity: 0.7;">
                    <strong>○ ${d.name}</strong>
                  </div>
                `).join('')}
              </div>

              <div style="background: #f0f9ff; padding: 15px; border-radius: 6px; border-left: 4px solid ${BRAND_COLORS.primary}; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px;">
                  <strong>View Full Details:</strong> Log in to your dashboard to see detailed progress, timelines, and updates.
                </p>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0;">StormGlide Technologies | ${new Date().getFullYear()}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

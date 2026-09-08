import { Resend } from "resend";

const brandColor = "#075985";
const accentColor = "#06b6d4";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ovipeps.ca";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character] ?? character);
}

function wrap(content: string, preheader: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>OVIpeps</title></head><body style="margin:0;background:#f1f5f9;font-family:Inter,Arial,sans-serif;color:#0f172a;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:28px 12px;"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,.08);"><tr><td style="padding:24px 30px;background:linear-gradient(135deg,${brandColor},${accentColor});color:#fff;font-size:25px;font-weight:800;">OVIpeps</td></tr><tr><td style="padding:30px;">${content}</td></tr><tr><td style="padding:22px 30px;background:#f8fafc;color:#64748b;font-size:12px;line-height:1.6;border-top:1px solid #e2e8f0;">OVIpeps products are intended exclusively for in-vitro research and laboratory use. Not intended for human or veterinary consumption.<br><a href="${siteUrl}/terms" style="color:${brandColor};">Terms</a> · <a href="${siteUrl}/privacy" style="color:${brandColor};">Privacy</a> · <a href="${siteUrl}/research-disclaimer" style="color:${brandColor};">Disclaimer</a><br>&copy; ${new Date().getFullYear()} OVIpeps</td></tr></table></td></tr></table></body></html>`;
}

export interface EmailTemplate { subject: string; html: string; text: string }

export const emailTemplates = {
  orderConfirmation: (data: {
    orderNumber: string; total: string; name: string;
    items: Array<{ name: string; variant: string; quantity: number; total: string }>;
    etransferEmail: string; autodepositName: string;
  }): EmailTemplate => {
    const safeOrder = escapeHtml(data.orderNumber);
    const itemRows = data.items.map((item) => `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${escapeHtml(item.name)} — ${escapeHtml(item.variant)} × ${item.quantity}</td><td align="right" style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:700;">${escapeHtml(item.total)}</td></tr>`).join("");
    return {
      subject: `Order submitted — ${data.orderNumber}`,
      html: wrap(
        `<p style="margin:0;color:${accentColor};font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;">Order submitted</p><h1 style="margin:8px 0 16px;color:${brandColor};font-size:28px;line-height:1.2;">Thank you, ${escapeHtml(data.name)}!</h1><p style="font-size:16px;line-height:1.65;">Your order <strong>${safeOrder}</strong> was submitted successfully. No card, banking, or payment information was collected or processed on the OVIpeps website.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0;font-size:14px;">${itemRows}<tr><td style="padding:14px 0;font-size:16px;font-weight:800;">Order total</td><td align="right" style="padding:14px 0;font-size:18px;font-weight:800;color:${brandColor};">${escapeHtml(data.total)}</td></tr></table><div style="margin:24px 0;padding:20px;border-radius:14px;background:#ecfeff;border:1px solid #a5f3fc;"><h2 style="margin:0 0 12px;color:${brandColor};font-size:19px;">External payment (completed separately)</h2><p style="margin:0 0 12px;line-height:1.65;">Complete payment separately through your Canadian bank:</p><ol style="margin:0;padding-left:20px;line-height:1.8;"><li>Send an Interac e-Transfer for <strong>${escapeHtml(data.total)}</strong> to <strong>${escapeHtml(data.etransferEmail)}</strong>.</li><li>Enter <strong>ONLY ${safeOrder}</strong> in the message or memo field.</li><li>Confirm AutoDeposit displays <strong>${escapeHtml(data.autodepositName)}</strong>.</li></ol></div><div style="padding:18px;border-left:4px solid ${accentColor};background:#f8fafc;line-height:1.65;"><strong>Storage and handling</strong><br>Keep products at a consistent temperature; refrigeration is highly recommended for stable storage. Keep each vial sealed in its original packaging, protect it from light and moisture, and retain the batch label for your records. Follow your qualified laboratory’s protocol and the product’s batch documentation.</div><p style="margin-top:22px;font-size:13px;line-height:1.6;color:#64748b;">Never send payment to an address other than the one in this official confirmation. If anything looks suspicious, reply to this email before sending funds.</p>`,
        `Order ${data.orderNumber} was submitted. No payment was processed online.`
      ),
      text: `Thank you, ${data.name}! Your order ${data.orderNumber} was submitted successfully for ${data.total}. No payment information was collected or processed on the OVIpeps website.\n\nItems:\n${data.items.map((item) => `- ${item.name} — ${item.variant} x ${item.quantity}: ${item.total}`).join("\n")}\n\nEXTERNAL PAYMENT (COMPLETED SEPARATELY)\nSend ${data.total} by Interac e-Transfer to ${data.etransferEmail}. Enter ONLY ${data.orderNumber} in the memo field and confirm AutoDeposit displays ${data.autodepositName}.\n\nSTORAGE AND HANDLING\nKeep products at a consistent temperature; refrigeration is highly recommended. Keep vials sealed, protect from light and moisture, and retain the batch label. Follow your qualified laboratory's protocol.\n\nNot intended for human or veterinary consumption.`,
    };
  },
  affiliateApproved: (data: { name: string }): EmailTemplate => ({
    subject: "Welcome to the OVIpeps Partner Program",
    html: wrap(`<p style="margin:0;color:${accentColor};font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;">You’re approved</p><h1 style="margin:8px 0 16px;color:${brandColor};font-size:28px;">Welcome, ${escapeHtml(data.name)}!</h1><p style="font-size:16px;line-height:1.65;">Congratulations—your OVIpeps Partner Program application has been approved.</p><div style="margin:22px 0;padding:20px;border-radius:14px;background:#ecfeff;border:1px solid #a5f3fc;"><p style="margin:0 0 8px;">Monthly commission tiers: <strong>10%</strong> up to $1,499, <strong>20%</strong> from $1,500–$4,999, and <strong>25%</strong> at $5,000 or more in combined qualifying sales.</p><p style="margin:0 0 8px;">Customers using your active code automatically receive <strong>5% off</strong>.</p><p style="margin:0;">Your next step is to sign in and choose your own unique affiliate code. Your referral link becomes active immediately after the code is saved.</p></div><p style="text-align:center;margin:26px 0;"><a href="${siteUrl}/account/affiliate" style="display:inline-block;padding:13px 22px;border-radius:10px;background:${brandColor};color:#fff;text-decoration:none;font-weight:700;">Choose my affiliate code</a></p><p style="font-size:13px;line-height:1.6;color:#64748b;">Generate at least $300 CAD in qualifying sales each calendar month. After three missed months—not necessarily consecutive—your affiliate account is frozen pending OVIpeps review. You are responsible for applicable tax reporting and payment obligations.</p>`, "Your OVIpeps Partner Program application has been approved."),
    text: `Welcome to the OVIpeps Partner Program, ${data.name}. Monthly commission tiers are 10% up to $1,499, 20% from $1,500–$4,999, and 25% at $5,000 or more in combined qualifying sales before shipping and taxes. Customers using your active code receive 5% off. Sign in at ${siteUrl}/account/affiliate to choose your unique affiliate code. A minimum of $300 CAD in qualifying sales per calendar month is required; after three missed months, not necessarily consecutive, your account is frozen pending review.`,
  }),
  passwordReset: (data: { name: string; resetUrl: string }): EmailTemplate => ({
    subject: "Reset your OVIpeps password",
    html: wrap(`<h1 style="color:${brandColor};font-size:26px;">Reset your password</h1><p>Hi ${escapeHtml(data.name)},</p><p>Use the secure link below to choose a new password. It expires in one hour.</p><p style="text-align:center;margin:26px 0;"><a href="${data.resetUrl}" style="display:inline-block;padding:13px 22px;border-radius:10px;background:${brandColor};color:#fff;text-decoration:none;font-weight:700;">Reset password</a></p><p style="font-size:13px;color:#64748b;">If you did not request this, you can ignore this email.</p>`, "Reset your OVIpeps password."),
    text: `Reset your OVIpeps password: ${data.resetUrl}\nThis link expires in one hour.`,
  }),
};

export async function sendEmail(to: string, template: EmailTemplate) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.warn(`[Email not sent: Resend sender is not fully configured] To: ${to} | Subject: ${template.subject}`);
    return {
      success: false,
      error: "RESEND_API_KEY and RESEND_FROM_EMAIL must be configured",
    };
  }
  const { data, error } = await new Resend(apiKey).emails.send({
    from,
    replyTo: process.env.RESEND_REPLY_TO ?? "ovipeps@gmail.com",
    to, subject: template.subject, html: template.html, text: template.text,
  });
  if (error) {
    console.error("Resend email failed", error);
    return { success: false, error: error.message };
  }
  return { success: true, id: data?.id };
}

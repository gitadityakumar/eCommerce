import { SendMailClient } from 'zeptomail';

export async function sendEmail({
  to,
  subject,
  html,
  magicLinkUrl,
}: {
  to: string;
  subject: string;
  html: string;
  magicLinkUrl?: string;
}) {
  const apiKey = (process.env.ZEPTOMAIL_API_KEY || '').trim();
  const fromEmail = (process.env.ZEPTOMAIL_FROM_EMAIL || '').trim();
  // For the package, we usually just need the host URL
  const baseUrl = (process.env.ZEPTOMAIL_BASE_URL || 'api.zeptomail.in/').trim();

  const templateKey = (process.env.FORGOT_PASSWORD_TEMPLATE_KEY || '').trim();
  const templateAlias = (process.env.FORGOT_PASSWORD_TEMPLATE_KEY_ALIAS || '').trim();

  if (!apiKey || !fromEmail) {
    console.warn('ZeptoMail credentials missing. Skipping email send.');
    console.warn('--- EMAIL CONTENT ---');
    console.warn(`To: ${to}`);
    console.warn(`Subject: ${subject}`);
    if (magicLinkUrl)
      console.warn(`Magic Link URL: ${magicLinkUrl}`);
    console.warn('---------------------');
    return { ok: true, message: 'Logged to console' };
  }

  const client = new SendMailClient({
    url: baseUrl.includes('://') ? `${new URL(baseUrl).host}/` : baseUrl,
    token: apiKey,
  });

  try {
    if (magicLinkUrl && templateKey && templateAlias) {
      return await client.sendMailWithTemplate({
        template_key: templateKey,
        template_alias: templateAlias,
        from: {
          address: fromEmail,
          name: 'PreetyTwist',
        },
        to: [
          {
            email_address: {
              address: to.trim(),
            },
          },
        ],
        merge_info: {
          magic_link_url: magicLinkUrl,
          username: to.split('@')[0],
          data_time: new Date(Date.now() + 3600000).toLocaleString('en-IN', {
            dateStyle: 'long',
            timeStyle: 'short',
          }),
          current_year: new Date().getFullYear().toString(),
          support_email: 'support@preetytwist.com',
        },
      });
    }

    // Fallback for regular emails (if any)
    return await client.sendMail({
      from: {
        address: fromEmail,
        name: 'PreetyTwist',
      },
      to: [
        {
          email_address: {
            address: to.trim(),
          },
        },
      ],
      subject: subject.trim(),
      htmlbody: html.replace(/\s+/g, ' ').trim(),
    });
  }
  catch (error) {
    console.error('Failed to send email via ZeptoMail package:', error);
    throw error;
  }
}

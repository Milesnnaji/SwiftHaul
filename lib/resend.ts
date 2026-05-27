import { Resend } from "resend";
import { render } from "@react-email/render";
import type { ReactElement } from "react";

export const FROM_EMAIL = process.env.FROM_EMAIL ?? "noreply@swifthaul.com";
export const APP_NAME = process.env.APP_NAME ?? "SwiftHaul";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  template: ReactElement;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
  }>;
}

export async function sendEmail({ to, subject, template, attachments }: SendEmailOptions) {
  const html = await render(template);
  const resend = getResend();

  const result = await resend.emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to,
    subject,
    html,
    attachments,
  });

  if (result.error) {
    throw new Error(`Failed to send email: ${result.error.message}`);
  }

  return result.data;
}

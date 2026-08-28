'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'enquiries@sulochanafurniture.in';
const TO = 'sulochanafurniture.superstore@gmail.com';

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function sendContactEmail(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const firstName = (formData.get('firstName') as string)?.trim();
  const lastName = (formData.get('lastName') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();

  if (!firstName || !email || !message) {
    return { status: 'error', message: 'Please fill in all required fields.' };
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: 'New enquiry from sulochanafurniture.in',
      text: [
        `Name:    ${firstName} ${lastName}`,
        `Email:   ${email}`,
        `Phone:   ${phone || '—'}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    });

    if (error) {
      console.error('[contact] Resend error (full):', JSON.stringify(error, null, 2));
      return { status: 'error', message: 'Failed to send message. Please try again.' };
    }

    return { status: 'success' };
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return { status: 'error', message: 'An unexpected error occurred. Please try again.' };
  }
}

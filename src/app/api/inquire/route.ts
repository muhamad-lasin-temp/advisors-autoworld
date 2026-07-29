import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactInquirySchema } from '@/lib/validations/car-schema';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { logSecurityEvent } from '@/lib/security-logger';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_TO = process.env.EMAIL_TO || 'sales@advisorsautoworld.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Schema-based validation at API boundary
    const validationResult = ContactInquirySchema.safeParse(body);

    if (!validationResult.success) {
      logSecurityEvent('VALIDATION_FAILED', {
        endpoint: '/api/inquire',
        issues: validationResult.error.issues,
      });

      return NextResponse.json(
        {
          error: 'Invalid inquiry payload format.',
          details: validationResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { name, email, phone, message, carId, carTitle } = validationResult.data as {
      name: string;
      email: string;
      phone?: string;
      message: string;
      carId?: string;
      carTitle?: string;
    };

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured) {
      const { error: dbError } = await supabase.from('inquiries').insert([
        {
          car_id: carId || null,
          car_title: carTitle || null,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone ? phone.trim() : null,
          message: message.trim(),
          status: 'new',
        },
      ]);

      if (dbError) {
        console.error('[Database Error] Failed to persist inquiry:', dbError.message);
      }
    }

    // 3. Send email via Resend
    if (process.env.RESEND_API_KEY) {
      const subject = carTitle
        ? `New Inquiry: ${carTitle}`
        : 'New General Inquiry — Advisors Autoworld';

      const htmlBody = `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9ff; padding: 24px; border-radius: 12px;">
          <div style="background: #00288e; color: white; padding: 24px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 800;">📬 New Vehicle Inquiry</h1>
            ${carTitle ? `<p style="margin: 6px 0 0; font-size: 13px; opacity: 0.85;">Regarding: <strong>${carTitle}</strong></p>` : ''}
          </div>

          <div style="background: white; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; width: 120px;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #111c2d;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #111c2d;">
                  <a href="mailto:${email}" style="color: #00288e;">${email}</a>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Phone</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #111c2d;">
                  <a href="tel:${phone}" style="color: #00288e;">${phone}</a>
                </td>
              </tr>` : ''}
              ${carTitle ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Vehicle</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #111c2d;">${carTitle}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; font-size: 14px; color: #111c2d; line-height: 1.6;">${message.replace(/\n/g, '<br/>')}</td>
              </tr>
            </table>

            <div style="margin-top: 24px; padding: 16px; background: #f0f3ff; border-radius: 8px; border-left: 4px solid #00288e;">
              <p style="margin: 0; font-size: 12px; color: #444653;">
                Reply directly to this email to respond to <strong>${name}</strong> at <a href="mailto:${email}" style="color: #00288e;">${email}</a>.
              </p>
            </div>
          </div>

          <p style="text-align: center; margin-top: 16px; font-size: 11px; color: #94a3b8;">
            Advisors Autoworld • Punnayurkulam, Kerala, India
          </p>
        </div>
      `;

      const { error: emailError } = await resend.emails.send({
        from: 'Advisors Autoworld <onboarding@resend.dev>',
        to: [EMAIL_TO],
        replyTo: email,
        subject,
        html: htmlBody,
      });

      if (emailError) {
        console.error('[Resend Error] Failed to send email:', emailError);
      }
    }

    // 4. Server security log
    logSecurityEvent('INQUIRY_RECEIVED', {
      name,
      email,
      hasPhone: Boolean(phone),
      carId: carId || 'general',
    });

    return NextResponse.json(
      { success: true, message: 'Inquiry received successfully.' },
      { status: 200 }
    );
  } catch (err: any) {
    logSecurityEvent('API_PAYLOAD_MALFORMED', { error: err?.message || 'Unknown error' });
    return NextResponse.json(
      { error: 'Malformed JSON payload.' },
      { status: 400 }
    );
  }
}

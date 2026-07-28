import { NextResponse } from 'next/server';
import { ContactInquirySchema } from '@/lib/validations/car-schema';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { logSecurityEvent } from '@/lib/security-logger';

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
        // Continue processing to not break user experience if log succeeded
      }
    }

    // 3. Server security log
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

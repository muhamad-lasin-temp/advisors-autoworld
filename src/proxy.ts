import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Sliding window cache for IP rate limiting (In-memory fallback)
const ipCache = new Map<string, { count: number; expiresAt: number }>();

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const path = request.nextUrl.pathname;
  const method = request.method;

  // Initialize response
  const response = NextResponse.next();

  // 1. Production Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // 2. Payload Body Size Guard (Max 15MB)
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 15 * 1024 * 1024) {
      return new NextResponse(
        JSON.stringify({ error: 'Payload Too Large. Request body exceeds maximum 15MB limit.' }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 3. Rate Limiting Throttling for sensitive API / login routes
  if (path.startsWith('/admin/login') || path.startsWith('/api')) {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15-minute window
    const maxRequests = 30; // 30 requests per window limit

    let current = ipCache.get(ip);
    if (!current || now > current.expiresAt) {
      current = { count: 1, expiresAt: now + windowMs };
      ipCache.set(ip, current);
    } else {
      if (current.count >= maxRequests) {
        return new NextResponse(
          JSON.stringify({ error: 'Too Many Requests. Rate limit exceeded. Please try again later.' }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '900',
              'X-RateLimit-Limit': maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
            },
          }
        );
      }
      current.count += 1;
    }

    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (maxRequests - current.count).toString());
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * Login API Route (/api/auth/login)
 * 
 * WHY: Firebase Client SDK creates short-lived JWTs (idTokens) valid for only 1 hour.
 * Relying purely on client JWTs exposes us to XSS attacks (if stored in localStorage) and 
 * forces us to do complex client-side route guards.
 * 
 * HOW: This endpoint takes that 1-hour JWT, verifies it securely using Admin SDK, 
 * and exchanges it for a 5-day encrypted Session Cookie.
 */
export async function POST(request) {
  try {
    // 1. Receive the raw Firebase JWT from the client
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'No ID token provided' }, { status: 401 });
    }

    // Set session expiration to 5 days (in milliseconds)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // 2. Admin SDK magically creates the secure session token
    // It automatically verifies the idToken first before issuing the session cookie.
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ success: true }, { status: 200 });
    
    // 3. Attach the token as a strict cookie
    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true, // Crucial: Prevents JavaScript (and XSS attacks) from reading this cookie
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      path: '/', // Valid across the whole site
      sameSite: 'lax', // CSRF protection
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

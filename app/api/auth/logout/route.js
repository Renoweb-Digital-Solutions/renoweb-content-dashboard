import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (sessionCookie) {
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
        await adminAuth.revokeRefreshTokens(decodedClaims.sub);
      } catch (error) {
        // Session cookie might be invalid or expired, ignore revocation error
        console.error('Error revoking tokens:', error);
      }
    }

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.delete('session');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

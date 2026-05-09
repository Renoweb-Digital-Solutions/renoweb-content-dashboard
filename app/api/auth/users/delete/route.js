import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { ROLES } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

/**
 * Delete User API Route (/api/auth/users/delete)
 * 
 * WHY: This executes a "Hard Delete". It removes the user from the authentication provider
 * so they can never log in again, AND removes their Firestore document so they disappear
 * from all internal CMS systems.
 * 
 * HOW: Relies strictly on Admin SDK to bypass security rules.
 */
export async function POST(request) {
  try {
    // 1. Session Extraction & Verification (Same rigorous check as creation)
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    // 2. Privilege Verification: Are they an Admin?
    const adminDoc = await adminDb.collection('users').doc(uid).get();
    if (!adminDoc.exists || adminDoc.data().role !== ROLES.ADMIN || !adminDoc.data().active) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // 3. Self-Harm Protection
    // WHY: If an admin deletes themselves, they could lock out the entire company.
    if (userId === uid) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    // 4. Hard Delete from Firebase Auth
    try {
      // Deletes the core credential. Their active session cookies might take a few minutes
      // to forcefully expire, but they can't re-authenticate.
      await adminAuth.deleteUser(userId);
    } catch (authError) {
      // Graceful degradation: If they are already deleted in Auth but stuck in Firestore,
      // we ignore the "not found" error so we can clean up Firestore anyway.
      if (authError.code !== 'auth/user-not-found') {
        throw authError;
      }
    }

    // 5. Hard Delete from Firestore
    // This permanently deletes the `/users/{userId}` document.
    await adminDb.collection('users').doc(userId).delete();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

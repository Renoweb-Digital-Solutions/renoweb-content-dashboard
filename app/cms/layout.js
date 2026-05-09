import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import AuthProvider from '@/lib/AuthContext';

/**
 * CMS Layout (Server Component)
 * 
 * WHY: This acts as the ultimate backend gatekeeper for the /cms/* route group.
 * While middleware.js blocks requests without a cookie, it can't read the database.
 * This file explicitly verifies the cookie cryptography AND fetches the user's role
 * from Firestore before allowing ANY child page to render.
 */
export default async function CMSLayout({ children }) {
  // 1. Grab the `session` cookie parsed by Next.js
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  let user = null;

  try {
    // 2. Cryptographically verify the session token using Firebase Admin SDK.
    // If the token is expired or forged, this throws an error.
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid; // The raw Firebase Auth ID

    // 3. Fetch the business logic document from Firestore (`users` collection).
    const userDocRef = adminDb.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    // Security Check: If they are in Auth but not in our Firestore, kick them out.
    if (!userDoc.exists) {
      redirect('/login');
    }

    // Attach the uid to the Firestore data so the client has the full picture.
    user = { uid, ...userDoc.data() };

    // Security Check: If an Admin manually deactivated them, kick them out instantly.
    if (!user.active) {
      redirect('/login?error=account_disabled');
    }
  } catch (error) {
    console.error('Session verification error:', error);
    // Invalid or expired session cookie
    redirect('/login');
  }

  return (
    // Hydration: We pass the verified `user` object down to the Client Context Provider.
    // This allows client components to access `{ user }` instantly without a loading screen.
    <AuthProvider initialUser={user}>
      {children}
    </AuthProvider>
  );
}

import admin from 'firebase-admin';

/**
 * Firebase Admin SDK Initialization
 * 
 * WHY: Unlike the Firebase Client SDK (which is restricted by Firestore Rules), the Admin SDK
 * has superuser privileges. We use it on the backend to bypass security rules when creating
 * secure JWT session cookies, fetching user roles during SSR, and creating/deleting users.
 * 
 * HOW: It initializes using a highly sensitive JSON Service Account Key.
 */

// SINGLETON PATTERN: We check if `admin.apps.length` is 0.
// Next.js hot-reloads during development (HMR). If we didn't check this, Next.js would 
// try to initialize the app again on every file save, crashing with "Firebase App already exists".
if (!admin.apps.length) {
  try {
    // 1. Grab the raw flattened JSON string from the environment variables.
    // CAUTION: This key must NEVER have the `NEXT_PUBLIC_` prefix, otherwise it leaks to the client!
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not defined in the environment variables');
    }

    // 2. Parse the string into a valid JS object.
    const serviceAccount = JSON.parse(serviceAccountKey);

    // 3. Initialize the app with the credentials.
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
    console.log('Firebase Admin initialized successfully.');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
}

// Export the initialized Firestore and Auth instances for use in our API routes and Server Components.
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

// utils/admin.js
import * as admin from 'firebase-admin';

// Check if Firebase Admin SDK has already been initialized
if (!admin.apps.length) {
  // Initialize Firebase Admin SDK with provided credentials and database URL
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

// Export the initialized Firebase Admin SDK for use in other parts of the application
export default admin;

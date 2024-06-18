// Import necessary Firebase modules
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { getAnalytics, logEvent } from "firebase/analytics";

// Firebase configuration object with values from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase app has already been initialized
if (!firebase.apps.length) {
    // Initialize Firebase with the provided configuration
    firebase.initializeApp(firebaseConfig);
}

// Extract individual Firebase modules for easy access
const app = firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Initialize Firebase Analytics on the client side
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

// Export the initialized Firebase app and individual modules for use in other parts of the application
export { firebase, app, analytics, auth, db, storage };

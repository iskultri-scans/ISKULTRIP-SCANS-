// Firebase Client SDK - Browser-side initialization
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Lazy auth and Firestore - avoid SSR initialization errors
let _auth: ReturnType<typeof getAuth> | null = null;
let _db: ReturnType<typeof getFirestore> | null = null;

export function getFirebaseAuth() {
  if (!_auth) {
    _auth = getAuth(app);
  }
  return _auth;
}

export function getFirebaseDb() {
  if (!_db) {
    _db = getFirestore(app);
  }
  return _db;
}

// For backward compatibility - these will be initialized on first client-side import
export const auth = typeof window !== 'undefined' ? getAuth(app) : (null as unknown as ReturnType<typeof getAuth>);
export const db = typeof window !== 'undefined' ? getFirestore(app) : (null as unknown as ReturnType<typeof getFirestore>);

export default app;

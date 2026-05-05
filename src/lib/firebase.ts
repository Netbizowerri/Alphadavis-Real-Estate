import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connectivity Test
async function testConnection() {
  try {
    // Attempting a server-side read to verify permissions and connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firebase Connection: Online");
  } catch (error) {
    // We expect a permission error if the doc doesn't exist, which is fine
    // but if it says "offline", that's the real issue
    if (error instanceof Error && error.message.includes('offline')) {
      console.error("Firebase Connection Error: The client is offline or config is invalid.");
    } else {
      console.log("Firebase Connection: Verified");
    }
  }
}
testConnection();

export default app;

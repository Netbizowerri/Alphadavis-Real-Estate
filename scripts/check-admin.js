import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const app = initializeApp({
  credential: cert({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore(app);

async function checkAdmin() {
  const uid = '24FlMQ4Vk1gE2U0sBPNNkmhauOH3';

  try {
    const adminDoc = await db.collection('admins').doc(uid).get();
    if (adminDoc.exists) {
      console.log('✅ Admin document FOUND:');
      console.log('   UID:', uid);
      console.log('   Data:', adminDoc.data());
    } else {
      console.log('❌ Admin document NOT FOUND for UID:', uid);
      console.log('   Please create document at /admins/' + uid);
      console.log('   With fields: { fullName, email, role: "super_admin", isActive: true }');
    }
  } catch (err) {
    console.error('Error checking admin:', err);
  } finally {
    app.delete();
  }
}

checkAdmin();

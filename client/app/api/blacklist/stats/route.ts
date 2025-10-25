
import { NextResponse } from 'next/server';
import admin, { ServiceAccount } from 'firebase-admin';

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export async function GET() {
  try {
    const verifiedSnapshot = await db.collection('blacklists').where('status', '==', 'verified').get();
    const scamsBlocked = verifiedSnapshot.size;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const reportsSnapshot = await db.collection('blacklists')
      .where('created_at', '>=', startOfMonth)
      .where('created_at', '<=', endOfMonth)
      .get();
    const reportsThisMonth = reportsSnapshot.size;

    // TODO: Account for this
    const assetsProtected = 10;

    return NextResponse.json({
      scamsBlocked,
      reportsThisMonth,
      assetsProtected,
    });
  } catch (error) {
    console.error('Error fetching blacklist stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

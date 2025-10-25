
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
    const blacklistSnapshot = await db.collection('blacklists').where('status', '==', 'verified').get();
    const blacklist = blacklistSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(blacklist);
  } catch (error) {
    console.error('Error fetching blacklist:', error);
    return NextResponse.json({ error: 'Failed to fetch blacklist' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { address, reason, evidence } = await request.json();

    if (!address || !reason) {
      return NextResponse.json({ error: 'Address and reason are required' }, { status: 400 });
    }

    const newBlacklistEntry = {
      address,
      blacklist_reason: reason,
      link_to_evidence: evidence,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      reports: 1,
      status: 'pending',
    };

    const docRef = await db.collection('blacklists').add(newBlacklistEntry);

    return NextResponse.json({ id: docRef.id, ...newBlacklistEntry });
  } catch (error) {
    console.error('Error creating blacklist entry:', error);
    return NextResponse.json({ error: 'Failed to create blacklist entry' }, { status: 500 });
  }
}

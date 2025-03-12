import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error('Missing Firebase Admin credentials');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      privateKey: privateKey.replace(/\\n/g, '\n'),
      clientEmail,
    }),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body) throw new Error("Request body is required");

    const payload = {
      notification: {
        title: body.notificationTitle,
        body: body.notificationBody,
      },
      data: body.url ? { url: body.url } : undefined,
      token: body.firebaseToken,
    };
    await admin.messaging().send(payload);
    return NextResponse.json({ message: "Notification sent successfully." });
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: error.message, details: error }, // Log full error details
      { status: 500 }
    );
  }
}

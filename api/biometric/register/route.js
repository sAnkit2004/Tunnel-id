import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("tunnelId");

    // Safely parse JSON body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const { username, biometricData } = body;

    // Validate input
    if (!username || !biometricData) {
      return NextResponse.json(
        { error: 'Username and biometric data are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Generate keypair (mock implementation)
    const mockGenerateKeypair = () => {
      const privateKey = crypto.randomBytes(32).toString('hex');
      const publicKey = crypto.randomBytes(32).toString('hex');
      return { privateKey, publicKey };
    };

    const { privateKey, publicKey } = mockGenerateKeypair();

    // Encrypt private key
    const encryptPrivateKey = (key) => {
      const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
      let encryptedKey = cipher.update(key, 'utf8', 'hex');
      encryptedKey += cipher.final('hex');
      return encryptedKey;
    };

    const encryptedPrivateKey = encryptPrivateKey(privateKey);

    // Create user
    const newUser = {
      username,
      publicKey,
      encryptedPrivateKey,
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);

    return NextResponse.json({
      success: true,
      data: {
        username: newUser.username,
        publicKey: newUser.publicKey
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


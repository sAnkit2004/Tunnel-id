import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import { SignJWT } from 'jose';

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

    // Find user
    const user = await db.collection("users").findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Mock biometric verification (replace with actual verification logic)
    const mockVerifyBiometric = (data, publicKey) => {
      // In a real implementation, this would use the fuzzy signature system
      return true;
    };

    const isValid = mockVerifyBiometric(biometricData, user.publicKey);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid biometric data' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await new SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


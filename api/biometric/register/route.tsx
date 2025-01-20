import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { BiometricService } from '../../../services/biometric';
import { encrypt } from '../../../utils/encryption';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Check if request has content
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      );
    }

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
        { 
          error: 'Missing required fields',
          details: {
            username: !username ? 'Username is required' : null,
            biometricData: !biometricData ? 'Biometric data is required' : null
          }
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Generate keypair from biometric data
    let keypair;
    try {
      keypair = await BiometricService.generateKeypair(
        Buffer.from(biometricData, 'base64')
      );
    } catch (error) {
      console.error('Biometric processing error:', error);
      return NextResponse.json(
        { error: 'Failed to process biometric data' },
        { status: 422 }
      );
    }

    // Encrypt private key
    let encryptedKey;
    try {
      encryptedKey = encrypt(
        keypair.privateKey,
        Buffer.from(process.env.ENCRYPTION_KEY!, 'base64')
      );
    } catch (error) {
      console.error('Encryption error:', error);
      return NextResponse.json(
        { error: 'Failed to secure private key' },
        { status: 500 }
      );
    }

    // Create user
    try {
      const user = await prisma.user.create({
        data: {
          username,
          publicKey: keypair.publicKey,
          encryptedKey
        }
      });

      return NextResponse.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          publicKey: user.publicKey
        }
      }, { 
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


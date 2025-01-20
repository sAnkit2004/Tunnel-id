import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { BiometricService } from '../../../../services/biometric';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, biometricData } = await req.json();

    // Validate input
    if (!username || !biometricData) {
      return NextResponse.json(
        { error: 'Username and biometric data are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify biometric data
    const isValid = await BiometricService.verifyBiometric(
      Buffer.from(biometricData, 'base64'),
      user.publicKey
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid biometric data' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(Buffer.from(process.env.JWT_SECRET!, 'base64'));

    // Set cookie
    (await cookies()).set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate user' },
      { status: 500 }
    );
  }
}


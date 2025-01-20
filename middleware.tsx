import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  // Paths that don't require authentication
  const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register'];
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(
      token.value,
      Buffer.from(process.env.JWT_SECRET!, 'base64')
    );
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|favicon.ico|public/).*)',
  ],
};


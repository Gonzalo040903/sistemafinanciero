import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublic   = createRouteMatcher(['/sign-in(.*)']);
const isAdminOnly = createRouteMatcher(['/vendedores(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return NextResponse.next();

  const { userId, sessionClaims } = await auth();

  if (!userId) return NextResponse.redirect(new URL('/sign-in', req.url));

  if (isAdminOnly(req)) {
    const rol = (sessionClaims?.metadata as { rol?: string })?.rol;
    if (rol !== 'admin') return NextResponse.redirect(new URL('/panel', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};

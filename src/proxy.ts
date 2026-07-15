import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isValid = token ? await verifySessionToken(token) : false;

  if (!isValid) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Corre en todas las rutas excepto:
     * - /login (la propia pantalla de login)
     * - /api/sync-rsvp (protegida por su propio secret, la llama Vercel Cron)
     * - archivos estáticos de Next y favicon
     */
    '/((?!login|api/sync-rsvp|_next/static|_next/image|favicon.ico).*)',
  ],
};

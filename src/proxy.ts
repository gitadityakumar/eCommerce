import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (session.user.role !== 'admin' && session.user.role !== 'staff') {
      // If user is logged in but not an admin/staff member, redirect them back home.
      // For now, redirecting to sign-in works as it will likely show they are already signed in or we can redirect to /
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

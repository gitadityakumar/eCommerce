import { headers } from 'next/headers';
import { requireUser } from '@/lib/auth/guards';

export async function getRateLimitedUserContext() {
  const user = await requireUser();
  const requestHeaders = await headers();
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
    || requestHeaders.get('x-real-ip')
    || user.id;

  return { user, ip };
}

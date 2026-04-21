import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export class AuthorizationError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new AuthorizationError('Unauthorized');
  }

  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== 'admin') {
    throw new AuthorizationError('Admin access required');
  }

  return user;
}

export function isAuthorizationError(error: unknown) {
  return error instanceof AuthorizationError;
}

export function assertOwner(resourceUserId: string | null | undefined, currentUserId: string) {
  if (!resourceUserId || resourceUserId !== currentUserId) {
    throw new AuthorizationError('Forbidden');
  }
}

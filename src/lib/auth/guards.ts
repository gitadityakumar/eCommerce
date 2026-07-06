import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export class AuthorizationError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

function hasStaffAccess(role?: string | null) {
  return role === 'admin' || role === 'staff';
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

export async function requireStaff() {
  const user = await requireUser();

  if (!hasStaffAccess(user.role)) {
    throw new AuthorizationError('Staff access required');
  }

  return user;
}

export async function requireOrderManager() {
  const user = await requireUser();

  if (!hasStaffAccess(user.role)) {
    throw new AuthorizationError('Order management access required');
  }

  return user;
}

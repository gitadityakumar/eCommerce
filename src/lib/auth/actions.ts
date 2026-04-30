'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/index';
import { checkRateLimit, rateLimitKey } from '@/lib/security/rate-limit';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8).max(128);
const nameSchema = z.string().min(1).max(100);

interface AuthUserPayload {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

interface AuthSuccessResult {
  ok: true;
  user: AuthUserPayload;
}

interface AuthErrorResult {
  ok: false;
  error: string;
  details?: Record<string, string[]>;
}

type AuthActionResult = AuthSuccessResult | AuthErrorResult;

function buildAuthSuccessUser(user: AuthUserPayload): AuthActionResult {
  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    },
  };
}

function buildAuthValidationError(error: unknown): AuthActionResult | null {
  if (error instanceof z.ZodError) {
    return { ok: false, error: 'Invalid input data', details: error.flatten().fieldErrors };
  }

  return null;
}

async function getRequestIp() {
  const requestHeaders = await headers();
  return requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
    || requestHeaders.get('x-real-ip')
    || 'unknown';
}

const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export async function signUp(formData: FormData): Promise<AuthActionResult> {
  try {
    const ip = await getRequestIp();
    const limit = checkRateLimit(rateLimitKey('sign-up', ip), 5, 15 * 60 * 1000);
    if (!limit.ok)
      return { ok: false, error: 'Too many attempts. Please try again later.' };

    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const data = signUpSchema.parse(rawData);

    const res = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: 'customer',
      },
    });

    return buildAuthSuccessUser(res.user);
  }
  catch (error: any) {
    const validationError = buildAuthValidationError(error);
    if (validationError)
      return validationError;
    console.error('Sign up error:', error);
    return { ok: false, error: error.message || 'Failed to sign up. Please try again.' };
  }
}

const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export async function signIn(formData: FormData): Promise<AuthActionResult> {
  try {
    const ip = await getRequestIp();
    const limit = checkRateLimit(rateLimitKey('sign-in', ip), 10, 15 * 60 * 1000);
    if (!limit.ok)
      return { ok: false, error: 'Too many attempts. Please try again later.' };

    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const data = signInSchema.parse(rawData);

    const res = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    return buildAuthSuccessUser(res.user);
  }
  catch (error: any) {
    const validationError = buildAuthValidationError(error);
    if (validationError)
      return validationError;
    console.error('Sign in error:', error);
    return { ok: false, error: error.message || 'Failed to sign in. Please try again.' };
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session?.user ?? null;
  }
  catch (e) {
    console.error(e);
    return null;
  }
}

export async function signOut() {
  await auth.api.signOut({ headers: {} });
  return { ok: true };
}

export async function forgotPassword(formData: FormData) {
  try {
    const ip = await getRequestIp();
    const limit = checkRateLimit(rateLimitKey('forgot-password', ip), 5, 15 * 60 * 1000);
    if (!limit.ok)
      return { ok: false, error: 'Too many attempts. Please try again later.' };

    const email = formData.get('email') as string;
    const data = z.object({ email: emailSchema }).parse({ email });

    // Check if user exists
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (!user) {
      return { ok: true };
    }

    try {
      // Better Auth v1 uses requestPasswordReset to initiate the flow
      await auth.api.requestPasswordReset({
        body: {
          email: data.email,
          redirectTo: '/reset-password', // This will be used to construct the link
        },
        headers: await headers(),
      });
    }
    catch (apiError: any) {
      console.error('Better Auth sendPasswordResetEmail failed:', {
        message: apiError.message,
        status: apiError.status,
        body: apiError.body,
        availableMethods: Object.keys(auth.api).filter(k => k.toLowerCase().includes('password')),
      });
      throw apiError;
    }

    return { ok: true };
  }
  catch (error: any) {
    console.error('Forgot password final error:', error);
    return { ok: false, error: 'Failed to send reset link. Please try again later.' };
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const ip = await getRequestIp();
    const limit = checkRateLimit(rateLimitKey('reset-password', ip), 5, 15 * 60 * 1000);
    if (!limit.ok)
      return { ok: false, error: 'Too many attempts. Please try again later.' };

    const password = formData.get('password') as string;
    const token = formData.get('token') as string;

    const { password: newPassword } = z.object({
      password: passwordSchema,
    }).parse({ password });

    if (!token) {
      return { ok: false, error: 'Reset token is missing. Please request a new link.' };
    }

    try {
      await auth.api.resetPassword({
        body: {
          newPassword,
          token,
        },
        headers: await headers(),
      });
      return { ok: true };
    }
    catch (apiError: any) {
      console.error('Better Auth resetPassword failed:', {
        message: apiError.message,
        status: apiError.status,
        body: apiError.body,
      });

      if (apiError.message?.toLowerCase().includes('password')) {
        return { ok: false, error: apiError.message || 'Invalid password format.' };
      }
      return { ok: false, error: apiError.message || 'Failed to reset password. The link may have expired.' };
    }
  }
  catch (error: any) {
    console.error('Update password final error:', error);
    return { ok: false, error: error.message || 'An unexpected error occurred.' };
  }
}
const updateProfileSchema = z.object({
  name: nameSchema,
  image: z.string().url().optional().nullable(),
});

export async function updateProfile(formData: FormData): Promise<AuthActionResult> {
  try {
    const rawData = {
      name: formData.get('name') as string,
      image: formData.get('image') as string || null,
    };

    const data = updateProfileSchema.parse(rawData);

    const res = await auth.api.updateUser({
      body: {
        name: data.name,
        image: data.image ?? undefined,
      },
      headers: await headers(),
    });

    if (!res?.status) {
      return { ok: false, error: 'Failed to update user' };
    }

    const updatedUser = await getCurrentUser();

    if (!updatedUser) {
      return { ok: false, error: 'Failed to fetch updated user' };
    }

    return buildAuthSuccessUser(updatedUser);
  }
  catch (error: any) {
    const validationError = buildAuthValidationError(error);
    if (validationError)
      return validationError;
    console.error('Update profile error:', error);
    return { ok: false, error: error.message || 'Failed to update profile. Please try again.' };
  }
}

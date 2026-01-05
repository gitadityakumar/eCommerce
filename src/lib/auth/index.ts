import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { magicLink } from 'better-auth/plugins';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema/index';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      const { sendEmail } = await import('@/lib/email');
      await sendEmail({
        to: user.email,
        subject: 'Reset Your Password | PreetyTwist',
        html: '', // Handled by template
        magicLinkUrl: url,
      });
    },
  },
  socialProviders: {},
  sessions: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  cookies: {
    sessionToken: {
      name: 'auth_session',
      options: {
        httpOnly: true,

        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      },
    },
  },
  advanced: {
    database: {
      generateId: () => uuidv4(),
    },
  },
  plugins: [
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const { sendEmail } = await import('@/lib/email');
        await sendEmail({
          to: email,
          subject: 'Your Magic Link for Password Reset',
          html: '', // We will use template instead
          magicLinkUrl: url,
        });
      },
    }),
  ],
});

import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

type SeedRole = 'admin' | 'staff';

interface SeedUserConfig {
  role: SeedRole;
  emailEnv: string;
  passwordEnv: string;
  nameEnv: string;
  defaultName: string;
}

const seedUsers: SeedUserConfig[] = [
  {
    role: 'admin',
    emailEnv: 'SEED_ADMIN_EMAIL',
    passwordEnv: 'SEED_ADMIN_PASSWORD',
    nameEnv: 'SEED_ADMIN_NAME',
    defaultName: 'Store Admin',
  },
  {
    role: 'staff',
    emailEnv: 'SEED_STAFF_EMAIL',
    passwordEnv: 'SEED_STAFF_PASSWORD',
    nameEnv: 'SEED_STAFF_NAME',
    defaultName: 'Store Manager',
  },
];

// eslint-disable-next-line no-console
const log = (...args: unknown[]) => console.log('[seed-admin]', ...args);

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

async function upsertSeedUser(config: SeedUserConfig) {
  const email = requireEnv(config.emailEnv).toLowerCase();
  const password = requireEnv(config.passwordEnv);
  const name = process.env[config.nameEnv]?.trim() || config.defaultName;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    await db
      .update(users)
      .set({ name, role: config.role, updatedAt: new Date() })
      .where(eq(users.id, existingUser.id));
    log(`Updated ${config.role} user`, email);
    return;
  }

  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      role: config.role,
    },
  });
  log(`Created ${config.role} user`, email);
}

async function seedAdminUsers() {
  for (const seedUser of seedUsers) {
    await upsertSeedUser(seedUser);
  }
}

seedAdminUsers()
  .then(() => {
    log('Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[seed-admin:error]', error);
    process.exit(1);
  });

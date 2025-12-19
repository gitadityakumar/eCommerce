import { auth } from "../auth";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Admin";

  if (!email || !password) {
    console.error("Usage: npx tsx src/lib/db/create-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  try {
    console.log(`Creating user: ${email}...`);
    
    // Create the user using better-auth API to ensure password hashing
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!res || !res.user) {
      console.error("Failed to create user. It might already exist.");
      process.exit(1);
    }

    console.log(`User created with ID: ${res.user.id}. Promoting to admin...`);

    // Promote to admin
    await db.update(users)
      .set({ role: "admin" })
      .where(eq(users.id, res.user.id));

    console.log("Successfully created admin user!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();

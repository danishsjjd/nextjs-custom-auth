"use server";

import { db } from "@/drizzle";
import { OAuthProvider, UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  generateSalt,
  hashPassword,
  verifyPassword,
} from "../core/password-hasher";
import { deleteUserSession } from "../core/user-session";
import { createUserSession } from "../core/user-session-create";
import {
  signInSchema,
  SignInSchema,
  signUpSchema,
  SignUpSchema,
} from "./schemas";
import { getOAuthClient } from "../core/oauth/base";

export async function signUp(formData: SignUpSchema) {
  const { success, data } = signUpSchema.safeParse(formData);

  if (!success) {
    return "Unprocessable Content";
  }

  const { name, email, password } = data;

  const existingUser = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
    columns: {
      id: true,
    },
  });

  if (existingUser != null) {
    return "User already exists";
  }

  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const [user] = await db
      .insert(UserTable)
      .values({
        email,
        name,
        password: hashedPassword,
        salt,
      })
      .returning({ id: UserTable.id, role: UserTable.role });

    await createUserSession(user, await cookies());
  } catch {
    return "Unable to create account";
  }

  redirect("/");
}

export async function signIn(formData: SignInSchema) {
  const { success, data } = signInSchema.safeParse(formData);

  if (!success) {
    return "Unprocessable Content";
  }

  const { email, password } = data;

  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
  });

  if (user == null) {
    return "Invalid credentials";
  }

  if (!user.password || !user.salt) {
    return "Invalid credentials";
  }

  const isPasswordValid = await verifyPassword(
    password,
    user.password,
    user.salt
  );

  if (!isPasswordValid) {
    return "Invalid credentials";
  }

  await createUserSession(user, await cookies());

  redirect("/");
}

export async function logOut() {
  await deleteUserSession(await cookies());

  redirect("/sign-in");
}

export async function oAuthSignin(provider: OAuthProvider) {
  const oAuthClient = getOAuthClient(provider);
  redirect(oAuthClient.createAuthUrl(await cookies()));
}

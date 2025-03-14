"use server";

import { db } from "@/drizzle";
import {
  generateSalt,
  hashPassword,
  verifyPassword,
} from "../core/password-hasher";
import {
  signInSchema,
  SignInSchema,
  signUpSchema,
  SignUpSchema,
} from "./schemas";
import { usersTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createUserSession, deleteSession } from "../core/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: SignUpSchema) {
  const { success, data } = signUpSchema.safeParse(formData);

  if (!success) {
    return "Unprocessable Content";
  }

  const { name, email, password } = data;

  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
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
      .insert(usersTable)
      .values({
        email,
        name,
        password: hashedPassword,
        salt,
      })
      .returning({ id: usersTable.id, role: usersTable.role });

    await createUserSession(user, await cookies());

    redirect("/");
  } catch {
    return "Unable to create account";
  }
}

export async function signIn(formData: SignInSchema) {
  const { success, data } = signInSchema.safeParse(formData);

  if (!success) {
    return "Unprocessable Content";
  }

  const { email, password } = data;

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });

  if (user == null) {
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
  await deleteSession(await cookies());

  redirect("/sign-in");
}

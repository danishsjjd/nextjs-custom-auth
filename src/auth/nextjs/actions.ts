"use server";

import { generateSalt, passwordHash } from "../core/password-hasher";
import {
  signInSchema,
  SignInSchema,
  signUpSchema,
  SignUpSchema,
} from "./schemas";

export async function signIn(formData: SignInSchema) {
  const { success, data } = signInSchema.safeParse(formData);

  if (!success) {
    return "Unprocessable Content";
  }

  return "Work in Progress";
}

export async function signUp(formData: SignUpSchema) {
  const { success, data } = signUpSchema.safeParse(formData);

  if (!success) {
    return "Unprocessable Content";
  }

  const { name, email, password } = data;

  const salt = generateSalt();
  const hashedPassword = await passwordHash(password, salt);

  console.log(hashedPassword);

  return "Work in Progress";
}

export async function logOut() {
  console.log("logOut");

  return "Work in Progress";
}

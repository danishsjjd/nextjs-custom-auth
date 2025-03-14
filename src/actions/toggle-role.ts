"use server";

import { updateUserSessionData } from "@/auth/core/session";
import { getCurrentUser } from "@/auth/nextjs/current-user";
import { db } from "@/drizzle";
import { usersTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const toggleRole = async () => {
  const user = await getCurrentUser({ redirectIfNotAuthenticated: true });

  console.log("toggle role", user);

  const [updatedUser] = await db
    .update(usersTable)
    .set({
      role: user.role === "user" ? "admin" : "user",
    })
    .where(eq(usersTable.id, user.id))
    .returning({ id: usersTable.id, role: usersTable.role });

  await updateUserSessionData(updatedUser, await cookies());
};

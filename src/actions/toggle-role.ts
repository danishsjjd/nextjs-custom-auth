"use server";

import { updateUserSessionData } from "@/auth/core/user-session";
import { getCurrentUser } from "@/auth/nextjs/current-user";
import { db } from "@/drizzle";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const toggleRole = async () => {
  const user = await getCurrentUser({ redirectIfNotAuthenticated: true });

  console.log("toggle role", user);

  const [updatedUser] = await db
    .update(UserTable)
    .set({
      role: user.role === "user" ? "admin" : "user",
    })
    .where(eq(UserTable.id, user.id))
    .returning({ id: UserTable.id, role: UserTable.role });

  await updateUserSessionData(updatedUser, await cookies());
};

import { db } from "@/drizzle";
import { usersTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InferSelectModel } from "drizzle-orm";
import { UserSession } from "../core/schema";
import { getUserFromSession } from "../core/session-edge";

export function getCurrentUser({}: {
  withFullUser?: false;
  redirectIfNotAuthenticated?: false;
}): Promise<UserSession | null>;
export function getCurrentUser({}: {
  withFullUser?: false;
  redirectIfNotAuthenticated?: true;
}): Promise<UserSession>;
export function getCurrentUser({}: {
  withFullUser?: true;
  redirectIfNotAuthenticated?: false;
}): Promise<InferSelectModel<typeof usersTable> | null>;
export function getCurrentUser({}: {
  withFullUser?: true;
  redirectIfNotAuthenticated?: true;
}): Promise<InferSelectModel<typeof usersTable>>;
export async function getCurrentUser({
  withFullUser = false,
  redirectIfNotAuthenticated = false,
}: {
  withFullUser?: boolean;
  redirectIfNotAuthenticated?: boolean;
}) {
  const session = await getUserFromSession(await cookies());

  if (!session) {
    if (redirectIfNotAuthenticated) {
      return redirect("/sign-in");
    }

    return null;
  }

  if (withFullUser) {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, session.id),
    });

    return user;
  }

  return session;
}

import { db } from "@/drizzle";
import { usersTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InferSelectModel } from "drizzle-orm";
import { UserSession } from "../core/schema";
import { getUserFromSession } from "../core/session-edge";
import { cache } from "react";

function _getCurrentUser({}: {
  withFullUser?: false;
  redirectIfNotAuthenticated?: false;
}): Promise<UserSession | null>;
function _getCurrentUser({}: {
  withFullUser?: false;
  redirectIfNotAuthenticated?: true;
}): Promise<UserSession>;
function _getCurrentUser({}: {
  withFullUser?: true;
  redirectIfNotAuthenticated?: false;
}): Promise<InferSelectModel<typeof usersTable> | null>;
function _getCurrentUser({}: {
  withFullUser?: true;
  redirectIfNotAuthenticated?: true;
}): Promise<InferSelectModel<typeof usersTable>>;
async function _getCurrentUser({
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

export const getCurrentUser = cache(_getCurrentUser);

import redis from "@/lib/redis";
import { SESSION_COOKIE_NAME, SESSION_EXPIRATION_TIME } from "./data";
import { UserSession, userSessionSchema } from "./schema";
import { Cookies } from "./type";

export const getUserFromSession = async (cookie: Pick<Cookies, "get">) => {
  const sessionId = cookie.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  return getUserSessionById(sessionId);
};

export async function updateUserSessionExpiration(
  user: UserSession,
  cookies: Pick<Cookies, "get" | "set">
) {
  const sessionId = cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return;
  }

  await setUserSessionById(sessionId, user);
  setCookie(sessionId, cookies);
}
export const setCookie = (sessionId: string, cookie: Pick<Cookies, "set">) => {
  cookie.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: true,
    maxAge: SESSION_EXPIRATION_TIME,
    sameSite: "lax",
  });
};

export const setUserSessionById = async (
  sessionId: string,
  userSession: UserSession
) => {
  await redis.set(
    `session:${sessionId}`,
    userSessionSchema.parse(userSession),
    {
      ex: SESSION_EXPIRATION_TIME,
    }
  );
};

const getUserSessionById = async (sessionId: string) => {
  console.log("redding from redis");
  const rawUser = await redis.get(`session:${sessionId}`);

  const { success, data } = userSessionSchema.safeParse(rawUser);

  if (!success) {
    return null;
  }

  return data;
};

export const deleteUserSessionById = async (sessionId: string) => {
  await redis.del(`session:${sessionId}`);
};

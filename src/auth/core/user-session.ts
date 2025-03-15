import redis from "@/lib/redis";
import { SESSION_COOKIE_NAME, SESSION_EXPIRATION_TIME } from "./data";
import { UserSession, userSessionSchema } from "./schema";
import { Cookies } from "./type";

export const getUserFromSession = async (cookies: Pick<Cookies, "get">) => {
  const sessionId = cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  return getUserSessionById(sessionId);
};

export const updateUserSessionData = async (
  userSession: UserSession,
  cookies: Pick<Cookies, "set" | "get">,
  updateSessionExpiration = false
) => {
  const sessionId = cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return;
  }

  await setUserSessionById(sessionId, userSession);

  if (updateSessionExpiration) {
    setCookie(sessionId, cookies);
  }
};

export const deleteUserSession = async (
  cookies: Pick<Cookies, "delete" | "get">
) => {
  const sessionId = cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return;
  }

  await deleteUserSessionById(sessionId);
  cookies.delete(SESSION_COOKIE_NAME);
};

export const setCookie = (sessionId: string, cookies: Pick<Cookies, "set">) => {
  cookies.set(SESSION_COOKIE_NAME, sessionId, {
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

const deleteUserSessionById = async (sessionId: string) => {
  await redis.del(`session:${sessionId}`);
};

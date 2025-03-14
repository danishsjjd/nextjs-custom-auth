import redis from "@/lib/redis";
import crypto from "crypto";
import { SESSION_COOKIE_NAME, SESSION_EXPIRATION_TIME } from "./data";
import {
  UserSession as UserSession,
  userSessionSchema as userSessionSchema,
} from "./schema";
import { Cookies as Cookies } from "./type";
import {
  deleteUserSessionById,
  setCookie,
  setUserSessionById,
} from "./session-edge";

export const createUserSession = async (
  userSession: UserSession,
  cookies: Pick<Cookies, "set">
) => {
  const { success, data } = userSessionSchema.safeParse(userSession);

  if (!success) {
    throw new Error("Invalid session user");
  }

  const sessionId = await generateSessionId();

  await setUserSessionById(sessionId, userSession);

  setCookie(sessionId, cookies);

  return sessionId;
};

export const deleteSession = async (
  cookie: Pick<Cookies, "delete" | "get">
) => {
  const sessionId = cookie.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return;
  }

  await deleteUserSessionById(sessionId);
  cookie.delete(SESSION_COOKIE_NAME);
};

export const updateUserSessionData = async (
  userSession: UserSession,
  cookies: Pick<Cookies, "set" | "get">
) => {
  const sessionId = cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return;
  }

  await setUserSessionById(sessionId, userSession);
};

export const generateSessionId = async () => {
  return crypto.randomBytes(512).toString("hex").normalize();
};

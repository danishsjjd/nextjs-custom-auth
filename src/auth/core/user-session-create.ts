import crypto from "crypto";
import { UserSession, userSessionSchema } from "./schema";
import { setCookie, setUserSessionById } from "./user-session";
import { Cookies } from "./type";

export const createUserSession = async (
  userSession: UserSession,
  cookies: Pick<Cookies, "set">
) => {
  const { success, data } = userSessionSchema.safeParse(userSession);

  if (!success) {
    throw new Error("Invalid session user");
  }

  const sessionId = crypto.randomBytes(512).toString("hex").normalize();

  await setUserSessionById(sessionId, data);

  setCookie(sessionId, cookies);

  return sessionId;
};

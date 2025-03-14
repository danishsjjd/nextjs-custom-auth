import { userRole } from "@/drizzle/schema";
import redis from "@/lib/redis";
import crypto from "crypto";
import { z } from "zod";

const SESSION_EXPIRATION_TIME = 60 * 60 * 24 * 7; // 7 days
const SESSION_COOKIE_NAME = "sessionId";

const sessionUserSchema = z.object({
  id: z.string(),
  role: z.enum(userRole),
});

type SessionUser = z.infer<typeof sessionUserSchema>;

type Cookie = {
  get: (name: string) => string | undefined;
  set: (
    name: string,
    value: string,
    options?: Partial<{
      httpOnly: boolean;
      secure: boolean;
      maxAge: number;
      path: string;
      sameSite: "lax" | "strict" | "none";
    }>
  ) => void;
  delete: (name: string) => void;
};

export const createSession = async (
  sessionUser: SessionUser,
  cookie: Pick<Cookie, "set">
) => {
  const { success, data } = sessionUserSchema.safeParse(sessionUser);

  if (!success) {
    throw new Error("Invalid session user");
  }

  const sessionId = generateSessionId();

  await redis.set(
    `session:${sessionId}`,
    JSON.stringify(data),
    "EX",
    SESSION_EXPIRATION_TIME
  );

  setCookie(sessionId, cookie);

  return sessionId;
};

export const generateSessionId = () => {
  return crypto.randomBytes(512).toString("hex").normalize();
};

export const setCookie = (sessionId: string, cookie: Pick<Cookie, "set">) => {
  cookie.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: true,
    maxAge: SESSION_EXPIRATION_TIME,
    sameSite: "lax",
  });
};

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    REDIS_TOKEN: z.string(),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

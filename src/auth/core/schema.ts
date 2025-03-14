import { userRole } from "@/drizzle/schema";
import { z } from "zod";

export const userSessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRole),
});

export type UserSession = z.infer<typeof userSessionSchema>;

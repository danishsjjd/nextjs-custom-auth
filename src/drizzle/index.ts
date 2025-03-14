import { env } from "@/env";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(env.DATABASE_URL);

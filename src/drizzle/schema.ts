import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userRole = ["user", "admin"] as const;

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 50 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: text({ enum: userRole }).notNull().default("user"),
  password: varchar({ length: 255 }).notNull(),
  salt: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

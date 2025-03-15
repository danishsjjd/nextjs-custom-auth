import { relations } from "drizzle-orm";
import {
  primaryKey,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRole = ["user", "admin"] as const;
export type UserRole = (typeof userRole)[number];
export const userRoleEnum = pgEnum("user_role", userRole);

export const oAuthProviders = ["discord", "github"] as const;
export type OAuthProvider = (typeof oAuthProviders)[number];
export const oAuthProvidersEnum = pgEnum("oauth_providers", oAuthProviders);

export const UserTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 50 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: userRoleEnum().notNull().default("user"),
  password: varchar({ length: 255 }),
  salt: text(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const UserOauthAccountTable = pgTable(
  "user_oauth_accounts",
  {
    userId: uuid().references(() => UserTable.id, { onDelete: "cascade" }),
    provider: oAuthProvidersEnum().notNull(),
    providerAccountId: text().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.providerAccountId] }),
  })
);

export const userRelations = relations(UserTable, ({ many }) => ({
  oauth: many(UserOauthAccountTable),
}));

export const userOauthAccountRelations = relations(
  UserOauthAccountTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserOauthAccountTable.userId],
      references: [UserTable.id],
    }),
  })
);

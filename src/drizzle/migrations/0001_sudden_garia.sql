ALTER TYPE "public"."oauth_providers" ADD VALUE 'github';--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" RENAME COLUMN "providerUserId" TO "providerAccountId";--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" DROP CONSTRAINT "user_oauth_accounts_provider_providerUserId_pk";--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" ADD CONSTRAINT "user_oauth_accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId");
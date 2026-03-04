CREATE TYPE "public"."business_account_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TABLE "business_accounts" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"business_account_id" varchar(100) NOT NULL,
	"access_token" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_accounts_business_account_id_unique" UNIQUE("business_account_id")
);
--> statement-breakpoint
CREATE TABLE "business_account_members" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"business_account_id" varchar(128) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"role" "business_account_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bam_account_user_unique" UNIQUE("business_account_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "instances" DROP CONSTRAINT "instances_name_unique";--> statement-breakpoint
ALTER TABLE "instances" ALTER COLUMN "business_account_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "instances" ALTER COLUMN "access_token" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "instance_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "instances" ADD COLUMN "business_account_ref_id" varchar(128);--> statement-breakpoint
ALTER TABLE "instances" ADD COLUMN IF NOT EXISTS "user_id" varchar(255);--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "business_account_ref_id" varchar(128);--> statement-breakpoint
ALTER TABLE "business_account_members" ADD CONSTRAINT "business_account_members_business_account_id_business_accounts_id_fk" FOREIGN KEY ("business_account_id") REFERENCES "public"."business_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instances" ADD CONSTRAINT "instances_business_account_ref_id_business_accounts_id_fk" FOREIGN KEY ("business_account_ref_id") REFERENCES "public"."business_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_business_account_ref_id_business_accounts_id_fk" FOREIGN KEY ("business_account_ref_id") REFERENCES "public"."business_accounts"("id") ON DELETE cascade ON UPDATE no action;
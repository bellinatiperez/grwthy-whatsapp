CREATE TYPE "public"."connection_status" AS ENUM('open', 'close', 'connecting');--> statement-breakpoint
CREATE TYPE "public"."device_source" AS ENUM('ios', 'android', 'web', 'unknown', 'desktop');--> statement-breakpoint
CREATE TABLE "instances" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"connection_status" "connection_status" DEFAULT 'open' NOT NULL,
	"owner_jid" varchar(100),
	"profile_name" varchar(100),
	"profile_pic_url" varchar(500),
	"phone_number_id" varchar(100) NOT NULL,
	"business_account_id" varchar(100) NOT NULL,
	"access_token" varchar(500) NOT NULL,
	"api_key" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "instances_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"key" jsonb NOT NULL,
	"push_name" varchar(100),
	"participant" varchar(100),
	"message_type" varchar(100) NOT NULL,
	"message" jsonb NOT NULL,
	"context_info" jsonb,
	"source" "device_source" DEFAULT 'unknown' NOT NULL,
	"message_timestamp" integer NOT NULL,
	"instance_id" varchar(128) NOT NULL,
	"webhook_url" varchar(500),
	"status" varchar(30),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_status_updates" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"key_id" varchar(100) NOT NULL,
	"remote_jid" varchar(100) NOT NULL,
	"from_me" boolean NOT NULL,
	"participant" varchar(100),
	"status" varchar(30) NOT NULL,
	"message_id" varchar(128) NOT NULL,
	"instance_id" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"remote_jid" varchar(100) NOT NULL,
	"push_name" varchar(100),
	"profile_pic_url" varchar(500),
	"instance_id" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contacts_jid_instance_unique" UNIQUE("remote_jid","instance_id")
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"remote_jid" varchar(100) NOT NULL,
	"name" varchar(100),
	"labels" jsonb,
	"unread_messages" integer DEFAULT 0 NOT NULL,
	"instance_id" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chats_jid_instance_unique" UNIQUE("instance_id","remote_jid")
);
--> statement-breakpoint
CREATE TABLE "media_files" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"file_name" varchar(500) NOT NULL,
	"type" varchar(100) NOT NULL,
	"mimetype" varchar(100) NOT NULL,
	"message_id" varchar(128) NOT NULL,
	"instance_id" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_files_message_id_unique" UNIQUE("message_id")
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"template_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(50),
	"language" varchar(20),
	"template" jsonb NOT NULL,
	"webhook_url" varchar(500),
	"instance_id" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_configs" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"url" varchar(500) NOT NULL,
	"headers" jsonb,
	"enabled" boolean DEFAULT true NOT NULL,
	"events" jsonb,
	"webhook_by_events" boolean DEFAULT false NOT NULL,
	"webhook_base64" boolean DEFAULT false NOT NULL,
	"instance_id" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "webhook_configs_instance_id_unique" UNIQUE("instance_id")
);
--> statement-breakpoint
CREATE TABLE "instance_settings" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"read_messages" boolean DEFAULT false NOT NULL,
	"groups_ignore" boolean DEFAULT false NOT NULL,
	"instance_id" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "instance_settings_instance_id_unique" UNIQUE("instance_id")
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_instance_id_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_status_updates" ADD CONSTRAINT "message_status_updates_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_status_updates" ADD CONSTRAINT "message_status_updates_instance_id_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_instance_id_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_instance_id_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_instance_id_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_instance_id_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_configs" ADD CONSTRAINT "webhook_configs_instance_id_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instance_settings" ADD CONSTRAINT "instance_settings_instance_id_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "messages_instance_id_idx" ON "messages" USING btree ("instance_id");--> statement-breakpoint
CREATE INDEX "messages_timestamp_idx" ON "messages" USING btree ("message_timestamp");--> statement-breakpoint
CREATE INDEX "msg_status_instance_idx" ON "message_status_updates" USING btree ("instance_id");
CREATE TABLE "chat" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"agent" text NOT NULL,
	"messages" json DEFAULT '[]'::json NOT NULL,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization" DROP CONSTRAINT "organization_tax_id_unique";--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "plan";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "tax_id";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "country_code";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "currency";
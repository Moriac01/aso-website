import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_donations_status" AS ENUM('declared', 'received', 'not-found');
  CREATE TYPE "public"."enum_donations_project" AS ENUM('general', 'education', 'paemv', 'psychosocial');
  CREATE TYPE "public"."enum_donation_settings_methods_kind" AS ENUM('mobile-money', 'bank', 'other');
  CREATE TABLE "donations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar,
  	"status" "enum_donations_status" DEFAULT 'declared' NOT NULL,
  	"checked_by" varchar,
  	"checked_at" timestamp(3) with time zone,
  	"amount" numeric NOT NULL,
  	"method" varchar NOT NULL,
  	"transaction_ref" varchar NOT NULL,
  	"project" "enum_donations_project" DEFAULT 'general' NOT NULL,
  	"anonymous" boolean DEFAULT false,
  	"donor_name" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"message" varchar,
  	"consent" boolean DEFAULT false NOT NULL,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "donation_settings_methods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"kind" "enum_donation_settings_methods_kind" DEFAULT 'mobile-money' NOT NULL,
  	"account_name" varchar,
  	"account_number" varchar,
  	"instructions" varchar,
  	"active" boolean DEFAULT false
  );
  
  CREATE TABLE "donation_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "donations_id" integer;
  ALTER TABLE "donation_settings_methods" ADD CONSTRAINT "donation_settings_methods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donation_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "donations_reference_idx" ON "donations" USING btree ("reference");
  CREATE INDEX "donations_updated_at_idx" ON "donations" USING btree ("updated_at");
  CREATE INDEX "donations_created_at_idx" ON "donations" USING btree ("created_at");
  CREATE INDEX "donation_settings_methods_order_idx" ON "donation_settings_methods" USING btree ("_order");
  CREATE INDEX "donation_settings_methods_parent_id_idx" ON "donation_settings_methods" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_donations_fk" FOREIGN KEY ("donations_id") REFERENCES "public"."donations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_donations_id_idx" ON "payload_locked_documents_rels" USING btree ("donations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "donations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "donation_settings_methods" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "donation_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "donations" CASCADE;
  DROP TABLE "donation_settings_methods" CASCADE;
  DROP TABLE "donation_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_donations_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_donations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "donations_id";
  DROP TYPE "public"."enum_donations_status";
  DROP TYPE "public"."enum_donations_project";
  DROP TYPE "public"."enum_donation_settings_methods_kind";`)
}

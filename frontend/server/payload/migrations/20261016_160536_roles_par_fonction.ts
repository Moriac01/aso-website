import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'tech', 'communication', 'secretariat', 'tresorerie', 'controle', 'mobilisation', 'consultation');
  CREATE TYPE "public"."enum_audit_log_action" AS ENUM('create', 'update', 'delete');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "audit_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"action" "enum_audit_log_action" NOT NULL,
  	"target" varchar NOT NULL,
  	"document_id" varchar,
  	"label" varchar,
  	"changes" varchar,
  	"user_id" integer,
  	"user_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "financial_reports" ADD COLUMN "audit_approved" boolean DEFAULT false;
  ALTER TABLE "financial_reports" ADD COLUMN "audited_by" varchar;
  ALTER TABLE "financial_reports" ADD COLUMN "audited_at" timestamp(3) with time zone;
  ALTER TABLE "financial_reports" ADD COLUMN "audit_comment" varchar;
  ALTER TABLE "users" ADD COLUMN "function" varchar;
  ALTER TABLE "users" ADD COLUMN "active" boolean DEFAULT true;
  ALTER TABLE "users" ADD COLUMN "mandate_ends_at" timestamp(3) with time zone;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "audit_log_id" integer;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "audit_log_user_idx" ON "audit_log" USING btree ("user_id");
  CREATE INDEX "audit_log_updated_at_idx" ON "audit_log" USING btree ("updated_at");
  CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");
  -- Reprise des comptes existants : admin → Président (admin), éditeur → Communication.
  INSERT INTO "users_roles" ("order", "parent_id", "value")
    SELECT 1, "id", CASE WHEN "role"::text = 'admin' THEN 'admin'::"enum_users_roles" ELSE 'communication'::"enum_users_roles" END
    FROM "users";
  -- Nouveau circuit : un rapport ne peut rester publié sans le visa du Commissaire aux comptes.
  UPDATE "financial_reports" SET "published" = false WHERE "published" = true;
  ALTER TABLE "users" DROP COLUMN "role";
  DROP TYPE "public"."enum_users_role";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'editor' NOT NULL;
  UPDATE "users" SET "role" = 'admin' WHERE "id" IN (SELECT "parent_id" FROM "users_roles" WHERE "value" = 'admin');
  ALTER TABLE "users_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "audit_log" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "audit_log" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_audit_log_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_audit_log_id_idx";
  ALTER TABLE "financial_reports" DROP COLUMN "audit_approved";
  ALTER TABLE "financial_reports" DROP COLUMN "audited_by";
  ALTER TABLE "financial_reports" DROP COLUMN "audited_at";
  ALTER TABLE "financial_reports" DROP COLUMN "audit_comment";
  ALTER TABLE "users" DROP COLUMN "function";
  ALTER TABLE "users" DROP COLUMN "active";
  ALTER TABLE "users" DROP COLUMN "mandate_ends_at";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "audit_log_id";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_audit_log_action";`)
}

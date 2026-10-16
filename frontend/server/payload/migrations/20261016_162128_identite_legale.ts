import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "legal_legal_name" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "legal_registration_number" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "legal_registration_date" timestamp(3) with time zone;
  ALTER TABLE "site_settings" ADD COLUMN "legal_registration_authority" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "legal_head_office" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "legal_legal_name";
  ALTER TABLE "site_settings" DROP COLUMN "legal_registration_number";
  ALTER TABLE "site_settings" DROP COLUMN "legal_registration_date";
  ALTER TABLE "site_settings" DROP COLUMN "legal_registration_authority";
  ALTER TABLE "site_settings" DROP COLUMN "legal_head_office";`)
}

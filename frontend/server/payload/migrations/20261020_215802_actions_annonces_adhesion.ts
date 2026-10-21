import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_announcements_kind" AS ENUM('candidatures', 'adhesion', 'evenement', 'autre');
  CREATE TYPE "public"."enum_announcements_button_action" AS ENUM('details', 'link', 'none');
  CREATE TYPE "public"."enum_announcements_details_apply_method" AS ENUM('email', 'link', 'volunteerForm', 'none');
  CREATE TYPE "public"."enum_actions_page_fallback_choice" AS ENUM('news', 'method', 'join');
  CREATE TABLE "announcements_details_positions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "announcements_details_profile" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "announcements_details_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"visible" boolean DEFAULT true,
  	"kind" "enum_announcements_kind" DEFAULT 'autre' NOT NULL,
  	"slug" varchar,
  	"button_action" "enum_announcements_button_action" DEFAULT 'details' NOT NULL,
  	"button_url" varchar,
  	"button_label" varchar DEFAULT 'En savoir plus',
  	"button_label_before_start" varchar,
  	"banner_show" boolean DEFAULT false,
  	"banner_text" varchar,
  	"report_id" integer,
  	"details_intro" varchar,
  	"details_apply_method" "enum_announcements_details_apply_method" DEFAULT 'email' NOT NULL,
  	"details_apply_email" varchar,
  	"details_apply_subject_prefix" varchar DEFAULT 'Candidature',
  	"details_apply_url" varchar,
  	"details_apply_instructions" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "announcements_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "actions_page_programs_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "actions_page_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"visible" boolean DEFAULT true,
  	"text" varchar NOT NULL,
  	"image_id" integer,
  	"badge" varchar
  );
  
  CREATE TABLE "actions_page_fallback_method_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "actions_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar DEFAULT 'Ce que l’ASO fait, concrètement.',
  	"hero_intro" varchar DEFAULT 'Nous payons la scolarité des enfants pris en charge et suivons leurs progrès, nous remboursons la moitié de leurs frais de santé et nous rendons régulièrement visite à leurs familles.',
  	"programs_title" varchar DEFAULT 'Un accompagnement suivi, enfant par enfant.',
  	"announcements_section_title" varchar DEFAULT 'L’ASO s’agrandit.',
  	"announcements_section_intro" varchar DEFAULT 'Pour élargir notre champ de mission, nous ouvrons nos portes à de nouveaux bénévoles et à de nouveaux membres.',
  	"fallback_choice" "enum_actions_page_fallback_choice" DEFAULT 'news',
  	"fallback_news_title" varchar DEFAULT 'Nos dernières réalisations.',
  	"fallback_news_intro" varchar DEFAULT 'Ce que l’ASO a fait ces dernières semaines, raconté dans nos actualités.',
  	"fallback_method_title" varchar DEFAULT 'Comment nous accompagnons un enfant.',
  	"fallback_method_intro" varchar DEFAULT 'De la première rencontre au suivi de chaque année scolaire.',
  	"fallback_join_title" varchar DEFAULT 'Il y a toujours une place pour vous.',
  	"fallback_join_intro" varchar DEFAULT 'Même sans campagne en cours, on peut aider l’ASO à tout moment.',
  	"donation_title" varchar DEFAULT 'Chaque franc est justifié.',
  	"donation_text" varchar DEFAULT 'Chaque remboursement de santé se fait sur facture de l’hôpital. Chaque dépense est enregistrée par notre Trésorière et figure dans nos rapports financiers, visés par notre Commissaire aux comptes.',
  	"call_to_action_title" varchar DEFAULT 'Chaque contribution ouvre une vraie opportunité.',
  	"call_to_action_text" varchar DEFAULT 'Donner, devenir bénévole ou adhérer : chaque forme d’engagement compte pour les enfants.',
  	"seo_title" varchar DEFAULT 'Nos actions — ASO',
  	"seo_description" varchar DEFAULT 'Scolarité, santé, soutien psychosocial et suivi des familles : ce que l’Association Soutien aux Orphelins fait concrètement pour les enfants de Bimbo et Bangui.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "membership" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_url" varchar,
  	"opening_date" timestamp(3) with time zone DEFAULT '2026-11-30T12:00:00.000Z',
  	"closing_date" timestamp(3) with time zone,
  	"title" varchar DEFAULT 'Devenir membre de l’ASO',
  	"intro" varchar DEFAULT 'Membre actif, vous participez aux activités et aux décisions de l’association. Membre bienfaiteur, vous la soutenez par un don libre, à titre personnel ou au nom d’une organisation.',
  	"notify_message" varchar DEFAULT 'Bonjour, je souhaite être prévenu(e) de l’ouverture des adhésions à l’ASO.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "announcements_id" integer;
  ALTER TABLE "announcements_details_positions" ADD CONSTRAINT "announcements_details_positions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_details_profile" ADD CONSTRAINT "announcements_details_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_details_benefits" ADD CONSTRAINT "announcements_details_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_report_id_news_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "actions_page_programs_points" ADD CONSTRAINT "actions_page_programs_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."actions_page_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "actions_page_programs" ADD CONSTRAINT "actions_page_programs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "actions_page_programs" ADD CONSTRAINT "actions_page_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."actions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "actions_page_fallback_method_steps" ADD CONSTRAINT "actions_page_fallback_method_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."actions_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "announcements_details_positions_order_idx" ON "announcements_details_positions" USING btree ("_order");
  CREATE INDEX "announcements_details_positions_parent_id_idx" ON "announcements_details_positions" USING btree ("_parent_id");
  CREATE INDEX "announcements_details_profile_order_idx" ON "announcements_details_profile" USING btree ("_order");
  CREATE INDEX "announcements_details_profile_parent_id_idx" ON "announcements_details_profile" USING btree ("_parent_id");
  CREATE INDEX "announcements_details_benefits_order_idx" ON "announcements_details_benefits" USING btree ("_order");
  CREATE INDEX "announcements_details_benefits_parent_id_idx" ON "announcements_details_benefits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "announcements_slug_idx" ON "announcements" USING btree ("slug");
  CREATE INDEX "announcements_report_idx" ON "announcements" USING btree ("report_id");
  CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");
  CREATE INDEX "announcements_rels_order_idx" ON "announcements_rels" USING btree ("order");
  CREATE INDEX "announcements_rels_parent_idx" ON "announcements_rels" USING btree ("parent_id");
  CREATE INDEX "announcements_rels_path_idx" ON "announcements_rels" USING btree ("path");
  CREATE INDEX "announcements_rels_media_id_idx" ON "announcements_rels" USING btree ("media_id");
  CREATE INDEX "actions_page_programs_points_order_idx" ON "actions_page_programs_points" USING btree ("_order");
  CREATE INDEX "actions_page_programs_points_parent_id_idx" ON "actions_page_programs_points" USING btree ("_parent_id");
  CREATE INDEX "actions_page_programs_order_idx" ON "actions_page_programs" USING btree ("_order");
  CREATE INDEX "actions_page_programs_parent_id_idx" ON "actions_page_programs" USING btree ("_parent_id");
  CREATE INDEX "actions_page_programs_image_idx" ON "actions_page_programs" USING btree ("image_id");
  CREATE INDEX "actions_page_fallback_method_steps_order_idx" ON "actions_page_fallback_method_steps" USING btree ("_order");
  CREATE INDEX "actions_page_fallback_method_steps_parent_id_idx" ON "actions_page_fallback_method_steps" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "announcements_details_positions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "announcements_details_profile" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "announcements_details_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "announcements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "announcements_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "actions_page_programs_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "actions_page_programs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "actions_page_fallback_method_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "actions_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "membership" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "announcements_details_positions" CASCADE;
  DROP TABLE "announcements_details_profile" CASCADE;
  DROP TABLE "announcements_details_benefits" CASCADE;
  DROP TABLE "announcements" CASCADE;
  DROP TABLE "announcements_rels" CASCADE;
  DROP TABLE "actions_page_programs_points" CASCADE;
  DROP TABLE "actions_page_programs" CASCADE;
  DROP TABLE "actions_page_fallback_method_steps" CASCADE;
  DROP TABLE "actions_page" CASCADE;
  DROP TABLE "membership" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_announcements_fk";
  
  DROP INDEX "payload_locked_documents_rels_announcements_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "announcements_id";
  DROP TYPE "public"."enum_announcements_kind";
  DROP TYPE "public"."enum_announcements_button_action";
  DROP TYPE "public"."enum_announcements_details_apply_method";
  DROP TYPE "public"."enum_actions_page_fallback_choice";`)
}

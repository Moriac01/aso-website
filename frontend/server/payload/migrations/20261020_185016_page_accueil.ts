import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"image_id" integer,
  	"badge" varchar
  );
  
  CREATE TABLE "home_page_approach_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar DEFAULT 'Offrir espoir et avenir aux orphelins de Bimbo.',
  	"hero_subtitle" varchar DEFAULT 'Avec votre soutien, l’ASO accompagne des enfants orphelins dans leur scolarité, leur santé et leur épanouissement.',
  	"hero_image_id" integer,
  	"hero_caption" varchar DEFAULT 'Donnez le sourire pour un avenir meilleur.',
  	"story" varchar DEFAULT 'Une équipe de jeunes professionnels, présidée par Emmanuel MADOUKOU, agit pour que chaque enfant orphelin puisse étudier, grandir et se reconstruire.',
  	"pillars_title" varchar DEFAULT 'Trois engagements pour l’avenir des enfants et de leurs familles.',
  	"approach_title" varchar DEFAULT 'De l’aide d’urgence à l’accompagnement durable.',
  	"approach_text" varchar DEFAULT 'Nous ne voulons pas seulement répondre aux besoins du jour. Nous construisons des solutions qui durent : l’école, les soins et un suivi régulier des enfants et de leurs familles.',
  	"call_to_action_title" varchar DEFAULT 'Donnez un avenir à ceux qui en ont besoin.',
  	"call_to_action_text" varchar DEFAULT 'Votre don finance la scolarité, les soins et l’accompagnement des enfants. Chaque don est vérifié par notre Trésorerie et figure dans nos rapports financiers.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "home_page_pillars" ADD CONSTRAINT "home_page_pillars_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_pillars" ADD CONSTRAINT "home_page_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_approach_cards" ADD CONSTRAINT "home_page_approach_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_pillars_order_idx" ON "home_page_pillars" USING btree ("_order");
  CREATE INDEX "home_page_pillars_parent_id_idx" ON "home_page_pillars" USING btree ("_parent_id");
  CREATE INDEX "home_page_pillars_image_idx" ON "home_page_pillars" USING btree ("image_id");
  CREATE INDEX "home_page_approach_cards_order_idx" ON "home_page_approach_cards" USING btree ("_order");
  CREATE INDEX "home_page_approach_cards_parent_id_idx" ON "home_page_approach_cards" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_hero_image_idx" ON "home_page" USING btree ("hero_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_pillars" CASCADE;
  DROP TABLE "home_page_approach_cards" CASCADE;
  DROP TABLE "home_page" CASCADE;`)
}

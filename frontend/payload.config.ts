import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { fr } from "@payloadcms/translations/languages/fr";
import { buildConfig } from "payload";
import sharp from "sharp";

import { migrations } from "./server/payload/migrations";
import { Applications } from "./server/payload/collections/Applications";
import { ContactMessages } from "./server/payload/collections/ContactMessages";
import { FinancialReports } from "./server/payload/collections/FinancialReports";
import { Media } from "./server/payload/collections/Media";
import { News } from "./server/payload/collections/News";
import { TeamMembers } from "./server/payload/collections/TeamMembers";
import { Users } from "./server/payload/collections/Users";
import { KeyFigures } from "./server/payload/globals/KeyFigures";
import { SiteSettings } from "./server/payload/globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  secret: process.env.PAYLOAD_SECRET || "",

  admin: {
    user: Users.slug,
    meta: { titleSuffix: " · ASO Back-office" },
    importMap: {
      baseDir: dirname,
      importMapFile: path.resolve(dirname, "app/(payload)/admin/importMap.js"),
    },
  },

  i18n: {
    supportedLanguages: { fr },
    fallbackLanguage: "fr",
  },

  collections: [
    // Contenu
    News,
    TeamMembers,
    Media,
    // Transparence
    FinancialReports,
    // Demandes reçues
    ContactMessages,
    Applications,
    // Administration
    Users,
  ],
  globals: [KeyFigures, SiteSettings],

  editor: lexicalEditor(),
  sharp,

  // L'API REST suffit ; GraphQL désactivé pour réduire la surface d'attaque.
  graphQL: { disable: true },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
      // Échouer vite plutôt que bloquer (build ou page) si la base ne répond pas.
      connectionTimeoutMillis: 10_000,
    },
    // Pas de modification « à la volée » du schéma en développement :
    // la structure de la base évolue uniquement par migrations versionnées
    // (identique chez chaque développeur et en production).
    push: false,
    migrationDir: path.resolve(dirname, "server/payload/migrations"),
    // En production, les migrations en attente sont appliquées au démarrage.
    prodMigrations: migrations,
  }),

  typescript: {
    outputFile: path.resolve(dirname, "server/payload/payload-types.ts"),
  },
});

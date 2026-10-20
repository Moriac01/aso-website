import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { fr } from "@payloadcms/translations/languages/fr";
import { buildConfig } from "payload";
import sharp from "sharp";

import { migrations } from "./server/payload/migrations";
import { Applications } from "./server/payload/collections/Applications";
import { Donations } from "./server/payload/collections/Donations";
import { AuditLog } from "./server/payload/collections/AuditLog";
import { ContactMessages } from "./server/payload/collections/ContactMessages";
import { FinancialReports } from "./server/payload/collections/FinancialReports";
import { Media } from "./server/payload/collections/Media";
import { News } from "./server/payload/collections/News";
import { TeamMembers } from "./server/payload/collections/TeamMembers";
import { Users } from "./server/payload/collections/Users";
import { DonationSettings } from "./server/payload/globals/DonationSettings";
import { HomePage } from "./server/payload/globals/HomePage";
import { KeyFigures } from "./server/payload/globals/KeyFigures";
import { SiteSettings } from "./server/payload/globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Envoi des emails par SMTP (par défaut : le compte Gmail de l'ASO).
 * Sans SMTP_USER / SMTP_PASS, aucun email n'est envoyé : Payload les affiche
 * seulement dans la console (pratique en développement).
 * Pour passer plus tard à un autre service (Resend, Brevo…), il suffit de
 * changer les variables SMTP_* et EMAIL_FROM, sans toucher au code.
 */
const smtpPort = Number(process.env.SMTP_PORT || 465);
const email =
  process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM || process.env.SMTP_USER,
        defaultFromName: process.env.EMAIL_FROM_NAME || "ASO — Soutien aux Orphelins",
        // Pas de connexion au serveur d'email au démarrage ni pendant le build :
        // une erreur éventuelle est journalisée au moment de l'envoi.
        skipVerify: true,
        transportOptions: {
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined;

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  secret: process.env.PAYLOAD_SECRET || "",

  admin: {
    user: Users.slug,
    meta: { titleSuffix: " · ASO Back-office" },
    importMap: {
      baseDir: dirname,
      importMapFile: path.resolve(dirname, "app/(payload)/admin/importMap.js"),
      // Fichier généré : uniquement via `bun run generate:importmap`, jamais pendant `bun dev`
      // (sinon chaque développeur voit des modifications parasites dans Git).
      autoGenerate: false,
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
    Donations,
    // Demandes reçues
    ContactMessages,
    Applications,
    // Administration
    Users,
    AuditLog,
  ],
  globals: [HomePage, KeyFigures, SiteSettings, DonationSettings],

  plugins: [
    /**
     * Fichiers (images, PDF) sur Vercel Blob en production : le disque de Vercel
     * n'est pas permanent. Sans BLOB_READ_WRITE_TOKEN (en local), les fichiers
     * restent dans frontend/uploads/ comme avant.
     */
    vercelBlobStorage({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Même structure de base partout, que le stockage soit actif ou non.
      alwaysInsertFields: true,
      // Envoi direct du navigateur vers Blob : pas de limite de 4,5 Mo par fichier.
      clientUploads: true,
      collections: {
        // Images publiques : servies directement par le CDN de Vercel (rapide, gratuit).
        media: { prefix: "media", disablePayloadAccessControl: true },
        // Rapports financiers : toujours servis via le back-office, qui vérifie qu'ils
        // sont publiés et visés. Chaque envoi depuis le back-office est rangé dans un
        // dossier au nom aléatoire : l'adresse brute du fichier est impossible à deviner.
        "financial-reports": { prefix: "rapports" },
      },
    }),
  ],

  editor: lexicalEditor(),
  sharp,
  email,

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
    // Types générés uniquement via `bun run generate:types` (pas à chaque `bun dev`).
    autoGenerate: false,
  },
});

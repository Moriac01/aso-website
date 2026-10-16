import path from "node:path";
import { fileURLToPath } from "node:url";

import type { CollectionConfig } from "payload";

import { CONTENT_EDITORS, READERS, allow, anyone, hiddenUnless } from "../access";
import { auditAfterChange, auditAfterDelete } from "../hooks/audit";
import { CACHE_TAGS } from "@/server/content/tags";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Image", plural: "Images" },
  admin: {
    group: "Contenu",
    hidden: hiddenUnless(...CONTENT_EDITORS, ...READERS),
    description:
      "Protection de l'enfance : pas de nom complet ni d'information permettant d'identifier un enfant. Photos d'enfants uniquement avec le consentement du tuteur.",
  },
  access: {
    read: anyone,
    create: allow(...CONTENT_EDITORS),
    update: allow(...CONTENT_EDITORS),
    delete: allow(...CONTENT_EDITORS),
  },
  upload: {
    // Stockage local en développement. En production : stockage objet (voir README).
    staticDir: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../uploads/media"),
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 800, height: 520, position: "centre" },
      { name: "hero", width: 1600, height: undefined, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    focalPoint: true,
  },
  hooks: {
    // Une image remplacée doit apparaître partout où elle est utilisée.
    afterChange: [revalidateAfterChange(CACHE_TAGS.news, CACHE_TAGS.team), auditAfterChange("Image", (doc) => doc.alt)],
    afterDelete: [revalidateAfterDelete(CACHE_TAGS.news, CACHE_TAGS.team), auditAfterDelete("Image", (doc) => doc.alt)],
  },
  fields: [
    {
      name: "alt",
      label: "Texte alternatif",
      type: "text",
      required: true,
      admin: {
        description:
          "Décrivez l'image en une phrase (accessibilité et référencement). Ex. : « Atelier de soutien scolaire à Bimbo ».",
      },
    },
    {
      name: "consent",
      label: "Consentement obtenu pour les personnes identifiables",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};

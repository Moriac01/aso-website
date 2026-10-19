import type { CollectionConfig, FieldHook } from "payload";

import { isStaff, publishedOrStaff } from "../access";
import { CACHE_TAGS } from "@/server/content/tags";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const fillSlug: FieldHook = ({ value, data }) => {
  if (typeof value === "string" && value.trim()) return slugify(value);
  if (typeof data?.title === "string") return slugify(data.title);
  return value;
};

export const newsCategories = [
  { label: "Éducation", value: "education" },
  { label: "Autonomisation économique", value: "autonomisation" },
  { label: "Soutien psychosocial", value: "psychosocial" },
  { label: "Santé", value: "sante" },
  { label: "Communauté", value: "communaute" },
  { label: "Projets", value: "projets" },
  { label: "Transparence", value: "transparence" },
];

export const News: CollectionConfig = {
  slug: "news",
  labels: { singular: "Actualité", plural: "Actualités" },
  admin: {
    group: "Contenu",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "featured", "_status"],
  },
  versions: {
    drafts: true, // Brouillon / Publié géré par Payload
    maxPerDoc: 20,
  },
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  defaultSort: "-publishedAt",
  hooks: {
    afterChange: [revalidateAfterChange(CACHE_TAGS.news)],
    afterDelete: [revalidateAfterDelete(CACHE_TAGS.news)],
  },
  fields: [
    { name: "title", label: "Titre", type: "text", required: true, maxLength: 140 },
    {
      name: "slug",
      label: "Adresse (slug)",
      type: "text",
      unique: true,
      index: true,
      hooks: { beforeValidate: [fillSlug] },
      admin: {
        position: "sidebar",
        description: "Généré depuis le titre si laissé vide. Ex. : soutien-scolaire-2026",
      },
    },
    {
      name: "excerpt",
      label: "Résumé",
      type: "textarea",
      required: true,
      maxLength: 300,
      admin: { description: "Affiché sur les cartes et pour le partage (300 caractères max)." },
    },
    { name: "content", label: "Contenu", type: "richText", required: true },
    { name: "image", label: "Image principale", type: "upload", relationTo: "media", required: true },
    {
      name: "category",
      label: "Catégorie",
      type: "select",
      required: true,
      options: newsCategories,
      admin: { position: "sidebar" },
    },
    {
      name: "publishedAt",
      label: "Date de publication",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly", displayFormat: "dd/MM/yyyy" } },
    },
    {
      name: "featured",
      label: "Mettre en avant sur l'accueil",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
  ],
};

import path from "node:path";
import { fileURLToPath } from "node:url";

import type { CollectionConfig } from "payload";

import { flaggedPublishedOrStaff, isStaff } from "../access";

/** Rapports financiers (PDF) publiés sur la page Transparence. */
export const FinancialReports: CollectionConfig = {
  slug: "financial-reports",
  labels: { singular: "Rapport financier", plural: "Rapports financiers" },
  admin: {
    group: "Transparence",
    useAsTitle: "title",
    defaultColumns: ["title", "year", "period", "published"],
  },
  access: {
    read: flaggedPublishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  upload: {
    // Stockage local en développement. En production : stockage objet (voir README).
    staticDir: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../uploads/reports"),
    mimeTypes: ["application/pdf"],
  },
  defaultSort: "-year",
  fields: [
    { name: "title", label: "Titre", type: "text", required: true },
    { name: "year", label: "Année", type: "number", required: true, min: 2000, max: 2100 },
    {
      name: "period",
      label: "Période",
      type: "text",
      admin: { description: "Ex. : « Annuel », « 1er semestre », « Projet PAEMV »." },
    },
    {
      name: "summary",
      label: "Résumé",
      type: "textarea",
      maxLength: 600,
      admin: { description: "Ce que le lecteur doit retenir en 2-3 phrases." },
    },
    {
      name: "published",
      label: "Publié sur le site",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
  ],
};

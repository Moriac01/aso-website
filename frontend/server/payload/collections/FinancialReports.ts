import path from "node:path";
import { fileURLToPath } from "node:url";

import { APIError, type CollectionConfig } from "payload";

import { allow, allowField, flaggedPublishedOrStaff, hasRole, hiddenUnless, userLabel } from "../access";
import { CACHE_TAGS } from "@/server/content/tags";
import { auditAfterChange, auditAfterDelete } from "../hooks/audit";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

/**
 * Rapports financiers (PDF) publiés sur la page Transparence.
 *
 * Circuit « quatre yeux » :
 *   1. la Trésorerie dépose ou met à jour le rapport ;
 *   2. le Commissaire aux comptes le vérifie et appose son visa ;
 *   3. le Président (admin) le publie — impossible sans visa.
 * Toute modification d'un rapport visé annule le visa et le dépublie.
 */

const PREPARERS = ["tresorerie", "admin"] as const;
const CONTENT_FIELDS = ["title", "year", "period", "summary", "filename", "filesize"] as const;

type Report = {
  auditApproved?: boolean | null;
  published?: boolean | null;
} & Partial<Record<(typeof CONTENT_FIELDS)[number], unknown>>;

export const FinancialReports: CollectionConfig = {
  slug: "financial-reports",
  labels: { singular: "Rapport financier", plural: "Rapports financiers" },
  admin: {
    group: "Transparence",
    useAsTitle: "title",
    defaultColumns: ["title", "year", "period", "auditApproved", "published"],
    description:
      "Circuit de validation : la Trésorerie dépose le rapport, le Commissaire aux comptes le vise, le Président le publie.",
    hidden: hiddenUnless("admin", "tech", "tresorerie", "controle", "consultation"),
  },
  access: {
    read: flaggedPublishedOrStaff,
    create: allow(...PREPARERS),
    update: allow(...PREPARERS, "controle"),
    delete: allow("admin"),
  },
  upload: {
    // Stockage local en développement. En production : stockage objet (voir docs/BACKEND.md).
    staticDir: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../uploads/reports"),
    mimeTypes: ["application/pdf"],
  },
  defaultSort: "-year",
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation, req }) => {
        const before = (originalDoc ?? {}) as Report;

        // Seule la Trésorerie (ou le Président) peut déposer ou remplacer le fichier.
        if (req.file && !hasRole(req.user, ...PREPARERS)) {
          throw new APIError("Seule la Trésorerie peut déposer ou remplacer un rapport.", 403, null, true);
        }

        // Rapport modifié après visa : le visa ne vaut plus, le rapport est dépublié.
        const contentChanged =
          operation === "update" &&
          (Boolean(req.file) ||
            CONTENT_FIELDS.some(
              (field) => field in data && JSON.stringify(data[field]) !== JSON.stringify(before[field]),
            ));
        if (contentChanged && before.auditApproved) {
          data.auditApproved = false;
          data.auditedBy = null;
          data.auditedAt = null;
          data.published = false;
        }

        // Visa : on enregistre qui l'a donné et quand.
        const approvedNow = data.auditApproved ?? before.auditApproved;
        if (approvedNow && !before.auditApproved) {
          data.auditedBy = userLabel(req);
          data.auditedAt = new Date().toISOString();
        }
        if (!approvedNow) {
          data.auditedBy = null;
          data.auditedAt = null;
        }

        // Pas de publication sans visa.
        const publishedNow = data.published ?? before.published;
        if (publishedNow && !approvedNow) {
          throw new APIError(
            "Ce rapport doit d’abord être visé par le Commissaire aux comptes avant d’être publié.",
            400,
            null,
            true,
          );
        }
        return data;
      },
    ],
    afterChange: [revalidateAfterChange(CACHE_TAGS.reports), auditAfterChange("Rapport financier")],
    afterDelete: [revalidateAfterDelete(CACHE_TAGS.reports), auditAfterDelete("Rapport financier")],
  },
  fields: [
    {
      name: "title",
      label: "Titre",
      type: "text",
      required: true,
      access: { update: allowField(...PREPARERS) },
    },
    {
      name: "year",
      label: "Année",
      type: "number",
      required: true,
      min: 2000,
      max: 2100,
      access: { update: allowField(...PREPARERS) },
    },
    {
      name: "period",
      label: "Période",
      type: "text",
      access: { update: allowField(...PREPARERS) },
      admin: { description: "Ex. : « Annuel », « 1er semestre », « Projet PAEMV »." },
    },
    {
      name: "summary",
      label: "Résumé",
      type: "textarea",
      maxLength: 600,
      access: { update: allowField(...PREPARERS) },
      admin: { description: "Ce que le lecteur doit retenir en 2-3 phrases." },
    },

    // Étape 2 : visa du Commissaire aux comptes
    {
      name: "auditApproved",
      label: "Visé par le Commissaire aux comptes",
      type: "checkbox",
      defaultValue: false,
      access: { create: () => false, update: allowField("controle") },
      admin: { position: "sidebar" },
    },
    {
      name: "auditedBy",
      label: "Visa donné par",
      type: "text",
      access: { create: () => false, update: () => false },
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "auditedAt",
      label: "Date du visa",
      type: "date",
      access: { create: () => false, update: () => false },
      admin: { position: "sidebar", readOnly: true, date: { displayFormat: "dd/MM/yyyy HH:mm" } },
    },
    {
      name: "auditComment",
      label: "Observations du Commissaire aux comptes",
      type: "textarea",
      access: {
        read: ({ req }) => Boolean(req.user),
        create: () => false,
        update: allowField("controle"),
      },
      admin: { position: "sidebar" },
    },

    // Étape 3 : publication par le Président
    {
      name: "published",
      label: "Publié sur le site",
      type: "checkbox",
      defaultValue: false,
      access: { create: () => false, update: allowField("admin") },
      admin: { position: "sidebar", description: "Possible uniquement après le visa." },
    },
  ],
};

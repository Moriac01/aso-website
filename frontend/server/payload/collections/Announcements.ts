import type { CollectionConfig, FieldHook, Where } from "payload";

import { periodState } from "@/lib/dates";
import { CACHE_TAGS } from "@/server/content/tags";

import { CONTENT_EDITORS, READERS, allow, hiddenUnless, rolesOf } from "../access";
import { auditAfterChange, auditAfterDelete } from "../hooks/audit";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const fillSlug: FieldHook = ({ value, data }) => {
  if (typeof value === "string" && value.trim()) return slugify(value);
  if (typeof data?.title === "string") return slugify(data.title);
  return value;
};

export const announcementKinds = [
  { label: "Appel à candidatures", value: "candidatures" },
  { label: "Adhésion", value: "adhesion" },
  { label: "Événement", value: "evenement" },
  { label: "Autre", value: "autre" },
] as const;

const STATE_LABELS = { upcoming: "À venir", current: "En cours", ended: "Terminée" } as const;

const dayField = { pickerAppearance: "dayOnly", displayFormat: "dd/MM/yyyy" } as const;

/**
 * Annonces de la page Actions (appels à candidatures, adhésions, événements).
 * Elles s'affichent toutes seules entre leurs dates de début et de fin.
 */
export const Announcements: CollectionConfig = {
  slug: "announcements",
  labels: { singular: "Annonce", plural: "Annonces" },
  admin: {
    group: "Contenu",
    useAsTitle: "title",
    defaultColumns: ["title", "startDate", "endDate", "state", "visible"],
    hidden: hiddenUnless(...CONTENT_EDITORS, ...READERS),
    description:
      "Annonces de la page Actions. Elles apparaissent et disparaissent toutes seules selon leurs dates. Sans annonce en cours ou à venir, la page affiche le contenu de secours choisi dans « Page Actions ».",
  },
  defaultSort: "-startDate",
  access: {
    // Public : seulement les annonces dont « Afficher sur le site » est coché. Équipe : tout.
    read: ({ req }) => (rolesOf(req.user).length > 0 ? true : ({ visible: { equals: true } } satisfies Where)),
    create: allow(...CONTENT_EDITORS),
    update: allow(...CONTENT_EDITORS),
    delete: allow(...CONTENT_EDITORS),
  },
  hooks: {
    afterChange: [revalidateAfterChange(CACHE_TAGS.announcements), auditAfterChange("Annonce")],
    afterDelete: [revalidateAfterDelete(CACHE_TAGS.announcements), auditAfterDelete("Annonce")],
  },
  fields: [
    { name: "title", label: "Titre", type: "text", required: true, maxLength: 90 },
    {
      name: "summary",
      label: "Texte de la carte",
      type: "textarea",
      required: true,
      maxLength: 220,
      admin: { description: "Deux phrases au plus, affichées sur la page Actions." },
    },
    {
      type: "row",
      fields: [
        {
          name: "startDate",
          label: "Début",
          type: "date",
          required: true,
          admin: { date: dayField, description: "Avant ce jour : « À partir du… »." },
        },
        {
          name: "endDate",
          label: "Fin (facultatif)",
          type: "date",
          admin: { date: dayField, description: "Après ce jour, l'annonce disparaît du site." },
          validate: (value: unknown, { siblingData }: { siblingData: { startDate?: string } }) => {
            if (value && siblingData?.startDate && new Date(value as string) < new Date(siblingData.startDate)) {
              return "La fin doit être après le début.";
            }
            return true;
          },
        },
      ],
    },
    {
      name: "state",
      label: "État",
      type: "text",
      virtual: true,
      admin: { readOnly: true, position: "sidebar", description: "Calculé à partir des dates." },
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            if (siblingData?.visible === false) return "Masquée";
            return STATE_LABELS[periodState(siblingData?.startDate, siblingData?.endDate)];
          },
        ],
      },
    },
    {
      name: "visible",
      label: "Afficher sur le site",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar", description: "Décochez pour préparer une annonce à l'avance." },
    },
    {
      name: "kind",
      label: "Type",
      type: "select",
      required: true,
      defaultValue: "autre",
      options: [...announcementKinds],
      admin: { position: "sidebar" },
    },
    {
      name: "slug",
      label: "Adresse de la page (slug)",
      type: "text",
      unique: true,
      index: true,
      hooks: { beforeValidate: [fillSlug] },
      admin: { position: "sidebar", description: "Rempli automatiquement à partir du titre." },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Bouton",
          fields: [
            {
              name: "button",
              type: "group",
              label: false,
              fields: [
                {
                  name: "action",
                  label: "Le bouton de la carte mène…",
                  type: "select",
                  required: true,
                  defaultValue: "details",
                  options: [
                    { label: "À la page détaillée de l'annonce (onglet « Page détaillée »)", value: "details" },
                    { label: "À un lien (page du site ou adresse externe)", value: "link" },
                    { label: "Pas de bouton", value: "none" },
                  ],
                },
                {
                  name: "url",
                  label: "Lien",
                  type: "text",
                  admin: {
                    condition: (_, sibling) => sibling?.action === "link",
                    description: "Ex. : /adherer, ou une adresse complète https://…",
                  },
                },
                {
                  type: "row",
                  admin: { condition: (_, sibling) => sibling?.action !== "none" },
                  fields: [
                    { name: "label", label: "Texte du bouton", type: "text", maxLength: 30, defaultValue: "En savoir plus" },
                    {
                      name: "labelBeforeStart",
                      label: "Texte avant le début (facultatif)",
                      type: "text",
                      maxLength: 30,
                      admin: { description: "Ex. : « Être prévenu »." },
                    },
                  ],
                },
              ],
            },
            {
              name: "banner",
              type: "group",
              label: "Bandeau sur l'accueil",
              fields: [
                {
                  name: "show",
                  label: "Afficher un bandeau en haut de l'accueil pendant l'annonce",
                  type: "checkbox",
                  defaultValue: false,
                },
                {
                  name: "text",
                  label: "Texte du bandeau",
                  type: "text",
                  maxLength: 120,
                  admin: { condition: (_, sibling) => Boolean(sibling?.show), description: "Laissé vide : le titre de l'annonce." },
                },
              ],
            },
            {
              name: "report",
              label: "Compte rendu (actualité liée)",
              type: "relationship",
              relationTo: "news",
              admin: {
                description:
                  "Une fois l'annonce terminée, sa carte reste un mois avec « Lire le compte rendu » vers cette actualité.",
              },
            },
          ],
        },
        {
          label: "Page détaillée",
          description: "Utilisée seulement si le bouton mène à la page détaillée de l'annonce.",
          fields: [
            {
              name: "details",
              type: "group",
              label: false,
              fields: [
                { name: "intro", label: "Introduction", type: "textarea", maxLength: 600 },
                {
                  name: "posters",
                  label: "Affiches / visuels",
                  type: "upload",
                  relationTo: "media",
                  hasMany: true,
                  maxRows: 6,
                },
                {
                  name: "positions",
                  label: "Postes",
                  type: "array",
                  maxRows: 10,
                  labels: { singular: "Poste", plural: "Postes" },
                  admin: { description: "Chaque poste a son propre bouton « Postuler »." },
                  fields: [
                    { name: "title", label: "Intitulé", type: "text", required: true, maxLength: 80 },
                    { name: "text", label: "Missions", type: "textarea", maxLength: 400 },
                  ],
                },
                {
                  name: "profile",
                  label: "Profil recherché",
                  type: "array",
                  maxRows: 10,
                  labels: { singular: "Point", plural: "Points" },
                  fields: [{ name: "text", label: "Texte", type: "text", required: true, maxLength: 140 }],
                },
                {
                  name: "benefits",
                  label: "Ce que vous gagnez",
                  type: "array",
                  maxRows: 10,
                  labels: { singular: "Point", plural: "Points" },
                  fields: [{ name: "text", label: "Texte", type: "text", required: true, maxLength: 140 }],
                },
                {
                  name: "apply",
                  type: "group",
                  label: "Comment répondre",
                  fields: [
                    {
                      name: "method",
                      label: "Les candidats répondent…",
                      type: "select",
                      required: true,
                      defaultValue: "email",
                      options: [
                        { label: "Par email (un bouton par poste, objet pré-rempli)", value: "email" },
                        { label: "Par un lien (Microsoft Forms, Google Forms…)", value: "link" },
                        { label: "Par le formulaire bénévole du site", value: "volunteerForm" },
                        { label: "Pas de réponse en ligne", value: "none" },
                      ],
                    },
                    {
                      name: "email",
                      label: "Adresse email",
                      type: "email",
                      admin: { condition: (_, sibling) => sibling?.method === "email", description: "Laissée vide : l'email public de l'ASO." },
                    },
                    {
                      name: "subjectPrefix",
                      label: "Début de l'objet",
                      type: "text",
                      defaultValue: "Candidature",
                      maxLength: 40,
                      admin: { condition: (_, sibling) => sibling?.method === "email", description: "L'objet devient « Candidature – Intitulé du poste »." },
                    },
                    {
                      name: "url",
                      label: "Lien du formulaire",
                      type: "text",
                      admin: { condition: (_, sibling) => sibling?.method === "link" },
                    },
                    {
                      name: "instructions",
                      label: "Consignes",
                      type: "textarea",
                      maxLength: 400,
                      admin: { description: "Ex. : « Joignez votre CV et votre lettre de motivation, en précisant le poste visé en objet. »" },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

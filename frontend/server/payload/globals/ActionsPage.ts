import type { GlobalConfig } from "payload";

import { CONTENT_EDITORS, READERS, allow, anyone, hiddenUnless } from "../access";
import { auditGlobal } from "../hooks/audit";
import { CACHE_TAGS } from "@/server/content/tags";
import { ACTIONS_DEFAULTS, FALLBACK_CHOICES } from "@/server/content/actions-defaults";
import { revalidateGlobal } from "../hooks/revalidate";

const d = ACTIONS_DEFAULTS;

/** Textes de la page Actions. Les annonces et les chiffres clés ont leur propre rubrique. */
export const ActionsPage: GlobalConfig = {
  slug: "actions-page",
  label: "Page Actions",
  admin: {
    group: "Contenu",
    hidden: hiddenUnless(...CONTENT_EDITORS, ...READERS),
    description:
      "Textes de la page Actions. Tout champ vidé reprend le texte d'origine. Les annonces se gèrent dans « Annonces », les chiffres dans « Chiffres clés ».",
  },
  access: {
    read: anyone,
    update: allow(...CONTENT_EDITORS),
  },
  hooks: {
    afterChange: [revalidateGlobal(CACHE_TAGS.actions), auditGlobal("Page Actions")],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Haut de page",
          fields: [
            {
              name: "hero",
              type: "group",
              label: false,
              fields: [
                { name: "title", label: "Grand titre", type: "text", maxLength: 90, defaultValue: d.hero.title },
                { name: "intro", label: "Introduction", type: "textarea", maxLength: 400, defaultValue: d.hero.intro },
              ],
            },
          ],
        },
        {
          label: "Programmes",
          fields: [
            { name: "programsTitle", label: "Titre de la section", type: "text", maxLength: 120, defaultValue: d.programsTitle },
            {
              name: "programs",
              label: "Programmes",
              type: "array",
              maxRows: 6,
              labels: { singular: "Programme", plural: "Programmes" },
              admin: {
                description:
                  "Sans photo choisie, un programme garde la photo actuelle du site à la même position. Décochez « Afficher » pour préparer un programme à l'avance (ex. : PAEMV).",
              },
              defaultValue: d.programs.map(({ title, text, points }) => ({
                title,
                text,
                points: points.map((point) => ({ text: point })),
                visible: true,
              })),
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "title", label: "Titre", type: "text", required: true, maxLength: 60 },
                    { name: "visible", label: "Afficher sur le site", type: "checkbox", defaultValue: true },
                  ],
                },
                { name: "text", label: "Texte", type: "textarea", required: true, maxLength: 300 },
                { name: "image", label: "Photo", type: "upload", relationTo: "media" },
                {
                  name: "points",
                  label: "Points clés",
                  type: "array",
                  maxRows: 6,
                  labels: { singular: "Point", plural: "Points" },
                  fields: [{ name: "text", label: "Texte", type: "text", required: true, maxLength: 100 }],
                },
                {
                  name: "badge",
                  label: "Mention (facultatif)",
                  type: "text",
                  maxLength: 40,
                  admin: { description: "Ex. : « Lancement en décembre 2026 »." },
                },
              ],
            },
          ],
        },
        {
          label: "Annonces",
          description:
            "Les annonces elles-mêmes se créent dans Contenu → Annonces. Ici : le titre de la section, et ce qui la remplace quand il n'y a aucune annonce en cours ou à venir.",
          fields: [
            {
              name: "announcementsSection",
              type: "group",
              label: "Section des annonces",
              fields: [
                { name: "title", label: "Titre", type: "text", maxLength: 90, defaultValue: d.announcements.title },
                { name: "intro", label: "Introduction", type: "textarea", maxLength: 300, defaultValue: d.announcements.intro },
              ],
            },
            {
              name: "fallback",
              type: "group",
              label: "Quand il n'y a aucune annonce",
              fields: [
                {
                  name: "choice",
                  label: "Afficher à la place",
                  type: "radio",
                  defaultValue: d.fallback.choice,
                  options: [...FALLBACK_CHOICES],
                },
                {
                  type: "row",
                  fields: [
                    { name: "newsTitle", label: "Titre « réalisations »", type: "text", maxLength: 90, defaultValue: d.fallback.news.title },
                    { name: "newsIntro", label: "Introduction", type: "text", maxLength: 200, defaultValue: d.fallback.news.intro },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "methodTitle", label: "Titre « comment nous accompagnons »", type: "text", maxLength: 90, defaultValue: d.fallback.method.title },
                    { name: "methodIntro", label: "Introduction", type: "text", maxLength: 200, defaultValue: d.fallback.method.intro },
                  ],
                },
                {
                  name: "methodSteps",
                  label: "Étapes de l'accompagnement",
                  type: "array",
                  maxRows: 6,
                  labels: { singular: "Étape", plural: "Étapes" },
                  defaultValue: d.fallback.method.steps,
                  fields: [
                    { name: "title", label: "Titre", type: "text", required: true, maxLength: 60 },
                    { name: "text", label: "Texte", type: "textarea", required: true, maxLength: 200 },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "joinTitle", label: "Titre « toujours une place »", type: "text", maxLength: 90, defaultValue: d.fallback.join.title },
                    { name: "joinIntro", label: "Introduction", type: "text", maxLength: 200, defaultValue: d.fallback.join.intro },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Don et appel final",
          fields: [
            {
              name: "donation",
              type: "group",
              label: "« Où va votre don »",
              fields: [
                { name: "title", label: "Titre", type: "text", maxLength: 90, defaultValue: d.donation.title },
                { name: "text", label: "Texte", type: "textarea", maxLength: 400, defaultValue: d.donation.text },
              ],
            },
            {
              name: "callToAction",
              type: "group",
              label: "Appel final",
              fields: [
                { name: "title", label: "Titre", type: "text", maxLength: 90, defaultValue: d.callToAction.title },
                { name: "text", label: "Texte", type: "textarea", maxLength: 300, defaultValue: d.callToAction.text },
              ],
            },
          ],
        },
        {
          label: "Google et partages",
          fields: [
            {
              name: "seo",
              type: "group",
              label: false,
              fields: [
                { name: "title", label: "Titre (onglet du navigateur, Google)", type: "text", maxLength: 70, defaultValue: d.seo.title },
                {
                  name: "description",
                  label: "Description (Google, aperçus WhatsApp et Facebook)",
                  type: "textarea",
                  maxLength: 200,
                  defaultValue: d.seo.description,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

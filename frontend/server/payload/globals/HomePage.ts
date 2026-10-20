import type { GlobalConfig } from "payload";

import { CONTENT_EDITORS, READERS, allow, anyone, hiddenUnless } from "../access";
import { auditGlobal } from "../hooks/audit";
import { CACHE_TAGS } from "@/server/content/tags";
import { HOME_DEFAULTS } from "@/server/content/home-defaults";
import { revalidateGlobal } from "../hooks/revalidate";

const EMPTY_KEEPS_DEFAULT = "Laissé vide : le texte actuel du site s'affiche.";

/** Textes de la page d'accueil. Les chiffres clés, actualités et rapports ont leur propre rubrique. */
export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Page d'accueil",
  admin: {
    group: "Contenu",
    hidden: hiddenUnless(...CONTENT_EDITORS, ...READERS),
    description:
      "Textes de la page d'accueil. Chiffres clés, actualités et rapports financiers se gèrent dans leurs rubriques.",
  },
  access: {
    read: anyone,
    update: allow(...CONTENT_EDITORS),
  },
  hooks: {
    afterChange: [revalidateGlobal(CACHE_TAGS.home), auditGlobal("Page d'accueil")],
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
                { name: "title", label: "Grand titre", type: "text", maxLength: 90, defaultValue: HOME_DEFAULTS.hero.title },
                {
                  name: "subtitle",
                  label: "Phrase d'introduction",
                  type: "textarea",
                  maxLength: 260,
                  defaultValue: HOME_DEFAULTS.hero.subtitle,
                },
                {
                  name: "image",
                  label: "Photo",
                  type: "upload",
                  relationTo: "media",
                  admin: { description: "Sans photo choisie : la photo actuelle du site est conservée." },
                },
                { name: "caption", label: "Légende de la photo", type: "text", maxLength: 90, defaultValue: HOME_DEFAULTS.hero.caption },
              ],
            },
            {
              name: "story",
              label: "« Notre histoire »",
              type: "textarea",
              maxLength: 300,
              defaultValue: HOME_DEFAULTS.story,
              admin: { description: EMPTY_KEEPS_DEFAULT },
            },
          ],
        },
        {
          label: "Nos actions",
          fields: [
            {
              name: "pillarsTitle",
              label: "Titre de la section",
              type: "text",
              maxLength: 120,
              defaultValue: HOME_DEFAULTS.pillarsTitle,
            },
            {
              name: "pillars",
              label: "Piliers d'action",
              type: "array",
              maxRows: 4,
              labels: { singular: "Pilier", plural: "Piliers" },
              admin: {
                description:
                  "De 1 à 4 cartes. Sans photo choisie, la carte garde la photo actuelle du site à la même position (1re, 2e, 3e), ou une illustration.",
              },
              defaultValue: HOME_DEFAULTS.pillars.map(({ title, text }) => ({ title, text })),
              fields: [
                { name: "title", label: "Titre", type: "text", required: true, maxLength: 60 },
                { name: "text", label: "Texte", type: "textarea", required: true, maxLength: 260 },
                { name: "image", label: "Photo", type: "upload", relationTo: "media" },
                {
                  name: "badge",
                  label: "Mention (facultatif)",
                  type: "text",
                  maxLength: 40,
                  admin: { description: "Petite étiquette sur la carte. Ex. : « Lancement en décembre 2026 »." },
                },
              ],
            },
          ],
        },
        {
          label: "Notre approche",
          fields: [
            {
              name: "approach",
              type: "group",
              label: false,
              fields: [
                { name: "title", label: "Titre", type: "text", maxLength: 90, defaultValue: HOME_DEFAULTS.approach.title },
                { name: "text", label: "Texte", type: "textarea", maxLength: 400, defaultValue: HOME_DEFAULTS.approach.text },
                {
                  name: "cards",
                  label: "Encadrés",
                  type: "array",
                  maxRows: 2,
                  labels: { singular: "Encadré", plural: "Encadrés" },
                  defaultValue: HOME_DEFAULTS.approach.cards,
                  fields: [
                    { name: "label", label: "Petit titre", type: "text", required: true, maxLength: 40 },
                    { name: "text", label: "Texte", type: "textarea", required: true, maxLength: 160 },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Appel au don",
          fields: [
            {
              name: "callToAction",
              type: "group",
              label: false,
              fields: [
                { name: "title", label: "Titre", type: "text", maxLength: 90, defaultValue: HOME_DEFAULTS.callToAction.title },
                { name: "text", label: "Texte", type: "textarea", maxLength: 300, defaultValue: HOME_DEFAULTS.callToAction.text },
              ],
            },
          ],
        },
      ],
    },
  ],
};

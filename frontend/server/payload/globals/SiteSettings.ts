import type { GlobalConfig } from "payload";

import { ADMINS, allow, anyone, hiddenUnless } from "../access";
import { CACHE_TAGS } from "@/server/content/tags";
import { auditGlobal } from "../hooks/audit";
import { revalidateGlobal } from "../hooks/revalidate";

/** Coordonnées et liens officiels, réutilisés partout (en-tête, pied de page, contact). */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Coordonnées & réseaux",
  admin: { group: "Administration", hidden: hiddenUnless(...ADMINS, "controle") },
  access: {
    read: anyone,
    update: allow(...ADMINS),
  },
  hooks: {
    afterChange: [revalidateGlobal(CACHE_TAGS.settings), auditGlobal("Coordonnées & réseaux")],
  },
  fields: [
    {
      name: "notificationEmail",
      label: "Email qui reçoit les notifications de formulaires",
      type: "email",
      access: {
        // Jamais exposé publiquement.
        read: ({ req }) => Boolean(req.user),
      },
    },
    {
      name: "publicEmail",
      label: "Email public",
      type: "email",
      admin: { description: "Affiché sur la page Contact, dans le pied de page et les pages légales." },
    },
    {
      name: "phone",
      label: "Téléphone",
      type: "text",
      admin: { description: "Format international conseillé, pour les appels de l’étranger : +236 70 00 00 00" },
    },
    {
      name: "address",
      label: "Adresse",
      type: "textarea",
      admin: { description: "Adresse du siège, telle qu’on la donne à un visiteur. Vide : le siège social de l’identité légale est affiché." },
    },
    {
      name: "legal",
      label: "Identité légale",
      type: "group",
      admin: { description: "Affichée sur les pages Transparence, Mentions légales et Confidentialité." },
      fields: [
        { name: "legalName", label: "Nom officiel", type: "text" },
        { name: "registrationNumber", label: "Numéro d’agrément", type: "text" },
        { name: "registrationDate", label: "Date de l’agrément", type: "date", admin: { date: { pickerAppearance: "dayOnly", displayFormat: "dd/MM/yyyy" } } },
        { name: "registrationAuthority", label: "Autorité qui a délivré l’agrément", type: "text" },
        { name: "headOffice", label: "Siège social", type: "text" },
        {
          name: "publicationDirector",
          label: "Directeur de la publication",
          type: "text",
          admin: { description: "Nom et fonction, affichés dans les mentions légales. Ex. : Prénom NOM, Chargé de communication." },
        },
      ],
    },
    {
      name: "socials",
      label: "Réseaux sociaux",
      type: "group",
      admin: {
        description:
          "Adresse complète de chaque page (https://…). Pour WhatsApp, le numéro suffit. Un réseau laissé vide n’est pas affiché sur le site.",
      },
      fields: [
        { name: "facebook", label: "Facebook", type: "text" },
        { name: "instagram", label: "Instagram", type: "text" },
        { name: "linkedin", label: "LinkedIn", type: "text" },
        { name: "whatsapp", label: "WhatsApp", type: "text" },
      ],
    },
  ],
};

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
    { name: "publicEmail", label: "Email public", type: "email" },
    { name: "phone", label: "Téléphone", type: "text" },
    { name: "address", label: "Adresse", type: "textarea" },
    {
      name: "legal",
      label: "Identité légale",
      type: "group",
      admin: { description: "Affichée sur la page Transparence et dans le pied de page." },
      fields: [
        { name: "legalName", label: "Nom officiel", type: "text" },
        { name: "registrationNumber", label: "Numéro d’agrément", type: "text" },
        { name: "registrationDate", label: "Date de l’agrément", type: "date", admin: { date: { pickerAppearance: "dayOnly", displayFormat: "dd/MM/yyyy" } } },
        { name: "registrationAuthority", label: "Autorité qui a délivré l’agrément", type: "text" },
        { name: "headOffice", label: "Siège social", type: "text" },
      ],
    },
    {
      name: "socials",
      label: "Réseaux sociaux",
      type: "group",
      fields: [
        { name: "facebook", label: "Facebook", type: "text" },
        { name: "instagram", label: "Instagram", type: "text" },
        { name: "linkedin", label: "LinkedIn", type: "text" },
        { name: "whatsapp", label: "WhatsApp", type: "text" },
      ],
    },
  ],
};

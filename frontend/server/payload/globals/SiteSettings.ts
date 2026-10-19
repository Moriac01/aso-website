import type { GlobalConfig } from "payload";

import { ADMINS, allow, anyone, hiddenUnless } from "../access";
import { auditGlobal } from "../hooks/audit";

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
    afterChange: [auditGlobal("Coordonnées & réseaux")],
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

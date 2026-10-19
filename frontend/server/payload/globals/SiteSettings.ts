import type { GlobalConfig } from "payload";

import { anyone, isAdmin } from "../access";

/** Coordonnées et liens officiels, réutilisés partout (en-tête, pied de page, contact). */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Coordonnées & réseaux",
  admin: { group: "Administration" },
  access: {
    read: anyone,
    update: isAdmin,
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

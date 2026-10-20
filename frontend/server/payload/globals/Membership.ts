import type { GlobalConfig } from "payload";

import { CONTENT_EDITORS, READERS, allow, anyone, hiddenUnless } from "../access";
import { auditGlobal } from "../hooks/audit";
import { CACHE_TAGS } from "@/server/content/tags";
import { MEMBERSHIP_DEFAULTS } from "@/server/content/actions-defaults";
import { revalidateGlobal } from "../hooks/revalidate";

const dayField = { pickerAppearance: "dayOnly", displayFormat: "dd/MM/yyyy" } as const;

/** Bloc « Devenir membre » de la page Devenir membre (adresse courte : aso-rca.org/adherer). */
export const Membership: GlobalConfig = {
  slug: "membership",
  label: "Adhésion",
  admin: {
    group: "Contenu",
    hidden: hiddenUnless(...CONTENT_EDITORS, ...READERS),
    description:
      "Les adhésions se font par le formulaire Microsoft Forms. Avant l'ouverture, les visiteurs peuvent demander à être prévenus sur WhatsApp. Les montants ne sont affichés que dans le formulaire.",
  },
  access: {
    read: anyone,
    update: allow(...CONTENT_EDITORS),
  },
  hooks: {
    afterChange: [revalidateGlobal(CACHE_TAGS.membership), auditGlobal("Adhésion")],
  },
  fields: [
    {
      name: "formUrl",
      label: "Lien du formulaire Microsoft Forms",
      type: "text",
      admin: { description: "Le lien « Envoyer » du formulaire (https://forms.office.com/…). Le bouton n'apparaît qu'une fois ce lien collé." },
      validate: (value: unknown) =>
        !value || /^https:\/\/\S+$/.test(String(value)) ? true : "Collez une adresse complète commençant par https://",
    },
    {
      type: "row",
      fields: [
        {
          name: "openingDate",
          label: "Ouverture des adhésions",
          type: "date",
          defaultValue: MEMBERSHIP_DEFAULTS.openingDate,
          admin: { date: dayField },
        },
        {
          name: "closingDate",
          label: "Clôture (facultatif)",
          type: "date",
          admin: { date: dayField, description: "Laissée vide : les adhésions restent ouvertes." },
        },
      ],
    },
    { name: "title", label: "Titre du bloc", type: "text", maxLength: 80, defaultValue: MEMBERSHIP_DEFAULTS.title },
    { name: "intro", label: "Présentation", type: "textarea", maxLength: 400, defaultValue: MEMBERSHIP_DEFAULTS.intro },
    {
      name: "notifyMessage",
      label: "Message WhatsApp « Être prévenu »",
      type: "text",
      maxLength: 200,
      defaultValue: MEMBERSHIP_DEFAULTS.notifyMessage,
      admin: { description: "Message pré-rempli envoyé au numéro WhatsApp de l'ASO (Coordonnées & réseaux)." },
    },
  ],
};

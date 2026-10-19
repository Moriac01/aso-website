import type { GlobalConfig } from "payload";

import { CACHE_TAGS } from "@/server/content/tags";

import { allow, anyone, hiddenUnless } from "../access";
import { auditGlobal } from "../hooks/audit";
import { revalidateGlobal } from "../hooks/revalidate";

/** Moyens de don affichés sur la page /donate — gérés par la Trésorerie. */
export const DonationSettings: GlobalConfig = {
  slug: "donation-settings",
  label: "Moyens de don",
  admin: {
    group: "Transparence",
    hidden: hiddenUnless("admin", "tresorerie", "controle"),
    description:
      "Seuls les comptes au nom de l’association. Un moyen décoché n’apparaît pas sur le site.",
  },
  access: {
    read: anyone,
    update: allow("admin", "tresorerie"),
  },
  hooks: {
    afterChange: [revalidateGlobal(CACHE_TAGS.donation), auditGlobal("Moyens de don")],
  },
  fields: [
    {
      name: "methods",
      label: "Moyens de don",
      type: "array",
      maxRows: 6,
      labels: { singular: "Moyen de don", plural: "Moyens de don" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", label: "Nom", type: "text", required: true, admin: { description: "Ex. : Orange Money" } },
            {
              name: "kind",
              label: "Type",
              type: "select",
              required: true,
              defaultValue: "mobile-money",
              options: [
                { label: "Mobile money", value: "mobile-money" },
                { label: "Virement bancaire", value: "bank" },
                { label: "Autre", value: "other" },
              ],
            },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "accountName", label: "Titulaire du compte", type: "text", admin: { description: "Doit être l’ASO." } },
            { name: "accountNumber", label: "Numéro / IBAN", type: "text" },
          ],
        },
        {
          name: "instructions",
          label: "Instructions",
          type: "textarea",
          admin: { description: "Les étapes à suivre, en mots simples. Ex. : « Faites un transfert vers ce numéro, puis notez la référence reçue par SMS. »" },
        },
        { name: "active", label: "Afficher sur le site", type: "checkbox", defaultValue: false },
      ],
    },
  ],
};

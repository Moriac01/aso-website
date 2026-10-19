import type { GlobalConfig } from "payload";

import { anyone, isStaff } from "../access";
import { CACHE_TAGS } from "@/server/content/tags";
import { revalidateGlobal } from "../hooks/revalidate";

/** Chiffres clés affichés sur le site — une seule source de vérité. */
export const KeyFigures: GlobalConfig = {
  slug: "key-figures",
  label: "Chiffres clés",
  admin: {
    group: "Contenu",
    description:
      "Ces chiffres engagent la crédibilité de l'ASO : n'indiquez que des valeurs vérifiables.",
  },
  access: {
    read: anyone,
    update: isStaff,
  },
  hooks: {
    afterChange: [revalidateGlobal(CACHE_TAGS.keyFigures)],
  },
  fields: [
    {
      name: "items",
      label: "Chiffres",
      type: "array",
      maxRows: 8,
      labels: { singular: "Chiffre", plural: "Chiffres" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "value", label: "Valeur", type: "number", required: true },
            {
              name: "suffix",
              label: "Suffixe",
              type: "text",
              admin: { description: "Ex. : %, +, FCFA" },
            },
          ],
        },
        { name: "label", label: "Libellé", type: "text", required: true },
        {
          name: "source",
          label: "Source / justification (interne)",
          type: "text",
          admin: { description: "Ex. : « Bulletins scolaires 2025-2026 ». Non affiché." },
        },
      ],
    },
  ],
};

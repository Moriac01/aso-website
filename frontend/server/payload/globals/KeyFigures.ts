import type { GlobalConfig } from "payload";

import { CONTENT_EDITORS, READERS, allow, anyone, hiddenUnless, rolesOf } from "../access";
import { auditGlobal } from "../hooks/audit";
import { CACHE_TAGS } from "@/server/content/tags";
import { revalidateGlobal } from "../hooks/revalidate";

/** Chiffres clés affichés sur le site — une seule source de vérité. */
export const KeyFigures: GlobalConfig = {
  slug: "key-figures",
  label: "Chiffres clés",
  admin: {
    group: "Contenu",
    hidden: hiddenUnless(...CONTENT_EDITORS, ...READERS),
    description:
      "Ces chiffres engagent la crédibilité de l'ASO : n'indiquez que des valeurs vérifiables.",
  },
  access: {
    read: anyone,
    update: allow(...CONTENT_EDITORS),
  },
  hooks: {
    afterChange: [revalidateGlobal(CACHE_TAGS.keyFigures), auditGlobal("Chiffres clés")],
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
          // Interne : jamais renvoyé par l'API publique.
          access: { read: ({ req }) => rolesOf(req.user).length > 0 },
          admin: { description: "Ex. : « Bulletins scolaires 2025-2026 ». Non affiché." },
        },
      ],
    },
  ],
};

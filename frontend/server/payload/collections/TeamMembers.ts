import type { CollectionConfig } from "payload";

import { anyone, isStaff } from "../access";
import { CACHE_TAGS } from "@/server/content/tags";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: { singular: "Membre de l'équipe", plural: "Équipe" },
  admin: {
    group: "Contenu",
    useAsTitle: "name",
    defaultColumns: ["name", "role", "type", "order"],
  },
  access: {
    read: anyone,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  defaultSort: "order",
  hooks: {
    afterChange: [revalidateAfterChange(CACHE_TAGS.team)],
    afterDelete: [revalidateAfterDelete(CACHE_TAGS.team)],
  },
  fields: [
    { name: "name", label: "Nom", type: "text", required: true },
    { name: "role", label: "Fonction", type: "text", required: true },
    {
      name: "type",
      label: "Catégorie",
      type: "select",
      required: true,
      defaultValue: "member",
      options: [
        { label: "Bureau exécutif", value: "executive" },
        { label: "Membre", value: "member" },
        { label: "Bénévole", value: "volunteer" },
      ],
    },
    { name: "photo", label: "Photo", type: "upload", relationTo: "media" },
    { name: "description", label: "Description", type: "textarea", maxLength: 300 },
    {
      name: "order",
      label: "Ordre d'affichage",
      type: "number",
      defaultValue: 100,
      admin: { position: "sidebar", description: "Plus petit = affiché en premier." },
    },
  ],
};

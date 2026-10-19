import type { CollectionConfig } from "payload";

import { allow, hiddenUnless, nobody } from "../access";

/** Journal des modifications — lecture seule pour tous, y compris les administrateurs. */
export const AuditLog: CollectionConfig = {
  slug: "audit-log",
  labels: { singular: "Entrée du journal", plural: "Journal des modifications" },
  admin: {
    group: "Administration",
    useAsTitle: "label",
    defaultColumns: ["createdAt", "userName", "action", "target", "label", "changes"],
    description: "Qui a modifié quoi, et quand. Ces entrées ne peuvent être ni modifiées ni supprimées.",
    hidden: hiddenUnless("admin", "tech", "controle"),
  },
  access: {
    read: allow("admin", "tech", "controle"),
    create: nobody, // écrit uniquement par le serveur
    update: nobody,
    delete: nobody,
  },
  defaultSort: "-createdAt",
  fields: [
    {
      name: "action",
      label: "Action",
      type: "select",
      required: true,
      options: [
        { label: "Création", value: "create" },
        { label: "Modification", value: "update" },
        { label: "Suppression", value: "delete" },
      ],
    },
    { name: "target", label: "Élément", type: "text", required: true },
    { name: "documentId", label: "Identifiant", type: "text" },
    { name: "label", label: "Titre", type: "text" },
    { name: "changes", label: "Champs modifiés", type: "text" },
    { name: "user", label: "Compte", type: "relationship", relationTo: "users" },
    { name: "userName", label: "Par", type: "text" },
  ],
};

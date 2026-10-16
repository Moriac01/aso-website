import type { CollectionConfig } from "payload";

import { isAdmin, isAdminField, isAdminOrSelf } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Compte", plural: "Comptes" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
    group: "Administration",
  },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8 h
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 min après 5 échecs
  },
  access: {
    // Le tout premier compte est créé via l'écran « Créer le premier utilisateur ».
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // Le premier compte créé devient automatiquement administrateur.
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;
        const { totalDocs } = await req.payload.count({ collection: "users", req });
        if (totalDocs === 0) data.role = "admin";
        return data;
      },
    ],
  },
  fields: [
    { name: "name", label: "Nom complet", type: "text", required: true },
    {
      name: "role",
      label: "Rôle",
      type: "select",
      required: true,
      defaultValue: "editor",
      saveToJWT: true,
      options: [
        { label: "Administrateur", value: "admin" },
        { label: "Éditeur", value: "editor" },
      ],
      access: {
        // Personne ne peut s'attribuer lui-même le rôle admin.
        update: isAdminField,
      },
      admin: {
        description:
          "Administrateur : tout gérer, y compris les comptes. Éditeur : contenu et suivi des demandes.",
      },
    },
  ],
};

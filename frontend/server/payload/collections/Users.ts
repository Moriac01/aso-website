import { APIError, type CollectionConfig, type PayloadRequest } from "payload";

import { ADMINS, allow, allowField, hasRole, isAdminOrSelf } from "../access";
import { auditAfterChange, auditAfterDelete } from "../hooks/audit";
import { roleOptions, type Role } from "../roles";

type UserData = {
  id?: number | string;
  roles?: Role[] | null;
  active?: boolean | null;
  mandateEndsAt?: string | null;
};

const countActiveAdmins = async (req: PayloadRequest, excludeId?: number | string) => {
  const { totalDocs } = await req.payload.count({
    collection: "users",
    req,
    overrideAccess: true,
    where: {
      and: [
        { roles: { contains: "admin" } },
        { active: { not_equals: false } },
        ...(excludeId !== undefined ? [{ id: { not_equals: excludeId } }] : []),
      ],
    },
  });
  return totalDocs;
};

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Compte", plural: "Comptes" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "roles", "active", "mandateEndsAt"],
    group: "Administration",
  },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8 h
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 min après 5 échecs
  },
  access: {
    // Le tout premier compte est créé via l'écran « Créer le premier utilisateur ».
    create: allow(...ADMINS),
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: allow(...ADMINS),
  },
  hooks: {
    beforeLogin: [
      ({ user }) => {
        const account = user as UserData;
        if (account.active === false) {
          throw new APIError("Ce compte est désactivé. Contactez le Président de l’ASO.", 403, null, true);
        }
        if (account.mandateEndsAt && new Date(account.mandateEndsAt) < new Date()) {
          throw new APIError(
            "Votre mandat est arrivé à échéance : ce compte n’est plus actif. Contactez le Président de l’ASO.",
            403,
            null,
            true,
          );
        }
      },
    ],
    beforeChange: [
      async ({ data, originalDoc, operation, req }) => {
        // Le premier compte créé devient automatiquement administrateur (Président).
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "users", req, overrideAccess: true });
          if (totalDocs === 0) {
            data.roles = ["admin"];
            data.active = true;
            return data;
          }
        }

        const before = (originalDoc as UserData | undefined)?.roles ?? [];
        const after = (data.roles as Role[] | undefined) ?? before;
        const adminChanged = before.includes("admin") !== after.includes("admin");

        // Seul le Président (rôle admin) peut donner ou retirer le rôle admin.
        if (adminChanged && req.user && !hasRole(req.user, "admin")) {
          throw new APIError("Seul un administrateur (Président) peut attribuer ou retirer ce rôle.", 403, null, true);
        }

        // Il doit toujours rester au moins un administrateur actif.
        const losesAdmin =
          operation === "update" &&
          before.includes("admin") &&
          (!after.includes("admin") || data.active === false);
        if (losesAdmin && (await countActiveAdmins(req, (originalDoc as UserData).id)) === 0) {
          throw new APIError("Impossible : l’ASO doit toujours avoir au moins un administrateur actif.", 400, null, true);
        }
        return data;
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const doc = (await req.payload.findByID({ collection: "users", id, req, overrideAccess: true })) as UserData;
        if (doc.roles?.includes("admin") && (await countActiveAdmins(req, id)) === 0) {
          throw new APIError("Impossible : l’ASO doit toujours avoir au moins un administrateur actif.", 400, null, true);
        }
      },
    ],
    afterChange: [auditAfterChange("Compte", (doc) => doc.name)],
    afterDelete: [auditAfterDelete("Compte", (doc) => doc.name)],
  },
  fields: [
    { name: "name", label: "Nom complet", type: "text", required: true },
    {
      name: "roles",
      label: "Rôles",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["consultation"],
      saveToJWT: true,
      options: roleOptions.map(({ label, value }) => ({ label, value })),
      access: {
        // Personne ne peut modifier ses propres droits sans être administrateur.
        update: allowField(...ADMINS),
      },
      admin: {
        description: roleOptions.map((role) => `${role.label} : ${role.description}`).join("  ·  "),
      },
    },
    {
      name: "function",
      label: "Fonction au Bureau Exécutif",
      type: "text",
      admin: { description: "Telle qu’inscrite au procès-verbal. Ex. : Trésorière Générale." },
    },
    {
      name: "active",
      label: "Compte actif",
      type: "checkbox",
      defaultValue: true,
      access: { update: allowField(...ADMINS) },
      admin: { position: "sidebar", description: "Décochez pour bloquer l’accès sans supprimer le compte." },
    },
    {
      name: "mandateEndsAt",
      label: "Fin de mandat",
      type: "date",
      access: { update: allowField(...ADMINS) },
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly", displayFormat: "dd/MM/yyyy" },
        description: "Après cette date, la connexion est refusée. Mandat du bureau élu le 24/01/2026 : 3 ans.",
      },
    },
  ],
};

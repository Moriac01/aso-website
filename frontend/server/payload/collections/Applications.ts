import type { CollectionConfig } from "payload";

import { isAdmin, isStaff, nobody } from "../access";

type ApplicationData = { type?: "member" | "volunteer" };
const forMember = (data: ApplicationData) => data?.type === "member";
const forVolunteer = (data: ApplicationData) => data?.type === "volunteer";

/**
 * Demandes d'adhésion (membre) et candidatures bénévoles.
 * Création uniquement par le serveur (Server Action).
 */
export const Applications: CollectionConfig = {
  slug: "applications",
  labels: { singular: "Candidature", plural: "Adhésions & bénévolat" },
  admin: {
    group: "Demandes reçues",
    useAsTitle: "email",
    defaultColumns: ["firstName", "lastName", "type", "city", "status", "createdAt"],
  },
  access: {
    create: nobody,
    read: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  defaultSort: "-createdAt",
  fields: [
    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      options: [
        { label: "Adhésion (membre)", value: "member" },
        { label: "Bénévolat", value: "volunteer" },
      ],
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "status",
      label: "Statut",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "Nouvelle", value: "new" },
        { label: "Contacté(e)", value: "contacted" },
        { label: "Acceptée", value: "accepted" },
        { label: "Déclinée", value: "declined" },
      ],
      admin: { position: "sidebar" },
    },
    {
      type: "row",
      fields: [
        { name: "firstName", label: "Prénom", type: "text", required: true, admin: { readOnly: true } },
        { name: "lastName", label: "Nom", type: "text", required: true, admin: { readOnly: true } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "email", label: "Email", type: "email", required: true, admin: { readOnly: true } },
        { name: "phone", label: "Téléphone", type: "text", required: true, admin: { readOnly: true } },
      ],
    },
    { name: "city", label: "Ville", type: "text", required: true, admin: { readOnly: true } },

    // Adhésion
    {
      name: "profession",
      label: "Profession",
      type: "text",
      admin: { readOnly: true, condition: forMember },
    },
    {
      name: "motivation",
      label: "Motivation",
      type: "textarea",
      admin: { readOnly: true, condition: forMember },
    },

    // Bénévolat
    {
      name: "skills",
      label: "Compétences",
      type: "text",
      admin: { readOnly: true, condition: forVolunteer },
    },
    {
      name: "availability",
      label: "Disponibilité",
      type: "text",
      admin: { readOnly: true, condition: forVolunteer },
    },
    {
      name: "helpType",
      label: "Type d'aide",
      type: "text",
      admin: { readOnly: true, condition: forVolunteer },
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      admin: { readOnly: true, condition: forVolunteer },
    },

    {
      name: "consent",
      label: "Consentement au traitement des données",
      type: "checkbox",
      required: true,
      admin: { readOnly: true },
    },
    {
      name: "internalNotes",
      label: "Notes internes",
      type: "textarea",
      admin: { position: "sidebar", description: "Visible uniquement par l'équipe." },
    },
  ],
};

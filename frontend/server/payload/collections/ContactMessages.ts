import type { CollectionConfig } from "payload";

import { isAdmin, isStaff, nobody } from "../access";

export const requestStatusOptions = [
  { label: "Nouveau", value: "new" },
  { label: "En cours", value: "in-progress" },
  { label: "Traité", value: "done" },
];

/**
 * Messages du formulaire de contact.
 * Création uniquement par le serveur (Server Action) — jamais via l'API publique.
 * Données personnelles : lecture réservée à l'équipe connectée.
 */
export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  labels: { singular: "Message", plural: "Messages de contact" },
  admin: {
    group: "Demandes reçues",
    useAsTitle: "subject",
    defaultColumns: ["subject", "name", "email", "status", "createdAt"],
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
      name: "status",
      label: "Statut",
      type: "select",
      required: true,
      defaultValue: "new",
      options: requestStatusOptions,
      admin: { position: "sidebar" },
    },
    { name: "name", label: "Nom", type: "text", required: true, admin: { readOnly: true } },
    { name: "email", label: "Email", type: "email", required: true, admin: { readOnly: true } },
    { name: "phone", label: "Téléphone", type: "text", admin: { readOnly: true } },
    { name: "subject", label: "Sujet", type: "text", required: true, admin: { readOnly: true } },
    { name: "message", label: "Message", type: "textarea", required: true, admin: { readOnly: true } },
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

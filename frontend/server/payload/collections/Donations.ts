import type { CollectionConfig } from "payload";

import { donationProjects, newDonationReference } from "@/lib/validation/donation";

import { allow, allowField, hiddenUnless, nobody, userLabel } from "../access";
import { auditAfterChange, auditAfterDelete } from "../hooks/audit";

type DonationDoc = { reference?: string; status?: string };

/**
 * Les informations déclarées par le donateur sont figées : personne, pas même
 * le Président, ne peut modifier un montant ou une référence après coup.
 *
 * Dons déclarés par les donateurs sur la page /donate.
 *
 * Circuit : le donateur envoie l'argent (Orange Money…) puis déclare son don →
 * statut « Déclaré » → la Trésorerie vérifie la réception sur le compte et passe
 * le don à « Reçu » (ou « Non retrouvé »). Chaque étape est inscrite au journal.
 */
export const Donations: CollectionConfig = {
  slug: "donations",
  labels: { singular: "Don", plural: "Dons" },
  admin: {
    group: "Transparence",
    useAsTitle: "reference",
    defaultColumns: ["reference", "createdAt", "amount", "method", "project", "status"],
    description:
      "Vérifiez chaque don sur le relevé Orange Money ou bancaire avant de le passer à « Reçu ».",
    hidden: hiddenUnless("admin", "tresorerie", "controle"),
  },
  access: {
    create: nobody, // uniquement via le formulaire public (Server Action)
    read: allow("admin", "tresorerie", "controle"),
    update: allow("admin", "tresorerie"),
    delete: allow("admin"),
  },
  defaultSort: "-createdAt",
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation, req }) => {
        if (operation === "create") data.reference = newDonationReference();
        const before = (originalDoc ?? {}) as DonationDoc;
        if (operation === "update" && data.status && data.status !== before.status) {
          if (data.status === "declared") {
            data.checkedBy = null;
            data.checkedAt = null;
          } else {
            data.checkedBy = userLabel(req);
            data.checkedAt = new Date().toISOString();
          }
        }
        return data;
      },
    ],
    // Les créations viennent du formulaire public : on journalise les vérifications de l'équipe.
    afterChange: [
      (args) =>
        args.operation === "update"
          ? auditAfterChange("Don", (doc) => doc.reference)(args)
          : args.doc,
    ],
    afterDelete: [auditAfterDelete("Don", (doc) => doc.reference)],
  },
  fields: [
    {
      name: "reference",
      label: "Référence",
      type: "text",
      unique: true,
      index: true,
      access: { update: () => false },
      admin: { readOnly: true, position: "sidebar", description: "Communiquée au donateur." },
    },
    {
      name: "status",
      label: "Statut",
      type: "select",
      required: true,
      defaultValue: "declared",
      options: [
        { label: "Déclaré (à vérifier)", value: "declared" },
        { label: "Reçu", value: "received" },
        { label: "Non retrouvé", value: "not-found" },
      ],
      access: { update: allowField("admin", "tresorerie") },
      admin: { position: "sidebar" },
    },
    {
      name: "checkedBy",
      label: "Vérifié par",
      type: "text",
      access: { create: () => false, update: () => false },
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "checkedAt",
      label: "Vérifié le",
      type: "date",
      access: { create: () => false, update: () => false },
      admin: { position: "sidebar", readOnly: true, date: { displayFormat: "dd/MM/yyyy HH:mm" } },
    },
    {
      type: "row",
      fields: [
        { name: "amount", label: "Montant (FCFA)", type: "number", required: true, min: 100, access: { update: () => false }, admin: { readOnly: true } },
        { name: "method", label: "Moyen utilisé", type: "text", required: true, access: { update: () => false }, admin: { readOnly: true } },
      ],
    },
    { name: "transactionRef", label: "Référence de la transaction", type: "text", required: true, access: { update: () => false }, admin: { readOnly: true } },
    {
      name: "project",
      label: "Projet soutenu",
      type: "select",
      required: true,
      defaultValue: "general",
      options: donationProjects.map(({ value, label }) => ({ value, label })),
      access: { update: () => false },
      admin: { readOnly: true },
    },
    { name: "anonymous", label: "Don anonyme", type: "checkbox", defaultValue: false, access: { update: () => false }, admin: { readOnly: true } },
    {
      type: "row",
      fields: [
        { name: "donorName", label: "Nom du donateur", type: "text", access: { update: () => false }, admin: { readOnly: true } },
        { name: "email", label: "Email", type: "email", access: { update: () => false }, admin: { readOnly: true } },
        { name: "phone", label: "Téléphone", type: "text", access: { update: () => false }, admin: { readOnly: true } },
      ],
    },
    { name: "message", label: "Message du donateur", type: "textarea", access: { update: () => false }, admin: { readOnly: true } },
    { name: "consent", label: "Consentement au traitement des données", type: "checkbox", required: true, access: { update: () => false }, admin: { readOnly: true } },
    {
      name: "internalNotes",
      label: "Notes de la Trésorerie",
      type: "textarea",
      access: { update: allowField("admin", "tresorerie") },
      admin: { position: "sidebar", description: "Ex. : reçu le 12/11 sur Orange Money, réf. relevé n° …" },
    },
  ],
};

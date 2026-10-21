import { z } from "zod";

import { honeypot } from "./forms";

/**
 * Contrat partagé front / back pour la déclaration de don.
 * Le serveur valide TOUJOURS avec ce schéma avant d'enregistrer.
 */

export const donationProjects = [
  { value: "general", label: "Là où le besoin est le plus grand", open: true },
  { value: "education", label: "Éducation des orphelins", open: true },
  // Projet PAEMV : lancement prévu en décembre 2026. Passer `open` à true pour le proposer aux donateurs.
  // La valeur reste connue du back-office (dons déjà enregistrés, choix possible par la Trésorerie).
  { value: "paemv", label: "Projet PAEMV (mères veuves)", open: false },
  { value: "psychosocial", label: "Soutien psychosocial", open: true },
] as const;

export type DonationProject = (typeof donationProjects)[number]["value"];

/** Projets proposés aux donateurs sur le site. */
export const openDonationProjects = donationProjects.filter((p) => p.open);

const projectValues = openDonationProjects.map((p) => p.value) as [DonationProject, ...DonationProject[]];

const phoneDigits = (value: string) => value.replace(/\D/g, "").length;

export const donationSchema = z
  .object({
    anonymous: z.boolean().default(false),
    donorName: z.string().trim().max(120, "Nom trop long.").default(""),
    email: z
      .string()
      .trim()
      .max(254, "Email trop long.")
      .refine((v) => v === "" || z.email().safeParse(v).success, "Veuillez saisir un email valide.")
      .default(""),
    phone: z
      .string()
      .trim()
      .max(30, "Le téléphone est invalide.")
      .refine((v) => v === "" || (phoneDigits(v) >= 8 && phoneDigits(v) <= 15), "Le téléphone est invalide.")
      .default(""),
    amount: z.coerce
      .number({ error: "Indiquez le montant envoyé." })
      .int("Indiquez un montant entier, en FCFA.")
      .min(100, "Le montant minimum est de 100 FCFA.")
      .max(100_000_000, "Montant trop élevé : contactez-nous directement."),
    method: z.string().trim().min(1, "Choisissez le moyen utilisé.").max(80),
    transactionRef: z
      .string()
      .trim()
      .min(4, "Indiquez la référence de la transaction (reçue par SMS).")
      .max(80, "Référence trop longue."),
    project: z.enum(projectValues).default("general"),
    message: z.string().trim().max(1000, "Message trop long (1000 caractères max).").default(""),
    consent: z.literal(true, { error: "Vous devez accepter le consentement." }),
    website: honeypot,
  })
  .refine((data) => data.anonymous || data.donorName.length > 0, {
    message: "Indiquez votre nom, ou cochez « don anonyme ».",
    path: ["donorName"],
  });

export type DonationInput = z.input<typeof donationSchema>;

export type DonationResult =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Référence lisible communiquée au donateur, ex. DON-2026-7K3QXM (sans 0/O ni 1/I pour éviter les confusions). */
export function newDonationReference(date = new Date()): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const code = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `DON-${date.getFullYear()}-${code}`;
}

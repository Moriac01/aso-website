import { z } from "zod";

/**
 * Contrat partagé front / back pour les formulaires publics.
 * - Le front peut l'utiliser pour valider dans le navigateur.
 * - Le serveur l'utilise TOUJOURS avant d'écrire en base (ne jamais faire
 *   confiance à la validation côté navigateur seule).
 */

const requiredText = (message: string, max = 200) =>
  z.string().trim().min(1, message).max(max, "Ce champ est trop long.");

const email = z
  .string()
  .trim()
  .min(1, "L’email est requis.")
  .max(254, "Email trop long.")
  .pipe(z.email("Veuillez saisir un email valide."));

const phoneDigits = (value: string) => value.replace(/\D/g, "").length;

const requiredPhone = z
  .string()
  .trim()
  .min(1, "Le téléphone est requis.")
  .max(30, "Le téléphone est invalide.")
  .refine((v) => phoneDigits(v) >= 8 && phoneDigits(v) <= 15, "Le téléphone est invalide.");

const optionalPhone = z
  .string()
  .trim()
  .max(30, "Le téléphone est invalide.")
  .refine(
    (v) => v === "" || (phoneDigits(v) >= 8 && phoneDigits(v) <= 15),
    "Le téléphone doit contenir entre 8 et 15 chiffres.",
  );

const consent = z.literal(true, { error: "Vous devez accepter le consentement." });

/** Champ piège anti-robots : invisible pour les humains, doit rester vide. */
export const honeypot = z.string().max(0).optional();

export const contactSchema = z.object({
  name: requiredText("Le nom est requis.", 120),
  email,
  phone: optionalPhone,
  subject: requiredText("Le sujet est requis.", 150),
  message: z
    .string()
    .trim()
    .min(1, "Le message est requis.")
    .min(10, "Le message doit contenir au moins 10 caractères.")
    .max(5000, "Le message est trop long (5000 caractères max)."),
  consent,
  website: honeypot,
});

const applicantBase = {
  firstName: requiredText("Le prénom est requis.", 80),
  lastName: requiredText("Le nom est requis.", 80),
  email,
  phone: requiredPhone,
  city: requiredText("La ville est requise.", 100),
  consent,
  website: honeypot,
};

const longText = (requiredMessage: string) =>
  z
    .string()
    .trim()
    .min(1, requiredMessage)
    .min(20, "Le message doit contenir au moins 20 caractères.")
    .max(3000, "Le message est trop long (3000 caractères max).");

export const memberSchema = z.object({
  ...applicantBase,
  profession: requiredText("Ce champ est requis.", 120),
  motivation: longText("Dites-nous pourquoi vous souhaitez rejoindre l’ASO."),
});

export const volunteerSchema = z.object({
  ...applicantBase,
  skills: requiredText("Le domaine de compétence est requis.", 200),
  availability: requiredText("Veuillez choisir votre disponibilité.", 100),
  helpType: requiredText("Veuillez choisir un type d’aide.", 100),
  message: longText("Le message est requis."),
});

export type ContactInput = z.input<typeof contactSchema>;
export type MemberInput = z.input<typeof memberSchema>;
export type VolunteerInput = z.input<typeof volunteerSchema>;

/** Réponse renvoyée par les Server Actions des formulaires. */
export type FormResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Première erreur par champ, au format attendu par les formulaires existants. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

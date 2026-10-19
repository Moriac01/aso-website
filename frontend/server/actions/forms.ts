"use server";

import config from "@payload-config";
import { getPayload, type Payload } from "payload";

import {
  contactSchema,
  memberSchema,
  toFieldErrors,
  volunteerSchema,
  type FormResult,
} from "@/lib/validation/forms";
import {
  donationProjects,
  donationSchema,
  type DonationResult,
} from "@/lib/validation/donation";

type FormFailure = Extract<FormResult, { ok: false }>;

const INVALID: FormFailure = {
  ok: false,
  error: "Certains champs sont invalides. Merci de vérifier le formulaire.",
};

const SERVER_ERROR: FormFailure = {
  ok: false,
  error:
    "Votre demande n’a pas pu être enregistrée. Merci de réessayer dans quelques instants ou de nous contacter par téléphone.",
};

/** Retire le champ piège avant l'enregistrement. */
function withoutHoneypot<T extends { website?: string }>(values: T): Omit<T, "website"> {
  const copy = { ...values };
  delete copy.website;
  return copy;
}

/** Un robot a rempli le champ piège : on fait comme si tout allait bien, sans rien enregistrer. */
const isBot = (input: unknown) =>
  typeof input === "object" &&
  input !== null &&
  "website" in input &&
  typeof (input as { website?: unknown }).website === "string" &&
  (input as { website: string }).website.length > 0;

async function notifyTeam(payload: Payload, subject: string, lines: string[]) {
  try {
    const settings = await payload.findGlobal({ slug: "site-settings", overrideAccess: true });
    if (!settings.notificationEmail) return;
    await payload.sendEmail({
      to: settings.notificationEmail,
      subject: `[Site ASO] ${subject}`,
      text: [...lines, "", "À traiter dans le back-office : /admin"].join("\n"),
    });
  } catch (error) {
    // La demande est déjà enregistrée : un échec d'email ne doit pas faire échouer l'envoi.
    payload.logger.error({ err: error }, "Notification email non envoyée");
  }
}

export async function submitContactMessage(input: unknown): Promise<FormResult> {
  if (isBot(input)) return { ok: true };

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ...INVALID, fieldErrors: toFieldErrors(parsed.error) };

  const data = withoutHoneypot(parsed.data);

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "contact-messages",
      data: { ...data, status: "new" },
      overrideAccess: true, // la collection refuse toute création via l'API publique
    });
    await notifyTeam(payload, `Nouveau message : ${data.subject}`, [
      `De : ${data.name} <${data.email}>${data.phone ? ` · ${data.phone}` : ""}`,
      "",
      data.message,
    ]);
    return { ok: true };
  } catch (error) {
    console.error("submitContactMessage", error);
    return SERVER_ERROR;
  }
}

export async function submitMemberApplication(input: unknown): Promise<FormResult> {
  if (isBot(input)) return { ok: true };

  const parsed = memberSchema.safeParse(input);
  if (!parsed.success) return { ...INVALID, fieldErrors: toFieldErrors(parsed.error) };

  const data = withoutHoneypot(parsed.data);

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "applications",
      data: { ...data, type: "member", status: "new" },
      overrideAccess: true,
    });
    await notifyTeam(payload, `Demande d’adhésion : ${data.firstName} ${data.lastName}`, [
      `${data.firstName} ${data.lastName} <${data.email}> · ${data.phone} · ${data.city}`,
      `Profession : ${data.profession}`,
      "",
      data.motivation,
    ]);
    return { ok: true };
  } catch (error) {
    console.error("submitMemberApplication", error);
    return SERVER_ERROR;
  }
}

export async function submitVolunteerApplication(input: unknown): Promise<FormResult> {
  if (isBot(input)) return { ok: true };

  const parsed = volunteerSchema.safeParse(input);
  if (!parsed.success) return { ...INVALID, fieldErrors: toFieldErrors(parsed.error) };

  const data = withoutHoneypot(parsed.data);

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "applications",
      data: { ...data, type: "volunteer", status: "new" },
      overrideAccess: true,
    });
    await notifyTeam(payload, `Candidature bénévole : ${data.firstName} ${data.lastName}`, [
      `${data.firstName} ${data.lastName} <${data.email}> · ${data.phone} · ${data.city}`,
      `Compétences : ${data.skills}`,
      `Disponibilité : ${data.availability} · Aide : ${data.helpType}`,
      "",
      data.message,
    ]);
    return { ok: true };
  } catch (error) {
    console.error("submitVolunteerApplication", error);
    return SERVER_ERROR;
  }
}

export async function submitDonation(input: unknown): Promise<DonationResult> {
  // Un robot reçoit une fausse confirmation, sans rien enregistrer.
  if (isBot(input)) return { ok: true, reference: "DON-0000-000000" };

  const parsed = donationSchema.safeParse(input);
  if (!parsed.success) return { ...INVALID, fieldErrors: toFieldErrors(parsed.error) };

  const data = withoutHoneypot(parsed.data);

  try {
    const payload = await getPayload({ config });
    const doc = await payload.create({
      collection: "donations",
      data: {
        ...data,
        donorName: data.anonymous ? "" : data.donorName,
        status: "declared",
      },
      overrideAccess: true, // la collection refuse toute création via l'API publique
    });
    const reference = doc.reference ?? "";
    const project = donationProjects.find((p) => p.value === data.project)?.label ?? data.project;
    await notifyTeam(payload, `Don déclaré : ${data.amount.toLocaleString("fr-FR")} FCFA (${reference})`, [
      `Montant : ${data.amount.toLocaleString("fr-FR")} FCFA via ${data.method}`,
      `Référence de la transaction : ${data.transactionRef}`,
      `Projet : ${project}`,
      `Donateur : ${data.anonymous ? "anonyme" : data.donorName}${data.phone ? ` · ${data.phone}` : ""}${data.email ? ` · ${data.email}` : ""}`,
      "",
      "À vérifier sur le relevé avant de passer le don à « Reçu ».",
    ]);
    return { ok: true, reference };
  } catch (error) {
    console.error("submitDonation", error);
    return SERVER_ERROR;
  }
}

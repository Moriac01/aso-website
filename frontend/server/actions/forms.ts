"use server";

import config from "@payload-config";
import { getPayload, type Payload } from "payload";

import {
  acknowledgement,
  applicationAlert,
  contactAlert,
  donationAlert,
  donationDeclared,
} from "@/server/email/messages";
import { sendLater, sendSafely, teamRecipients } from "@/server/email/send";
import type { Role } from "@/server/payload/roles";

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

/**
 * Emails envoyés APRÈS la réponse au visiteur (fonction `after` de Next.js) :
 * le formulaire répond tout de suite, même si le serveur d'email est lent.
 */
function emailTeamAndSender(
  payload: Payload,
  roles: Role[],
  alert: { subject: string; html: string; text: string; replyTo?: string },
  sender?: { to: string; subject: string; html: string; text: string },
) {
  sendLater(async () => {
    try {
      await sendSafely(payload, { ...alert, to: await teamRecipients(payload, roles) });
    } catch (error) {
      payload.logger.error({ err: error }, "Destinataires de l'alerte introuvables");
    }
    if (sender) await sendSafely(payload, sender);
  });
}

export async function submitContactMessage(input: unknown): Promise<FormResult> {
  if (isBot(input)) return { ok: true };

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ...INVALID, fieldErrors: toFieldErrors(parsed.error) };

  const data = withoutHoneypot(parsed.data);

  try {
    const payload = await getPayload({ config });
    const doc = await payload.create({
      collection: "contact-messages",
      data: { ...data, status: "new" },
      overrideAccess: true, // la collection refuse toute création via l'API publique
    });
    emailTeamAndSender(
      payload,
      ["secretariat"],
      { ...contactAlert({ ...data, id: doc.id }), replyTo: data.email },
      { to: data.email, ...acknowledgement("contact") },
    );
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
    const doc = await payload.create({
      collection: "applications",
      data: { ...data, type: "member", status: "new" },
      overrideAccess: true,
    });
    emailTeamAndSender(
      payload,
      ["secretariat", "mobilisation"],
      {
        ...applicationAlert({
          ...data,
          id: doc.id,
          type: "member",
          details: [["Profession", data.profession]],
          text: data.motivation,
        }),
        replyTo: data.email,
      },
      { to: data.email, ...acknowledgement("member") },
    );
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
    const doc = await payload.create({
      collection: "applications",
      data: { ...data, type: "volunteer", status: "new" },
      overrideAccess: true,
    });
    emailTeamAndSender(
      payload,
      ["mobilisation", "secretariat"],
      {
        ...applicationAlert({
          ...data,
          id: doc.id,
          type: "volunteer",
          details: [
            ["Compétences", data.skills],
            ["Disponibilité", data.availability],
            ["Type d’aide", data.helpType],
          ],
          text: data.message,
        }),
        replyTo: data.email,
      },
      { to: data.email, ...acknowledgement("volunteer") },
    );
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
    emailTeamAndSender(
      payload,
      ["tresorerie"],
      donationAlert({
        id: doc.id,
        reference,
        amount: data.amount,
        method: data.method,
        transactionRef: data.transactionRef,
        project,
        donor: data.anonymous ? "Anonyme" : data.donorName,
        contact: [data.phone, data.email].filter(Boolean).join(" · "),
      }),
      data.email ? { to: data.email, ...donationDeclared({ reference, amount: data.amount, project }) } : undefined,
    );
    return { ok: true, reference };
  } catch (error) {
    console.error("submitDonation", error);
    return SERVER_ERROR;
  }
}

import { after } from "next/server";
import type { Payload } from "payload";

import type { Role } from "@/server/payload/roles";

import type { RenderedEmail } from "./layout";

type Message = RenderedEmail & {
  to: string | string[];
  subject: string;
  /** Adresse à laquelle répondre (ex. la personne qui a écrit via le formulaire). */
  replyTo?: string;
};

/**
 * Envoie un email sans jamais faire échouer l'action en cours : la demande ou
 * le don est déjà enregistré, un problème d'email est seulement journalisé.
 */
export async function sendSafely(payload: Payload, { to, subject, html, text, replyTo }: Message) {
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (recipients.length === 0) return;
  try {
    await payload.sendEmail({ to: recipients, subject, html, text, ...(replyTo ? { replyTo } : {}) });
  } catch (error) {
    payload.logger.error({ err: error, subject }, "Email non envoyé");
  }
}

/**
 * Destinataires d'une alerte : les comptes actifs (mandat en cours) qui ont
 * l'un des rôles concernés, plus la boîte générale définie dans
 * Administration → Coordonnées & réseaux. Si personne n'a encore ce rôle,
 * les administrateurs sont prévenus, pour qu'aucune demande ne passe inaperçue.
 */
export async function teamRecipients(payload: Payload, roles: Role[]): Promise<string[]> {
  const now = new Date().toISOString();
  const findWithRoles = async (wanted: Role[]) => {
    const { docs } = await payload.find({
      collection: "users",
      overrideAccess: true,
      depth: 0,
      limit: 50,
      pagination: false,
      select: { email: true },
      where: {
        and: [
          { roles: { in: wanted } },
          { active: { not_equals: false } },
          { or: [{ mandateEndsAt: { exists: false } }, { mandateEndsAt: { equals: null } }, { mandateEndsAt: { greater_than: now } }] },
        ],
      },
    });
    return docs.map((user) => user.email).filter(Boolean);
  };

  const settings = await payload.findGlobal({ slug: "site-settings", overrideAccess: true, depth: 0 });
  let people = await findWithRoles(roles);
  if (people.length === 0 && !roles.includes("admin")) people = await findWithRoles(["admin"]);

  const all = [settings.notificationEmail, ...people].filter((email): email is string => Boolean(email));
  return [...new Set(all.map((email) => email.toLowerCase()))];
}

/**
 * Lance l'envoi APRÈS la réponse (fonction `after` de Next.js) : le visiteur ou
 * le membre de l'équipe n'attend pas le serveur d'email. Hors d'une requête
 * Next.js (script, import), la tâche est simplement lancée en arrière-plan.
 */
export function sendLater(task: () => Promise<void>) {
  try {
    after(task);
  } catch {
    void task();
  }
}

/**
 * Dates « au jour près », à l'heure de Bangui (UTC+1), quelle que soit l'heure du serveur.
 * Les dates saisies dans le back-office sont des jours (sans heure).
 */

const TIME_ZONE = "Africa/Bangui";

/** « 2026-11-15 » : le jour calendaire à Bangui (comparable comme du texte). */
export function banguiDay(date: Date | string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

/** « 15 novembre » (ou « 27 janvier 2027 » si ce n'est pas l'année en cours). */
export function formatDay(date: Date | string, now: Date = new Date()): string {
  const sameYear = banguiDay(date).slice(0, 4) === banguiDay(now).slice(0, 4);
  return new Date(date).toLocaleDateString("fr-FR", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

export type PeriodState = "upcoming" | "current" | "ended";

/** Avant le jour de début : à venir. Jusqu'au jour de fin inclus : en cours. Ensuite : terminé. */
export function periodState(
  start: Date | string | null | undefined,
  end: Date | string | null | undefined,
  now: Date = new Date(),
): PeriodState {
  const today = banguiDay(now);
  if (start && today < banguiDay(start)) return "upcoming";
  if (end && today > banguiDay(end)) return "ended";
  return "current";
}

/** Nombre de jours écoulés depuis une date (0 le jour même). */
export function daysSince(date: Date | string, now: Date = new Date()): number {
  const a = Date.parse(banguiDay(date));
  const b = Date.parse(banguiDay(now));
  return Math.round((b - a) / 86_400_000);
}

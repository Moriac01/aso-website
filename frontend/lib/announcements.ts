import { daysSince, formatDay, periodState, type PeriodState } from "@/lib/dates";
import type { AnnouncementItem } from "@/server/content/actions";

/** Durée pendant laquelle une annonce terminée reste affichée avec son compte rendu. */
export const REPORT_DAYS = 30;

export type AnnouncementView = {
  item: AnnouncementItem;
  state: PeriodState;
  /** « En cours · jusqu'au 15 novembre », « À partir du 30 novembre », « Terminé ». */
  badge: string;
  /** Bouton de la carte (compte rendu si terminé). */
  action: { href: string; label: string } | null;
};

export function viewAnnouncement(item: AnnouncementItem, now: Date = new Date()): AnnouncementView {
  const state = periodState(item.startDate, item.endDate, now);

  const badge =
    state === "upcoming"
      ? `À partir du ${formatDay(item.startDate, now)}`
      : state === "current"
        ? item.endDate
          ? `En cours · jusqu’au ${formatDay(item.endDate, now)}`
          : "En cours"
        : "Terminé";

  let action: AnnouncementView["action"] = null;
  if (state === "ended") {
    action = item.report ? { href: item.report.href, label: "Lire le compte rendu" } : null;
  } else if (item.button.href) {
    const label = state === "upcoming" && item.button.labelBeforeStart ? item.button.labelBeforeStart : item.button.label;
    action = { href: item.button.href, label };
  }

  return { item, state, badge, action };
}

/**
 * Annonces à montrer sur la page Actions : en cours d'abord, puis à venir,
 * puis les terminées qui ont un compte rendu (pendant un mois).
 */
export function visibleAnnouncements(items: AnnouncementItem[], now: Date = new Date()): AnnouncementView[] {
  const order: Record<PeriodState, number> = { current: 0, upcoming: 1, ended: 2 };
  return items
    .map((item) => viewAnnouncement(item, now))
    .filter(
      (view) =>
        view.state !== "ended" ||
        (view.item.report !== null && view.item.endDate !== null && daysSince(view.item.endDate, now) <= REPORT_DAYS),
    )
    .sort((a, b) => order[a.state] - order[b.state] || a.item.startDate.localeCompare(b.item.startDate));
}

/** Annonce en cours à signaler en bandeau sur l'accueil (la première qui le demande). */
export function homeBanner(items: AnnouncementItem[], now: Date = new Date()): AnnouncementView | null {
  return (
    items
      .map((item) => viewAnnouncement(item, now))
      .find((view) => view.state === "current" && view.item.banner.show && view.action !== null) ?? null
  );
}

/** Lien « mailto: » avec objet et début de message pré-remplis. */
export function mailtoHref(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

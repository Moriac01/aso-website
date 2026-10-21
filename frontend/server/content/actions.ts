import { unstable_cache } from "next/cache";

import type { Announcement, Media, News } from "@/server/payload/payload-types";

import { ACTIONS_DEFAULTS, MEMBERSHIP_DEFAULTS, type FallbackChoice } from "./actions-defaults";
import { CACHE_SECONDS, CACHE_TAGS, getPayloadClient, mediaAlt, mediaUrl, withFallback } from "./client";

const text = (value: string | null | undefined, fallback: string) => value?.trim() || fallback;
const list = (items: { text?: string | null }[] | null | undefined) =>
  (items ?? []).map((item) => item.text?.trim() ?? "").filter(Boolean);

/* ------------------------------------------------------------------ Page Actions */

export type Program = {
  title: string;
  text: string;
  points: string[];
  image: { src: string; alt: string } | null;
  badge: string | null;
};

export type ActionsContent = {
  hero: { title: string; intro: string };
  programsTitle: string;
  programs: Program[];
  announcementsSection: { title: string; intro: string };
  fallback: {
    choice: FallbackChoice;
    news: { title: string; intro: string };
    method: { title: string; intro: string; steps: { title: string; text: string }[] };
    join: { title: string; intro: string };
  };
  donation: { title: string; text: string };
  callToAction: { title: string; text: string };
  seo: { title: string; description: string };
};

const d = ACTIONS_DEFAULTS;

export const DEFAULT_ACTIONS: ActionsContent = {
  hero: d.hero,
  programsTitle: d.programsTitle,
  programs: d.programs.map((program) => ({ ...program, badge: null })),
  announcementsSection: d.announcements,
  fallback: d.fallback,
  donation: d.donation,
  callToAction: d.callToAction,
  seo: d.seo,
};

const loadActions = unstable_cache(
  async (): Promise<ActionsContent> => {
    const payload = await getPayloadClient();
    const page = await payload.findGlobal({ slug: "actions-page", depth: 1, overrideAccess: false });

    // Enregistré au moins une fois : la liste du back-office fait foi (même vide de programmes visibles).
    const saved = Array.isArray(page.programs) && page.updatedAt;
    const programs = saved
      ? (page.programs ?? []).flatMap((program, index): Program[] => {
          if (program.visible === false) return [];
          const src = mediaUrl(program.image, "card");
          return [
            {
              title: program.title,
              text: program.text,
              points: list(program.points),
              // Sans photo choisie : celle du site à la même position, sinon une illustration.
              image: src ? { src, alt: mediaAlt(program.image, program.title) } : (d.programs[index]?.image ?? null),
              badge: program.badge?.trim() || null,
            },
          ];
        })
      : DEFAULT_ACTIONS.programs;

    const f = page.fallback;
    const steps = (f?.methodSteps ?? []).map(({ title, text: body }) => ({ title, text: body }));

    return {
      hero: { title: text(page.hero?.title, d.hero.title), intro: text(page.hero?.intro, d.hero.intro) },
      programsTitle: text(page.programsTitle, d.programsTitle),
      programs,
      announcementsSection: {
        title: text(page.announcementsSection?.title, d.announcements.title),
        intro: text(page.announcementsSection?.intro, d.announcements.intro),
      },
      fallback: {
        choice: (f?.choice as FallbackChoice | null | undefined) ?? d.fallback.choice,
        news: { title: text(f?.newsTitle, d.fallback.news.title), intro: text(f?.newsIntro, d.fallback.news.intro) },
        method: {
          title: text(f?.methodTitle, d.fallback.method.title),
          intro: text(f?.methodIntro, d.fallback.method.intro),
          steps: steps.length > 0 ? steps : d.fallback.method.steps,
        },
        join: { title: text(f?.joinTitle, d.fallback.join.title), intro: text(f?.joinIntro, d.fallback.join.intro) },
      },
      donation: { title: text(page.donation?.title, d.donation.title), text: text(page.donation?.text, d.donation.text) },
      callToAction: {
        title: text(page.callToAction?.title, d.callToAction.title),
        text: text(page.callToAction?.text, d.callToAction.text),
      },
      seo: { title: text(page.seo?.title, d.seo.title), description: text(page.seo?.description, d.seo.description) },
    };
  },
  ["cms-actions"],
  { tags: [CACHE_TAGS.actions], revalidate: CACHE_SECONDS },
);

export const getActionsContent = () => withFallback("page Actions", DEFAULT_ACTIONS, loadActions);

/* ------------------------------------------------------------------ Annonces */

export type AnnouncementItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  kind: Announcement["kind"];
  startDate: string;
  endDate: string | null;
  button: { href: string | null; label: string; labelBeforeStart: string | null };
  banner: { show: boolean; text: string };
  report: { href: string } | null;
  details: {
    intro: string | null;
    posters: { src: string; alt: string }[];
    positions: { title: string; text: string | null }[];
    profile: string[];
    benefits: string[];
    apply: {
      method: "email" | "link" | "volunteerForm" | "none";
      email: string | null;
      subjectPrefix: string;
      url: string | null;
      instructions: string | null;
    };
  };
};

function buttonHref(doc: Announcement): string | null {
  const action = doc.button?.action ?? "details";
  if (action === "none") return null;
  if (action === "link") return doc.button?.url?.trim() || null;
  return doc.slug ? `/annonces/${doc.slug}` : null;
}

function reportHref(report: Announcement["report"]): { href: string } | null {
  if (!report || typeof report === "number") return null;
  const news = report as News;
  return news._status === "published" && news.slug ? { href: `/news/${news.slug}` } : null;
}

function toItem(doc: Announcement): AnnouncementItem {
  const details = doc.details;
  const posters = (details?.posters ?? []).flatMap((poster) => {
    const src = mediaUrl(poster as Media | number, "hero");
    return src ? [{ src, alt: mediaAlt(poster as Media | number, doc.title) }] : [];
  });
  return {
    id: String(doc.id),
    slug: doc.slug ?? String(doc.id),
    title: doc.title,
    summary: doc.summary,
    kind: doc.kind,
    startDate: doc.startDate,
    endDate: doc.endDate ?? null,
    button: {
      href: buttonHref(doc),
      label: doc.button?.label?.trim() || "En savoir plus",
      labelBeforeStart: doc.button?.labelBeforeStart?.trim() || null,
    },
    banner: { show: Boolean(doc.banner?.show), text: doc.banner?.text?.trim() || doc.title },
    report: reportHref(doc.report),
    details: {
      intro: details?.intro?.trim() || null,
      posters,
      positions: (details?.positions ?? []).map(({ title, text: body }) => ({ title, text: body?.trim() || null })),
      profile: list(details?.profile),
      benefits: list(details?.benefits),
      apply: {
        method: details?.apply?.method ?? "email",
        email: details?.apply?.email?.trim() || null,
        subjectPrefix: details?.apply?.subjectPrefix?.trim() || "Candidature",
        url: details?.apply?.url?.trim() || null,
        instructions: details?.apply?.instructions?.trim() || null,
      },
    },
  };
}

/** Annonces visibles, des plus récentes aux plus anciennes. Le tri par état se fait à l'affichage (selon la date du jour). */
const loadAnnouncements = unstable_cache(
  async (): Promise<AnnouncementItem[]> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "announcements",
      where: { visible: { equals: true } },
      sort: "startDate",
      limit: 50,
      depth: 1,
      overrideAccess: false,
    });
    return docs.map(toItem);
  },
  ["cms-announcements"],
  { tags: [CACHE_TAGS.announcements, CACHE_TAGS.news], revalidate: CACHE_SECONDS },
);

export const getAnnouncements = () => withFallback("annonces", [], loadAnnouncements);

export const getAnnouncementBySlug = async (slug: string) =>
  (await getAnnouncements()).find((item) => item.slug === slug);

/* ------------------------------------------------------------------ Adhésion */

export type MembershipInfo = {
  formUrl: string | null;
  openingDate: string | null;
  closingDate: string | null;
  title: string;
  intro: string;
  notifyMessage: string;
};

const DEFAULT_MEMBERSHIP: MembershipInfo = {
  formUrl: null,
  openingDate: MEMBERSHIP_DEFAULTS.openingDate,
  closingDate: null,
  title: MEMBERSHIP_DEFAULTS.title,
  intro: MEMBERSHIP_DEFAULTS.intro,
  notifyMessage: MEMBERSHIP_DEFAULTS.notifyMessage,
};

const loadMembership = unstable_cache(
  async (): Promise<MembershipInfo> => {
    const payload = await getPayloadClient();
    const m = await payload.findGlobal({ slug: "membership", overrideAccess: false });
    return {
      formUrl: m.formUrl?.trim() || null,
      // Jamais enregistré : la date d'ouverture de la campagne.
      openingDate: m.updatedAt ? (m.openingDate ?? null) : MEMBERSHIP_DEFAULTS.openingDate,
      closingDate: m.closingDate ?? null,
      title: text(m.title, MEMBERSHIP_DEFAULTS.title),
      intro: text(m.intro, MEMBERSHIP_DEFAULTS.intro),
      notifyMessage: text(m.notifyMessage, MEMBERSHIP_DEFAULTS.notifyMessage),
    };
  },
  ["cms-membership"],
  { tags: [CACHE_TAGS.membership], revalidate: CACHE_SECONDS },
);

export const getMembership = () => withFallback("adhésion", DEFAULT_MEMBERSHIP, loadMembership);

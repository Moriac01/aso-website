import { unstable_cache } from "next/cache";

import { HOME_DEFAULTS } from "./home-defaults";
import { CACHE_SECONDS, CACHE_TAGS, getPayloadClient, mediaAlt, mediaUrl, withFallback } from "./client";

export type HomePillar = {
  title: string;
  text: string;
  image: { src: string; alt: string } | null;
  badge: string | null;
};

export type HomeContent = {
  hero: { title: string; subtitle: string; image: { src: string; alt: string }; caption: string };
  story: string;
  pillarsTitle: string;
  pillars: HomePillar[];
  approach: { title: string; text: string; cards: { label: string; text: string }[] };
  callToAction: { title: string; text: string };
};

/** Texte saisi, ou à défaut le texte d'origine du site. */
const text = (value: string | null | undefined, fallback: string) => value?.trim() || fallback;

const DEFAULT_CONTENT: HomeContent = {
  ...HOME_DEFAULTS,
  pillars: HOME_DEFAULTS.pillars.map((pillar) => ({ ...pillar, badge: null })),
};

/** Page d'accueil — Contenu → Page d'accueil. Tout champ vide garde le texte d'origine. */
const loadHome = unstable_cache(
  async (): Promise<HomeContent> => {
    const payload = await getPayloadClient();
    const page = await payload.findGlobal({ slug: "home-page", depth: 1, overrideAccess: false });
    const d = HOME_DEFAULTS;

    const heroImage = mediaUrl(page.hero?.image, "hero");
    const pillars = (page.pillars ?? []).map((pillar, index): HomePillar => {
      const src = mediaUrl(pillar.image, "card");
      return {
        title: pillar.title,
        text: pillar.text,
        // Sans photo choisie : celle du site à la même position, sinon une illustration.
        image: src ? { src, alt: mediaAlt(pillar.image, pillar.title) } : (d.pillars[index]?.image ?? null),
        badge: pillar.badge?.trim() || null,
      };
    });
    const cards = (page.approach?.cards ?? []).map(({ label, text: body }) => ({ label, text: body }));

    return {
      hero: {
        title: text(page.hero?.title, d.hero.title),
        subtitle: text(page.hero?.subtitle, d.hero.subtitle),
        image: heroImage ? { src: heroImage, alt: mediaAlt(page.hero?.image, d.hero.image.alt) } : d.hero.image,
        caption: text(page.hero?.caption, d.hero.caption),
      },
      story: text(page.story, d.story),
      pillarsTitle: text(page.pillarsTitle, d.pillarsTitle),
      pillars: pillars.length > 0 ? pillars : DEFAULT_CONTENT.pillars,
      approach: {
        title: text(page.approach?.title, d.approach.title),
        text: text(page.approach?.text, d.approach.text),
        cards: cards.length > 0 ? cards : d.approach.cards,
      },
      callToAction: {
        title: text(page.callToAction?.title, d.callToAction.title),
        text: text(page.callToAction?.text, d.callToAction.text),
      },
    };
  },
  ["cms-home"],
  { tags: [CACHE_TAGS.home], revalidate: CACHE_SECONDS },
);

export const getHomeContent = () => withFallback("page d'accueil", DEFAULT_CONTENT, loadHome);

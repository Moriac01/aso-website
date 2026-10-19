import config from "@payload-config";
import { getPayload } from "payload";

import type { Media } from "@/server/payload/payload-types";

/** Client Payload (API locale : pas d'appel HTTP, accès direct à la base). */
export const getPayloadClient = () => getPayload({ config });

export { CACHE_TAGS } from "./tags";

/** Délai maximal avant rafraîchissement automatique (filet de sécurité). */
export const CACHE_SECONDS = 3600;

/**
 * Le site doit rester affichable même si la base est injoignable
 * (coupure réseau, variables d'environnement absentes en local…) :
 * on journalise l'erreur et on renvoie une valeur vide.
 */
export async function withFallback<T>(label: string, fallback: T, load: () => Promise<T>): Promise<T> {
  try {
    return await load();
  } catch (error) {
    console.error(`[contenu] ${label} indisponible :`, error instanceof Error ? error.message : error);
    return fallback;
  }
}

const siteOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_SERVER_URL ? new URL(process.env.NEXT_PUBLIC_SERVER_URL).origin : "";
  } catch {
    return "";
  }
})();

/** URL relative quand le fichier est servi par ce site (compatible next/image). */
export function localUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return siteOrigin && url.startsWith(siteOrigin) ? url.slice(siteOrigin.length) : url;
}

/** URL d'une image du back-office, relative quand elle est servie par ce site (compatible next/image). */
export function mediaUrl(
  media: number | Media | null | undefined,
  size?: keyof NonNullable<Media["sizes"]>,
): string | null {
  if (!media || typeof media === "number") return null;
  return localUrl((size && media.sizes?.[size]?.url) || media.url);
}

export function mediaAlt(media: number | Media | null | undefined, fallback: string): string {
  return media && typeof media !== "number" && media.alt ? media.alt : fallback;
}

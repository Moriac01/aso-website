import { unstable_cache } from "next/cache";

import type { Person } from "@/app/(site)/about/data";
import type { Media } from "@/server/payload/payload-types";

import { CACHE_SECONDS, CACHE_TAGS, getPayloadClient, mediaUrl, withFallback } from "./client";

/**
 * Cadrage du portrait dans le cadre 4:5.
 * Point focal laissé au centre (réglage par défaut) : on vise le haut de la photo,
 * où se trouve presque toujours le visage. Sinon, on suit le point choisi dans le back-office.
 */
function photoPosition(media: number | Media | null | undefined): string | undefined {
  if (!media || typeof media === "number") return undefined;
  const x = media.focalX ?? 50;
  const y = media.focalY ?? 50;
  if (x === 50 && y === 50) return "50% 30%";
  return `${x}% ${y}%`;
}

const loadTeam = unstable_cache(
  async (): Promise<Person[]> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "team-members",
      sort: "order",
      limit: 100,
      depth: 1,
      overrideAccess: false,
    });
    return docs.map((doc) => ({
      id: String(doc.id),
      name: doc.name,
      role: doc.role,
      type: doc.type,
      description: doc.description ?? undefined,
      // Taille « hero » : photo entière (non recadrée), assez grande pour le profil ouvert.
      // Sans photo : les initiales du membre s'affichent (plus de logo répété).
      photo: mediaUrl(doc.photo, "hero") ?? undefined,
      photoPosition: photoPosition(doc.photo),
    }));
  },
  ["cms-team-v2"],
  { tags: [CACHE_TAGS.team], revalidate: CACHE_SECONDS },
);

export const getTeam = () => withFallback("équipe", [], loadTeam);

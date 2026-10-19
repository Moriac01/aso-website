import { unstable_cache } from "next/cache";

import type { Person } from "@/app/(site)/about/data";

import { CACHE_SECONDS, CACHE_TAGS, getPayloadClient, mediaUrl, withFallback } from "./client";

/** Sans photo : logo de l'ASO (jamais une photo de terrain à la place d'un portrait). */
const FALLBACK_PHOTO = "/icon.png";

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
      photo: mediaUrl(doc.photo, "card") ?? FALLBACK_PHOTO,
    }));
  },
  ["cms-team"],
  { tags: [CACHE_TAGS.team], revalidate: CACHE_SECONDS },
);

export const getTeam = () => withFallback("équipe", [], loadTeam);

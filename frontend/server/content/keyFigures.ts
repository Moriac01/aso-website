import { unstable_cache } from "next/cache";

import { CACHE_SECONDS, CACHE_TAGS, getPayloadClient, withFallback } from "./client";

export type KeyFigure = { label: string; value: number; suffix: string };

const loadKeyFigures = unstable_cache(
  async (): Promise<KeyFigure[]> => {
    const payload = await getPayloadClient();
    const global = await payload.findGlobal({ slug: "key-figures", overrideAccess: false });
    return (global.items ?? []).map((item) => ({
      label: item.label,
      value: item.value,
      suffix: item.suffix ?? "",
    }));
  },
  ["cms-key-figures"],
  { tags: [CACHE_TAGS.keyFigures], revalidate: CACHE_SECONDS },
);

export const getKeyFigures = () => withFallback("chiffres clés", [], loadKeyFigures);

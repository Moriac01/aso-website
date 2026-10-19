import { unstable_cache } from "next/cache";

import { CACHE_SECONDS, CACHE_TAGS, getPayloadClient, withFallback } from "./client";

export type DonationMethod = {
  label: string;
  kind: "mobile-money" | "bank" | "other";
  accountName: string | null;
  accountNumber: string | null;
  instructions: string | null;
};

/** Moyens de don actifs, tels que saisis par la Trésorerie. */
const loadMethods = unstable_cache(
  async (): Promise<DonationMethod[]> => {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({ slug: "donation-settings", overrideAccess: false });
    return (settings.methods ?? [])
      .filter((method) => method.active && method.accountNumber)
      .map((method) => ({
        label: method.label,
        kind: method.kind,
        accountName: method.accountName ?? null,
        accountNumber: method.accountNumber ?? null,
        instructions: method.instructions ?? null,
      }));
  },
  ["cms-donation-methods"],
  { tags: [CACHE_TAGS.donation], revalidate: CACHE_SECONDS },
);

export const getDonationMethods = () => withFallback("moyens de don", [], loadMethods);

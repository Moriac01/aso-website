import { unstable_cache } from "next/cache";

import { buildSocials, EMPTY_CONTACT, type ContactInfo } from "@/lib/contact";

import { CACHE_SECONDS, CACHE_TAGS, getPayloadClient, withFallback } from "./client";

const clean = (value: string | null | undefined) => value?.trim() || null;

/** Coordonnées publiques (page Contact, pied de page) — Administration → Coordonnées & réseaux. */
const loadContact = unstable_cache(
  async (): Promise<ContactInfo> => {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({ slug: "site-settings", overrideAccess: false });
    return {
      email: clean(settings.publicEmail),
      phone: clean(settings.phone),
      address: clean(settings.address) ?? clean(settings.legal?.headOffice),
      socials: buildSocials(settings.socials ?? {}),
    };
  },
  ["cms-contact"],
  { tags: [CACHE_TAGS.settings], revalidate: CACHE_SECONDS },
);

export const getContactInfo = () => withFallback("coordonnées", EMPTY_CONTACT, loadContact);

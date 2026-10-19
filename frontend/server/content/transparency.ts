import { unstable_cache } from "next/cache";

import { CACHE_SECONDS, CACHE_TAGS, getPayloadClient, localUrl, withFallback } from "./client";

export type PublishedReport = {
  id: string;
  title: string;
  year: number;
  period: string | null;
  summary: string | null;
  fileUrl: string | null;
  fileSize: number | null;
  auditedBy: string | null;
  auditedAt: string | null;
};

export type LegalInfo = {
  legalName: string | null;
  registrationNumber: string | null;
  registrationDate: string | null;
  registrationAuthority: string | null;
  headOffice: string | null;
};

/** Rapports publiés — donc visés par le Commissaire aux comptes (règle imposée par le back-office). */
const loadReports = unstable_cache(
  async (): Promise<PublishedReport[]> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "financial-reports",
      where: { and: [{ published: { equals: true } }, { auditApproved: { equals: true } }] },
      sort: "-year",
      limit: 50,
      overrideAccess: false,
    });
    return docs.map((doc) => ({
      id: String(doc.id),
      title: doc.title,
      year: doc.year,
      period: doc.period ?? null,
      summary: doc.summary ?? null,
      fileUrl: localUrl(doc.url),
      fileSize: doc.filesize ?? null,
      auditedBy: doc.auditedBy ?? null,
      auditedAt: doc.auditedAt ?? null,
    }));
  },
  ["cms-reports-published"],
  { tags: [CACHE_TAGS.reports], revalidate: CACHE_SECONDS },
);

const loadLegal = unstable_cache(
  async (): Promise<LegalInfo> => {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({ slug: "site-settings", overrideAccess: false });
    const legal = settings.legal ?? {};
    return {
      legalName: legal.legalName ?? null,
      registrationNumber: legal.registrationNumber ?? null,
      registrationDate: legal.registrationDate ?? null,
      registrationAuthority: legal.registrationAuthority ?? null,
      headOffice: legal.headOffice ?? null,
    };
  },
  ["cms-legal"],
  { tags: [CACHE_TAGS.settings], revalidate: CACHE_SECONDS },
);

const EMPTY_LEGAL: LegalInfo = {
  legalName: null,
  registrationNumber: null,
  registrationDate: null,
  registrationAuthority: null,
  headOffice: null,
};

export const getPublishedReports = () => withFallback("rapports financiers", [], loadReports);
export const getLegalInfo = () => withFallback("identité légale", EMPTY_LEGAL, loadLegal);

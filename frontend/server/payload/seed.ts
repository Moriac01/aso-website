/**
 * Contenu initial du back-office : reprend le contenu actuel du site
 * (actualités, équipe) et les chiffres clés de l'ASO.
 *
 *   bun run seed
 *
 * Sans risque : chaque partie n'est importée que si elle est encore vide.
 * Tout reste modifiable ensuite dans /admin.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getPayload } from "payload";

import { people } from "../../app/(site)/about/data";
import { news as legacyNews } from "../../data/news";
import config from "../../payload.config";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(dirname, "../../public");

/** Import initial : pas d’invalidation de cache (hors serveur Next.js) ni d’entrées au journal. */
const context = { skipRevalidate: true, skipAudit: true };

const categoryMap: Record<string, string> = {
  Éducation: "education",
  Santé: "sante",
  Communauté: "communaute",
  Accompagnement: "psychosocial",
  Projets: "projets",
};

/** Texte simple (paragraphes séparés par une ligne vide) → format de l'éditeur riche. */
function toRichText(text: string) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: text.split("\n\n").map((paragraph) => ({
        type: "paragraph",
        format: "" as const,
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        textFormat: 0,
        textStyle: "",
        children: [
          { type: "text", detail: 0, format: 0, mode: "normal", style: "", text: paragraph, version: 1 },
        ],
      })),
    },
  };
}

const payload = await getPayload({ config });
const log = (message: string) => payload.logger.info(`[seed] ${message}`);

// 1. Chiffres clés — valeurs issues de la présentation de l'ASO.
const keyFigures = await payload.findGlobal({ slug: "key-figures" });
if (!keyFigures.items?.length) {
  await payload.updateGlobal({
    slug: "key-figures",
    context,
    data: {
      items: [
        { value: 10, suffix: "", label: "Orphelins pris en charge", source: "Présentation ASO" },
        { value: 90, suffix: "%", label: "De réussite scolaire", source: "Présentation ASO" },
        { value: 5, suffix: "", label: "Mères veuves accompagnées (PAEMV)", source: "Projet PAEMV" },
      ],
    },
  });
  log("Chiffres clés importés.");
} else {
  log("Chiffres clés déjà renseignés : ignorés.");
}

// Identité légale — d'après le PV de l'Assemblée Générale du 24/01/2026.
const settings = await payload.findGlobal({ slug: "site-settings" });
if (!settings.legal?.registrationNumber) {
  await payload.updateGlobal({
    slug: "site-settings",
    context,
    data: {
      legal: {
        legalName: "Association Soutien aux Orphelins (ASO)",
        registrationNumber: "283/MATDDL/DIRCAB/DGAT/DAPSE/SASE",
        registrationDate: "2025-09-12",
        registrationAuthority:
          "Ministère de l’Administration du Territoire, de la Décentralisation et du Développement local",
        headOffice: "Bangui, République centrafricaine",
      },
    },
  });
  log("Identité légale importée.");
} else {
  log("Identité légale déjà renseignée : ignorée.");
}

// Directeur de la publication (mentions légales) — le Chargé de communication.
const legalNow = (await payload.findGlobal({ slug: "site-settings" })).legal;
if (!legalNow?.publicationDirector) {
  await payload.updateGlobal({
    slug: "site-settings",
    context,
    data: { legal: { ...legalNow, publicationDirector: "Moriac KPANGAM, Chargé de communication (par intérim)" } },
  });
  log("Directeur de la publication renseigné.");
}

// Moyens de don — Orange Money prévu, à compléter et activer par la Trésorerie.
const donation = await payload.findGlobal({ slug: "donation-settings" });
if (!donation.methods?.length) {
  await payload.updateGlobal({
    slug: "donation-settings",
    context,
    data: {
      methods: [
        {
          label: "Orange Money",
          kind: "mobile-money",
          accountName: "Association Soutien aux Orphelins",
          accountNumber: "",
          instructions:
            "Faites un transfert vers ce numéro depuis votre compte Orange Money, puis notez la référence indiquée dans le SMS de confirmation.",
          active: false,
        },
      ],
    },
  });
  log("Moyens de don préparés (Orange Money à compléter et activer dans /admin).");
}

// 2. Actualités — avec leurs images.
const { totalDocs: newsCount } = await payload.count({ collection: "news" });
if (newsCount === 0) {
  const mediaByFile = new Map<string, number>();
  for (const item of legacyNews) {
    let mediaId = mediaByFile.get(item.image);
    if (!mediaId) {
      const media = await payload.create({
        collection: "media",
        context,
        data: { alt: item.title },
        filePath: path.join(publicDir, item.image),
      });
      mediaId = media.id;
      mediaByFile.set(item.image, mediaId);
    }

    await payload.create({
      collection: "news",
      context,
      draft: item.status === "draft",
      data: {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: toRichText(item.content),
        image: mediaId,
        category: (categoryMap[item.category] ?? "projets") as "projets",
        publishedAt: item.publishedAt,
        featured: Boolean(item.featured),
        _status: item.status === "published" ? "published" : "draft",
      },
    });
  }
  log(`${legacyNews.length} actualités importées.`);
} else {
  log("Des actualités existent déjà : ignorées.");
}

// 3. Équipe — sans photo (les photos de terrain ne doivent pas servir de portraits).
const { totalDocs: teamCount } = await payload.count({ collection: "team-members" });
if (teamCount === 0) {
  for (const [index, person] of people.entries()) {
    await payload.create({
      collection: "team-members",
      context,
      data: {
        name: person.id === "president" ? "Emmanuel MADOUKOU" : person.name,
        role: person.role,
        type: person.type,
        description: person.description,
        order: (index + 1) * 10,
      },
    });
  }
  log(`${people.length} membres de l'équipe importés (à compléter dans /admin → Équipe).`);
} else {
  log("L'équipe existe déjà : ignorée.");
}

log("Terminé.");
process.exit(0);

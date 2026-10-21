import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Building2, Copyright, ExternalLink, Flag, PenLine, Server } from "lucide-react";

import { ContactLine, InfoList, LegalLayout, type LegalSection } from "@/components/legal/LegalLayout";
import { getLegalInfo } from "@/server/content/transparency";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Mentions légales — ASO",
  description:
    "Éditeur, directeur de la publication, hébergement et propriété intellectuelle du site de l’Association Soutien aux Orphelins (ASO).",
};

const UPDATED_AT = "16 octobre 2026";

const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Bangui" }) : null;

const linkClass = "font-semibold text-[#0a67d0] hover:text-[#08529f]";

export default async function LegalNoticePage() {
  const legal = await getLegalInfo();
  const name = legal.legalName ?? "Association Soutien aux Orphelins (ASO)";
  const agrement = [
    legal.registrationNumber ? `N° ${legal.registrationNumber}` : null,
    formatDate(legal.registrationDate) ? `du ${formatDate(legal.registrationDate)}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const editorItems: [string, ReactNode][] = [["Nom", name]];
  if (agrement) editorItems.push(["Agrément", agrement]);
  if (legal.registrationAuthority) editorItems.push(["Délivré par", legal.registrationAuthority]);
  editorItems.push(["Siège social", legal.headOffice ?? "Bangui, République centrafricaine"]);
  if (legal.address) editorItems.push(["Adresse", legal.address]);
  if (legal.phone) editorItems.push(["Téléphone", legal.phone]);
  if (legal.publicEmail) {
    editorItems.push([
      "Email",
      <a key="email" href={`mailto:${legal.publicEmail}`} className={linkClass}>
        {legal.publicEmail}
      </a>,
    ]);
  }

  const sections: LegalSection[] = [
    {
      id: "editeur",
      title: "Éditeur du site",
      icon: Building2,
      content: (
        <>
          <p>Ce site est édité par une association à but non lucratif de droit centrafricain.</p>
          <InfoList items={editorItems} />
        </>
      ),
    },
    {
      id: "publication",
      title: "Directeur de la publication",
      icon: PenLine,
      content: (
        <>
          <p>
            Le directeur de la publication est responsable des contenus publiés sur ce site, au nom du
            Bureau exécutif de l’ASO.
          </p>
          <InfoList items={[["Directeur de la publication", legal.publicationDirector ?? "Le Chargé de communication de l’ASO"]]} />
          <p>
            Le site est conçu et entretenu bénévolement par des membres du Bureau exécutif de
            l’association.
          </p>
        </>
      ),
    },
    {
      id: "hebergement",
      title: "Hébergement",
      icon: Server,
      content: (
        <>
          <InfoList
            items={[
              ["Hébergeur du site", "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com"],
              ["Base de données", "Neon (service de base de données PostgreSQL) — neon.com"],
              ["Envoi des emails", "Google (Gmail) — google.com"],
            ]}
          />
          <p>
            Les données personnelles confiées via ce site sont donc stockées sur des serveurs situés hors de
            la République centrafricaine. Leur traitement est décrit dans notre{" "}
            <Link href="/confidentialite" className={linkClass}>
              politique de confidentialité
            </Link>
            .
          </p>
        </>
      ),
    },
    {
      id: "propriete",
      title: "Propriété intellectuelle",
      icon: Copyright,
      content: (
        <>
          <p>
            Le nom, le logo, les textes et les photos de ce site appartiennent à l’ASO ou sont utilisés avec
            l’autorisation de leurs auteurs. Toute reproduction, même partielle, nécessite l’accord écrit de
            l’association.
          </p>
          <p>
            Vous pouvez citer de courts extraits de nos textes, notamment pour parler de nos actions, à
            condition d’indiquer clairement la source (« Association Soutien aux Orphelins — ASO ») et un lien
            vers ce site.
          </p>
          <p>
            Les photos d’enfants ne sont publiées qu’avec l’accord de leur parent ou tuteur. Elles ne peuvent
            en aucun cas être reprises, même avec citation.
          </p>
        </>
      ),
    },
    {
      id: "liens",
      title: "Liens et responsabilité",
      icon: ExternalLink,
      content: (
        <>
          <p>
            L’ASO veille à l’exactitude des informations publiées : les chiffres clés sont vérifiés et les
            rapports financiers sont visés par notre Commissaire aux comptes avant publication. Une erreur reste
            toutefois possible : signalez-la-nous et nous la corrigerons rapidement.
          </p>
          <p>
            Les liens vers d’autres sites (réseaux sociaux, partenaires) sont fournis pour information. L’ASO
            n’est pas responsable de leur contenu.
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: "Signaler un contenu, nous contacter",
      icon: Flag,
      content: (
        <>
          <p>
            Pour signaler une erreur, demander le retrait d’une photo ou poser une question sur ce site,
            contactez-nous <ContactLine email={legal.publicEmail} />.
          </p>
          <p>Ce site et ses mentions légales sont soumis au droit de la République centrafricaine.</p>
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      eyebrow="Informations légales"
      title="Mentions légales"
      intro="Qui publie ce site, qui l’héberge, et comment nous joindre pour toute question sur son contenu."
      updatedAt={UPDATED_AT}
      sections={sections}
      related={{ label: "Politique de confidentialité →", href: "/confidentialite" }}
    />
  );
}

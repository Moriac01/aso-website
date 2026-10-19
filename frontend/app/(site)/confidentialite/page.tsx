import type { Metadata } from "next";
import Link from "next/link";
import {
  Baby,
  Clock,
  Cookie,
  Database,
  Globe,
  Lock,
  RefreshCw,
  Scale,
  Target,
  UserCheck,
  Users,
} from "lucide-react";

import { ContactLine, LegalLayout, type LegalSection } from "@/components/legal/LegalLayout";
import { getLegalInfo } from "@/server/content/transparency";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Politique de confidentialité — ASO",
  description:
    "Quelles données l’Association Soutien aux Orphelins collecte via son site, pourquoi, qui y a accès, combien de temps elles sont conservées et comment exercer vos droits.",
};

const UPDATED_AT = "16 octobre 2026";

const linkClass = "font-semibold text-[#0c7af8] hover:text-[#0a67d0]";

/** Tableau simple, lisible sur téléphone (les lignes deviennent des cartes). */
function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dfe7df]">
      <table className="w-full text-left text-sm">
        <thead className="hidden bg-[#f4f9f5] text-[#070707] sm:table-header-group">
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col" className="px-4 py-3 font-semibold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#dfe7df]">
          {rows.map((row) => (
            <tr key={row[0]} className="grid gap-1 px-4 py-3 sm:table-row sm:p-0">
              {row.map((cell, index) => (
                <td
                  key={head[index]}
                  className={`leading-6 [overflow-wrap:anywhere] sm:px-4 sm:py-3 sm:align-top ${index === 0 ? "font-semibold text-[#070707]" : "text-[#526057]"}`}
                >
                  <span className="mr-1 text-[#526057] sm:hidden">{index > 0 ? `${head[index]} :` : ""}</span>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function PrivacyPage() {
  const legal = await getLegalInfo();
  const name = legal.legalName ?? "Association Soutien aux Orphelins (ASO)";

  const sections: LegalSection[] = [
    {
      id: "responsable",
      title: "Qui est responsable de vos données",
      icon: Scale,
      content: (
        <>
          <p>
            Le responsable du traitement est l’<strong className="text-[#070707]">{name}</strong>
            {legal.registrationNumber ? `, association agréée sous le N° ${legal.registrationNumber}` : ""}, dont le
            siège est à {legal.headOffice ?? "Bangui, République centrafricaine"}.
          </p>
          <p>
            Nous appliquons la loi centrafricaine n° 24.001 portant protection des données à caractère
            personnel : nous ne collectons que ce qui est utile, nous l’utilisons seulement pour la raison
            annoncée, et vous gardez la main sur vos informations.
          </p>
          <p>
            Pour toute question sur vos données, contactez-nous <ContactLine email={legal.publicEmail} />.
          </p>
        </>
      ),
    },
    {
      id: "donnees",
      title: "Les données que nous recueillons",
      icon: Database,
      content: (
        <>
          <p>Uniquement ce que vous saisissez vous-même dans nos formulaires :</p>
          <Table
            head={["Formulaire", "Informations demandées"]}
            rows={[
              ["Contact", "Nom, email, téléphone (facultatif), sujet et message."],
              ["Adhésion", "Nom, prénom, email, téléphone, ville, profession et motivation."],
              ["Bénévolat", "Nom, prénom, email, téléphone, ville, compétences, disponibilités, type d’aide et message."],
              [
                "Déclaration de don",
                "Montant, moyen de paiement, référence de la transaction, projet soutenu, nom (ou «\u00a0anonyme\u00a0»), et si vous le souhaitez email, téléphone et message.",
              ],
            ]}
          />
          <p>
            Nous ne recevons jamais vos codes Orange Money ni vos coordonnées bancaires : le transfert se fait
            depuis votre téléphone ou votre banque, en dehors de ce site.
          </p>
          <p>
            Les membres du Bureau exécutif qui gèrent le site ont un compte personnel (nom, email, fonction). Leurs
            actions dans l’espace de gestion sont enregistrées dans un journal, pour la traçabilité.
          </p>
        </>
      ),
    },
    {
      id: "finalites",
      title: "Pourquoi nous les utilisons",
      icon: Target,
      content: (
        <>
          <ul className="list-disc space-y-2 pl-5">
            <li>Répondre à vos messages et à vos questions.</li>
            <li>Étudier votre demande d’adhésion et vous accueillir comme membre.</li>
            <li>Organiser votre engagement bénévole.</li>
            <li>
              Vérifier la réception de votre don, vous la confirmer, et l’inscrire dans notre comptabilité et nos
              rapports financiers.
            </li>
            <li>Vous envoyer les emails liés à votre demande (accusé de réception, confirmation de don).</li>
          </ul>
          <p>
            Nous utilisons vos données parce que vous y consentez en cochant la case prévue dans chaque formulaire,
            et, pour les dons, parce que la bonne tenue de nos comptes l’exige.
          </p>
          <p>
            Nous ne vendons, ne louons et n’échangeons jamais vos données. Nous ne les utilisons pas pour de la
            publicité, et nous ne vous inscrivons à aucune lettre d’information sans votre accord.
          </p>
        </>
      ),
    },
    {
      id: "acces",
      title: "Qui peut les consulter",
      icon: Users,
      content: (
        <>
          <p>
            Seuls les membres du Bureau exécutif dont la fonction l’exige, chacun avec un accès limité à ce qui le
            concerne :
          </p>
          <Table
            head={["Données", "Accessibles à"]}
            rows={[
              ["Messages de contact", "Secrétariat, Président, Commissaire aux comptes."],
              ["Adhésions et bénévolat", "Secrétariat, Mobilisation, Président, Commissaire aux comptes."],
              ["Dons", "Trésorerie, Président, Commissaire aux comptes."],
            ]}
          />
          <p>
            Les noms des donateurs ne sont jamais publiés sur le site. Nos rapports financiers publics présentent
            des montants, pas des personnes.
          </p>
        </>
      ),
    },
    {
      id: "conservation",
      title: "Combien de temps nous les gardons",
      icon: Clock,
      content: (
        <>
          <Table
            head={["Données", "Durée de conservation"]}
            rows={[
              ["Messages de contact", "5 ans après la réception du message."],
              ["Adhésions et bénévolat", "5 ans après la fin de votre engagement, ou après votre demande si elle n’a pas abouti."],
              ["Dons", "10 ans, durée de conservation des pièces comptables."],
              ["Comptes de gestion du site", "Désactivés à la fin du mandat de la personne."],
            ]}
          />
          <p>À l’issue de ces durées, les données sont supprimées ou rendues anonymes.</p>
        </>
      ),
    },
    {
      id: "hebergement",
      title: "Où elles sont stockées",
      icon: Globe,
      content: (
        <>
          <p>
            Le site est hébergé par Vercel, sa base de données par Neon, et nos emails sont envoyés par Google
            (Gmail). Ces services utilisent des serveurs situés hors de la République centrafricaine, notamment
            aux États-Unis ou dans l’Union européenne. En envoyant un formulaire, vous acceptez ce transfert, qui
            sert uniquement à faire fonctionner le site.
          </p>
          <p>
            Ces prestataires n’utilisent pas vos données pour leur propre compte. Le détail figure dans nos{" "}
            <Link href="/mentions-legales#hebergement" className={linkClass}>
              mentions légales
            </Link>
            .
          </p>
        </>
      ),
    },
    {
      id: "securite",
      title: "Comment nous les protégeons",
      icon: Lock,
      content: (
        <ul className="list-disc space-y-2 pl-5">
          <li>Connexion chiffrée (HTTPS) sur tout le site.</li>
          <li>Espace de gestion réservé aux membres du bureau, avec un compte personnel et un mot de passe protégé.</li>
          <li>Accès limité selon la fonction de chacun, comme décrit plus haut.</li>
          <li>Blocage automatique après plusieurs tentatives de connexion échouées.</li>
          <li>Journal de toutes les modifications, que personne ne peut effacer.</li>
        </ul>
      ),
    },
    {
      id: "droits",
      title: "Vos droits",
      icon: UserCheck,
      content: (
        <>
          <p>À tout moment, et gratuitement, vous pouvez nous demander :</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>de savoir quelles données nous avons sur vous et d’en recevoir une copie ;</li>
            <li>de corriger des informations inexactes ;</li>
            <li>de supprimer vos données, sauf celles que nous devons garder pour nos comptes (dons) ;</li>
            <li>de ne plus utiliser vos données, si vous retirez votre consentement.</li>
          </ul>
          <p>
            Écrivez-nous <ContactLine email={legal.publicEmail} />, en précisant le formulaire utilisé et, pour un
            don, sa référence (DON-…). Nous vous répondons dans un délai d’un mois au plus.
          </p>
          <p>
            Si notre réponse ne vous satisfait pas, vous pouvez vous adresser à l’autorité chargée de la protection
            des données à caractère personnel en République centrafricaine.
          </p>
        </>
      ),
    },
    {
      id: "enfants",
      title: "Protection des enfants",
      icon: Baby,
      content: (
        <>
          <p>
            Nos formulaires s’adressent aux adultes. Nous ne publions jamais d’information permettant d’identifier
            un enfant que nous accompagnons (nom complet, école, adresse).
          </p>
          <p>
            Une photo d’enfant n’est publiée qu’avec l’accord de son parent ou tuteur, qui peut en demander le
            retrait à tout moment. Pour un mineur, ce sont ses parents ou son tuteur qui exercent les droits
            décrits ci-dessus.
          </p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies",
      icon: Cookie,
      content: (
        <p>
          Ce site n’utilise ni cookie publicitaire, ni outil de mesure d’audience, ni bouton de partage qui vous
          suivrait. Les seuls cookies concernent les membres du bureau : ils gardent leur session et leurs préférences
          dans l’espace de gestion. Aucun bandeau de consentement n’est donc nécessaire.
        </p>
      ),
    },
    {
      id: "modifications",
      title: "Modifications de cette politique",
      icon: RefreshCw,
      content: (
        <p>
          Nous mettrons cette page à jour si nos pratiques évoluent, par exemple à l’ouverture du compte bancaire de
          l’association ou d’un paiement en ligne. La date de dernière mise à jour figure en haut de la page.
        </p>
      ),
    },
  ];

  return (
    <LegalLayout
      eyebrow="Vos données"
      title="Politique de confidentialité"
      intro="Les personnes qui nous écrivent, nous rejoignent ou nous soutiennent nous confient des informations. Voici, en clair, ce que nous en faisons."
      updatedAt={UPDATED_AT}
      sections={sections}
      related={{ label: "Mentions légales →", href: "/mentions-legales" }}
    />
  );
}

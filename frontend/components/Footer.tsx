import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";

import { formatPhone, phoneHref, type SocialNetwork } from "@/lib/contact";
import { getContactInfo } from "@/server/content/contact";
import { getLegalInfo } from "@/server/content/transparency";

const linkGroups: { title: string; links: [string, string][] }[] = [
  {
    title: "L'association",
    links: [
      ["À propos", "/about"],
      ["Nos actions", "/actions"],
      ["Actualités", "/news"],
      ["Transparence", "/transparence"],
    ],
  },
  {
    title: "Nous rejoindre",
    links: [
      ["Faire un don", "/donate"],
      ["Devenir membre ou bénévole", "/volunteers"],
      ["Nous contacter", "/contact"],
    ],
  },
];

const socialIcons: Record<SocialNetwork, LucideIcon> = {
  facebook: Globe,
  instagram: Globe,
  linkedin: Globe,
  whatsapp: MessageCircle,
};

const headingClass = "text-[13px] font-semibold uppercase tracking-[0.14em] text-[#17483b]";
// Sur téléphone, chaque lien fait 44 px de haut : facile à toucher du doigt.
const linkClass = "block py-3 text-[15px] text-[#3d5249] transition-colors hover:text-[#0a67d0] md:py-1.5";

const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Bangui" }) : null;

/**
 * Pied de page. Coordonnées, réseaux et identité légale : Administration → Coordonnées & réseaux
 * (ce qui est vide n'est pas affiché).
 */
const Footer = async () => {
  const [{ email, phone, address, socials }, legal] = await Promise.all([getContactInfo(), getLegalInfo()]);
  // « Association Soutien aux Orphelins (ASO) » : le sigle est ajouté une seule fois plus bas.
  const legalName = legal.legalName?.trim().replace(/\s*\(ASO\)$/i, "") || "Association Soutien aux Orphelins";
  const registrationNumber = legal.registrationNumber?.trim() || null;
  const registrationDate = formatDate(legal.registrationDate);

  const contacts: { icon: LucideIcon; label: string; href?: string; multiline?: boolean }[] = [
    ...(email ? [{ icon: Mail, label: email, href: `mailto:${email}` }] : []),
    ...(phone ? [{ icon: Phone, label: formatPhone(phone), href: phoneHref(phone) }] : []),
    ...(address ? [{ icon: MapPin, label: address, multiline: true }] : []),
  ];

  return (
    <footer className="border-t border-[#d9e0d5] bg-white text-[#17483b]">
      <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        <div className="grid gap-y-8 md:grid-cols-2 md:gap-x-10 lg:grid-cols-[1.45fr_1.6fr_1.25fr] lg:gap-12">
          {/* Identité */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/icon.png" alt="" width={52} height={45} className="h-[45px] w-[52px]" />
              <span className="text-lg font-bold leading-[1.25]">
                Association
                <br />
                Soutien aux Orphelins
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[15px] leading-6 text-[#526057]">
              Accompagner les enfants orphelins dans leur scolarité, leur santé et leur épanouissement,
              à Bangui et Bimbo.
            </p>
            <Link
              href="/donate"
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0c7af8] px-6 text-[15px] font-semibold text-white transition hover:bg-[#0a67d0] sm:w-auto"
            >
              Faire un don
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Liens */}
          <nav
            aria-label="Liens du pied de page"
            className="grid grid-cols-2 gap-x-4 border-t border-[#e6ece6] pt-6 md:border-0 md:pt-0"
          >
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h2 className={`${headingClass} mb-1 md:mb-2.5`}>{group.title}</h2>
                <ul>
                  {group.links.map(([label, href]) => (
                    <li key={href + label}>
                      <Link href={href} className={linkClass}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Contact */}
          <div className="border-t border-[#e6ece6] pt-6 md:border-0 md:pt-0">
            <h2 className={`${headingClass} mb-1 md:mb-2.5`}>Contact</h2>
            {contacts.length > 0 ? (
              <ul>
                {contacts.map(({ icon: Icon, label, href, multiline }) => {
                  const content = (
                    <>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eef5ef] text-[#17483b]">
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <span className={`min-w-0 [overflow-wrap:anywhere] ${multiline ? "whitespace-pre-line" : ""}`}>
                        {label}
                      </span>
                    </>
                  );
                  const rowClass = "flex items-center gap-3 py-2 text-[15px] text-[#3d5249] md:py-1.5";
                  return (
                    <li key={label}>
                      {href ? (
                        <a href={href} className={`${rowClass} transition-colors hover:text-[#0a67d0]`}>
                          {content}
                        </a>
                      ) : (
                        <div className={rowClass}>{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <Link href="/contact" className={linkClass}>
                Nous écrire
              </Link>
            )}

            {socials.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2.5">
                {socials.map(({ network, label, href }) => {
                  const Icon = socialIcons[network];
                  return (
                    <a
                      key={network}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-[#d9e0d5] px-[18px] text-sm font-medium text-[#17483b] transition hover:border-[#0c7af8] hover:text-[#0a67d0]"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {label}
                      <span className="sr-only"> (nouvel onglet)</span>
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        {/* Ligne du bas */}
        <div className="mt-8 flex flex-col-reverse items-center gap-3 border-t border-[#d9e0d5] py-5 text-center text-[13px] leading-5 text-[#526057] md:mt-12 md:flex-row md:items-center md:justify-between md:gap-6 md:text-left">
          <div className="flex flex-col gap-1">
            <p>© {new Date().getFullYear()} {legalName} (ASO). Tous droits réservés.</p>
            {registrationNumber ? (
              <p className="text-xs text-[#6b776f] md:text-[13px]">
                Association agréée — <span className="whitespace-nowrap">N° {registrationNumber}</span>
                {registrationDate ? <> du {registrationDate}</> : null}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 gap-2 font-medium text-[#3d5249] md:gap-6">
            <Link href="/mentions-legales" className="px-2.5 py-3 transition-colors hover:text-[#0a67d0] md:p-0">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="px-2.5 py-3 transition-colors hover:text-[#0a67d0] md:p-0">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

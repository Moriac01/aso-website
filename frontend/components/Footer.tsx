import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { phoneHref } from "@/lib/contact";
import { getContactInfo } from "@/server/content/contact";

const navigation = [
  ["À propos", "/about"],
  ["Actions", "/actions"],
  ["Actualités", "/news"],
  ["Transparence", "/transparence"],
  ["Devenir membre", "/volunteers"],
  ["Contact", "/contact"],
];

// Coordonnées et réseaux : Administration → Coordonnées & réseaux (ce qui est vide n'est pas affiché).
const Footer = async () => {
  const { email, phone, address, socials } = await getContactInfo();
  return (
    <footer className="border-t border-[#d9e0d5] bg-white px-6 pb-3 pt-6 text-[#17483b] sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/icon.png" alt="Logo ASO" width={48} height={48} />
              <span className="font-display text-xl font-semibold">ASO</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-5 text-[#526057]">
              Agir ensemble pour un avenir plus solidaire.
            </p>
          </div>

          <div className="col-span-1">
            <h2 className="text-base font-semibold">Liens utiles</h2>
            <nav aria-label="Liens du pied de page" className="mt-3 flex flex-col gap-2 text-sm leading-5">
              {navigation.map(([label, href]) => (
                <Link key={href} href={href} className="w-fit text-[#526057] transition-colors hover:text-[#17483b]">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="col-span-1">
            <h2 className="text-base font-semibold">Contact</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm leading-5 text-[#526057]">
              {email ? (
                <li className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  <a href={`mailto:${email}`} className="break-all transition-colors hover:text-[#17483b]">
                    {email}
                  </a>
                </li>
              ) : null}
              {phone ? (
                <li className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  <a href={phoneHref(phone)} className="transition-colors hover:text-[#17483b]">
                    {phone}
                  </a>
                </li>
              ) : null}
              {address ? (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span className="whitespace-pre-line">{address}</span>
                </li>
              ) : null}
              {!email && !phone && !address ? (
                <li>
                  <Link href="/contact" className="transition-colors hover:text-[#17483b]">
                    Nous écrire
                  </Link>
                </li>
              ) : null}
            </ul>

            {socials.length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#d9e0d5] pt-4">
                {socials.map(({ network, label, href }) => (
                  <a
                    key={network}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sm text-[#526057] transition-colors hover:text-[#17483b]"
                  >
                    {label}
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="col-span-2 mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-[#d9e0d5] pt-3 text-center text-[13px] text-[#526057] md:col-span-3">
          <span>© {new Date().getFullYear()} ASO | Tous droits réservés.</span>
          <Link href="/mentions-legales" className="transition-colors hover:text-[#17483b]">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="transition-colors hover:text-[#17483b]">
            Confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

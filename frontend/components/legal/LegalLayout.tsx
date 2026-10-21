import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type LegalSection = {
  id: string;
  title: string;
  icon: LucideIcon;
  content: ReactNode;
};

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  updatedAt: string;
  sections: LegalSection[];
  /** Lien vers l'autre page légale, en bas du sommaire. */
  related: { label: string; href: string };
};

/** Mise en page commune des pages Mentions légales et Confidentialité (styles du site). */
export function LegalLayout({ eyebrow, title, intro, updatedAt, sections, related }: Props) {
  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 lg:px-12 lg:pt-16">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#eaf6ff] via-white to-[#f2f8ee] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 lg:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#070707] sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#526057] sm:text-lg">{intro}</p>
          <p className="mt-6 text-sm text-[#526057]">Dernière mise à jour : {updatedAt}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-[260px_1fr] lg:px-12">
        <nav aria-label="Sommaire" className="min-w-0 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-[1.75rem] border border-[#dfe7df] bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#526057]">Sommaire</p>
            <ol className="mt-4 space-y-2 text-sm">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="flex gap-2 text-[#2c3a34] transition hover:text-[#0a67d0]">
                    <span className="text-[#526057]">{index + 1}.</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
            <Link
              href={related.href}
              className="mt-5 inline-block border-t border-[#dfe7df] pt-4 text-sm font-semibold text-[#0a67d0] hover:text-[#08529f]"
            >
              {related.label}
            </Link>
          </div>
        </nav>

        <div className="min-w-0 space-y-6">
          {sections.map(({ id, title: sectionTitle, icon: Icon, content }, index) => (
            <article
              key={id}
              id={id}
              className="scroll-mt-8 rounded-[1.75rem] border border-[#dfe7df] bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)] sm:p-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#0a67d0]">
                  <Icon size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#070707] sm:text-2xl">
                  {index + 1}. {sectionTitle}
                </h2>
              </div>
              <div className="mt-5 space-y-4 text-base leading-7 text-[#526057]">{content}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

/** Tableau « libellé / valeur » des informations officielles. */
export function InfoList({ items }: { items: [label: string, value: ReactNode][] }) {
  return (
    <dl className="divide-y divide-[#dfe7df] overflow-hidden rounded-2xl border border-[#dfe7df] bg-[#f7faf6]">
      {items.map(([label, value]) => (
        <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[220px_1fr] sm:gap-4">
          <dt className="text-sm text-[#526057]">{label}</dt>
          <dd className="font-semibold text-[#070707] [overflow-wrap:anywhere]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Coordonnées de contact : email public s'il est renseigné, sinon le formulaire. */
export function ContactLine({ email }: { email: string | null }) {
  return email ? (
    <>
      par email à{" "}
      <a href={`mailto:${email}`} className="font-semibold text-[#0a67d0] hover:text-[#08529f]">
        {email}
      </a>{" "}
      ou via notre{" "}
      <Link href="/contact" className="font-semibold text-[#0a67d0] hover:text-[#08529f]">
        formulaire de contact
      </Link>
    </>
  ) : (
    <>
      via notre{" "}
      <Link href="/contact" className="font-semibold text-[#0a67d0] hover:text-[#08529f]">
        formulaire de contact
      </Link>
    </>
  );
}

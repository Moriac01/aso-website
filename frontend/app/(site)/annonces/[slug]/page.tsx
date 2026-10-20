import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarClock, Check, Mail, MessageCircle, Send } from "lucide-react";

import { CopyButton } from "@/components/actions/CopyButton";
import { mailtoHref, viewAnnouncement } from "@/lib/announcements";
import { formatDay } from "@/lib/dates";
import { whatsappHref } from "@/lib/contact";
import { getAnnouncementBySlug } from "@/server/content/actions";
import { getContactInfo } from "@/server/content/contact";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getAnnouncementBySlug(slug);
  if (!item) return { title: "Annonce introuvable — ASO" };
  return {
    title: `${item.title} — ASO`,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      ...(item.details.posters[0] ? { images: [item.details.posters[0].src] } : {}),
    },
  };
}

const outline =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#0a67d0] bg-white px-5 text-sm font-semibold text-[#0a67d0] transition hover:bg-[#0a67d0] hover:text-white";
const solid =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a67d0] px-6 text-[15px] font-semibold text-white transition hover:bg-[#08529f]";

export default async function AnnouncementPage({ params }: Props) {
  const { slug } = await params;
  const [item, contact] = await Promise.all([getAnnouncementBySlug(slug), getContactInfo()]);
  if (!item) notFound();

  const view = viewAnnouncement(item);
  const open = view.state !== "ended";
  const canApply = view.state === "current";
  const { details } = item;
  const apply = details.apply;
  const email = apply.email ?? contact.email;
  const whatsappSource = contact.socials.find((social) => social.network === "whatsapp")?.href ?? contact.phone;
  const whatsapp = whatsappSource
    ? whatsappHref(whatsappSource, `Bonjour, j’ai une question sur l’annonce « ${item.title} ».`)
    : null;

  const greeting = "Bonjour,\n\nJe vous adresse ma candidature pour le poste de ";
  const signature = ".\nVous trouverez en pièces jointes mon CV et ma lettre de motivation.\n\nCordialement,\n";
  const applyByEmail = (position: string | null) =>
    email
      ? mailtoHref(
          email,
          `${apply.subjectPrefix} – ${position ?? item.title}`,
          position ? `${greeting}${position}${signature}` : `Bonjour,\n\nJe réponds à votre annonce « ${item.title} ».\n\nCordialement,\n`,
        )
      : null;

  const badgeClass =
    view.state === "current"
      ? "bg-[#e3f5e8] text-[#17683a]"
      : view.state === "upcoming"
        ? "bg-[#eaf3ff] text-[#0a67d0]"
        : "bg-[#eef1ee] text-[#526057]";

  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      <section className="mx-auto max-w-5xl px-5 pt-8 sm:px-8 lg:pt-12">
        <Link href="/actions#annonces" className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-[#0a67d0] hover:text-[#08529f]">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Toutes nos actions
        </Link>

        <div className="mt-4 rounded-[2rem] bg-[#0b1220] p-7 text-white sm:p-10 lg:p-12">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{view.badge}</span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{item.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">{details.intro ?? item.summary}</p>
          {item.endDate ? (
            <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#fbbf6a]">
              <CalendarClock className="size-4" aria-hidden="true" />
              {open ? `Date limite : ${formatDay(item.endDate)}` : `Clôturé le ${formatDay(item.endDate)}`}
            </p>
          ) : null}
        </div>

        {!open ? (
          <p className="mt-6 rounded-2xl border border-[#dfe7df] bg-white p-5 text-[15px] leading-7 text-[#526057]">
            Cette annonce est terminée : il n’est plus possible d’y répondre. Merci à toutes celles et ceux qui ont participé !
            {item.report ? (
              <>
                {" "}
                <Link href={item.report.href} className="font-semibold text-[#0a67d0] hover:underline">
                  Lire le compte rendu
                </Link>
                .
              </>
            ) : null}
          </p>
        ) : null}
      </section>

      {details.positions.length > 0 ? (
        <section className="mx-auto max-w-5xl px-5 pt-12 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
            {details.positions.length > 1 ? `Les ${details.positions.length} postes` : "Le poste"}
          </p>
          <div className="mt-5 grid gap-4">
            {details.positions.map((position) => {
              const href = canApply && apply.method === "email" ? applyByEmail(position.title) : null;
              return (
                <article key={position.title} className="rounded-3xl border border-[#dfe7df] bg-white p-6 sm:flex sm:items-start sm:justify-between sm:gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#070707]">{position.title}</h2>
                    {position.text ? <p className="mt-2 text-[15px] leading-7 text-[#526057]">{position.text}</p> : null}
                  </div>
                  {href ? (
                    <a href={href} className={`${outline} mt-4 w-full shrink-0 sm:mt-0 sm:w-auto`}>
                      <Send className="size-4" aria-hidden="true" />
                      Postuler à ce poste
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {details.profile.length > 0 || details.benefits.length > 0 ? (
        <section className="mx-auto grid max-w-5xl gap-5 px-5 pt-12 sm:px-8 md:grid-cols-2">
          {[
            { title: "Votre profil", items: details.profile, tone: "bg-white" },
            { title: "Ce que vous gagnez", items: details.benefits, tone: "bg-[#eef7ff]" },
          ]
            .filter((block) => block.items.length > 0)
            .map((block) => (
              <div key={block.title} className={`rounded-3xl border border-[#dfe7df] p-6 ${block.tone}`}>
                <h2 className="text-xl font-bold text-[#070707]">{block.title}</h2>
                <ul className="mt-4 space-y-3">
                  {block.items.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-[15px] leading-6 text-[#2c3a34]">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e3f5e8] text-[#1d9b4a]">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </section>
      ) : null}

      {view.state === "upcoming" ? (
        <section className="mx-auto max-w-5xl px-5 pt-12 sm:px-8">
          <p className="rounded-2xl border border-[#dfe7df] bg-white p-5 text-[15px] leading-7 text-[#526057]">
            Les réponses seront possibles à partir du {formatDay(item.startDate)}.
          </p>
        </section>
      ) : null}

      {canApply && apply.method !== "none" ? (
        <section id="postuler" className="mx-auto max-w-5xl px-5 pt-12 sm:px-8">
          <div className="rounded-[2rem] border border-[#f3c98b] bg-[#fff7ea] p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-[#070707] sm:text-3xl">Comment répondre</h2>
            {apply.instructions ? <p className="mt-3 max-w-3xl text-base leading-7 text-[#3d4a42]">{apply.instructions}</p> : null}

            {apply.method === "email" && email ? (
              <>
                <p className="mt-5 inline-flex items-center gap-2 break-all text-lg font-bold text-[#070707]">
                  <Mail className="size-5 shrink-0 text-[#0a67d0]" aria-hidden="true" />
                  {email}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#526057]">
                  Le bouton ouvre votre messagerie avec l’objet déjà rempli. N’oubliez pas d’y joindre vos documents. Pas
                  d’application email sur votre téléphone ? Copiez l’adresse et écrivez depuis Gmail ou votre messagerie
                  habituelle.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {details.positions.length === 0 && applyByEmail(null) ? (
                    <a href={applyByEmail(null)!} className={solid}>
                      <Send className="size-4" aria-hidden="true" />
                      Postuler par email
                    </a>
                  ) : null}
                  <CopyButton value={email} />
                </div>
              </>
            ) : null}

            {apply.method === "link" && apply.url ? (
              <div className="mt-5">
                <a href={apply.url} target="_blank" rel="noreferrer" className={solid}>
                  Remplir le formulaire
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            ) : null}

            {apply.method === "volunteerForm" ? (
              <div className="mt-5">
                <Link href="/volunteers#engagement-choice" className={solid}>
                  Remplir le formulaire bénévole
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            ) : null}

            {whatsapp ? (
              <p className="mt-6 border-t border-[#f3c98b] pt-5 text-[15px] text-[#3d4a42]">
                Une question ?{" "}
                <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-[#17683a] hover:underline">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Écrivez-nous sur WhatsApp
                </a>
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {details.posters.length > 0 ? (
        <section className="mx-auto max-w-5xl px-5 pt-12 sm:px-8">
          <h2 className="text-xl font-bold text-[#070707]">Les affiches</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {details.posters.map((poster) => (
              <a
                key={poster.src}
                href={poster.src}
                target="_blank"
                rel="noreferrer"
                className="relative block aspect-square overflow-hidden rounded-2xl border border-[#dfe7df] bg-white"
              >
                <Image src={poster.src} alt={poster.alt} fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover" />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <div className="pb-16" />
    </main>
  );
}

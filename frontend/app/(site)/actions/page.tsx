import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Check,
  HandHeart,
  HeartHandshake,
  HeartPulse,
  House,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Sprout,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { NewsCard } from "@/components/news/NewsCard";
import { visibleAnnouncements, type AnnouncementView } from "@/lib/announcements";
import { getActionsContent, getAnnouncements, type ActionsContent, type Program } from "@/server/content/actions";
import { getKeyFigures } from "@/server/content/keyFigures";
import { getLatestNews } from "@/services/news";

// La page se régénère au plus tard toutes les 5 min : les annonces apparaissent
// et disparaissent d'elles-mêmes selon leurs dates.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getActionsContent();
  return {
    title: seo.title,
    description: seo.description,
    openGraph: { title: seo.title, description: seo.description },
  };
}

const programIcons: [RegExp, LucideIcon][] = [
  [/scol|éduc|educ/, BookOpenText],
  [/santé|sante|soin/, HeartPulse],
  [/psycho/, HeartHandshake],
  [/famil|visite/, House],
  [/paemv|autonom|mère|mere|revenu/, Sprout],
];

/** Icône d'un programme d'après son titre. */
function programIcon(title: string, className: string) {
  const t = title.toLowerCase();
  const Icon = programIcons.find(([pattern]) => pattern.test(t))?.[1] ?? Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}

const kindIcons: Record<string, LucideIcon> = {
  candidatures: Megaphone,
  adhesion: UsersRound,
  evenement: CalendarDays,
  autre: Sparkles,
};

const columns = ["", "md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-3"];

const primaryButton =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0a67d0] px-6 text-[15px] font-semibold text-white transition hover:bg-[#08529f] sm:w-auto";
const secondaryButton =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#0a67d0] bg-white px-6 text-[15px] font-semibold text-[#0a67d0] transition hover:bg-[#0a67d0] hover:text-white sm:w-auto";

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${light ? "text-[#90cdf4]" : "text-[#0a67d0]"}`}>
      {children}
    </p>
  );
}

function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[#dfe7df] bg-white shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
      <div className="relative h-52 overflow-hidden">
        {program.image ? (
          <Image
            src={program.image.src}
            alt={program.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#eef7ff] to-[#e3f5e8]">
            <span className="flex size-20 items-center justify-center rounded-3xl bg-white text-[#1d9b4a] shadow-sm">
              {programIcon(program.title, "size-10")}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#eaf3ff] text-[#0a67d0]">
            {programIcon(program.title, "size-[22px]")}
          </span>
          {program.badge ? (
            <span className="rounded-full bg-[#e3f5e8] px-3 py-1 text-xs font-semibold text-[#17683a]">{program.badge}</span>
          ) : null}
        </div>
        <h3 className="mt-5 text-2xl font-bold text-[#070707]">{program.title}</h3>
        <p className="mt-3 text-[15px] leading-7 text-[#526057]">{program.text}</p>
        {program.points.length > 0 ? (
          <ul className="mt-5 space-y-2.5">
            {program.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm leading-6 text-[#2c3a34]">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e3f5e8] text-[#1d9b4a]">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

function AnnouncementCard({ view }: { view: AnnouncementView }) {
  const Icon = kindIcons[view.item.kind] ?? Sparkles;
  const ended = view.state === "ended";
  const badgeClass =
    view.state === "current"
      ? "bg-[#e3f5e8] text-[#17683a]"
      : view.state === "upcoming"
        ? "bg-[#eaf3ff] text-[#0a67d0]"
        : "bg-[#eef1ee] text-[#526057]";
  const external = view.action ? /^https?:\/\//.test(view.action.href) : false;

  return (
    <article className={`flex flex-col rounded-3xl border border-[#dfe7df] p-6 ${ended ? "bg-[#fbfcfb]" : "bg-white"}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`flex size-11 items-center justify-center rounded-2xl ${ended ? "bg-[#eef1ee] text-[#6b776f]" : "bg-[#eaf3ff] text-[#0a67d0]"}`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{view.badge}</span>
      </div>
      <h3 className="mt-5 text-xl font-bold leading-snug text-[#070707]">{view.item.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[#526057]">{view.item.summary}</p>
      {view.action ? (
        <div className="mt-auto pt-5">
          <Link
            href={view.action.href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#0a67d0] px-5 text-[15px] font-semibold text-[#0a67d0] transition hover:bg-[#0a67d0] hover:text-white sm:w-auto"
          >
            {view.action.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </article>
  );
}

function SectionIntro({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-[#526057]">{intro}</p>
    </div>
  );
}

/** Annonces en cours / à venir, ou le contenu de secours choisi dans le back-office. */
async function AnnouncementsOrFallback({ content, views }: { content: ActionsContent; views: AnnouncementView[] }) {
  if (views.length > 0) {
    const eyebrow = views.some((view) => view.state === "current") ? "En ce moment" : "Prochainement";
    return (
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <SectionIntro eyebrow={eyebrow} {...content.announcementsSection} />
        <div className={`grid gap-5 ${views.length > 1 ? "md:grid-cols-2" : ""}`}>
          {views.map((view) => (
            <AnnouncementCard key={view.item.id} view={view} />
          ))}
        </div>
      </div>
    );
  }

  const { fallback } = content;
  let choice = fallback.choice;
  const news = choice === "news" ? await getLatestNews(2) : [];
  if (choice === "news" && news.length === 0) choice = "join";

  if (choice === "news") {
    return (
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <div>
          <SectionIntro eyebrow="Sur le terrain" {...fallback.news} />
          <Link href="/news" className="mt-5 inline-flex items-center gap-2 py-2 text-[15px] font-semibold text-[#0a67d0] hover:text-[#08529f]">
            Toutes nos actualités
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  }

  if (choice === "method") {
    return (
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <SectionIntro eyebrow="Notre méthode" {...fallback.method} />
        <ol className="rounded-3xl border border-[#dfe7df] bg-white px-6 py-2">
          {fallback.method.steps.map((step, index) => (
            <li key={step.title + index} className="flex items-start gap-4 border-t border-[#e6ece6] py-4 first:border-t-0">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0a67d0] font-bold text-white">
                {index + 1}
              </span>
              <div>
                <p className="text-[17px] font-bold text-[#070707]">{step.title}</p>
                <p className="mt-1 text-[15px] leading-6 text-[#526057]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const joinCards = [
    {
      icon: HandHeart,
      title: "Devenir bénévole",
      text: "Donnez un peu de votre temps ou de vos compétences, selon vos disponibilités.",
      href: "/volunteers",
      label: "Je me propose",
    },
    {
      icon: HeartPulse,
      title: "Soutenir chaque mois",
      text: "Un petit don régulier permet de prévoir la scolarité et les soins des enfants sur toute l’année.",
      href: "/donate",
      label: "Faire un don",
    },
  ];
  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
      <SectionIntro eyebrow="Toute l’année" {...fallback.join} />
      <div className="grid gap-5 md:grid-cols-2">
        {joinCards.map(({ icon: Icon, title, text, href, label }) => (
          <article key={title} className="flex flex-col rounded-3xl border border-[#dfe7df] bg-white p-6">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#eaf3ff] text-[#0a67d0]">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-[#070707]">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[#526057]">{text}</p>
            <div className="mt-auto pt-5">
              <Link href={href} className={secondaryButton}>
                {label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default async function ActionsPage() {
  const [content, announcements, keyFigures] = await Promise.all([
    getActionsContent(),
    getAnnouncements(),
    getKeyFigures(),
  ]);
  const views = visibleAnnouncements(announcements);
  const figures = keyFigures.slice(0, 4);

  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#eaf6ff] via-white to-[#f2f8ee] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 lg:p-14">
          <div className={`grid items-center gap-8 lg:gap-12 ${figures.length > 0 ? "lg:grid-cols-[1.25fr_0.75fr]" : ""}`}>
            <div>
              <Eyebrow>Nos actions</Eyebrow>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#070707] sm:text-5xl">{content.hero.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#526057] sm:text-lg">{content.hero.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/donate" className={primaryButton}>
                  Faire un don
                </Link>
                <Link href="/volunteers" className={secondaryButton}>
                  Nous rejoindre
                </Link>
              </div>
            </div>

            {figures.length > 0 ? (
              <div className="rounded-[1.75rem] border border-[#dfe7df] bg-white p-5 sm:p-6">
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#526057]">En chiffres</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {figures.map((figure) => (
                    <div key={figure.label} className="rounded-2xl bg-[#f4f9f5] p-4 text-center">
                      <p className="text-3xl font-extrabold text-[#070707]">
                        {figure.value}
                        {figure.suffix}
                      </p>
                      <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#526057]">
                        {figure.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {content.programs.length > 0 ? (
        <section id="programmes" className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-12 lg:pt-20">
          <div className="max-w-3xl">
            <Eyebrow>Nos programmes</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">{content.programsTitle}</h2>
          </div>
          <div className={`mt-8 grid gap-6 ${columns[Math.min(content.programs.length, 6)]}`}>
            {content.programs.map((program, index) => (
              <ProgramCard key={program.title + index} program={program} />
            ))}
          </div>
        </section>
      ) : null}

      <section id="annonces" className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-14 sm:px-8 lg:px-12 lg:pt-20">
        <AnnouncementsOrFallback content={content} views={views} />
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-12 lg:pt-20">
        <div className="grid items-center gap-7 rounded-[2rem] bg-[#0b1220] p-7 text-white sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
          <div>
            <Eyebrow light>Où va votre don</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{content.donation.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">{content.donation.text}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/transparence"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#0b1220] transition hover:bg-[#eaf3ff]"
            >
              <ShieldCheck className="size-[18px]" aria-hidden="true" />
              Voir nos rapports financiers
            </Link>
            <Link
              href="/donate"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10"
            >
              Faire un don
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-[#eef7ff] p-7 text-center sm:p-12">
          <Eyebrow>Rejoignez-nous</Eyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">{content.callToAction.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#526057]">{content.callToAction.text}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/volunteers" className={primaryButton}>
              Devenir bénévole
            </Link>
            <Link href="/contact" className={secondaryButton}>
              Parler à l’équipe
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


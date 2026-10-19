import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  HeartHandshake,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const actionPrograms = [
  {
    title: "Éducation & accompagnement",
    description:
      "Nous offrons un cadre scolaire sécurisé et stimulant pour que chaque enfant puisse apprendre, grandir et s’épanouir.",
    items: [
      "Soutien scolaire et aide aux devoirs",
      "Accès à des matériaux pédagogiques",
      "Encadrement des enfants en situation vulnérable",
    ],
    image: "/edu.jpg",
    icon: BookOpenText,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    title: "Santé & bien-être",
    description:
      "Nous sensibilisons les familles et facilitons l’accès aux soins essentiels pour améliorer la qualité de vie des enfants.",
    items: [
      "Suivi des besoins sanitaires",
      "Sensibilisation sur l’hygiène et la nutrition",
      "Accompagnement vers les structures de soins",
    ],
    image: "/sant.jpg",
    icon: HeartPulse,
    accent: "bg-rose-100 text-rose-700",
  },
  {
    title: "Protection & sécurité",
    description:
      "Nous créons des espaces plus sûrs et des repères rassurants pour les enfants et leurs familles.",
    items: [
      "Mise en place de dispositifs de protection",
      "Aide aux familles en difficulté",
      "Suivi social et conseil personnalisé",
    ],
    image: "/IMG-20250913-WA0015.jpg",
    icon: ShieldCheck,
    accent: "bg-emerald-100 text-emerald-700",
  },
];

const impactStats = [
  { value: "+20", label: "enfants accompagnés" },
  { value: "10", label: "familles soutenues" },
  { value: "4", label: "partenaires actifs" },
];

export default function ActionsPage() {
  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 lg:px-12 lg:pb-20 lg:pt-16">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#eaf6ff] via-white to-[#f2f8ee] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
                Nos actions
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-[#070707] sm:text-5xl">
                Agir concrètement pour une enfance plus sûre et plus heureuse.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#526057] sm:text-lg">
                À travers des programmes à forte valeur humaine, nous accompagnons les enfants,
                leurs familles et les communautés dans leur besoin d’éducation, de santé, de
                sécurité et d’épanouissement.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0c7af8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a67d0]"
                >
                  Soutenir une action
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[#0c7af8] px-6 py-3 text-sm font-semibold text-[#088efc] transition hover:bg-[#0c7af8] hover:text-white"
                >
                  Nous contacter
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#dfe7df] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#0c7af8]">
                  <HeartHandshake size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526057]">
                    Notre mission
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#070707]">Un avenir meilleur</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  "Protéger les enfants dans leur environnement quotidien",
                  "Favoriser l’accès à l’éducation et aux soins",
                  "Créer des opportunités durables pour les familles",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl bg-[#f4f9f5] p-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#d9f5df] text-[#1d9b4a]">
                      <Sparkles size={14} />
                    </div>
                    <p className="text-sm leading-6 text-[#2c3a34]">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-12">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
            Nos programmes
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Des réponses adaptées aux besoins des enfants et des familles.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {actionPrograms.map(({ title, description, items, image, icon: Icon, accent }) => (
            <article
              key={title}
              className="overflow-hidden rounded-[1.75rem] border border-[#dfe7df] bg-white shadow-[0_12px_35px_rgba(15,23,42,0.04)]"
            >
              <div className="overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  width={600}
                  height={240}
                  className="h-52 w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent}`}>
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-2xl font-bold text-[#070707]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#526057]">{description}</p>

                <ul className="mt-5 space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#2c3a34]">
                      <span className="mt-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#dfeeff] text-[#0c7af8]">
                        <ArrowRight size={12} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
          <div className="rounded-[2rem] bg-[#0b1220] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.12)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#90cdf4]">
              Notre approche
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Une action durable, pensée avec les communautés.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-200">
              Nous travaillons en lien avec les familles, les acteurs locaux et les partenaires
              pour mettre en place des solutions concrètes, pertinentes et durables.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {impactStats.map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] border border-[#dfe7df] bg-[#f4f9f5] p-6">
                <p className="text-3xl font-black text-[#070707]">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-[#526057]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-[#eef7ff] p-8 text-center sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
            Rejoignez-nous
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Chaque contribution ouvre une vraie opportunité.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#526057]">
            En soutenant nos actions, vous aidez à protéger l’avenir des enfants et à renforcer
            les moyens de chacun.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/volunteers"
              className="rounded-full bg-[#0c7af8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a67d0]"
            >
              Devenir bénévole
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-[#0c7af8] px-6 py-3 text-sm font-semibold text-[#088efc] transition hover:bg-[#0c7af8] hover:text-white"
            >
              Parler à l’équipe
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

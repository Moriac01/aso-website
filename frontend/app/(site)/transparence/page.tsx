import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Download,
  FileText,
  Landmark,
  ShieldCheck,
  Stamp,
} from "lucide-react";

import { getLegalInfo, getPublishedReports } from "@/server/content/transparency";

// Mêmes règles que les autres pages alimentées par le back-office.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Transparence financière — ASO",
  description:
    "Rapports financiers de l’Association Soutien aux Orphelins, visés par notre Commissaire aux comptes, et informations légales de l’association.",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", timeZone: "Africa/Bangui" });

const formatSize = (bytes: number | null) => {
  if (!bytes) return null;
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} Ko` : `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
};

const commitments = [
  "Chaque dépense est enregistrée et justifiée par une pièce comptable",
  "Chaque rapport est vérifié et visé par notre Commissaire aux comptes",
  "Les rapports validés sont publiés ici, accessibles à tous",
];

/** Le circuit est une vraie séquence : les étapes sont numérotées. */
const steps = [
  {
    title: "La Trésorerie prépare",
    description: "La Trésorière Générale rassemble les dépenses et les justificatifs, puis dépose le rapport financier.",
    icon: FileText,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    title: "Le Commissaire aux comptes vérifie",
    description: "Il contrôle les pièces et appose son visa. Sans ce visa, aucun rapport ne peut être publié.",
    icon: Stamp,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Le Président publie",
    description: "Le rapport visé est mis en ligne. S’il est modifié ensuite, il doit être visé à nouveau.",
    icon: BadgeCheck,
    accent: "bg-amber-100 text-amber-700",
  },
];

export default async function TransparencePage() {
  const [reports, legal] = await Promise.all([getPublishedReports(), getLegalInfo()]);

  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 lg:px-12 lg:pb-20 lg:pt-16">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#eaf6ff] via-white to-[#f2f8ee] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
                Transparence
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-[#070707] sm:text-5xl">
                Nos comptes sont publics.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#526057] sm:text-lg">
                Chaque franc confié à l’ASO doit pouvoir être suivi. Nous publions nos rapports
                financiers, après vérification par notre Commissaire aux comptes, pour que donateurs
                et partenaires sachent exactement où va leur aide.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#rapports"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0a67d0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08529f]"
                >
                  Voir les rapports
                  <ArrowRight size={16} />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[#0a67d0] px-6 py-3 text-sm font-semibold text-[#0a67d0] transition hover:bg-[#0a67d0] hover:text-white"
                >
                  Poser une question
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#dfe7df] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#0a67d0]">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526057]">
                    Notre engagement
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#070707]">Rendre des comptes</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {commitments.map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl bg-[#f4f9f5] p-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d9f5df] text-[#1d9b4a]">
                      <ClipboardCheck size={14} />
                    </div>
                    <p className="text-sm leading-6 text-[#2c3a34]">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="rapports" className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
            Rapports financiers
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Nos rapports, vérifiés et visés.
          </h2>
        </div>

        {reports.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[#dfe7df] bg-white p-8 text-center text-[#526057] shadow-sm">
            Les premiers rapports seront publiés ici dès leur validation par notre Commissaire aux
            comptes.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {reports.map((report) => (
              <article
                key={report.id}
                className="flex flex-col rounded-[1.75rem] border border-[#dfe7df] bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <FileText size={24} />
                  </div>
                  <span className="inline-flex rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#0a67d0]">
                    {report.period ? `${report.year} · ${report.period}` : report.year}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-bold text-[#070707]">{report.title}</h3>
                {report.summary ? (
                  <p className="mt-3 text-base leading-7 text-[#526057]">{report.summary}</p>
                ) : null}

                {report.auditedBy && report.auditedAt ? (
                  <p className="mt-5 flex items-start gap-2 rounded-2xl bg-[#f4f9f5] p-3 text-sm leading-6 text-[#2c3a34]">
                    <BadgeCheck size={18} className="mt-0.5 shrink-0 text-[#1d9b4a]" aria-hidden="true" />
                    <span>
                      Visé par {report.auditedBy}, Commissaire aux comptes, le{" "}
                      {formatDate(report.auditedAt)}.
                    </span>
                  </p>
                ) : null}

                {report.fileUrl ? (
                  <div className="mt-6 pt-1">
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#0a67d0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#08529f]"
                    >
                      <Download size={16} aria-hidden="true" />
                      Télécharger le PDF
                      {formatSize(report.fileSize) ? (
                        <span className="font-normal opacity-90">({formatSize(report.fileSize)})</span>
                      ) : null}
                    </a>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
              Notre méthode
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
              Comment un rapport est validé.
            </h2>
          </div>

          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map(({ title, description, icon: Icon, accent }, index) => (
              <li
                key={title}
                className="rounded-[1.75rem] border border-[#dfe7df] bg-[#f7faf6] p-6"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-sm font-semibold text-[#526057]">Étape {index + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-[#070707]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#526057]">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] [&>*]:min-w-0">
          <div className="rounded-[2rem] bg-[#0b1220] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.12)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#90cdf4]">
              Association reconnue
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Une association déclarée et agréée.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-200">
              L’ASO est une organisation à but non lucratif, apolitique et laïque, dirigée par un
              Bureau Exécutif élu en Assemblée Générale.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#dfe7df] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#0a67d0]">
                <Landmark size={22} />
              </div>
              <p className="text-xl font-bold text-[#070707]">Informations légales</p>
            </div>

            <dl className="mt-6 divide-y divide-[#edf2ef] text-base">
              {[
                ["Nom officiel", legal.legalName],
                ["Agrément ministériel", legal.registrationNumber],
                ["Date de l’agrément", legal.registrationDate ? formatDate(legal.registrationDate) : null],
                ["Délivré par", legal.registrationAuthority],
                ["Siège social", legal.headOffice],
              ]
                .filter((row): row is [string, string] => Boolean(row[1]))
                .map(([label, value]) => (
                  <div key={label} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
                    <dt className="text-sm font-medium text-[#526057]">{label}</dt>
                    <dd className="min-w-0 text-[#070707] [overflow-wrap:anywhere]">{value}</dd>
                  </div>
                ))}
            </dl>

            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0a67d0] transition hover:text-[#08529f]"
            >
              Découvrir le Bureau Exécutif
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-[#eef7ff] p-8 text-center sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
            Une question sur nos comptes ?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Nous vous répondons, pièces à l’appui.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#526057]">
            Donateurs, partenaires, bailleurs : écrivez-nous pour obtenir des précisions sur un
            rapport ou sur l’utilisation de votre soutien.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-[#0a67d0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08529f]"
            >
              Nous contacter
            </Link>
            <Link
              href="/actions"
              className="rounded-full border border-[#0a67d0] px-6 py-3 text-sm font-semibold text-[#0a67d0] transition hover:bg-[#0a67d0] hover:text-white"
            >
              Découvrir nos actions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

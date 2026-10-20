import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HandCoins, HeartHandshake, Landmark, Send, Smartphone } from "lucide-react";

import { CopyButton } from "@/components/donation/CopyButton";
import { DonationForm } from "@/components/donation/DonationForm";
import { getDonationMethods } from "@/server/content/donation";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Faire un don — ASO",
  description:
    "Soutenez l’Association Soutien aux Orphelins par Orange Money. Chaque don est vérifié par notre Trésorerie et figure dans nos rapports financiers publics.",
};

/** Les étapes sont une vraie séquence : elles sont numérotées. */
const steps = [
  {
    title: "Envoyez votre don",
    description: "Depuis votre téléphone, vers le numéro officiel de l’ASO indiqué sur cette page.",
    icon: Send,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    title: "Déclarez-le ici",
    description: "Indiquez le montant et la référence reçue par SMS : vous recevez une référence de don.",
    icon: HandCoins,
    accent: "bg-amber-100 text-amber-700",
  },
  {
    title: "Nous le vérifions",
    description: "La Trésorerie confirme la réception. Votre don figure ensuite dans le rapport financier.",
    icon: BadgeCheck,
    accent: "bg-emerald-100 text-emerald-700",
  },
];

const methodIcon = { "mobile-money": Smartphone, bank: Landmark, other: HandCoins } as const;

export default async function DonatePage() {
  const methods = await getDonationMethods();

  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 lg:px-12 lg:pb-20 lg:pt-16">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#eaf6ff] via-white to-[#f2f8ee] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
                Faire un don
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-[#070707] sm:text-5xl">
                Votre don, suivi jusqu’au bout.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#526057] sm:text-lg">
                Vos dons financent la scolarité des orphelins, leur accès aux soins et le soutien
                psychosocial des familles. Chaque don est vérifié par
                notre Trésorerie et figure dans nos rapports financiers publics.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#donner"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0a67d0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08529f]"
                >
                  Je fais un don
                  <ArrowRight size={16} />
                </a>
                <Link
                  href="/transparence"
                  className="inline-flex items-center gap-2 rounded-full border border-[#0a67d0] px-6 py-3 text-sm font-semibold text-[#0a67d0] transition hover:bg-[#0a67d0] hover:text-white"
                >
                  Voir nos comptes
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#dfe7df] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#0a67d0]">
                  <HeartHandshake size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526057]">
                    Ce que vous financez
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#070707]">Des projets suivis</p>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                {[
                  "La scolarité et le suivi de 10 orphelins",
                  "L’accès aux soins des enfants accompagnés",
                  "L’accompagnement psychosocial des enfants et des familles",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl bg-[#f4f9f5] p-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d9f5df] text-[#1d9b4a]">
                      <BadgeCheck size={14} />
                    </div>
                    <p className="text-sm leading-6 text-[#2c3a34]">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
            Comment donner
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Trois étapes, et chaque franc est tracé.
          </h2>
        </div>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map(({ title, description, icon: Icon, accent }, index) => (
            <li key={title} className="rounded-[1.75rem] border border-[#dfe7df] bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
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
      </section>

      <section id="donner" className="scroll-mt-8 bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
                Étape 1
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
                Envoyez votre don.
              </h2>
            </div>

            {methods.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-[#dfe7df] bg-[#f7faf6] p-6 text-[#526057]">
                Nos coordonnées de don seront affichées ici très prochainement. En attendant,{" "}
                <Link href="/contact" className="font-semibold text-[#0a67d0] hover:text-[#08529f]">
                  contactez-nous
                </Link>{" "}
                pour soutenir l’ASO.
              </div>
            ) : (
              methods.map((method) => {
                const Icon = methodIcon[method.kind] ?? HandCoins;
                return (
                  <article key={method.label} className="rounded-[1.75rem] border border-[#dfe7df] bg-[#f7faf6] p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <Icon size={22} />
                      </div>
                      <h3 className="text-xl font-bold text-[#070707]">{method.label}</h3>
                    </div>
                    <div className="mt-5 rounded-2xl border border-[#dfe7df] bg-white p-4">
                      <p className="text-sm text-[#526057]">
                        {method.kind === "bank" ? "Numéro de compte" : "Numéro"}
                        {method.accountName ? ` · titulaire : ${method.accountName}` : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <p className="break-all text-2xl font-bold tracking-wide text-[#070707]">
                          {method.accountNumber}
                        </p>
                        <CopyButton value={method.accountNumber ?? ""} label={`le numéro ${method.label}`} />
                      </div>
                    </div>
                    {method.instructions ? (
                      <p className="mt-4 whitespace-pre-line text-base leading-7 text-[#526057]">
                        {method.instructions}
                      </p>
                    ) : null}
                  </article>
                );
              })
            )}

            <p className="text-sm leading-6 text-[#526057]">
              Vérifiez toujours que le compte est bien au nom de l’Association Soutien aux
              Orphelins. L’ASO ne vous demandera jamais d’envoyer de l’argent sur un autre numéro.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#dfe7df] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)] sm:p-7 lg:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
                Étape 2
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
                Déclarez votre don.
              </h2>
              <p className="mt-3 text-base leading-7 text-[#526057]">
                Ces informations permettent à notre Trésorerie de retrouver votre don et de vous
                en confirmer la réception.
              </p>
            </div>
            {methods.length === 0 ? (
              <p className="rounded-2xl bg-[#f4f9f5] p-4 text-sm leading-6 text-[#2c3a34]">
                Le formulaire sera disponible dès que nos coordonnées de don seront en ligne.
              </p>
            ) : (
              <DonationForm methods={methods.map((method) => method.label)} />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-[#eef7ff] p-8 text-center sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
            Donner autrement
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Votre temps compte aussi.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#526057]">
            Soutien scolaire, comptabilité, communication : rejoignez nos bénévoles, ou contactez-nous
            pour un partenariat.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/volunteers"
              className="rounded-full bg-[#0a67d0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08529f]"
            >
              Devenir bénévole
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-[#0a67d0] px-6 py-3 text-sm font-semibold text-[#0a67d0] transition hover:bg-[#0a67d0] hover:text-white"
            >
              Proposer un partenariat
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

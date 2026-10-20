import { ArrowRight, BellRing, CalendarClock, MessageCircle, UsersRound } from "lucide-react";

import { formatDay, periodState } from "@/lib/dates";
import { whatsappHref } from "@/lib/contact";
import type { MembershipInfo } from "@/server/content/actions";

/**
 * Bloc d'adhésion de la page Devenir membre (aso-rca.org/adherer).
 * L'adhésion se fait par le formulaire Microsoft Forms ; avant l'ouverture, on peut demander
 * à être prévenu sur WhatsApp. Les montants ne figurent que dans le formulaire.
 */
export function MembershipBlock({ membership, whatsapp }: { membership: MembershipInfo; whatsapp: string | null }) {
  const state = periodState(membership.openingDate, membership.closingDate);
  const formOpen = state === "current" && membership.formUrl;
  const notifyHref = whatsapp ? whatsappHref(whatsapp, membership.notifyMessage) : null;
  const questionHref = whatsapp ? whatsappHref(whatsapp, "Bonjour, j’ai une question sur l’adhésion à l’ASO.") : null;

  const status =
    state === "ended"
      ? "Les adhésions sont closes pour le moment. Écrivez-nous pour être informé(e) de la prochaine campagne."
      : state === "upcoming" && membership.openingDate
        ? `Les adhésions ouvrent le ${formatDay(membership.openingDate)}.`
        : formOpen
          ? membership.closingDate
            ? `Les adhésions sont ouvertes jusqu’au ${formatDay(membership.closingDate)}.`
            : "Les adhésions sont ouvertes."
          : "Le formulaire d’adhésion sera en ligne très prochainement.";

  return (
    <div className="rounded-[2rem] border border-[#dfe7df] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf3ff] text-[#0a67d0]">
          <UsersRound className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">Adhésion</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-[#070707]">{membership.title}</h3>
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-base leading-7 text-[#526057]">{membership.intro}</p>

      <p
        className={`mt-6 flex items-start gap-2.5 rounded-2xl p-4 text-[15px] font-semibold leading-6 ${formOpen ? "bg-[#e3f5e8] text-[#17683a]" : "bg-[#eef7ff] text-[#0a4f9e]"}`}
      >
        <CalendarClock className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        {status}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {formOpen ? (
          <a
            href={membership.formUrl!}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0a67d0] px-6 text-[15px] font-semibold text-white transition hover:bg-[#08529f] sm:w-auto"
          >
            Remplir le formulaire d’adhésion
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        ) : notifyHref ? (
          <a
            href={notifyHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#17803d] px-6 text-[15px] font-semibold text-white transition hover:bg-[#136b33] sm:w-auto"
          >
            <BellRing className="size-4" aria-hidden="true" />
            {state === "ended" ? "Nous écrire sur WhatsApp" : "Être prévenu sur WhatsApp"}
          </a>
        ) : null}

        {formOpen && questionHref ? (
          <a
            href={questionHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#dfe7df] px-6 text-[15px] font-semibold text-[#17483b] transition hover:border-[#1d9b4a] hover:text-[#17683a] sm:w-auto"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Une question ?
          </a>
        ) : null}
      </div>

      {formOpen ? (
        <p className="mt-4 text-sm leading-6 text-[#526057]">
          Le formulaire (Microsoft Forms) s’ouvre dans un nouvel onglet et prend environ 3 minutes. Un membre du Bureau vous
          contacte ensuite pour finaliser votre adhésion.
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { HoneypotField } from "@/components/HoneypotField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { openDonationProjects, type DonationProject } from "@/lib/validation/donation";
import { submitDonation } from "@/server/actions/forms";

type Values = {
  amount: string;
  method: string;
  transactionRef: string;
  project: DonationProject;
  anonymous: boolean;
  donorName: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
};

type Errors = Partial<Record<keyof Values, string>>;

const fieldClass = (error?: string) =>
  error ? "border-red-300 bg-red-50" : "border-[#dfe7df] bg-[#f7faf6]";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-xs text-red-600">{message}</p>;
}

/** Déclaration d'un don déjà envoyé (Orange Money, virement…), vérifiée ensuite par la Trésorerie. */
export function DonationForm({ methods }: { methods: string[] }) {
  const initial: Values = {
    amount: "",
    method: methods[0] ?? "",
    transactionRef: "",
    project: "general",
    anonymous: false,
    donorName: "",
    phone: "",
    email: "",
    message: "",
    consent: false,
  };
  const [form, setForm] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const update = <K extends keyof Values>(field: K, value: Values[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    const amount = Number(form.amount);
    if (!form.amount.trim()) next.amount = "Indiquez le montant envoyé.";
    else if (!Number.isInteger(amount) || amount < 100) next.amount = "Indiquez un montant entier d’au moins 100 FCFA.";
    if (!form.method) next.method = "Choisissez le moyen utilisé.";
    if (form.transactionRef.trim().length < 4) next.transactionRef = "Indiquez la référence reçue par SMS.";
    if (!form.anonymous && !form.donorName.trim()) next.donorName = "Indiquez votre nom, ou cochez « don anonyme ».";
    if (!form.consent) next.consent = "Vous devez accepter le consentement.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSending(true);
    const result = await submitDonation({ ...form, website: honeypot });
    setIsSending(false);

    if (!result.ok) {
      setErrors((result.fieldErrors ?? {}) as Errors);
      setSubmitError(result.error);
      return;
    }
    setReference(result.reference);
    setForm(initial);
  };

  if (reference) {
    return (
      <div className="rounded-2xl border border-[#cfe9d5] bg-[#edfdf2] p-6 text-[#0d6b3d]" role="status">
        <p className="flex items-center gap-2 text-lg font-semibold">
          <CheckCircle2 className="size-6" aria-hidden="true" />
          Merci pour votre don !
        </p>
        <p className="mt-3 text-base leading-7 text-[#2c3a34]">
          Votre déclaration est enregistrée sous la référence{" "}
          <strong className="font-semibold text-[#070707]">{reference}</strong>. Notez-la : notre
          Trésorerie va vérifier la réception, et votre don apparaîtra dans le prochain rapport
          financier.
        </p>
        <button
          type="button"
          onClick={() => setReference(null)}
          className="mt-5 text-sm font-semibold text-[#0c7af8] transition hover:text-[#0a67d0]"
        >
          Déclarer un autre don
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <HoneypotField value={honeypot} onChange={setHoneypot} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="don-amount" className="mb-2 block text-sm font-medium text-[#070707]">
            Montant envoyé (FCFA)
          </label>
          <Input
            id="don-amount"
            type="number"
            inputMode="numeric"
            min={100}
            step={1}
            value={form.amount}
            onChange={(event) => update("amount", event.target.value)}
            aria-invalid={Boolean(errors.amount)}
            className={fieldClass(errors.amount)}
            placeholder="Ex. : 10000"
          />
          <FieldError message={errors.amount} />
        </div>

        <div>
          <label htmlFor="don-method" className="mb-2 block text-sm font-medium text-[#070707]">
            Moyen utilisé
          </label>
          <select
            id="don-method"
            value={form.method}
            onChange={(event) => update("method", event.target.value)}
            aria-invalid={Boolean(errors.method)}
            className={`h-10 w-full rounded-2xl border px-2.5 text-base outline-none ${fieldClass(errors.method)}`}
          >
            {methods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
          <FieldError message={errors.method} />
        </div>
      </div>

      <div>
        <label htmlFor="don-ref" className="mb-2 block text-sm font-medium text-[#070707]">
          Référence de la transaction
        </label>
        <Input
          id="don-ref"
          type="text"
          value={form.transactionRef}
          onChange={(event) => update("transactionRef", event.target.value)}
          aria-invalid={Boolean(errors.transactionRef)}
          className={fieldClass(errors.transactionRef)}
          placeholder="Indiquée dans le SMS de confirmation"
        />
        <FieldError message={errors.transactionRef} />
      </div>

      <div>
        <label htmlFor="don-project" className="mb-2 block text-sm font-medium text-[#070707]">
          Projet que vous souhaitez soutenir
        </label>
        <select
          id="don-project"
          value={form.project}
          onChange={(event) => update("project", event.target.value as DonationProject)}
          className={`h-10 w-full rounded-2xl border px-2.5 text-base outline-none ${fieldClass()}`}
        >
          {openDonationProjects.map((project) => (
            <option key={project.value} value={project.value}>
              {project.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-[#2c3a34]">
        <input
          type="checkbox"
          checked={form.anonymous}
          onChange={(event) => update("anonymous", event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[#c8d4cf] text-[#0c7af8] focus:ring-[#0c7af8]"
        />
        <span>Je souhaite faire un don anonyme</span>
      </label>

      {!form.anonymous && (
        <div>
          <label htmlFor="don-name" className="mb-2 block text-sm font-medium text-[#070707]">
            Votre nom
          </label>
          <Input
            id="don-name"
            type="text"
            value={form.donorName}
            onChange={(event) => update("donorName", event.target.value)}
            aria-invalid={Boolean(errors.donorName)}
            className={fieldClass(errors.donorName)}
            placeholder="Nom et prénom, ou nom de l’organisation"
          />
          <FieldError message={errors.donorName} />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="don-phone" className="mb-2 block text-sm font-medium text-[#070707]">
            Téléphone (facultatif)
          </label>
          <Input
            id="don-phone"
            type="tel"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            className={fieldClass(errors.phone)}
            placeholder="Pour vous confirmer la réception"
          />
          <FieldError message={errors.phone} />
        </div>
        <div>
          <label htmlFor="don-email" className="mb-2 block text-sm font-medium text-[#070707]">
            Email (facultatif)
          </label>
          <Input
            id="don-email"
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            className={fieldClass(errors.email)}
            placeholder="votre@email.com"
          />
          <FieldError message={errors.email} />
        </div>
      </div>

      <div>
        <label htmlFor="don-message" className="mb-2 block text-sm font-medium text-[#070707]">
          Un mot pour l’équipe (facultatif)
        </label>
        <Textarea
          id="don-message"
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          className={`min-h-24 ${fieldClass(errors.message)}`}
        />
        <FieldError message={errors.message} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-6 text-[#2c3a34]">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(event) => update("consent", event.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            className="mt-1 h-4 w-4 rounded border-[#c8d4cf] text-[#0c7af8] focus:ring-[#0c7af8]"
          />
          <span>
            J&apos;accepte que ces informations soient utilisées pour vérifier mon don et m&apos;en
            confirmer la réception. Voir notre{" "}
            <Link href="/confidentialite" target="_blank" className="font-semibold text-[#0c7af8] underline-offset-2 hover:underline">
              politique de confidentialité
            </Link>
            .
          </span>
        </label>
        <FieldError message={errors.consent} />
      </div>

      {submitError && (
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0c7af8] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0a67d0]"
      >
        {isSending ? "Envoi en cours…" : "Déclarer mon don"}
        <Send className="size-4" aria-hidden="true" />
      </Button>
    </form>
  );
}

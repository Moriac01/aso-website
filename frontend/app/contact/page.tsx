"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Globe,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
};

type ContactErrors = Partial<Record<keyof ContactFormValues, string>>;

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  consent: false,
};

const contactDetails = [
  {
    label: "Téléphone",
    value: "(+236) 72 53 78 46",
    href: "tel:+23672537846",
    icon: Phone,
    accent: "bg-[#eaf6ff] text-[#0c7af8]",
  },
  {
    label: "Email",
    value: "contact@monsite.com",
    href: "mailto:contact@monsite.com",
    icon: Mail,
    accent: "bg-[#eef7ff] text-[#0c7af8]",
  },
  {
    label: "Adresse",
    value: "123 Rue, Avenue des Martyrs, Bangui",
    href: "https://www.google.com/maps/search/?api=1&query=123+Rue+Avenue+des+Martyrs+Bangui",
    icon: MapPin,
    accent: "bg-[#f4f9f5] text-[#1d9b4a]",
  },
];

const socialLinks = [
  { label: "Facebook", icon: Globe },
  { label: "Instagram", icon: Users },
  { label: "LinkedIn", icon: MessageSquareText },
];

const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const validatePhone = (value: string) => {
  if (!value.trim()) return true;
  const normalized = value.replace(/\D/g, "");
  return normalized.length >= 8 && normalized.length <= 15;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-2 text-xs text-red-600">{message}</p>;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mapLink = useMemo(
    () => "https://www.google.com/maps/search/?api=1&query=123+Rue+Avenue+des+Martyrs+Bangui",
    [],
  );

  const updateField = (field: keyof ContactFormValues, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateForm = () => {
    const nextErrors: ContactErrors = {};

    if (!form.name.trim()) nextErrors.name = "Le nom est requis.";
    if (!form.email.trim()) nextErrors.email = "L’email est requis.";
    else if (!validateEmail(form.email)) nextErrors.email = "Veuillez saisir un email valide.";
    if (form.phone.trim() && !validatePhone(form.phone)) nextErrors.phone = "Le téléphone doit contenir entre 8 et 15 chiffres.";
    if (!form.subject.trim()) nextErrors.subject = "Le sujet est requis.";
    if (!form.message.trim()) nextErrors.message = "Le message est requis.";
    else if (form.message.trim().length < 10) nextErrors.message = "Le message doit contenir au moins 10 caractères.";
    if (!form.consent) nextErrors.consent = "Vous devez accepter ce consentement.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      setIsSubmitted(false);
      return;
    }

    setIsSubmitted(true);
    setForm(initialValues);
  };

  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      <section className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 lg:px-12 lg:pb-20 lg:pt-16">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef7ff] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
                Contact
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-[#070707] sm:text-5xl">
                Nous sommes à votre écoute.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#526057] sm:text-lg">
                Pour obtenir des informations, poser une question, proposer une collaboration ou
                contribuer à nos actions, nous sommes à votre disposition.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-[#dfe7df] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#0c7af8]">
                  <MessageSquareText className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526057]">
                    Contact rapide
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#070707]">Une réponse attentive.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Informations sur nos missions et actions",
                  "Questions sur le soutien, le bénévolat et les dons",
                  "Propositions de partenariat et de collaboration",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-[#f4f9f5] p-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#d9f5df] text-[#1d9b4a]">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <p className="text-sm leading-6 text-[#2c3a34]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <div className="mb-2 max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
                Coordonnées
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
                Nous sommes à votre disposition.
              </h2>
            </div>

            {contactDetails.map(({ label, value, href, icon: Icon, accent }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="group block rounded-[1.5rem] border border-[#dfe7df] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
                    <Icon className="size-5" />
                  </div>

                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526057]">
                      {label}
                    </p>
                    <p className="mt-2 text-base font-medium text-[#070707] group-hover:text-[#0c7af8]">
                      {value}
                    </p>
                  </div>
                </div>
              </a>
            ))}

            <div className="rounded-[1.5rem] border border-[#dfe7df] bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef7ff] text-[#0c7af8]">
                  <Clock3 className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526057]">
                    Horaires
                  </p>
                  <p className="mt-2 text-base font-medium text-[#070707]">
                    Les horaires seront communiqués prochainement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#dfe7df] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)] sm:p-7 lg:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
                Envoyez-nous un message
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
                Une demande ? Nous vous répondons.
              </h2>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#070707]">
                    Nom
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    className={errors.name ? "border-red-300 bg-red-50" : "border-[#dfe7df] bg-[#f7faf6]"}
                    placeholder="Votre nom"
                  />
                  <FieldError message={errors.name} />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#070707]">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    className={errors.email ? "border-red-300 bg-red-50" : "border-[#dfe7df] bg-[#f7faf6]"}
                    placeholder="votre@email.com"
                  />
                  <FieldError message={errors.email} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#070707]">
                    Téléphone (facultatif)
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    className={errors.phone ? "border-red-300 bg-red-50" : "border-[#dfe7df] bg-[#f7faf6]"}
                    placeholder="+236 12 34 56 78"
                  />
                  <FieldError message={errors.phone} />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-[#070707]">
                    Sujet
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    value={form.subject}
                    onChange={(event) => updateField("subject", event.target.value)}
                    aria-invalid={Boolean(errors.subject)}
                    className={errors.subject ? "border-red-300 bg-red-50" : "border-[#dfe7df] bg-[#f7faf6]"}
                    placeholder="Objet de votre message"
                  />
                  <FieldError message={errors.subject} />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#070707]">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  className={errors.message ? "border-red-300 bg-red-50" : "border-[#dfe7df] bg-[#f7faf6]"}
                  rows={6}
                  placeholder="Décrivez votre demande..."
                />
                <FieldError message={errors.message} />
              </div>

              <div className="rounded-2xl border border-[#dfe7df] bg-[#f7faf6] p-3">
                <label className="flex items-start gap-3 text-sm leading-6 text-[#2c3a34]">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(event) => updateField("consent", event.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                    className="mt-1 h-4 w-4 rounded border-[#c8d4cf] text-[#0c7af8] focus:ring-[#0c7af8]"
                  />
                  <span>J&apos;accepte que les informations fournies soient utilisées pour répondre à ma demande.</span>
                </label>
                <FieldError message={errors.consent} />
              </div>

              <Button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0c7af8] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0a67d0]"
              >
                Envoyer le message
                <Send className="size-4" />
              </Button>
            </form>

            {isSubmitted && (
              <div className="mt-6 rounded-2xl border border-[#d9f5df] bg-[#f1fbf3] p-4 text-[#0d5c2b]">
                <p className="text-lg font-semibold">Merci pour votre message !</p>
                <p className="mt-1 text-sm leading-6">
                  Nous vous répondrons dans les meilleurs délais.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-[#eef7ff] p-8 text-center shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
            Vous souhaitez nous rejoindre ?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Rejoignez l&apos;ASO et donnez un sens concret à votre engagement.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/volunteers"
              className="inline-flex items-center gap-2 rounded-full bg-[#0c7af8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a67d0]"
            >
              Devenir membre / bénévole
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12 lg:pb-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[#dfe7df] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
              Suivez-nous
            </p>
            <h3 className="mt-3 text-2xl font-bold text-[#070707]">Restez informé de nos actions.</h3>
            <p className="mt-3 text-base leading-7 text-[#526057]">
              Les réseaux sociaux officiels de l&apos;ASO seront publiés prochainement.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {socialLinks.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-[#dfe7df] bg-[#f7faf6] px-3 py-2 text-sm text-[#526057]"
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-[#526057]">
              Les réseaux sociaux officiels de l&apos;ASO seront partagés prochainement.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#dfe7df] bg-[#f4f9f5] p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
              Où nous trouver ?
            </p>
            <h3 className="mt-3 text-2xl font-bold text-[#070707]">Notre adresse</h3>
            <p className="mt-3 text-base leading-7 text-[#2c3a34]">
              123 Rue, Avenue des Martyrs, Bangui
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#bfd0cf] bg-white p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#0c7af8]">
                <MapPin className="size-6" />
              </div>
              <p className="mt-4 text-sm text-[#526057]">
                Emplacement dédié à une future carte interactive et à une meilleure localisation.
              </p>
            </div>

            <div className="mt-6">
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#0c7af8] px-6 py-3 text-sm font-semibold text-[#0c7af8] transition hover:bg-[#0c7af8] hover:text-white"
              >
                Voir l&apos;itinéraire
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

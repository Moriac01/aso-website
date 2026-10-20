"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, CheckCircle2, HandHeart, HeartHandshake, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HoneypotField } from "@/components/HoneypotField";
import { submitVolunteerApplication } from "@/server/actions/forms";
import type { EngagementType, VolunteerFormValues } from "@/app/(site)/volunteers/types";

const volunteerInitialValues: VolunteerFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  skills: "",
  availability: "",
  helpType: "",
  message: "",
  consent: false,
};

const availabilityOptions = [
  "Quelques heures par semaine",
  "Week-end",
  "Ponctuellement",
  "Selon les besoins",
];

const helpTypeOptions = [
  "Éducation",
  "Communication",
  "Événements",
  "Collecte de dons",
  "Informatique / numérique",
  "Accompagnement",
  "Autre",
];

const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const validatePhone = (value: string) => value.replace(/\s+/g, "").length >= 8;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-2 text-xs text-red-600">{message}</p>;
}

/**
 * Page « Devenir membre » : adhésion (bloc fourni par la page, formulaire Microsoft Forms)
 * ou bénévolat (formulaire du site, réponses dans le back-office).
 */
export default function VolunteersView({ membership }: { membership: ReactNode }) {
  const [selectedType, setSelectedType] = useState<EngagementType>("member");
  const [volunteerForm, setVolunteerForm] = useState<VolunteerFormValues>(volunteerInitialValues);
  const [volunteerErrors, setVolunteerErrors] = useState<Partial<Record<keyof VolunteerFormValues, string>>>({});
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const activeCardClass = useMemo(
    () =>
      "border-[#0c7af8] bg-[#eef7ff] shadow-md ring-2 ring-[#cfe8ff]",
    [],
  );

  const handleVolunteerChange = (
    field: keyof VolunteerFormValues,
    value: string | boolean,
  ) => {
    setVolunteerForm((current) => ({ ...current, [field]: value }));
    setVolunteerErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateVolunteerForm = () => {
    const errors: Partial<Record<keyof VolunteerFormValues, string>> = {};

    if (!volunteerForm.firstName.trim()) errors.firstName = "Le prénom est requis.";
    if (!volunteerForm.lastName.trim()) errors.lastName = "Le nom est requis.";
    if (!volunteerForm.email.trim()) errors.email = "L’email est requis.";
    else if (!validateEmail(volunteerForm.email)) errors.email = "Veuillez saisir un email valide.";
    if (!volunteerForm.phone.trim()) errors.phone = "Le téléphone est requis.";
    else if (!validatePhone(volunteerForm.phone)) errors.phone = "Le téléphone est invalide.";
    if (!volunteerForm.city.trim()) errors.city = "La ville est requise.";
    if (!volunteerForm.skills.trim()) errors.skills = "Le domaine de compétence est requis.";
    if (!volunteerForm.availability.trim()) errors.availability = "Veuillez choisir votre disponibilité.";
    if (!volunteerForm.helpType.trim()) errors.helpType = "Veuillez choisir un type d’aide.";
    if (!volunteerForm.message.trim()) errors.message = "Le message est requis.";
    else if (volunteerForm.message.trim().length < 20) errors.message = "Le message doit contenir au moins 20 caractères.";
    if (!volunteerForm.consent) errors.consent = "Vous devez accepter le consentement.";

    setVolunteerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onVolunteerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validateVolunteerForm()) return;

    setIsSending(true);
    const result = await submitVolunteerApplication({ ...volunteerForm, website: honeypot });
    setIsSending(false);

    if (!result.ok) {
      setVolunteerErrors((result.fieldErrors ?? {}) as Partial<Record<keyof VolunteerFormValues, string>>);
      setSubmitError(result.error);
      return;
    }

    setVolunteerSubmitted(true);
    setVolunteerForm(volunteerInitialValues);
  };

  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef7ff] p-6 shadow-lg sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
                REJOIGNEZ-NOUS
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#070707] sm:text-5xl">
                Ensemble, construisons un avenir meilleur.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#526057] sm:text-lg">
                Chacun peut contribuer à la mission de l’ASO en donnant de son temps, de ses compétences
                ou en rejoignant durablement l’association pour soutenir les enfants et les familles
                accompagnées.
              </p>

              <Button
                type="button"
                asChild
                className="mt-8 rounded-full bg-[#0c7af8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a67d0]"
              >
                <a href="#engagement-choice">
                  Faire le premier pas
                  <ArrowDown className="ml-2 size-4" />
                </a>
              </Button>
            </div>

            <div className="rounded-[1.75rem] border border-[#dfe7df] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#0c7af8]">
                  <HeartHandshake className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526057]">
                    Nous avons besoin de vous
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#070707]">Votre engagement compte.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Soutenir des actions concrètes pour les enfants",
                  "Contribuer selon vos compétences et votre disponibilité",
                  "Participer à une mission humaine et durable",
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

      <section id="engagement-choice" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
            Engagement
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Comment souhaitez-vous vous engager ?
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              type: "member" as const,
              title: "Devenir membre",
              description:
                "Rejoignez l’association pour participer durablement à sa vie, à ses projets et à ses actions. Votre adhésion renforce la continuité et la cohérence de notre mission.",
              icon: UserRound,
            },
            {
              type: "volunteer" as const,
              title: "Devenir bénévole",
              description:
                "Offrez votre temps, votre énergie et vos compétences pour soutenir les activités de l’ASO et accompagner les enfants et leurs familles.",
              icon: HandHeart,
            },
          ].map(({ type, title, description, icon: Icon }) => {
            const selected = selectedType === type;

            return (
              <div
                key={type}
                className={`rounded-[1.75rem] border p-6 transition-all duration-200 ${selected ? activeCardClass : "border-[#dfe7df] bg-white shadow-sm"}`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#0c7af8]">
                  <Icon className="size-6" />
                </div>

                <h3 className="mt-5 text-2xl font-bold text-[#070707]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#526057]">{description}</p>

                <Button
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`mt-6 rounded-full px-5 py-3 text-sm font-semibold ${selected ? "bg-[#0c7af8] text-white hover:bg-[#0a67d0]" : "border border-[#0c7af8] bg-white text-[#088efc] hover:bg-[#0c7af8] hover:text-white"}`}
                >
                  {title}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <section id="adhesion" className="mx-auto max-w-5xl scroll-mt-24 px-5 pb-16 sm:px-8 lg:px-12">
        {selectedType === "member" ? (
          membership
        ) : (
          <div className="rounded-[2rem] border border-[#dfe7df] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
                Devenir bénévole
              </p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-[#070707]">
                Devenir bénévole
              </h3>
            </div>

            <form onSubmit={onVolunteerSubmit} className="space-y-6" noValidate>
              <HoneypotField value={honeypot} onChange={setHoneypot} />
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="volunteer-firstName" className="mb-2 block text-sm font-medium text-[#070707]">
                    Nom
                  </label>
                  <Input
                    id="volunteer-firstName"
                    value={volunteerForm.lastName}
                    onChange={(event) => handleVolunteerChange("lastName", event.target.value)}
                    aria-invalid={Boolean(volunteerErrors.lastName)}
                    className={volunteerErrors.lastName ? "border-red-300 bg-red-50" : ""}
                    placeholder="Votre nom"
                  />
                  <FieldError message={volunteerErrors.lastName} />
                </div>

                <div>
                  <label htmlFor="volunteer-lastName" className="mb-2 block text-sm font-medium text-[#070707]">
                    Prénom
                  </label>
                  <Input
                    id="volunteer-lastName"
                    value={volunteerForm.firstName}
                    onChange={(event) => handleVolunteerChange("firstName", event.target.value)}
                    aria-invalid={Boolean(volunteerErrors.firstName)}
                    className={volunteerErrors.firstName ? "border-red-300 bg-red-50" : ""}
                    placeholder="Votre prénom"
                  />
                  <FieldError message={volunteerErrors.firstName} />
                </div>

                <div>
                  <label htmlFor="volunteer-email" className="mb-2 block text-sm font-medium text-[#070707]">
                    Email
                  </label>
                  <Input
                    id="volunteer-email"
                    type="email"
                    value={volunteerForm.email}
                    onChange={(event) => handleVolunteerChange("email", event.target.value)}
                    aria-invalid={Boolean(volunteerErrors.email)}
                    className={volunteerErrors.email ? "border-red-300 bg-red-50" : ""}
                    placeholder="votre@email.com"
                  />
                  <FieldError message={volunteerErrors.email} />
                </div>

                <div>
                  <label htmlFor="volunteer-phone" className="mb-2 block text-sm font-medium text-[#070707]">
                    Téléphone
                  </label>
                  <Input
                    id="volunteer-phone"
                    type="tel"
                    value={volunteerForm.phone}
                    onChange={(event) => handleVolunteerChange("phone", event.target.value)}
                    aria-invalid={Boolean(volunteerErrors.phone)}
                    className={volunteerErrors.phone ? "border-red-300 bg-red-50" : ""}
                    placeholder="+236 ..."
                  />
                  <FieldError message={volunteerErrors.phone} />
                </div>

                <div>
                  <label htmlFor="volunteer-city" className="mb-2 block text-sm font-medium text-[#070707]">
                    Ville
                  </label>
                  <Input
                    id="volunteer-city"
                    value={volunteerForm.city}
                    onChange={(event) => handleVolunteerChange("city", event.target.value)}
                    aria-invalid={Boolean(volunteerErrors.city)}
                    className={volunteerErrors.city ? "border-red-300 bg-red-50" : ""}
                    placeholder="Votre ville"
                  />
                  <FieldError message={volunteerErrors.city} />
                </div>

                <div>
                  <label htmlFor="volunteer-skills" className="mb-2 block text-sm font-medium text-[#070707]">
                    Domaine de compétence
                  </label>
                  <Input
                    id="volunteer-skills"
                    value={volunteerForm.skills}
                    onChange={(event) => handleVolunteerChange("skills", event.target.value)}
                    aria-invalid={Boolean(volunteerErrors.skills)}
                    className={volunteerErrors.skills ? "border-red-300 bg-red-50" : ""}
                    placeholder="Ex. Communication, éducation, santé..."
                  />
                  <FieldError message={volunteerErrors.skills} />
                </div>

                <div>
                  <label htmlFor="volunteer-availability" className="mb-2 block text-sm font-medium text-[#070707]">
                    Disponibilité
                  </label>
                  <select
                    id="volunteer-availability"
                    value={volunteerForm.availability}
                    onChange={(event) => handleVolunteerChange("availability", event.target.value)}
                    className={`h-10 w-full rounded-2xl border bg-input/50 px-2.5 text-base outline-none ${volunteerErrors.availability ? "border-red-300 bg-red-50" : "border-transparent"}`}
                    aria-invalid={Boolean(volunteerErrors.availability)}
                  >
                    <option value="">Sélectionner</option>
                    {availabilityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <FieldError message={volunteerErrors.availability} />
                </div>

                <div>
                  <label htmlFor="volunteer-helpType" className="mb-2 block text-sm font-medium text-[#070707]">
                    Type d’aide souhaitée
                  </label>
                  <select
                    id="volunteer-helpType"
                    value={volunteerForm.helpType}
                    onChange={(event) => handleVolunteerChange("helpType", event.target.value)}
                    className={`h-10 w-full rounded-2xl border bg-input/50 px-2.5 text-base outline-none ${volunteerErrors.helpType ? "border-red-300 bg-red-50" : "border-transparent"}`}
                    aria-invalid={Boolean(volunteerErrors.helpType)}
                  >
                    <option value="">Sélectionner</option>
                    {helpTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <FieldError message={volunteerErrors.helpType} />
                </div>
              </div>

              <div>
                <label htmlFor="volunteer-message" className="mb-2 block text-sm font-medium text-[#070707]">
                  Message
                </label>
                <Textarea
                  id="volunteer-message"
                  value={volunteerForm.message}
                  onChange={(event) => handleVolunteerChange("message", event.target.value)}
                  aria-invalid={Boolean(volunteerErrors.message)}
                  className={volunteerErrors.message ? "border-red-300 bg-red-50" : ""}
                  rows={5}
                  placeholder="Décrivez votre disponibilité, vos motivations et la façon dont vous souhaitez aider."
                />
                <FieldError message={volunteerErrors.message} />
              </div>

              <div className="rounded-2xl border border-[#dfe7df] bg-[#f4f9f5] p-4">
                <label className="flex items-start gap-3 text-sm leading-7 text-[#2c3a34]">
                  <input
                    type="checkbox"
                    checked={volunteerForm.consent}
                    onChange={(event) => handleVolunteerChange("consent", event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#b7c7b9] text-[#0c7af8] focus:ring-[#0c7af8]"
                  />
                  <span>
                    J&apos;accepte que les informations fournies soient utilisées dans le cadre du traitement de ma demande. Voir notre{" "}
                    <Link href="/confidentialite" target="_blank" className="font-semibold text-[#0c7af8] underline-offset-2 hover:underline">
                      politique de confidentialité
                    </Link>
                    .
                  </span>
                </label>
                <FieldError message={volunteerErrors.consent} />
              </div>

              {volunteerSubmitted ? (
                <div className="rounded-2xl border border-[#cfe9d5] bg-[#edfdf2] p-4 text-[#0d6b3d]">
                  <p className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="size-5" />
                    Merci pour votre engagement !
                  </p>
                </div>
              ) : null}

              {submitError ? (
                <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {submitError}
                </p>
              ) : null}

              <div className="flex justify-end">
                <Button type="submit" disabled={isSending} className="rounded-full bg-[#0c7af8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a67d0]">
                  {isSending ? "Envoi en cours…" : "Envoyer ma demande"}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

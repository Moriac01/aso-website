/**
 * Textes des emails envoyés par le site.
 *
 * Règle de sécurité pour les emails adressés au public (accusés de réception,
 * donateurs) : ils ne reprennent jamais un texte saisi dans le formulaire.
 * Sinon, n'importe qui pourrait faire envoyer par l'ASO un message de son choix
 * à une adresse de son choix. Seules des valeurs contrôlées y figurent
 * (référence générée, montant, projet choisi dans une liste).
 */
import { absoluteUrl, renderEmail, siteUrl } from "./layout";

const fcfa = (amount: number) => `${amount.toLocaleString("fr-FR").replace(/ | /g, " ")} FCFA`;

const NOT_YOU =
  "Vous recevez ce message parce que votre adresse a été indiquée dans un formulaire du site de l’ASO. Si vous n’êtes pas à l’origine de cette demande, ignorez simplement cet email.";

const AUTOMATIC = "Message automatique du site de l’ASO.";

/** Lien vers une fiche du back-office (ou vers /admin si l'adresse du site n'est pas configurée). */
const adminLink = (collection: string, id: number | string) => ({
  label: "Ouvrir dans le back-office",
  url: siteUrl() ? absoluteUrl(`/admin/collections/${collection}/${id}`) : "/admin",
});

// ——— Alertes à l'équipe ———————————————————————————————————————————————

export function contactAlert(data: { id: number | string; name: string; email: string; phone?: string; subject: string; message: string }) {
  return {
    subject: `[Site ASO] Nouveau message : ${data.subject}`,
    ...renderEmail({
      title: "Nouveau message reçu sur le site",
      paragraphs: ["Un visiteur a écrit via le formulaire de contact. Vous pouvez lui répondre directement en répondant à cet email."],
      details: [
        ["De", data.name],
        ["Email", data.email],
        ...(data.phone ? ([["Téléphone", data.phone]] as [string, string][]) : []),
        ["Sujet", data.subject],
      ],
      quote: data.message,
      signature: AUTOMATIC,
      action: adminLink("contact-messages", data.id),
      note: "Pensez à passer le message à « Traité » une fois la réponse envoyée.",
    }),
  };
}

export function applicationAlert(data: {
  id: number | string;
  type: "member" | "volunteer";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  details: [string, string][];
  text: string;
}) {
  const what = data.type === "member" ? "Demande d’adhésion" : "Candidature bénévole";
  return {
    subject: `[Site ASO] ${what} : ${data.firstName} ${data.lastName}`,
    ...renderEmail({
      title: `${what} reçue sur le site`,
      paragraphs: [
        data.type === "member"
          ? "Une personne souhaite devenir membre de l’ASO."
          : "Une personne propose son aide comme bénévole.",
      ],
      details: [
        ["Nom", `${data.firstName} ${data.lastName}`],
        ["Email", data.email],
        ["Téléphone", data.phone],
        ["Ville", data.city],
        ...data.details,
      ],
      quote: data.text,
      signature: AUTOMATIC,
      action: adminLink("applications", data.id),
      note: "Pensez à mettre à jour le statut de la demande après l’avoir traitée.",
    }),
  };
}

export function donationAlert(data: {
  id: number | string;
  reference: string;
  amount: number;
  method: string;
  transactionRef: string;
  project: string;
  donor: string;
  contact: string;
}) {
  return {
    subject: `[Site ASO] Don déclaré : ${fcfa(data.amount)} (${data.reference})`,
    ...renderEmail({
      title: "Un don vient d’être déclaré",
      paragraphs: [
        "Vérifiez sur le relevé que l’argent est bien arrivé, puis passez le don à « Reçu » (ou « Non retrouvé ») dans le back-office.",
        "Si le donateur a laissé son email, il sera prévenu automatiquement quand le don passera à « Reçu ».",
      ],
      details: [
        ["Référence du don", data.reference],
        ["Montant déclaré", fcfa(data.amount)],
        ["Moyen", data.method],
        ["Référence de la transaction", data.transactionRef],
        ["Projet", data.project],
        ["Donateur", data.donor],
        ...(data.contact ? ([["Contact", data.contact]] as [string, string][]) : []),
      ],
      signature: AUTOMATIC,
      action: adminLink("donations", data.id),
    }),
  };
}

// ——— Accusés de réception (public) ———————————————————————————————————————

const ACKNOWLEDGEMENTS = {
  contact: {
    subject: "Nous avons bien reçu votre message — ASO",
    title: "Merci pour votre message",
    paragraphs: [
      "Bonjour,",
      "Nous avons bien reçu votre message. Un membre de notre Secrétariat vous répondra dans les meilleurs délais.",
    ],
  },
  member: {
    subject: "Votre demande d’adhésion à l’ASO",
    title: "Merci de vouloir rejoindre l’ASO",
    paragraphs: [
      "Bonjour,",
      "Nous avons bien reçu votre demande d’adhésion. Notre Secrétariat l’étudie et reviendra vers vous pour la suite.",
    ],
  },
  volunteer: {
    subject: "Votre candidature bénévole à l’ASO",
    title: "Merci de proposer votre aide",
    paragraphs: [
      "Bonjour,",
      "Nous avons bien reçu votre candidature comme bénévole. Notre équipe de mobilisation vous contactera pour voir ensemble comment vous pouvez aider.",
    ],
  },
} as const;

export function acknowledgement(kind: keyof typeof ACKNOWLEDGEMENTS) {
  const { subject, title, paragraphs } = ACKNOWLEDGEMENTS[kind];
  return {
    subject,
    ...renderEmail({
      title,
      paragraphs: [...paragraphs],
      ...(siteUrl() ? { action: { label: "Découvrir nos actions", url: absoluteUrl("/actions") } } : {}),
      note: NOT_YOU,
    }),
  };
}

// ——— Donateurs ——————————————————————————————————————————————————————————

export function donationDeclared(data: { reference: string; amount: number; project: string }) {
  return {
    subject: `Merci pour votre don — référence ${data.reference}`,
    ...renderEmail({
      title: "Merci pour votre don",
      paragraphs: [
        "Bonjour,",
        "Nous avons bien reçu la déclaration de votre don. Notre Trésorerie va vérifier sa réception sur notre compte ; vous recevrez un second email dès que ce sera fait.",
        "Conservez la référence ci-dessous : elle permet de retrouver votre don si vous nous contactez.",
      ],
      details: [
        ["Référence du don", data.reference],
        ["Montant déclaré", fcfa(data.amount)],
        ["Projet soutenu", data.project],
      ],
      note: NOT_YOU,
    }),
  };
}

export function donationReceived(data: { reference: string; amount: number; project: string }) {
  return {
    subject: `Votre don ${data.reference} est bien arrivé`,
    ...renderEmail({
      title: "Votre don est bien arrivé",
      paragraphs: [
        "Bonjour,",
        "Notre Trésorerie a vérifié et confirmé la réception de votre don. Merci : grâce à vous, nous pouvons poursuivre notre action auprès des orphelins et de leurs familles.",
        "Votre don sera comptabilisé dans notre prochain rapport financier, vérifié par notre Commissaire aux comptes et publié sur notre site.",
      ],
      details: [
        ["Référence du don", data.reference],
        ["Montant", fcfa(data.amount)],
        ["Projet soutenu", data.project],
      ],
      ...(siteUrl() ? { action: { label: "Voir nos rapports financiers", url: absoluteUrl("/transparence") } } : {}),
      note: NOT_YOU,
    }),
  };
}

/**
 * Textes par défaut de la page Actions et du bloc d'adhésion. Ils s'affichent tant qu'un champ
 * est vide dans le back-office et y servent de valeurs de départ.
 * Fichier sans dépendance : importé à la fois par le site et par la configuration Payload.
 */

export type ProgramDefault = {
  title: string;
  text: string;
  points: string[];
  /** Photo du site utilisée tant qu'aucune photo n'est choisie dans le back-office. */
  image: { src: string; alt: string } | null;
};

export const FALLBACK_CHOICES = [
  { value: "news", label: "Nos dernières réalisations (2 dernières actualités, automatique)" },
  { value: "method", label: "Comment nous accompagnons un enfant (étapes ci-dessous)" },
  { value: "join", label: "Il y a toujours une place pour vous (bénévolat et don)" },
] as const;

export type FallbackChoice = (typeof FALLBACK_CHOICES)[number]["value"];

export const ACTIONS_DEFAULTS = {
  hero: {
    title: "Ce que l’ASO fait, concrètement.",
    intro:
      "Nous payons la scolarité des enfants pris en charge et suivons leurs progrès, nous remboursons la moitié de leurs frais de santé et nous rendons régulièrement visite à leurs familles.",
  },
  programsTitle: "Un accompagnement suivi, enfant par enfant.",
  programs: [
    {
      title: "Scolarité",
      text: "Nous payons la scolarité de chaque enfant pris en charge, lui remettons ses kits et fournitures scolaires, et suivons ses progrès à la maison et à l’école.",
      points: [
        "Frais de scolarité pris en charge",
        "Kits et fournitures scolaires",
        "Suivi scolaire à domicile et à l’école",
      ],
      image: { src: "/photos/scolarite-remise-kit.jpg", alt: "Une bénévole de l’ASO remet son kit scolaire à un élève" },
    },
    {
      title: "Santé",
      text: "L’ASO rembourse la moitié des frais de santé des enfants, avancés par leurs tutrices, sur présentation des factures de l’hôpital.",
      points: ["50 % des frais de santé des enfants remboursés", "Sur facture de l’hôpital"],
      image: { src: "/sant.jpg", alt: "Une soignante avec un enfant" },
    },
    {
      title: "Soutien psychosocial",
      text: "Un accompagnement pour aider les enfants et leurs familles à traverser le deuil et à reprendre confiance.",
      points: [],
      image: { src: "/photos/psychosocial-visite.jpg", alt: "L’équipe de l’ASO en visite chez une tutrice et ses enfants" },
    },
    {
      title: "Suivi des familles",
      text: "Des visites régulières à domicile pour connaître la situation de chaque famille et ajuster notre aide.",
      points: ["Visites régulières des familles", "Besoins suivis dans la durée"],
      image: { src: "/photos/suivi-familles-visites.jpg", alt: "L’équipe de l’ASO en route vers les familles, dans le quartier" },
    },
  ] satisfies ProgramDefault[],
  announcements: {
    title: "L’ASO s’agrandit.",
    intro:
      "Pour élargir notre champ de mission, nous ouvrons nos portes à de nouveaux bénévoles et à de nouveaux membres.",
  },
  fallback: {
    choice: "news" as FallbackChoice,
    news: {
      title: "Nos dernières réalisations.",
      intro: "Ce que l’ASO a fait ces dernières semaines, raconté dans nos actualités.",
    },
    method: {
      title: "Comment nous accompagnons un enfant.",
      intro: "De la première rencontre au suivi de chaque année scolaire.",
      steps: [
        { title: "Rencontre avec la famille", text: "Nous faisons connaissance avec l’enfant et sa tutrice, et évaluons ses besoins." },
        { title: "Prise en charge de la scolarité", text: "Frais de scolarité, kits et fournitures scolaires payés par l’ASO." },
        { title: "Suivi à l’école et à la maison", text: "Visites régulières pour suivre ses progrès et la vie de sa famille." },
        { title: "Santé", text: "La moitié de ses frais de santé remboursée, sur facture de l’hôpital." },
      ],
    },
    join: {
      title: "Il y a toujours une place pour vous.",
      intro: "Même sans campagne en cours, on peut aider l’ASO à tout moment.",
    },
  },
  donation: {
    title: "Chaque franc est justifié.",
    text: "Chaque remboursement de santé se fait sur facture de l’hôpital. Chaque dépense est enregistrée par notre Trésorière et figure dans nos rapports financiers, visés par notre Commissaire aux comptes.",
  },
  callToAction: {
    title: "Chaque contribution ouvre une vraie opportunité.",
    text: "Donner, devenir bénévole ou adhérer : chaque forme d’engagement compte pour les enfants.",
  },
  seo: {
    title: "Nos actions — ASO",
    description:
      "Scolarité, santé, soutien psychosocial et suivi des familles : ce que l’Association Soutien aux Orphelins fait concrètement pour les enfants de Bimbo et Bangui.",
  },
};

export const MEMBERSHIP_DEFAULTS = {
  /** Jour d'ouverture des adhésions (campagne 2026–2027). */
  openingDate: "2026-11-30T12:00:00.000Z",
  title: "Devenir membre de l’ASO",
  intro:
    "Membre actif, vous participez aux activités et aux décisions de l’association. Membre bienfaiteur, vous la soutenez par un don libre, à titre personnel ou au nom d’une organisation.",
  notifyMessage: "Bonjour, je souhaite être prévenu(e) de l’ouverture des adhésions à l’ASO.",
};

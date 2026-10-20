/**
 * Textes de la page d'accueil par défaut. Ils s'affichent tant qu'un champ est vide
 * dans le back-office (Contenu → Page d'accueil) et y servent de valeurs de départ.
 * Fichier sans dépendance : importé à la fois par le site et par la configuration Payload.
 */

export type HomePillarDefault = {
  title: string;
  text: string;
  /** Photo du site utilisée tant qu'aucune photo n'est choisie dans le back-office. */
  image: { src: string; alt: string } | null;
};

export const HOME_DEFAULTS = {
  hero: {
    title: "Offrir espoir et avenir aux orphelins de Bimbo.",
    subtitle:
      "Avec votre soutien, l’ASO accompagne des enfants orphelins dans leur scolarité, leur santé et leur épanouissement.",
    image: { src: "/IMG-20250913-WA0014.jpg", alt: "Enfant accompagné par l’association" },
    caption: "Donnez le sourire pour un avenir meilleur.",
  },
  story:
    "Une équipe de jeunes professionnels, présidée par Emmanuel MADOUKOU, agit pour que chaque enfant orphelin puisse étudier, grandir et se reconstruire.",
  pillarsTitle: "Trois engagements pour l’avenir des enfants et de leurs familles.",
  pillars: [
    {
      title: "Éducation",
      text: "Frais de scolarité, fournitures et suivi régulier des orphelins pris en charge, pour qu’ils réussissent à l’école.",
      image: { src: "/edu.jpg", alt: "Enfants pendant le soutien scolaire" },
    },
    {
      title: "Santé",
      text: "Accompagnement des familles et accès aux soins essentiels pour une vie plus saine.",
      image: { src: "/sant.jpg", alt: "Une soignante avec un enfant" },
    },
    {
      title: "Soutien psychosocial",
      text: "Un accompagnement pour aider les enfants et leurs familles à traverser le deuil et à reprendre confiance.",
      image: { src: "/IMG-20250913-WA0016.jpg", alt: "Enfant assis contre un mur" },
    },
  ] satisfies HomePillarDefault[],
  approach: {
    title: "De l’aide d’urgence à l’accompagnement durable.",
    text: "Nous ne voulons pas seulement répondre aux besoins du jour. Nous construisons des solutions qui durent : l’école, les soins et un suivi régulier des enfants et de leurs familles.",
    cards: [
      { label: "Pour les enfants", text: "Scolarité payée, fournitures et suivi régulier, jusqu’à la réussite." },
      { label: "Pour les familles", text: "Un accompagnement psychosocial pour traverser le deuil et reprendre confiance." },
    ],
  },
  callToAction: {
    title: "Donnez un avenir à ceux qui en ont besoin.",
    text: "Votre don finance la scolarité, les soins et l’accompagnement des enfants. Chaque don est vérifié par notre Trésorerie et figure dans nos rapports financiers.",
  },
};

/**
 * Rôles du back-office, calqués sur les fonctions du Bureau Exécutif
 * (PV de l'Assemblée Générale du 24 janvier 2026).
 *
 * Principe : un rôle = une fonction, pas une personne. Une personne peut
 * cumuler plusieurs rôles (ex. Vice-Président chargé de la communication).
 */
export const ROLES = {
  admin: "admin",
  tech: "tech",
  communication: "communication",
  secretariat: "secretariat",
  tresorerie: "tresorerie",
  controle: "controle",
  mobilisation: "mobilisation",
  consultation: "consultation",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const roleOptions: { label: string; value: Role; description: string }[] = [
  {
    value: "admin",
    label: "Président — administrateur",
    description: "Tout, dont la gestion des comptes et la publication des rapports financiers.",
  },
  {
    value: "tech",
    label: "Administrateur technique",
    description: "Maintenance du site : comptes, réglages, contenus. Ne vise ni ne publie les rapports financiers.",
  },
  {
    value: "communication",
    label: "Communication",
    description: "Actualités, équipe, images, chiffres clés.",
  },
  {
    value: "secretariat",
    label: "Secrétariat",
    description: "Messages de contact et demandes d'adhésion.",
  },
  {
    value: "tresorerie",
    label: "Trésorerie",
    description: "Dépose et met à jour les rapports financiers (sans les publier).",
  },
  {
    value: "controle",
    label: "Commissaire aux comptes",
    description: "Lit tout, journal compris ; seule action : viser les rapports financiers.",
  },
  {
    value: "mobilisation",
    label: "Mobilisation",
    description: "Candidatures bénévoles et demandes d'adhésion.",
  },
  {
    value: "consultation",
    label: "Consultation",
    description: "Lecture du contenu, sans accès aux données personnelles.",
  },
];

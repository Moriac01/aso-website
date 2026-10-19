export type PersonType = "executive" | "member" | "volunteer";

export interface Person {
  id: string;
  name: string;
  role: string;
  photo: string;
  description?: string;
  type: PersonType;
}

export const people: Person[] = [
  {
    id: "president",
    name: "Nom du président",
    role: "Président",
    photo: "/IMG-20250913-WA0015.jpg",
    description: "Responsable de la direction générale de l’association et de son pilotage stratégique.",
    type: "executive",
  },
  {
    id: "vice-president",
    name: "Nom du vice-président",
    role: "Vice-président",
    photo: "/IMG-20250913-WA0016.jpg",
    description: "Appuie la coordination des actions et la mise en œuvre des décisions de l’équipe.",
    type: "executive",
  },
  {
    id: "secretary",
    name: "Nom du secrétaire",
    role: "Secrétaire",
    photo: "/edu.jpg",
    description: "Assure la tenue des dossiers, le suivi des échanges et la coordination administrative.",
    type: "executive",
  },
  {
    id: "treasurer",
    name: "Nom du trésorier",
    role: "Trésorier",
    photo: "/sant.jpg",
    description: "Pilotage de la gestion financière et du suivi des ressources allouées aux actions.",
    type: "executive",
  },
  {
    id: "member-1",
    name: "Membre à compléter",
    role: "Membre",
    photo: "/IMG-20250913-WA0015.jpg",
    description: "Participe activement aux actions de terrain et au développement des initiatives associatives.",
    type: "member",
  },
  {
    id: "member-2",
    name: "Membre à compléter",
    role: "Membre",
    photo: "/IMG-20250913-WA0016.jpg",
    description: "Contribue aux projets de sensibilisation, de suivi et d’accompagnement des familles.",
    type: "member",
  },
  {
    id: "member-3",
    name: "Membre à compléter",
    role: "Membre",
    photo: "/edu.jpg",
    description: "Soutient les activités associatives et la mise en place des réponses adaptées.",
    type: "member",
  },
  {
    id: "volunteer-1",
    name: "Bénévole à compléter",
    role: "Bénévole",
    photo: "/sant.jpg",
    description: "Aide à l’organisation des actions et au soutien humain dans les missions de terrain.",
    type: "volunteer",
  },
  {
    id: "volunteer-2",
    name: "Bénévole à compléter",
    role: "Bénévole",
    photo: "/IMG-20250913-WA0015.jpg",
    description: "Participe à l’accompagnement, à la mise en relation et au soutien logistique.",
    type: "volunteer",
  },
];

export type NewsStatus = "published" | "draft";

export type News = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  publishedAt: string;
  status: NewsStatus;
  featured?: boolean;
};

export const news: News[] = [
  {
    id: "news-01",
    slug: "soutien-scolaire-etoile",
    title: "Un soutien scolaire plus accessible pour les enfants",
    excerpt:
      "Grâce à une organisation pensée avec les familles, les enfants bénéficient d’un accompagnement régulier et bienveillant.",
    content:
      "Depuis plusieurs mois, l’association a renforcé son accompagnement scolaire pour offrir à chaque enfant un cadre plus sûr et plus stimulant.\n\nLes ateliers de soutien, les échanges avec les familles et le suivi des besoins pédagogiques permettent d’aider les élèves à reprendre confiance en eux. Chaque parcours est pensé pour s’adapter à la situation de chacun, avec une attention particulière à la régularité et au bien-être.\n\nCette initiative répond à un besoin concret : donner plus de chances de réussite aux enfants dans un environnement plus serein et plus motivant.",
    image: "/edu.jpg",
    category: "Éducation",
    publishedAt: "2026-09-01",
    status: "published",
    featured: true,
  },
  {
    id: "news-02",
    slug: "campagne-bien-etre-familles",
    title: "La santé et le bien-être au cœur des actions de l’ASO",
    excerpt:
      "Une campagne de sensibilisation et d’accompagnement a été mise en place pour renforcer la santé et le bien-être des familles.",
    content:
      "Dans le cadre de ses missions, l’ASO a lancé une campagne dédiée à la santé et au bien-être des enfants et des familles accompagnées.\n\nL’objectif est de mieux informer, d’encourager les bons gestes et de faire circuler les bonnes pratiques autour de l’hygiène, de la nutrition et de l’accès aux soins. Les échanges sont organisés avec des familles, des partenaires et des bénévoles afin de proposer des solutions concrètes et durables.\n\nCette approche permet de mieux répondre aux besoins humains et de renforcer la résilience des familles dans leur quotidien.",
    image: "/sant.jpg",
    category: "Santé",
    publishedAt: "2026-08-18",
    status: "published",
    featured: true,
  },
  {
    id: "news-03",
    slug: "rencontre-benevoles-aso",
    title: "Une rencontre inspirante avec nos bénévoles et partenaires",
    excerpt:
      "Une journée de partage a permis de renforcer les liens entre les équipes, les bénévoles et les familles accompagnées.",
    content:
      "L’association a organisé une rencontre spéciale autour du bénévolat, des échanges et des projets à venir.\n\nCette journée a permis d’assembler les personnes qui portent la mission de l’ASO dans leur quotidien, et d’échanger sur les besoins, les réalités terrain et les idées d’action pour les prochains mois.\n\nAu-delà des échanges, cette rencontre a renforcé l’esprit de communauté et la volonté partagée d’aider les enfants et leurs familles avec plus d’empathie et de cohérence.",
    image: "/IMG-20250913-WA0015.jpg",
    category: "Communauté",
    publishedAt: "2026-08-05",
    status: "published",
    featured: true,
  },
  {
    id: "news-04",
    slug: "atelier-ecoute-familles",
    title: "Atelier d’écoute pour renforcer le soutien aux familles",
    excerpt:
      "Des échanges simples et bienveillants ont permis de mieux identifier les besoins auxquels répondre au quotidien.",
    content:
      "Le dernier atelier d’écoute organisé par l’ASO a permis de réunir plusieurs familles afin d’identifier ensemble les besoins prioritaires et les solutions les plus adaptées.\n\nLes échanges ont mis en lumière l’importance d’un accompagnement régulier, humain et concret. L’association continue d’ajuster ses actions pour répondre au mieux à ces réalités de terrain, avec un souci constant du respect, de la dignité et du bien-être.\n\nLes familles ont ainsi pu partager leurs difficultés, leurs espoirs et les pistes de soutien qu’elles souhaitent voir se développer.",
    image: "/IMG-20250913-WA0014.jpg",
    category: "Accompagnement",
    publishedAt: "2026-07-20",
    status: "published",
  },
  {
    id: "news-05",
    slug: "projet-en-cours-2026",
    title: "Projet 2026 en préparation pour renforcer les actions locales",
    excerpt:
      "L’équipe prépare une nouvelle série d’actions pour mieux répondre aux besoins des enfants et des familles.",
    content:
      "L’association travaille actuellement sur un programme de développement qui vise à renforcer les actions de proximité et améliorer la qualité de son accompagnement.\n\nLes priorités seront orientées vers l’éducation, la santé et le soutien social, avec une attention particulière à des réponses concrètes et durables.\n\nCe projet est encore en cours de préparation, et l’équipe continue d’échanger avec les familles, les partenaires et les bénévoles pour bâtir des actions utiles et cohérentes.",
    image: "/IMG-20250913-WA0016.jpg",
    category: "Projets",
    publishedAt: "2026-07-10",
    status: "draft",
  },
];

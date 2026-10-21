import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

/**
 * Contenu de départ : les deux annonces de la campagne 2026–2027 (affiches du pôle Communication
 * et plan de campagne d'adhésion). Ajoutées seulement s'il n'existe encore aucune annonce ;
 * elles restent ensuite entièrement modifiables dans le back-office (Contenu → Annonces).
 * Les affiches elles-mêmes sont à ajouter dans l'onglet « Page détaillée ».
 */

const context = { skipRevalidate: true, skipAudit: true };

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { totalDocs } = await payload.count({ collection: "announcements", req });
  if (totalDocs > 0) return;

  await payload.create({
    collection: "announcements",
    req,
    context,
    data: {
      title: "Appel à candidatures : pôle Communication",
      slug: "pole-communication",
      kind: "candidatures",
      summary:
        "L’ASO recrute 3 bénévoles pour faire connaître son action : rédaction et réseaux sociaux, photo et vidéo, visuels.",
      startDate: "2026-10-16T12:00:00.000Z",
      endDate: "2026-11-15T12:00:00.000Z",
      visible: true,
      button: { action: "details", label: "Je postule" },
      banner: {
        show: true,
        text: "Appel à candidatures : 3 postes bénévoles au pôle Communication, jusqu’au 15 novembre.",
      },
      details: {
        intro:
          "9 enfants sur 10 ont réussi leur année. Il nous manque des voix pour le raconter. Pas besoin d’être expert : il faut être engagé(e).",
        positions: [
          {
            title: "Rédacteur(trice) & Community manager",
            text: "Faire vivre nos pages Facebook, LinkedIn et WhatsApp, répondre à la communauté, rédiger comptes rendus et communiqués, garder le lien avec la presse et les partenaires.",
          },
          {
            title: "Photographe / Vidéaste terrain",
            text: "Couvrir nos descentes (remises de kits, visites aux familles), constituer notre banque d’images et tourner de courtes vidéos.",
          },
          {
            title: "Graphiste / Créateur(trice) visuel",
            text: "Concevoir affiches et visuels aux couleurs de l’ASO (Canva ou autre), réaliser des montages simples.",
          },
        ],
        profile: [
          { text: "Passionné(e) par la cause des orphelins et des enfants vulnérables" },
          { text: "Des bases dans le domaine du poste visé, ou l’envie d’apprendre" },
          { text: "Français et sango" },
          { text: "Temps partiel, présent(e) aux réunions et sorties" },
          { text: "Basé(e) à Bangui ou dans ses environs" },
          { text: "Smartphone ou ordinateur : un vrai atout" },
        ],
        benefits: [
          { text: "Une expérience concrète à valoriser sur votre CV" },
          { text: "Votre connexion internet prise en charge" },
          { text: "Une équipe jeune, rigoureuse et soudée" },
          { text: "Des responsabilités qui grandissent avec votre engagement" },
        ],
        apply: {
          method: "email",
          email: "contact.aso236@gmail.com",
          subjectPrefix: "Candidature",
          instructions:
            "Envoyez votre CV et votre lettre de motivation avant le 15 novembre 2026, en précisant le poste visé en objet.",
        },
      },
    },
  });

  await payload.create({
    collection: "announcements",
    req,
    context,
    data: {
      title: "Campagne d’adhésion 2026–2027",
      slug: "adhesion-2026-2027",
      kind: "adhesion",
      summary: "Devenez membre actif ou bienfaiteur de l’ASO et participez à ses décisions.",
      startDate: "2026-11-30T12:00:00.000Z",
      endDate: "2027-01-27T12:00:00.000Z",
      visible: true,
      button: { action: "link", url: "/adherer", label: "Adhérer", labelBeforeStart: "Être prévenu" },
      banner: { show: true, text: "Les adhésions 2026–2027 sont ouvertes jusqu’au 27 janvier." },
      details: { apply: { method: "none" } },
    },
  });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.delete({
    collection: "announcements",
    req,
    context,
    where: { slug: { in: ["pole-communication", "adhesion-2026-2027"] } },
  });
}

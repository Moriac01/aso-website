# Back-office et backend — ASO

Le backend vit **dans la même application Next.js** que le site, grâce à
[Payload CMS](https://payloadcms.com) (v3) et une base **PostgreSQL (Neon)**.

- Site public : `/`, `/about`, `/actions`, `/news`, `/volunteers`, `/contact`, `/transparence`, `/donate`,
  `/mentions-legales`, `/confidentialite`
- Back-office : `/admin`
- API REST (lecture du contenu public) : `/api/...`

## Démarrage en local

1. **Base de données** : créez un projet sur [Neon](https://neon.tech), puis une branche `dev`.
   Copiez la chaîne de connexion « Pooled connection ».
2. **Variables d'environnement** :
   ```bash
   cp frontend/.env.example frontend/.env
   # puis remplissez DATABASE_URL et PAYLOAD_SECRET (openssl rand -hex 32)
   ```
3. **Installation et lancement** :
   ```bash
   bun install
   bun run migrate     # crée les tables dans la base
   bun run seed        # (facultatif) contenu de départ : actualités, équipe, chiffres clés
   bun dev
   ```
4. Ouvrez http://localhost:3000/admin et créez le **premier compte** : il devient
   automatiquement administrateur.

## Structure

```
frontend/
  app/(site)/            → pages publiques (front)
  app/(payload)/         → back-office /admin et API — fichiers générés par Payload, ne pas modifier
  payload.config.ts      → configuration du back-office
  server/
    payload/
      collections/       → modèles de données (Actualités, Équipe, Messages…)
      globals/           → réglages uniques (Chiffres clés, Coordonnées)
      access.ts          → règles d'accès (rôles admin / éditeur)
      migrations/        → historique du schéma de la base (versionné)
      payload-types.ts   → types TypeScript générés (bun run generate:types)
    actions/forms.ts     → Server Actions des formulaires publics
  lib/validation/        → schémas Zod partagés front/back (le « contrat »)
```

## Rôles et responsabilités

Les rôles suivent les fonctions du Bureau Exécutif (PV de l'Assemblée Générale du 24/01/2026).
Un compte peut cumuler plusieurs rôles ; chaque personne ne voit dans le menu que ce qui la concerne.

| Rôle | Fonction au PV | Peut faire |
|---|---|---|
| Président — administrateur | Président | Tout ; seul à attribuer le rôle admin ; publie les rapports financiers |
| Administrateur technique | Vice-Président (développement du site) | Comptes (sauf rôle admin), réglages, contenus ; aucune donnée personnelle |
| Communication | Chargé de communication (intérim : Vice-Président) | Actualités, équipe, images, chiffres clés |
| Secrétariat | Secrétaire Générale | Messages de contact, adhésions et bénévolat |
| Trésorerie | Trésorière Générale | Dépose et met à jour les rapports financiers, sans les publier |
| Commissaire aux comptes | Commissaire aux Comptes | Lit tout, journal compris ; seule action : viser les rapports |
| Mobilisation | 1er et 2e Mobilisateurs | Adhésions et bénévolat |
| Consultation | Conseillers | Lecture du contenu, sans données personnelles |

**Rapports financiers, règle des « quatre yeux »** : la Trésorerie dépose → le Commissaire aux
comptes vise (son nom et la date sont enregistrés) → le Président publie. Publication impossible
sans visa ; toute modification d'un rapport visé annule le visa et le dépublie.

**Sécurité des comptes** : pas d'inscription publique ; il reste toujours au moins un administrateur
actif ; 5 échecs de connexion = blocage 15 min ; session de 8 h ; un compte peut être désactivé, et la
connexion est refusée après la date de fin de mandat (mandat du bureau : 3 ans, jusqu'en janvier 2029).

**Journal des modifications** (Administration → Journal) : chaque création, modification ou
suppression est enregistrée (qui, quoi, quels champs, quand). Personne ne peut le modifier ni l'effacer.
Lecture : Président, administrateur technique, Commissaire aux comptes.

## Affichage sur le site

Les pages Accueil (chiffres clés, actualités à la une), Actualités et À propos (équipe)
lisent le contenu du back-office via `server/content/` :

- le contenu est mis en cache ; **quand l'équipe publie ou modifie** une actualité, un membre,
  une image ou les chiffres clés, le cache est invalidé et le site affiche la nouvelle version
  au prochain chargement de la page (pas de redéploiement) ;
- les **brouillons** ne sont jamais affichés ;
- si la base est injoignable, le site reste en ligne : les sections concernées sont simplement
  masquées et l'erreur est journalisée (`[contenu] … indisponible`).

## Page Transparence (`/transparence`)

Affiche automatiquement les rapports financiers **publiés et visés**, avec la mention du visa
(nom du Commissaire aux comptes et date) et le lien de téléchargement, ainsi que l'identité
légale de l'association (Administration → Coordonnées & réseaux → Identité légale).
Les PDF non publiés restent inaccessibles au public, même avec leur adresse exacte.

## Dons (`/donate`)

Version sans paiement en ligne, entièrement traçable :

1. Le donateur envoie l'argent sur un compte de l'ASO affiché sur la page (Orange Money ;
   virement bancaire à ajouter quand le compte sera ouvert).
2. Il déclare son don : montant, référence de la transaction (SMS), projet soutenu, nom ou
   don anonyme. Il reçoit une référence de don (ex. `DON-2026-7K3QXM`).
3. Le don arrive dans **Transparence → Dons** avec le statut « Déclaré ». La Trésorerie vérifie
   la réception sur le relevé et le passe à « Reçu » ou « Non retrouvé » (son nom et la date sont
   enregistrés, l'action est inscrite au journal).

Les informations déclarées (montant, référence, donateur…) sont figées : personne ne peut les
modifier après coup. Lecture : Président, Trésorerie, Commissaire aux comptes.

**Mettre en service** : Transparence → Moyens de don → Orange Money : saisir le numéro du compte
**au nom de l'association**, cocher « Afficher sur le site ». Tant qu'aucun moyen n'est actif,
la page affiche un message d'attente et pas de formulaire.

## Coordonnées (page Contact et pied de page)

La page Contact (téléphone, email, adresse, itinéraire, réseaux sociaux) et le pied de page
lisent Administration → Coordonnées & réseaux (`server/content/contact.ts`). Ce qui est vide
n'est pas affiché ; sans adresse saisie, le siège social de l'identité légale est utilisé.
Un numéro à 8 chiffres est composé avec l'indicatif +236 ; pour WhatsApp, le numéro suffit.

## Mentions légales et confidentialité

`/mentions-legales` et `/confidentialite` reprennent automatiquement l'identité légale, le
directeur de la publication et les coordonnées saisis dans Administration → Coordonnées & réseaux.
Le reste du texte (hébergeurs, durées de conservation, droits) est dans le code des pages :
**à mettre à jour si l'hébergeur ou les pratiques changent** (et la date « Dernière mise à jour »).

Durées de conservation annoncées : messages 5 ans, adhésions et bénévolat 5 ans après la fin de
l'engagement, dons 10 ans. Leur suppression n'est pas encore automatique (voir plus bas).

## Page Actions, annonces et adhésion

- **Contenu → Page Actions** : textes de la page `/actions` (haut de page, programmes, appel final, titre Google). Tout champ vidé reprend le texte d'origine (`server/content/actions-defaults.ts`). Un programme peut être préparé à l'avance (case « Afficher » décochée).
- **Contenu → Annonces** : appels à candidatures, campagne d'adhésion, événements. Chaque annonce a une date de début et une date de fin : l'étiquette (« À partir du… », « En cours · jusqu'au… ») et l'affichage sont calculés à l'heure de Bangui (`lib/dates.ts`, `lib/announcements.ts`). Une annonce terminée disparaît, sauf si une actualité « compte rendu » est liée (affichée encore 30 jours). Option : bandeau en haut de l'accueil pendant l'annonce.
- **Page détaillée** `/annonces/<slug>` : postes (un bouton « Postuler » par poste, email avec objet pré-rempli), profil, avantages, consignes, affiches, question WhatsApp. Réponse possible par email, par un lien (Microsoft Forms…) ou par le formulaire bénévole.
- **Sans annonce en cours ou à venir**, la section affiche le contenu de secours choisi dans Page Actions : dernières actualités, « Comment nous accompagnons un enfant » (étapes) ou « Il y a toujours une place pour vous ».
- **Contenu → Adhésion** : lien du formulaire Microsoft Forms, dates d'ouverture et de clôture, message WhatsApp « Être prévenu ». Bloc affiché sur `/volunteers` (« Devenir membre »), adresse courte `/adherer`. Les montants de cotisation ne figurent que dans le formulaire.
- Les deux annonces de la campagne 2026–2027 sont créées par la migration `20261020_215900_annonces_initiales` (seulement si aucune annonce n'existe).

## Formulaires publics

Contact, adhésion et bénévolat passent par des **Server Actions** (`server/actions/forms.ts`) :

1. validation serveur avec les schémas Zod de `lib/validation/forms.ts` ;
2. champ piège anti-robots (les envois de robots sont ignorés silencieusement) ;
3. enregistrement dans le back-office (statut « Nouveau ») ;
4. emails : alerte à l'équipe concernée et accusé de réception à la personne (voir « Emails »).

Les collections de demandes refusent toute création via l'API publique : seules les
Server Actions peuvent écrire.

## Emails

Envoyés par le compte **Gmail de l'association** (SMTP), après la réponse au visiteur :
le formulaire reste rapide et un problème d'email ne fait jamais échouer une demande
(il est seulement journalisé : `Email non envoyé`).

| Événement | Équipe alertée | Email à la personne |
|---|---|---|
| Message de contact | Secrétariat (« Répondre » écrit directement au visiteur) | Accusé de réception |
| Demande d'adhésion | Secrétariat, Mobilisation | Accusé de réception |
| Candidature bénévole | Mobilisation, Secrétariat | Accusé de réception |
| Don déclaré | Trésorerie | Confirmation avec la référence `DON-…` (si email donné) |
| Don passé à « Reçu » | — | « Votre don est bien arrivé » (si email donné) |

- **Destinataires des alertes** : les comptes actifs, au mandat en cours, qui ont le rôle
  concerné, plus la boîte générale (Administration → Coordonnées & réseaux → « Email qui reçoit
  les notifications »). Si personne n'a encore le rôle, les administrateurs sont prévenus.
- **Sécurité** : les emails envoyés au public ne recopient jamais un texte saisi dans le
  formulaire (sinon n'importe qui pourrait faire envoyer par l'ASO un message de son choix).
  Tout texte saisi est échappé dans les emails de l'équipe.
- Textes des emails : `server/email/messages.ts` ; mise en page : `server/email/layout.ts`.

**Configurer Gmail** (une fois, avec le compte Gmail de l'ASO) :

1. Compte Google → Sécurité → activer la **Validation en deux étapes**.
2. Compte Google → Sécurité → **Mots de passe des applications** → créer « Site ASO » :
   Google affiche un code de 16 lettres.
3. Dans `frontend/.env` (et plus tard dans les variables d'environnement de l'hébergeur) :
   ```bash
   SMTP_USER=adresse.de.lassociation@gmail.com
   SMTP_PASS=lecodede16lettres   # sans espaces
   ```
4. Redémarrez `bun dev`. Sans ces deux variables, les emails s'affichent seulement dans la console.

Limite Gmail : environ 500 emails par jour, largement suffisant. Pour passer plus tard à un
service avec nom de domaine (Resend, Brevo…), il suffit de changer `SMTP_HOST`, `SMTP_PORT`,
`SMTP_USER`, `SMTP_PASS` et `EMAIL_FROM` : aucun code à modifier.

## Modifier le schéma de données

`bun dev` **ne modifie jamais** la structure de la base (`push: false`) : tout passe par des
migrations versionnées, identiques chez chaque développeur et en production.

Après avoir modifié une collection :

```bash
bun run generate:types            # met à jour payload-types.ts
bun run migrate:create nom-court  # crée une migration
bun run migrate                   # l'applique en local
```

Commitez la migration avec le code. En production, les migrations en attente sont
appliquées automatiquement au démarrage (`prodMigrations`).

Si vous ajoutez un composant personnalisé dans l'admin : `bun run generate:importmap`.

## Commandes utiles

| Commande | Rôle |
|---|---|
| `bun dev` | Lancer le site + back-office |
| `bun run build` | Build de production |
| `bun run lint` / `bun run typecheck` | Vérifications |
| `bun run migrate` | Appliquer les migrations |
| `bun run seed` | Importer le contenu de départ (ignore ce qui existe déjà) |

## Dépannage

**`git switch` refuse : « Your local changes to … payload-types.ts would be overwritten »**
Ce fichier est généré. Écartez la copie locale puis changez de branche :

```bash
git restore frontend/server/payload/payload-types.ts
```

Depuis cette version, `bun dev` ne le régénère plus : seulement `bun run generate:types`.

**« It looks like you've run Payload in dev mode… Would you like to proceed? »**
La base a été modifiée « à la volée » par une ancienne version du projet. Répondez `N`, puis
dans Neon → *SQL Editor* (sur la bonne branche) exécutez :

```sql
DELETE FROM payload_migrations WHERE batch = -1;
```

puis relancez `bun run migrate`.

## Mise en production (Vercel)

**Stockage des fichiers** : en local, images et PDF vont dans `frontend/uploads/` (ignoré
par Git). Sur Vercel, le disque n'est pas permanent : dès que `BLOB_READ_WRITE_TOKEN` est
défini, ils vont sur **Vercel Blob** (`@payloadcms/storage-vercel-blob`).

- Images (`media`) : servies directement par le CDN de Vercel.
- Rapports financiers : toujours servis par `/api/financial-reports/file/…`, qui vérifie
  qu'ils sont publiés et visés. Chaque envoi depuis le back-office est rangé dans un dossier
  au nom aléatoire (`_objectKey`), l'adresse brute est donc impossible à deviner.
- Envoi direct du navigateur vers Blob (`clientUploads`) : pas de limite de 4,5 Mo.
- `importMap.js` contient le composant d'envoi Blob. Pour le régénérer, définir un jeton au
  bon format, sinon il disparaît :
  `BLOB_READ_WRITE_TOKEN=vercel_blob_rw_x_y bun run generate:importmap`

**Variables d'environnement sur Vercel** (Settings → Environment Variables, Production) :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | Neon, projet `aso-production`, « Pooled connection » |
| `PAYLOAD_SECRET` | Nouvelle clé (`openssl rand -hex 32`), différente de celle du développement |
| `NEXT_PUBLIC_SERVER_URL` | `https://aso-website.vercel.app`, puis `https://aso-rca.org` |
| `BLOB_READ_WRITE_TOKEN` | Ajoutée automatiquement en reliant un stockage Blob (Storage → Blob) |
| `SMTP_USER` / `SMTP_PASS` | Compte Gmail de l'ASO et mot de passe d'application |

Puis **Redeploy**. Les migrations s'appliquent automatiquement au démarrage.

**Remplir la base de production** depuis un poste de développement (Git Bash), avec les
valeurs de production le temps de la commande (elles priment sur `frontend/.env`) :

```bash
DATABASE_URL="…production…" PAYLOAD_SECRET="…production…" BLOB_READ_WRITE_TOKEN="…" \
NEXT_PUBLIC_SERVER_URL="https://aso-website.vercel.app" bun run migrate
# même ligne avec « bun run seed » à la place de « bun run migrate »
```

Puis ouvrir `/admin` en ligne et créer le compte du Président (le premier compte est
administrateur).

## À faire avant la mise en production
- **Emails** : renseigner `SMTP_USER` / `SMTP_PASS` (Gmail de l'ASO) chez l'hébergeur.
- **Limiter le nombre d'envois par visiteur** (anti-abus des formulaires) une fois l'hébergeur
  choisi (ex. règle de pare-feu Vercel).
- Brancher les autres contenus encore écrits en dur (page Actions, chiffres de la page
  À propos) sur le back-office.
- Base Neon de production distincte de la base de développement.
- Suppression automatique des données au-delà des durées annoncées dans la politique de
  confidentialité (tâche planifiée).
- Renseigner l'email public et l'adresse exacte du siège (Coordonnées & réseaux) : ils
  apparaissent dans les mentions légales et la politique de confidentialité.

## Protection des données

- Ne publiez aucune information permettant d'identifier un enfant (nom complet, école,
  adresse). Photos d'enfants uniquement avec le consentement du tuteur.
- Les demandes reçues contiennent des données personnelles : accès limité à l'équipe,
  suppression réservée aux administrateurs.

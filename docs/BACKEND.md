# Back-office et backend — ASO

Le backend vit **dans la même application Next.js** que le site, grâce à
[Payload CMS](https://payloadcms.com) (v3) et une base **PostgreSQL (Neon)**.

- Site public : `/`, `/about`, `/actions`, `/news`, `/volunteers`, `/contact`
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

## Formulaires publics

Contact, adhésion et bénévolat passent par des **Server Actions** (`server/actions/forms.ts`) :

1. validation serveur avec les schémas Zod de `lib/validation/forms.ts` ;
2. champ piège anti-robots (les envois de robots sont ignorés silencieusement) ;
3. enregistrement dans le back-office (statut « Nouveau ») ;
4. notification par email à l'adresse définie dans *Coordonnées & réseaux*
   (sans service d'email configuré, l'email est seulement affiché dans la console).

Les collections de demandes refusent toute création via l'API publique : seules les
Server Actions peuvent écrire.

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

**« It looks like you've run Payload in dev mode… Would you like to proceed? »**
La base a été modifiée « à la volée » par une ancienne version du projet. Répondez `N`, puis
dans Neon → *SQL Editor* (sur la bonne branche) exécutez :

```sql
DELETE FROM payload_migrations WHERE batch = -1;
```

puis relancez `bun run migrate`.

## À faire avant la mise en production

- **Stockage des fichiers** : les images et PDF sont stockés sur le disque en local
  (`frontend/uploads/`, ignoré par Git). Sur Vercel, le disque n'est pas persistant :
  il faudra un stockage objet (ex. Vercel Blob ou S3) via un plugin Payload.
- **Service d'email** (ex. Resend) pour les notifications.
- Brancher les autres contenus encore écrits en dur (page Actions, chiffres de la page
  À propos, coordonnées du pied de page) sur le back-office.
- Base Neon de production distincte de la base de développement.

## Protection des données

- Ne publiez aucune information permettant d'identifier un enfant (nom complet, école,
  adresse). Photos d'enfants uniquement avec le consentement du tuteur.
- Les demandes reçues contiennent des données personnelles : accès limité à l'équipe,
  suppression réservée aux administrateurs.

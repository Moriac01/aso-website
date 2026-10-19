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

## Contenu du back-office

| Section | Contenu | Qui peut lire |
|---|---|---|
| Contenu | Actualités (brouillon/publié), Équipe, Images, Chiffres clés | Public (publié seulement) |
| Transparence | Rapports financiers (PDF) | Public si « Publié sur le site » |
| Demandes reçues | Messages de contact, Adhésions & bénévolat | Équipe connectée uniquement |
| Administration | Comptes, Coordonnées & réseaux | Administrateurs |

Rôles : **Administrateur** (tout, y compris les comptes) et **Éditeur** (contenu et suivi des demandes).

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

## À faire avant la mise en production

- **Stockage des fichiers** : les images et PDF sont stockés sur le disque en local
  (`frontend/uploads/`, ignoré par Git). Sur Vercel, le disque n'est pas persistant :
  il faudra un stockage objet (ex. Vercel Blob ou S3) via un plugin Payload.
- **Service d'email** (ex. Resend) pour les notifications.
- **Afficher le contenu du back-office sur les pages publiques** (actualités, équipe,
  chiffres clés) à la place des données écrites en dur dans `data/` et `app/(site)/about/data.ts`.
- Base Neon de production distincte de la base de développement.

## Protection des données

- Ne publiez aucune information permettant d'identifier un enfant (nom complet, école,
  adresse). Photos d'enfants uniquement avec le consentement du tuteur.
- Les demandes reçues contiennent des données personnelles : accès limité à l'équipe,
  suppression réservée aux administrateurs.

import { revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

/**
 * Quand l'équipe publie ou modifie un contenu, le site se met à jour
 * au prochain affichage de la page (pas besoin de redéployer).
 */
function revalidate(tags: string[], logger?: { warn: (msg: string) => void }) {
  for (const tag of tags) {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch {
      // Hors d'une requête Next.js (script, migration) : rien à invalider.
      logger?.warn(`Cache « ${tag} » non invalidé (hors serveur Next.js).`);
    }
  }
}

export const revalidateAfterChange =
  (...tags: string[]): CollectionAfterChangeHook =>
  ({ doc, req }) => {
    if (!req.context?.skipRevalidate) revalidate(tags, req.payload.logger);
    return doc;
  };

export const revalidateAfterDelete =
  (...tags: string[]): CollectionAfterDeleteHook =>
  ({ doc, req }) => {
    if (!req.context?.skipRevalidate) revalidate(tags, req.payload.logger);
    return doc;
  };

export const revalidateGlobal =
  (...tags: string[]): GlobalAfterChangeHook =>
  ({ doc, req }) => {
    if (!req.context?.skipRevalidate) revalidate(tags, req.payload.logger);
    return doc;
  };

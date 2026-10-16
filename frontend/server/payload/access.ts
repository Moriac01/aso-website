import type { Access, FieldAccess, Where } from "payload";

/**
 * Règles d'accès partagées du back-office.
 *
 * Deux rôles :
 *  - admin  : tout, y compris la gestion des comptes
 *  - editor : contenu (actualités, équipe, rapports, chiffres) et suivi des demandes
 */

type WithRole = { role?: "admin" | "editor" | null } | null | undefined;

export const isAdmin: Access = ({ req }) => (req.user as WithRole)?.role === "admin";

export const isAdminField: FieldAccess = ({ req }) =>
  (req.user as WithRole)?.role === "admin";

export const isStaff: Access = ({ req }) => Boolean(req.user);

export const isAdminOrSelf: Access = ({ req }) => {
  const user = req.user as (WithRole & { id?: number | string }) | null;
  if (!user) return false;
  if (user.role === "admin") return true;
  return { id: { equals: user.id } };
};

export const anyone: Access = () => true;

export const nobody: Access = () => false;

/** Public : seulement les documents publiés (brouillons Payload). Équipe : tout. */
export const publishedOrStaff: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: "published" } } satisfies Where;
};

/** Public : seulement si la case « publié » est cochée. Équipe : tout. */
export const flaggedPublishedOrStaff: Access = ({ req }) => {
  if (req.user) return true;
  return { published: { equals: true } } satisfies Where;
};

import type { Access, FieldAccess, PayloadRequest, Where } from "payload";

import type { Role } from "./roles";

/**
 * Règles d'accès du back-office.
 * Moindre privilège : chaque fonction n'accède qu'à ce dont elle a besoin.
 * Le détail des rôles est dans ./roles.ts.
 */

type StaffUser = { id?: number | string; roles?: Role[] | null };

export const rolesOf = (user: unknown): Role[] =>
  (user as StaffUser | null | undefined)?.roles ?? [];

export const hasRole = (user: unknown, ...roles: Role[]) =>
  rolesOf(user).some((role) => roles.includes(role));

/** Accès de collection réservé à certains rôles. */
export const allow =
  (...roles: Role[]): Access =>
  ({ req }) =>
    hasRole(req.user, ...roles);

/** Accès de champ réservé à certains rôles. */
export const allowField =
  (...roles: Role[]): FieldAccess =>
  ({ req }) =>
    hasRole(req.user, ...roles);

/** Masque une section du menu aux rôles qui n'en ont pas l'usage. */
export const hiddenUnless =
  (...roles: Role[]) =>
  ({ user }: { user: unknown }) =>
    !hasRole(user, ...roles);

export const anyone: Access = () => true;
export const nobody: Access = () => false;
export const isStaff: Access = ({ req }) => rolesOf(req.user).length > 0;

/** Administration du site : comptes et réglages. */
export const ADMINS: Role[] = ["admin", "tech"];
/** Gestion du contenu public. */
export const CONTENT_EDITORS: Role[] = ["admin", "tech", "communication"];
/** Lecture de tout, sans modification (contrôle et consultation). */
export const READERS: Role[] = ["controle", "consultation"];

export const isAdminOrSelf: Access = ({ req }) => {
  if (!req.user) return false;
  if (hasRole(req.user, ...ADMINS, "controle")) return true;
  return { id: { equals: (req.user as StaffUser).id } } satisfies Where;
};

/** Public : seulement les documents publiés (brouillons Payload). Équipe : tout. */
export const publishedOrStaff: Access = ({ req }) => {
  if (rolesOf(req.user).length > 0) return true;
  return { _status: { equals: "published" } } satisfies Where;
};

/** Public : seulement si la case « publié » est cochée. Équipe : tout. */
export const flaggedPublishedOrStaff: Access = ({ req }) => {
  if (rolesOf(req.user).length > 0) return true;
  return { published: { equals: true } } satisfies Where;
};

export const userLabel = (req: PayloadRequest) => {
  const user = req.user as { name?: string; email?: string } | null;
  return user?.name || user?.email || "système";
};

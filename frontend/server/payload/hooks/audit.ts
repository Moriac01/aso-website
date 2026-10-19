import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from "payload";

/**
 * Journal des modifications : qui a fait quoi, sur quel contenu, et quand.
 * Les entrées sont écrites par le serveur et ne peuvent être ni modifiées ni supprimées.
 */

const IGNORED_FIELDS = new Set([
  "updatedAt",
  "createdAt",
  "sizes",
  "hash",
  "salt",
  "password",
  "resetPasswordToken",
  "resetPasswordExpiration",
  "loginAttempts",
  "lockUntil",
  "sessions",
  "_verificationToken",
]);

type Doc = Record<string, unknown> & { id?: number | string };

function changedFields(previous: Doc | undefined, next: Doc): string[] {
  if (!previous) return [];
  const keys = new Set([...Object.keys(previous), ...Object.keys(next)]);
  return [...keys]
    .filter((key) => !IGNORED_FIELDS.has(key))
    .filter((key) => JSON.stringify(previous[key] ?? null) !== JSON.stringify(next[key] ?? null));
}

async function write(
  req: PayloadRequest,
  entry: { action: "create" | "update" | "delete"; target: string; documentId?: string; label?: string; changes?: string[] },
) {
  if (req.context?.skipAudit) return;
  const user = req.user as { id?: number; name?: string; email?: string } | null;
  try {
    await req.payload.create({
      collection: "audit-log",
      req,
      overrideAccess: true,
      context: { skipAudit: true },
      data: {
        action: entry.action,
        target: entry.target,
        documentId: entry.documentId,
        label: entry.label,
        changes: entry.changes?.join(", ") || undefined,
        user: typeof user?.id === "number" ? user.id : undefined,
        userName: user?.name || user?.email || "Système",
      },
    });
  } catch (error) {
    req.payload.logger.error({ err: error }, "Écriture du journal impossible");
  }
}

const labelOf = (doc: Doc, title?: (doc: Doc) => unknown) => {
  const value = title?.(doc) ?? doc.title ?? doc.name ?? doc.filename;
  return typeof value === "string" ? value : undefined;
};

export const auditAfterChange =
  (target: string, title?: (doc: Doc) => unknown): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, operation, req }) => {
    const changes = operation === "update" ? changedFields(previousDoc as Doc, doc as Doc) : [];
    if (operation === "update" && changes.length === 0) return doc;
    await write(req, {
      action: operation,
      target,
      documentId: String((doc as Doc).id),
      label: labelOf(doc as Doc, title),
      changes,
    });
    return doc;
  };

export const auditAfterDelete =
  (target: string, title?: (doc: Doc) => unknown): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    await write(req, {
      action: "delete",
      target,
      documentId: String((doc as Doc).id),
      label: labelOf(doc as Doc, title),
    });
    return doc;
  };

export const auditGlobal =
  (target: string): GlobalAfterChangeHook =>
  async ({ doc, previousDoc, req }) => {
    const changes = changedFields(previousDoc as Doc, doc as Doc).filter((key) => key !== "globalType");
    if (changes.length > 0) await write(req, { action: "update", target, changes });
    return doc;
  };

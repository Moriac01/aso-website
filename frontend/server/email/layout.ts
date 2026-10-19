/**
 * Mise en page commune des emails : une version HTML (couleurs du site) et
 * une version texte (lue par certains téléphones et filtres anti-spam).
 * HTML volontairement simple (tableaux, styles en ligne) : c'est ce que les
 * messageries comme Gmail ou Outlook affichent correctement.
 */

export type EmailContent = {
  /** Titre affiché en haut de l'email. */
  title: string;
  /** Paragraphes, dans l'ordre. */
  paragraphs: string[];
  /** Texte écrit par la personne (message, motivation), affiché tel quel dans un encadré. */
  quote?: string;
  /** Tableau « libellé : valeur » (référence, montant…). */
  details?: [label: string, value: string][];
  /** Bouton d'action. */
  action?: { label: string; url: string };
  /** Signature ; par défaut « L'équipe de l'ASO ». */
  signature?: string;
  /** Petite note en bas (ex. « Si vous n'êtes pas à l'origine… »). */
  note?: string;
};

export type RenderedEmail = { html: string; text: string };

const BLUE = "#0c7af8";
const INK = "#070707";
const MUTED = "#526057";
const BORDER = "#dfe7df";
const BACKGROUND = "#f7faf6";

/** Espaces insécables à l'intérieur des guillemets français, puis échappement HTML. */
const escape = (value: string) =>
  value
    .replace(/« /g, "«\u00a0")
    .replace(/ »/g, "\u00a0»")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Adresse publique du site, sans / final (vide si non configurée). */
export const siteUrl = () => (process.env.NEXT_PUBLIC_SERVER_URL || "").replace(/\/+$/, "");

/** Lien absolu vers une page du site ou du back-office. */
export const absoluteUrl = (path: string) => `${siteUrl()}${path}`;

const SIGNATURE = "L’équipe de l’Association Soutien aux Orphelins (ASO)";
const FOOTER = "Association Soutien aux Orphelins — Bangui, République centrafricaine";

export function renderEmail({ title, paragraphs, quote, details, action, signature = SIGNATURE, note }: EmailContent): RenderedEmail {
  const logo = siteUrl()
    ? `<img src="${escape(absoluteUrl("/icon.png"))}" width="48" height="48" alt="ASO" style="display:block;border:0;border-radius:12px;margin:0 0 20px" />`
    : "";

  const detailRows = (details ?? [])
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;color:${MUTED};font-size:14px;white-space:nowrap">${escape(label)}</td>` +
        `<td style="padding:8px 12px;color:${INK};font-size:15px;font-weight:700">${escape(value)}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escape(title)}</title></head>
<body style="margin:0;padding:0;background:${BACKGROUND};font-family:Arial,Helvetica,sans-serif;color:${INK}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BACKGROUND};padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${BORDER};border-radius:20px">
<tr><td style="padding:32px 28px">
${logo}
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${INK}">${escape(title)}</h1>
${paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${MUTED}">${escape(p)}</p>`).join("\n")}
${quote ? `<div style="margin:8px 0 18px;padding:14px 16px;border-left:4px solid ${BLUE};background:${BACKGROUND};border-radius:8px;font-size:15px;line-height:1.6;color:${INK};white-space:pre-line">${escape(quote)}</div>` : ""}
${detailRows ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 18px;background:${BACKGROUND};border:1px solid ${BORDER};border-radius:12px;width:100%">${detailRows}</table>` : ""}
${action ? `<p style="margin:22px 0"><a href="${escape(action.url)}" style="display:inline-block;background:${BLUE};color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:999px">${escape(action.label)}</a></p>` : ""}
<p style="margin:22px 0 0;font-size:15px;line-height:1.6;color:${INK}">${escape(signature)}</p>
${note ? `<p style="margin:18px 0 0;font-size:13px;line-height:1.5;color:${MUTED}">${escape(note)}</p>` : ""}
</td></tr>
</table>
<p style="margin:16px 0 0;font-size:12px;color:${MUTED}">${escape(FOOTER)}</p>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    title,
    "",
    ...paragraphs.flatMap((p) => [p, ""]),
    ...(quote ? [quote, ""] : []),
    ...(details?.length ? [...details.map(([label, value]) => `${label} : ${value}`), ""] : []),
    ...(action ? [`${action.label} : ${action.url}`, ""] : []),
    signature,
    ...(note ? ["", note] : []),
    "",
    "—",
    FOOTER,
  ].join("\n");

  return { html, text };
}

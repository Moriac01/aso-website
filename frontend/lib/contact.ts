/**
 * Coordonnées publiques de l'ASO, telles que saisies dans le back-office
 * (Administration → Coordonnées & réseaux). Utilisable côté serveur et navigateur.
 */

export type SocialNetwork = "facebook" | "instagram" | "linkedin" | "whatsapp";

export type ContactInfo = {
  email: string | null;
  phone: string | null;
  /** Adresse saisie, ou à défaut le siège social de l'identité légale. */
  address: string | null;
  socials: { network: SocialNetwork; label: string; href: string }[];
};

export const EMPTY_CONTACT: ContactInfo = { email: null, phone: null, address: null, socials: [] };

const CAR_PREFIX = "236";

/** Numéro composable : « 70107514 » → « +23670107514 » (Centrafrique par défaut). */
export function phoneDigits(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) return `+${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.length === 8) return `+${CAR_PREFIX}${digits}`;
  return `+${digits}`;
}

export const phoneHref = (phone: string) => `tel:${phoneDigits(phone)}`;

/** Affichage lisible : « 70107514 » ou « +23670107514 » → « +236 70 10 75 14 ». Autres formats : tels que saisis. */
export function formatPhone(phone: string): string {
  const full = phoneDigits(phone);
  const local = full.startsWith(`+${CAR_PREFIX}`) ? full.slice(CAR_PREFIX.length + 1) : null;
  if (local && local.length === 8) return `+${CAR_PREFIX} ${local.match(/\d{2}/g)!.join(" ")}`;
  return phone.trim();
}

export const mapsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\s+/g, " ").trim())}`;

/** Lien WhatsApp vers un numéro (ou un lien wa.me déjà saisi), avec un message tout prêt. */
export function whatsappHref(numberOrLink: string, message?: string): string | null {
  const trimmed = numberOrLink.trim();
  if (!trimmed) return null;
  const base = /^https?:\/\//i.test(trimmed) ? trimmed : `https://wa.me/${phoneDigits(trimmed).slice(1)}`;
  if (!message) return base;
  return `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(message)}`;
}

const SOCIAL_LABELS: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
};

/** Lien d'un réseau : une adresse web telle quelle ; pour WhatsApp, un simple numéro suffit. */
export function socialHref(network: SocialNetwork, value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (network === "whatsapp" && /\d/.test(trimmed)) return `https://wa.me/${phoneDigits(trimmed).slice(1)}`;
  if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(trimmed)) return `https://${trimmed}`;
  return null;
}

export function buildSocials(values: Partial<Record<SocialNetwork, string | null | undefined>>): ContactInfo["socials"] {
  return (Object.keys(SOCIAL_LABELS) as SocialNetwork[]).flatMap((network) => {
    const href = socialHref(network, values[network] ?? "");
    return href ? [{ network, label: SOCIAL_LABELS[network], href }] : [];
  });
}

"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Copie un numéro (mobile money, IBAN) pour éviter les erreurs de saisie. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copier ${label}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#0a67d0] px-3 py-1.5 text-xs font-semibold text-[#0a67d0] transition hover:bg-[#0a67d0] hover:text-white"
    >
      {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      {copied ? "Copié" : "Copier"}
    </button>
  );
}

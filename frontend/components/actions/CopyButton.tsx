"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Copie un texte (ex. : une adresse email) — utile sur les téléphones sans application email. */
export function CopyButton({ value, label = "Copier l’adresse" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Navigateur ancien ou accès refusé : sélection manuelle via une zone temporaire.
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(area);
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#dfe7df] bg-white px-5 text-sm font-semibold text-[#17483b] transition hover:border-[#0a67d0] hover:text-[#0a67d0]"
    >
      {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Adresse copiée" : label}</span>
    </button>
  );
}

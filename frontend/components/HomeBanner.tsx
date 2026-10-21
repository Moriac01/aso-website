"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useSyncExternalStore } from "react";

const EVENT = "aso-banner-dismiss";

const read = (key: string) => {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

const subscribe = (callback: () => void) => {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

/** Bandeau en haut de l'accueil pendant une annonce en cours. Le visiteur peut le fermer. */
export function HomeBanner({ id, text, href, label }: { id: string; text: string; href: string; label: string }) {
  const key = `aso-banner-${id}`;
  const dismissed = useSyncExternalStore(subscribe, () => read(key), () => false);
  if (dismissed) return null;

  const external = /^https?:\/\//.test(href);
  const dismiss = () => {
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      // Stockage indisponible (navigation privée) : le bandeau reviendra à la prochaine visite.
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <div className="bg-[#0b1220] text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-2.5 text-sm sm:px-8 lg:px-12">
        <span className="hidden shrink-0 rounded-full bg-[#1d9b4a] px-2.5 py-0.5 text-xs font-semibold sm:inline-flex">
          En cours
        </span>
        <p className="min-w-0 flex-1 leading-5">
          {text}{" "}
          <Link
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-[#90cdf4] hover:text-white"
          >
            {label}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fermer le bandeau"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

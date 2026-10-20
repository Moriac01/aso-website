"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Animations désactivées pour les personnes qui l'ont demandé dans les réglages de leur appareil. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

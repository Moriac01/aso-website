import { redirect } from "next/navigation";

/** Adresse courte des affiches de la campagne (aso-rca.org/adherer) : le bloc d'adhésion. */
export default function AdhererPage() {
  redirect("/volunteers#adhesion");
}

import type { Metadata } from "next";

import { MembershipBlock } from "@/components/actions/MembershipBlock";
import { getMembership } from "@/server/content/actions";
import { getContactInfo } from "@/server/content/contact";

import VolunteersView from "./VolunteersView";

// Le bloc d'adhésion change de lui-même à la date d'ouverture.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Devenir membre ou bénévole — ASO",
  description:
    "Adhérez à l’Association Soutien aux Orphelins ou rejoignez ses bénévoles pour accompagner les enfants orphelins de Bimbo et Bangui.",
};

export default async function VolunteersPage() {
  const [membership, contact] = await Promise.all([getMembership(), getContactInfo()]);
  const whatsapp = contact.socials.find((social) => social.network === "whatsapp")?.href ?? contact.phone;

  return <VolunteersView membership={<MembershipBlock membership={membership} whatsapp={whatsapp} />} />;
}

import type { Metadata } from "next";

import { getContactInfo } from "@/server/content/contact";

import { ContactView } from "./ContactView";

// Mêmes règles que les autres pages alimentées par le back-office.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact — ASO",
  description:
    "Écrivez à l’Association Soutien aux Orphelins : question, partenariat, demande d’aide. Téléphone, email et adresse à Bangui.",
};

export default async function ContactPage() {
  const contact = await getContactInfo();
  return <ContactView contact={contact} />;
}

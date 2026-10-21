import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const description =
  "L'Association Soutien aux Orphelins (ASO) accompagne les enfants orphelins de Bimbo et Bangui : scolarité, santé et soutien psychosocial.";

export const metadata: Metadata = {
  // Adresse du site : sert aux aperçus de liens (WhatsApp, Facebook) et aux moteurs de recherche.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"),
  title: "ASO — Association Soutien aux Orphelins",
  description,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "ASO — Association Soutien aux Orphelins",
    title: "ASO — Association Soutien aux Orphelins",
    description,
    images: [
      {
        url: "/photos/partage-reseaux.jpg",
        width: 1200,
        height: 630,
        alt: "L’équipe de l’ASO avec des enfants accompagnés, lors de la remise des kits scolaires",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <NavBar />
        <MotionProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </MotionProvider>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appelerApiOuNull } from "@/lib/api";
import type { ReponseVitrine } from "@/lib/types";
import { CatalogueVitrine } from "@/components/CatalogueVitrine";
import { EnregistrerVisite } from "@/components/EnregistrerVisite";

export async function generateMetadata({ params }: PageProps<"/boutique/vitrine/[code]">): Promise<Metadata> {
  const { code } = await params;
  const donnees = await appelerApiOuNull<ReponseVitrine>(`/public/vitrines/${code}`);
  if (!donnees) return { title: "Boutique indisponible — Ordi'Space" };

  return {
    title: `La sélection de ${donnees.vendeur.nom} | Ordi'Space`,
    description: "Ordinateurs livrés chez vous, paiement à la réception.",
    openGraph: { title: `Ordi'Space — la sélection de ${donnees.vendeur.nom}`, images: donnees.produits.flatMap((p) => (p.image ? [p.image] : [])).slice(0, 1) },
  };
}

/**
 * Arrivée par la vitrine d'un vendeur : par lien partagé, ou par le QR de
 * l'affiche (`?src=qr`, compté comme un scan et non comme un clic).
 */
export default async function PageVitrine({ params, searchParams }: PageProps<"/boutique/vitrine/[code]">) {
  const { code } = await params;
  const { src } = await searchParams;
  const donnees = await appelerApiOuNull<ReponseVitrine>(`/public/vitrines/${code}`);
  if (!donnees) notFound();

  const origineQr = src === "qr" ? ("qr" as const) : undefined;

  return (
    <>
      <EnregistrerVisite origine={{ type: "vitrine", code, src: origineQr }} />
      <CatalogueVitrine donnees={donnees} code={code} src={origineQr} />
    </>
  );
}

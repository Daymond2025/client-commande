import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appelerApiOuNull } from "@/lib/api";
import { formaterPrix, type ReponseProduit } from "@/lib/types";
import { FicheProduit } from "@/components/FicheProduit";

export async function generateMetadata({ params }: PageProps<"/boutique/vitrine/[code]/produit/[id]">): Promise<Metadata> {
  const { code, id } = await params;
  const donnees = await appelerApiOuNull<ReponseProduit>(`/public/vitrines/${code}/produits/${id}`);
  if (!donnees) return { title: "Produit indisponible — Ordi'Space" };

  return {
    title: `${donnees.produit.nom_produit} — ${formaterPrix(donnees.produit.prix_vente)} FCFA | Ordi'Space`,
    openGraph: { images: donnees.produit.images.slice(0, 1) },
  };
}

/** Un produit de la vitrine — la visite a déjà été comptée à l'arrivée sur la vitrine. */
export default async function PageProduitVitrine({ params, searchParams }: PageProps<"/boutique/vitrine/[code]/produit/[id]">) {
  const { code, id } = await params;
  const { src } = await searchParams;
  const donnees = await appelerApiOuNull<ReponseProduit>(`/public/vitrines/${code}/produits/${id}`);
  if (!donnees) notFound();

  const origineQr = src === "qr" ? ("qr" as const) : undefined;

  return (
    <FicheProduit
      donnees={donnees}
      origine={{ type: "vitrine", code, src: origineQr }}
      retour={`/boutique/vitrine/${code}${origineQr ? "?src=qr" : ""}`}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appelerApiOuNull } from "@/lib/api";
import { formaterPrix, type ReponseProduit } from "@/lib/types";
import { EnregistrerVisite } from "@/components/EnregistrerVisite";
import { FicheProduit } from "@/components/FicheProduit";

/** Aperçu du lien (WhatsApp, réseaux) : nom, prix et première photo du produit. */
export async function generateMetadata({ params }: PageProps<"/boutique/produit/[code]">): Promise<Metadata> {
  const { code } = await params;
  const donnees = await appelerApiOuNull<ReponseProduit>(`/public/liens/${code}`);
  if (!donnees) return { title: "Lien indisponible — Ordi'Space" };

  const { produit } = donnees;
  const titre = `${produit.nom_produit} — ${formaterPrix(produit.prix_vente)} FCFA`;
  const description = "Livraison à domicile, paiement à la réception. Commandez en quelques secondes.";

  return {
    title: `${titre} | Ordi'Space`,
    description,
    openGraph: { title: titre, description, images: produit.images.slice(0, 1) },
  };
}

/** Arrivée par le lien de vente d'un produit (POST /boutique/produits/{id}/lien côté livreur). */
export default async function PageProduit({ params }: PageProps<"/boutique/produit/[code]">) {
  const { code } = await params;
  const donnees = await appelerApiOuNull<ReponseProduit>(`/public/liens/${code}`);
  if (!donnees) notFound();

  return (
    <>
      <EnregistrerVisite origine={{ type: "lien", code }} />
      <FicheProduit donnees={donnees} origine={{ type: "lien", code }} />
    </>
  );
}

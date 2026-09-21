import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appelerApiOuNull } from "@/lib/api";
import type { Confirmation } from "@/lib/types";
import { ResultatConfirmation } from "@/components/ResultatConfirmation";

export const metadata: Metadata = { title: "Votre commande | Ordi'Space", robots: { index: false } };

/** Page de retour de Wave (paiement de confirmation) : succès comme échec, le statut réel est lu côté serveur. */
export default async function PageConfirmation({ params }: PageProps<"/boutique/confirmation/[token]">) {
  const { token } = await params;
  const confirmation = await appelerApiOuNull<Confirmation>(`/public/confirmations/${encodeURIComponent(token)}`);
  if (!confirmation) notFound();

  return <ResultatConfirmation initiale={confirmation} />;
}

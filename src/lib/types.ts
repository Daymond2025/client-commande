/** Formes de l'API publique (BoutiquePubliqueController) — ce que l'acheteur peut voir, jamais la commission. */
export type Vendeur = {
  nom: string;
  photo: string | null;
  telephone: string | null;
  whatsapp_url: string | null;
};

export type FraisLivraison = { localite_id: number; localite: string | null; montant: number };

export type EtatProduit = "neuf" | "quasi_neuf" | "occasion" | "reconditionne";

export type Produit = {
  id: number;
  nom_produit: string;
  description: string | null;
  prix_vente: number;
  prix_barre: number | null;
  pourcentage_reduction: number | null;
  etat_produit: EtatProduit | null;
  quantite_stock: number;
  duree_garantie_mois: number | null;
  processeur: string | null;
  memoire_ram: string | null;
  stockage: string | null;
  taille: string | null;
  systeme_exploitation: string | null;
  carte_graphique: string | null;
  couleur: string | null;
  cadeaux: string[] | null;
  images: string[];
  frais_livraison: FraisLivraison[];
};

export type ReponseProduit = { vendeur: Vendeur; produit: Produit };

export type ProduitVitrine = {
  id: number;
  nom_produit: string;
  image: string | null;
  prix_vente: number;
  prix_barre: number | null;
  pourcentage_reduction: number | null;
  etat_produit: EtatProduit | null;
  specs: string[];
};

export type ReponseVitrine = { vendeur: Vendeur; produits: ProduitVitrine[] };

export type ReponseCommande = {
  reference: number;
  nom_produit: string;
  quantite: number;
  montant_produits: number;
  frais_livraison: number;
  total_a_payer: number;
  vendeur: Vendeur;
};

/** D'où vient l'acheteur : un lien produit, ou la vitrine (avec `src=qr` quand il a scanné l'affiche). */
export type Origine =
  | { type: "lien"; code: string }
  | { type: "vitrine"; code: string; src?: "qr" };

export const LIBELLE_ETAT: Record<EtatProduit, string> = {
  neuf: "Neuf",
  quasi_neuf: "Quasi neuf",
  occasion: "Occasion",
  reconditionne: "Reconditionné",
};

export function formaterPrix(montant: number): string {
  return new Intl.NumberFormat("fr-FR").format(montant);
}

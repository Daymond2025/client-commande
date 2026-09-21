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
  marque: string | null;
  description: string | null;
  prix_vente: number;
  prix_barre: number | null;
  pourcentage_reduction: number | null;
  etat_produit: EtatProduit | null;
  quantite_stock: number;
  duree_garantie_mois: number | null;
  /** Paiement de confirmation réclamé pour commander (FCFA, non remboursable, déduit du total). */
  montant_confirmation: number;
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

export type StatutConfirmation = "en_attente" | "confirme" | "echoue";

/** Paiement de confirmation d'une commande : la commande n'existe (reference) qu'une fois Wave confirmé. */
export type Confirmation = {
  token: string;
  statut: StatutConfirmation;
  montant_confirmation: number;
  /** Adresse de paiement Wave — présente seulement tant que le paiement est attendu. */
  wave_launch_url: string | null;
  reference: number | null;
  nom_produit: string | null;
  quantite: number;
  montant_produits: number;
  frais_livraison: number;
  total_a_payer: number;
  /** Ce que l'acheteur paiera encore à la livraison : le total moins la confirmation. */
  reliquat: number;
  /** Payé, mais la commande n'a pas pu être créée : l'équipe rappelle l'acheteur. */
  anomalie: boolean;
  vendeur: Vendeur | null;
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

/** Montant à points, comme sur le récapitulatif de commande : 51000 → "51.000". */
export function formaterPrixPoints(montant: number): string {
  return Math.round(montant)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Numéro saisi → "+225 07 59 02 85 45" (le préfixe +225 est celui du champ, jamais saisi). */
export function formaterTelephone(saisie: string): string {
  let chiffres = saisie.replace(/\D/g, "");
  if (chiffres.startsWith("225") && chiffres.length > 10) chiffres = chiffres.slice(3);
  return `+225 ${chiffres.replace(/(\d{2})(?=\d)/g, "$1 ")}`.trim();
}

/** Ce que l'acheteur renseigne dans "Information de livraison". */
export type InfosLivraison = { nom: string; telephone: string; localiteId: number };

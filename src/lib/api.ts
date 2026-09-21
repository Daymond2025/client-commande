import type { Confirmation } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

export class ErreurApi extends Error {
  status: number;
  champs: Record<string, string[]>;

  constructor(message: string, status: number, champs: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.champs = champs;
  }
}

/**
 * Appel de l'API publique (aucun jeton : cette page n'a pas de compte).
 * `cache: "no-store"` — stock et prix doivent toujours être ceux du moment.
 */
export async function appelerApi<T>(chemin: string, options: { method?: string; corps?: unknown } = {}): Promise<T> {
  const reponse = await fetch(`${API_URL}${chemin}`, {
    method: options.method ?? "GET",
    cache: "no-store",
    headers: { Accept: "application/json", ...(options.corps ? { "Content-Type": "application/json" } : {}) },
    body: options.corps ? JSON.stringify(options.corps) : undefined,
  });

  const json = await reponse.json().catch(() => null);

  if (!reponse.ok || !json?.success) {
    throw new ErreurApi(json?.error?.message ?? "Une erreur est survenue, réessayez.", reponse.status, json?.error?.fields ?? {});
  }

  return json.data as T;
}

/** Comme appelerApi mais `null` sur 404 — pour les pages qui affichent "lien introuvable". */
export async function appelerApiOuNull<T>(chemin: string): Promise<T | null> {
  try {
    return await appelerApi<T>(chemin);
  } catch (e) {
    if (e instanceof ErreurApi && e.status === 404) return null;
    throw e;
  }
}

export type DonneesCommande = {
  origine: "lien" | "vitrine";
  code: string;
  produit_id?: number;
  src?: "qr";
  quantite: number;
  nom: string;
  prenom?: string;
  telephone: string;
  localite_id: number;
  notes?: string;
};

/**
 * "Payer" : ouvre le paiement de confirmation sur Wave. Aucune commande n'existe encore — elle
 * naît quand Wave confirme le paiement (voir AcompteConfirmationService côté backend).
 */
export function ouvrirConfirmation(donnees: DonneesCommande): Promise<Confirmation> {
  return appelerApi<Confirmation>("/public/confirmations", { method: "POST", corps: donnees });
}

/** Où en est la confirmation (page de retour de Wave) — le statut réel, jamais ce que dit l'URL. */
export function lireConfirmation(token: string): Promise<Confirmation> {
  return appelerApi<Confirmation>(`/public/confirmations/${encodeURIComponent(token)}`);
}

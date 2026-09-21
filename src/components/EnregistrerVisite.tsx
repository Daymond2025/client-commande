"use client";

import { useEffect } from "react";
import { appelerApi } from "@/lib/api";
import type { Origine } from "@/lib/types";

/**
 * Compte la visite (clic sur le lien, scan du QR) une seule fois par onglet :
 * les navigations internes (vitrine → produit) et les rechargements ne
 * gonflent pas les compteurs du vendeur. Déclenchée depuis le navigateur — pas
 * pendant le rendu serveur — pour que les robots d'aperçu (WhatsApp, réseaux
 * sociaux) qui lisent la page sans exécuter de JavaScript ne comptent pas.
 */
export function EnregistrerVisite({ origine }: { origine: Origine }) {
  const cle = origine.type === "vitrine" ? `visite:vitrine:${origine.code}` : `visite:lien:${origine.code}`;
  const chemin =
    origine.type === "vitrine"
      ? `/public/vitrines/${origine.code}/vue${origine.src === "qr" ? "?src=qr" : ""}`
      : `/public/liens/${origine.code}/vue`;

  useEffect(() => {
    try {
      if (sessionStorage.getItem(cle)) return;
      sessionStorage.setItem(cle, "1");
    } catch {
      // Stockage indisponible (navigation privée) : on compte quand même, au pire une fois de plus.
    }
    appelerApi(chemin, { method: "POST" }).catch(() => {});
  }, [cle, chemin]);

  return null;
}

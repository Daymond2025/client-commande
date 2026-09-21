"use client";

import Link from "next/link";
import { useState } from "react";
import { LIBELLE_ETAT, formaterPrix, type Origine, type ReponseProduit } from "@/lib/types";
import { CarteConseiller } from "@/components/CarteConseiller";
import { FormulaireCommande } from "@/components/FormulaireCommande";
import { BouclierIcon, CadeauIcon, CamionIcon, FlecheGaucheIcon, ImageIcon, PortefeuilleIcon } from "@/components/icons";

/**
 * Page produit de l'acheteur : galerie, prix, caractéristiques, garanties de
 * service et conseiller, puis le bouton "Commander" (barre collée en bas) qui
 * ouvre la feuille de commande. `retour` n'existe que depuis une vitrine.
 */
export function FicheProduit({ donnees, origine, retour }: { donnees: ReponseProduit; origine: Origine; retour?: string }) {
  const { produit, vendeur } = donnees;
  const [imageActive, setImageActive] = useState(0);
  const [commandeOuverte, setCommandeOuverte] = useState(false);

  const fraisMin = produit.frais_livraison.length > 0 ? Math.min(...produit.frais_livraison.map((f) => f.montant)) : null;
  const enRupture = produit.quantite_stock <= 0;
  const economie = produit.prix_barre && produit.prix_barre > produit.prix_vente ? produit.prix_barre - produit.prix_vente : null;

  const caracteristiques = [
    { label: "Processeur", valeur: produit.processeur },
    { label: "Mémoire (RAM)", valeur: produit.memoire_ram },
    { label: "Stockage", valeur: produit.stockage },
    { label: "Écran", valeur: produit.taille },
    { label: "Carte graphique", valeur: produit.carte_graphique },
    { label: "Système", valeur: produit.systeme_exploitation },
    { label: "Couleur", valeur: produit.couleur },
  ].filter((c): c is { label: string; valeur: string } => Boolean(c.valeur));

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#F4F7FF] pb-28 md:my-6 md:min-h-0 md:overflow-hidden md:rounded-[28px] md:shadow-2xl md:shadow-slate-900/10">
      <header className="bg-gradient-brand-blue flex items-center gap-3 px-4 py-3.5 text-white">
        {retour ? (
          <Link href={retour} aria-label="Retour à la boutique" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/25">
            <FlecheGaucheIcon className="h-5 w-5" />
          </Link>
        ) : null}
        <p className="flex-1 text-base font-extrabold tracking-wide">ORDI&apos;SPACE</p>
        <p className="text-[11px] font-semibold text-white/90">Livraison à domicile</p>
      </header>

      <div className="relative bg-white">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2F5FA]">
          {produit.images[imageActive] ? (
            // eslint-disable-next-line @next/next/no-img-element -- photo servie par le backend, domaine dynamique
            <img src={produit.images[imageActive]} alt={produit.nom_produit} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-brand-muted">
              <ImageIcon className="h-12 w-12" />
            </div>
          )}
          {produit.etat_produit ? (
            <span className="absolute left-3 top-3 rounded-lg bg-gradient-to-r from-[#FFCC00] to-[#FF7800] px-2.5 py-1 text-xs font-extrabold text-white shadow-sm">
              {LIBELLE_ETAT[produit.etat_produit]}
            </span>
          ) : null}
          {produit.pourcentage_reduction ? (
            <span className="absolute right-3 top-3 rounded-md bg-gradient-to-br from-[#FF9700] to-[#FFB800] px-2 py-1 text-xs font-extrabold text-white">
              -{produit.pourcentage_reduction}%
            </span>
          ) : null}
        </div>

        {produit.images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto px-3 py-3">
            {produit.images.map((url, index) => (
              <button
                key={url}
                type="button"
                onClick={() => setImageActive(index)}
                aria-label={`Photo ${index + 1}`}
                className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${index === imageActive ? "border-[color:var(--brand-blue-end)]" : "border-transparent"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- photo servie par le backend, domaine dynamique */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <section className="mx-3 -mt-1 rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(0,80,200,0.08)]">
        <h1 className="text-xl font-extrabold leading-tight text-brand-ink">{produit.nom_produit}</h1>

        <div className="mt-3 flex items-end gap-3">
          <p className="text-3xl font-extrabold leading-none text-[#EA6A12]">{formaterPrix(produit.prix_vente)} <span className="text-base">FCFA</span></p>
          {produit.prix_barre ? <p className="pb-0.5 text-sm text-brand-muted line-through">{formaterPrix(produit.prix_barre)} FCFA</p> : null}
        </div>
        {economie ? (
          <span className="mt-2 inline-block rounded-full bg-[#FFF1DC] px-3 py-1 text-xs font-bold text-[#EA7A0B]">Vous économisez {formaterPrix(economie)} FCFA</span>
        ) : null}

        <p className={`mt-3 text-sm font-bold ${enRupture ? "text-red-500" : produit.quantite_stock <= 3 ? "text-[#EA6A12]" : "text-[#16A34A]"}`}>
          {enRupture ? "Rupture de stock" : produit.quantite_stock <= 3 ? `Plus que ${produit.quantite_stock} en stock` : "En stock"}
        </p>
      </section>

      <section className="mx-3 mt-3 grid grid-cols-3 gap-2">
        {[
          { icone: CamionIcon, titre: "Livraison", detail: fraisMin !== null ? `dès ${formaterPrix(fraisMin)} F` : "à domicile" },
          { icone: PortefeuilleIcon, titre: "Paiement", detail: "à la réception" },
          { icone: BouclierIcon, titre: "Garantie", detail: produit.duree_garantie_mois ? `${produit.duree_garantie_mois} mois` : "Ordi'Space" },
        ].map(({ icone: Icone, titre, detail }) => (
          <div key={titre} className="flex flex-col items-center rounded-2xl bg-white px-2 py-3 text-center shadow-[0_2px_10px_rgba(0,80,200,0.06)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4EEFF] text-[color:var(--brand-blue-end)]">
              <Icone className="h-[18px] w-[18px]" />
            </span>
            <p className="mt-1.5 text-xs font-extrabold text-brand-ink">{titre}</p>
            <p className="text-[11px] text-brand-muted">{detail}</p>
          </div>
        ))}
      </section>

      {caracteristiques.length > 0 ? (
        <section className="mx-3 mt-3 rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(0,80,200,0.06)]">
          <h2 className="text-sm font-extrabold text-brand-ink">Caractéristiques</h2>
          <dl className="mt-3 grid grid-cols-2 gap-2">
            {caracteristiques.map((c) => (
              <div key={c.label} className="rounded-xl bg-[#F7F8FF] px-3 py-2">
                <dt className="text-[10px] font-semibold uppercase text-brand-muted">{c.label}</dt>
                <dd className="text-[13px] font-extrabold leading-snug text-brand-ink">{c.valeur}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {produit.cadeaux && produit.cadeaux.length > 0 ? (
        <section className="mx-3 mt-3 rounded-2xl bg-gradient-to-r from-[#FFF4E5] to-[#FFEBD0] p-4">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#B45309]">
            <CadeauIcon className="h-5 w-5" />
            Offerts avec votre commande
          </h2>
          <ul className="mt-2 space-y-1 text-sm font-semibold text-brand-ink">
            {produit.cadeaux.map((cadeau) => (
              <li key={cadeau}>• {cadeau}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {produit.description ? (
        <section className="mx-3 mt-3 rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(0,80,200,0.06)]">
          <h2 className="text-sm font-extrabold text-brand-ink">Description</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-brand-muted">{produit.description}</p>
        </section>
      ) : null}

      <div className="mx-3 mt-3">
        <CarteConseiller vendeur={vendeur} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md rounded-t-[22px] bg-white px-4 pb-4 pt-3 shadow-[0_-4px_14px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-brand-muted">Prix</p>
            <p className="truncate text-lg font-extrabold leading-tight text-brand-ink">{formaterPrix(produit.prix_vente)} FCFA</p>
          </div>
          <button
            type="button"
            onClick={() => setCommandeOuverte(true)}
            disabled={enRupture}
            className="bg-gradient-brand-orange ml-auto h-12 flex-1 rounded-xl text-[15px] font-extrabold text-white shadow-[0_6px_14px_rgba(255,122,0,0.3)] disabled:opacity-50"
          >
            {enRupture ? "Indisponible" : "Commander"}
          </button>
        </div>
      </div>

      {commandeOuverte ? <FormulaireCommande produit={produit} vendeur={vendeur} origine={origine} onFermer={() => setCommandeOuverte(false)} /> : null}
    </main>
  );
}

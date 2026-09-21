"use client";

import { useState } from "react";
import { LIBELLE_ETAT, formaterPrixPoints, formaterTelephone, type InfosLivraison, type Produit } from "@/lib/types";
import { BarrePaiement } from "@/components/BarrePaiement";
import { FriseElements } from "@/components/FriseElements";
import { CocheIcon, DrapeauCiIcon, FlecheGaucheIcon, ImageIcon, MoinsIcon, PlusIcon, PointsVerticauxIcon } from "@/components/icons";

const QUANTITE_MAX = 5;

const CARTE = "mx-3.5 rounded-2xl bg-white px-4 pb-4 pt-4 shadow-[0_1px_4px_rgba(20,20,60,0.07)]";

function TitreCarte({ children }: { children: string }) {
  return <h2 className="border-b border-[#E5E7EB] pb-2.5 text-center text-[16px] text-brand-ink">{children}</h2>;
}

function Champ({ libelle, children }: { libelle: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="whitespace-nowrap text-[9.5px] text-brand-muted">{libelle}</p>
      <div className="mt-1 flex min-h-[26px] items-center gap-1.5 rounded bg-[#EEF0FF] px-1.5 py-1 text-[10px] font-semibold text-brand-ink">{children}</div>
    </div>
  );
}

/**
 * "Récapitulatif" — étape suivant "Information de livraison" : rappel de la
 * saisie, de la commande (quantité modifiable), de ce qui sera reçu et du détail
 * du paiement. "Payer" ouvre la confirmation (la page parente appelle l'API avec la
 * quantité choisie) : seule la confirmation se paie en ligne, le reliquat se paie à la livraison.
 */
export function RecapitulatifCommande({
  produit,
  infos,
  onRetour,
  onPayer,
  enCours,
  erreur,
}: {
  produit: Produit;
  infos: InfosLivraison;
  onRetour: () => void;
  onPayer: (quantite: number) => void;
  enCours: boolean;
  erreur: string | null;
}) {
  const [quantite, setQuantite] = useState(1);

  const max = Math.max(1, Math.min(QUANTITE_MAX, produit.quantite_stock));
  const livraison = produit.frais_livraison.find((f) => f.localite_id === infos.localiteId);
  const cadeaux = produit.cadeaux ?? [];

  const base = produit.prix_vente * quantite;
  const economie = produit.prix_barre && produit.prix_barre > produit.prix_vente ? (produit.prix_barre - produit.prix_vente) * quantite : 0;
  const frais = livraison?.montant ?? 0;
  const total = base + frais;

  const resume = [produit.processeur, produit.memoire_ram && `${produit.memoire_ram} RAM`, produit.stockage, produit.taille].filter(Boolean).join(" • ");
  const recu = [
    `${quantite} ${produit.nom_produit}`,
    ...cadeaux.map((cadeau) => `${quantite} ${cadeau}`),
    ...(cadeaux.length > 0 ? ["Tous les bonus offerts"] : []),
  ];

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#F5F5FF] pb-40 md:my-6 md:min-h-0 md:overflow-hidden md:rounded-[28px] md:shadow-2xl md:shadow-slate-900/10">
      <header className="flex h-16 items-center justify-between bg-white px-4 shadow-[0_1px_3px_rgba(20,20,60,0.08)]">
        <button type="button" onClick={onRetour} aria-label="Retour à la fiche produit" className="flex h-9 w-9 items-center justify-center text-brand-ink">
          <FlecheGaucheIcon className="h-6 w-6" />
        </button>
        <h1 className="text-[20px] font-extrabold text-brand-ink">Récapitulatif</h1>
        {/* Pas de menu défini dans la maquette : le pictogramme est présent, sans action. */}
        <span className="flex h-9 w-9 items-center justify-center text-brand-ink" aria-hidden="true">
          <PointsVerticauxIcon className="h-5 w-5" />
        </span>
      </header>

      <div className="mt-3.5 space-y-3.5">
        <section className={CARTE}>
          <TitreCarte>Information de livraison</TitreCarte>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1.3fr)] gap-1.5">
            <Champ libelle="Nom sur la facture">
              <span className="truncate">{infos.nom}</span>
            </Champ>
            <Champ libelle="Destination">
              <DrapeauCiIcon className="h-3 w-[16px] shrink-0 rounded-[2px]" aria-hidden="true" />
              <span className="truncate">Côte d&apos;ivoire, {livraison?.localite ?? "—"}</span>
            </Champ>
            <Champ libelle="Contact">
              <span className="truncate">{formaterTelephone(infos.telephone)}</span>
            </Champ>
          </div>
        </section>

        <section className={CARTE}>
          <TitreCarte>Les Commandes</TitreCarte>
          <div className="mt-3 rounded-xl bg-[#F5F5FF] p-2">
            <div className="relative flex items-center gap-3 overflow-hidden rounded-xl bg-white p-2">
              <div className="relative h-[76px] w-[68px] shrink-0 overflow-hidden rounded-lg bg-[#F2F5FA]">
                {produit.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element -- photo servie par le backend, domaine dynamique
                  <img src={produit.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-brand-muted">
                    <ImageIcon className="h-6 w-6" />
                  </span>
                )}
                <span className="absolute left-1 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#FF7A00] bg-white text-[#FF7A00]" aria-hidden="true">
                  <CocheIcon className="h-3 w-3" strokeWidth={3.2} />
                </span>
              </div>

              <div className="min-w-0 flex-1 pt-3">
                <p className="truncate text-[12px] font-extrabold text-brand-ink">{produit.nom_produit}</p>
                {resume ? <p className="mt-0.5 truncate text-[9px] text-brand-muted">{resume}</p> : null}
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                      disabled={quantite <= 1}
                      aria-label="Retirer un exemplaire"
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-brand-ink text-brand-ink disabled:opacity-35"
                    >
                      <MoinsIcon className="h-3 w-3" strokeWidth={3} />
                    </button>
                    <span className="min-w-4 border-b border-brand-ink text-center text-[13px] font-extrabold" aria-label={`Quantité : ${quantite}`}>
                      {quantite}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantite((q) => Math.min(max, q + 1))}
                      disabled={quantite >= max}
                      aria-label="Ajouter un exemplaire"
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF7A00] text-white disabled:opacity-40"
                    >
                      <PlusIcon className="h-3 w-3" strokeWidth={3} />
                    </button>
                  </div>
                  <p className="whitespace-nowrap text-[15px] font-extrabold text-[#FF8A00]">
                    {formaterPrixPoints(base)}
                    <span className="text-[10px] font-bold text-brand-ink">&nbsp;CFA</span>
                  </p>
                </div>
              </div>

              {produit.etat_produit ? (
                <span className="bg-gradient-brand-orange absolute right-0 top-0 rounded-bl-xl px-3 py-1 text-[10px] font-extrabold italic text-white">
                  {LIBELLE_ETAT[produit.etat_produit]}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <section className={CARTE}>
          <TitreCarte>À recevoir</TitreCarte>
          <FriseElements elements={recu} />
        </section>

        <section className={CARTE}>
          <TitreCarte>Modalités de payement</TitreCarte>

          <div className="mt-3 rounded-xl bg-[#EAF3FF] px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-extrabold leading-tight text-[#0B1B3A]">
                Total prix de base
                <br />
                des produits
              </p>
              <p className="whitespace-nowrap text-[24px] font-extrabold leading-none text-[#1D63E0]">
                {formaterPrixPoints(base)}
                <span className="text-[11px] font-bold text-brand-ink">&nbsp;CFA</span>
              </p>
            </div>
            {economie > 0 ? (
              <p className="mt-2.5 flex items-center gap-1.5 rounded-full bg-[#FFF1DC] px-2.5 py-1 text-[10px] font-bold text-[#EA7A0B]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF8A00]" />
                Tu économises {formaterPrixPoints(economie)} F De réduction sur ton achat
              </p>
            ) : null}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-[#F5F6FB] px-3 py-3">
            <p className="text-[13px] font-extrabold leading-tight text-[#0B1B3A]">
              Total frais
              <br />
              de livraison
            </p>
            <p className="whitespace-nowrap text-[22px] font-extrabold leading-none text-brand-ink">
              {formaterPrixPoints(frais)}
              <span className="text-[11px] font-bold">&nbsp;CFA</span>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 px-1">
            <div>
              <p className="text-[13px] font-extrabold uppercase text-black">Total a payer</p>
              <p className="mt-1 rounded bg-[#FFE9E4] px-1.5 py-0.5 text-[9px] text-[#E8231C]">Paiement à la livraison à {livraison?.localite ?? "—"}</p>
            </div>
            <p className="whitespace-nowrap text-[24px] font-extrabold leading-none text-[#FF8A00]">
              {formaterPrixPoints(total)}
              <span className="text-[11px] font-bold text-brand-ink">&nbsp;CFA</span>
            </p>
          </div>
        </section>
      </div>

      <BarrePaiement montant={produit.montant_confirmation} enCours={enCours} onPayer={() => onPayer(quantite)}>
        {erreur ? <p className="mb-2 text-center text-xs font-semibold text-red-500">{erreur}</p> : null}
      </BarrePaiement>
    </main>
  );
}

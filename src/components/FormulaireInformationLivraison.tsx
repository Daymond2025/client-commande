"use client";

import { useState } from "react";
import { formaterPrixPoints, type InfosLivraison, type Produit } from "@/lib/types";
import { ChevronBasIcon, DrapeauCiIcon } from "@/components/icons";

const CHAMP =
  "h-[46px] w-full rounded-[10px] border border-[#D5D9E0] bg-white px-3.5 text-[13px] text-brand-ink outline-none focus:border-[color:var(--brand-blue-end)]";
const LIBELLE = "block text-[14px] font-extrabold text-black";

/**
 * "Information de livraison" — feuille ouverte par "Je passe la commande" : nom
 * et prénoms, téléphone (+225) et ville de livraison, limitée aux communes que le
 * produit dessert. "Enregistrer" ne fait que valider la saisie et la remonter à la
 * page, qui ouvre le récapitulatif — rien n'est envoyé au serveur ici.
 */
export function FormulaireInformationLivraison({
  produit,
  initiales,
  onEnregistrer,
  onFermer,
}: {
  produit: Produit;
  initiales: InfosLivraison | null;
  onEnregistrer: (infos: InfosLivraison) => void;
  onFermer: () => void;
}) {
  const [nom, setNom] = useState(initiales?.nom ?? "");
  const [telephone, setTelephone] = useState(initiales?.telephone ?? "");
  const [localiteId, setLocaliteId] = useState(initiales ? String(initiales.localiteId) : "");
  const [erreur, setErreur] = useState<string | null>(null);

  const villes = produit.frais_livraison;

  function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    if (!nom.trim()) return setErreur("Indiquez votre nom et vos prénoms.");
    if (telephone.replace(/\D/g, "").length < 8) return setErreur("Indiquez un numéro de téléphone valide.");
    if (!localiteId) return setErreur("Choisissez votre ville de livraison.");
    onEnregistrer({ nom: nom.trim(), telephone: telephone.trim(), localiteId: Number(localiteId) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center" onClick={onFermer}>
      <form
        onSubmit={enregistrer}
        onChange={() => setErreur(null)}
        onClick={(e) => e.stopPropagation()}
        noValidate
        role="dialog"
        aria-label="Information de livraison"
        className="flex max-h-[94dvh] min-h-[min(600px,90dvh)] w-full max-w-md flex-col overflow-y-auto rounded-t-[36px] bg-white md:rounded-[36px]"
      >
        <h2 className="border-b border-[#E5E7EB] px-6 pb-4 pt-6 text-center text-[20px] font-extrabold text-[#777]">information de livraison</h2>

        <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
          <label className={LIBELLE} htmlFor="livraison-nom">
            Nom &amp; Prénoms
          </label>
          <input
            id="livraison-nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            autoComplete="name"
            placeholder="Entrez votre nom et prénom"
            className={`${CHAMP} mt-2.5 placeholder:text-[11px]`}
          />

          <label className={`${LIBELLE} mt-6`} htmlFor="livraison-telephone">
            Numero De Telephone
          </label>
          <div className="mt-2.5 flex h-[46px] items-center gap-2.5 rounded-[10px] border border-[#D5D9E0] px-3 focus-within:border-[color:var(--brand-blue-end)]">
            <DrapeauCiIcon className="h-[22px] w-[30px] shrink-0 rounded-[3px]" aria-hidden="true" />
            <span className="text-sm font-extrabold text-black">+225</span>
            <span className="h-6 w-px bg-[#D5D9E0]" />
            <input
              id="livraison-telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value.replace(/[^\d\s]/g, ""))}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="Numéro de WhatsApp et joignable"
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-brand-ink outline-none placeholder:text-[11px]"
            />
          </div>

          <label className={`${LIBELLE} mt-6`} htmlFor="livraison-ville">
            Lieu De Livraison
          </label>
          <div className="relative mt-2.5">
            <select
              id="livraison-ville"
              value={localiteId}
              onChange={(e) => setLocaliteId(e.target.value)}
              disabled={villes.length === 0}
              className={`${CHAMP} appearance-none pr-10 ${localiteId ? "" : "text-[#6B7280]"}`}
            >
              <option value="">{villes.length === 0 ? "Livraison indisponible pour ce produit" : "Sélectionner votre ville, (Exemple Abidjan)"}</option>
              {villes.map((f) => (
                <option key={f.localite_id} value={f.localite_id}>
                  {f.localite} — livraison {formaterPrixPoints(f.montant)} F
                </option>
              ))}
            </select>
            <ChevronBasIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B6F5E]" />
          </div>

          {erreur ? <p className="mt-4 text-[13px] font-semibold text-red-500">{erreur}</p> : null}

          <button
            type="submit"
            disabled={villes.length === 0}
            className="bg-gradient-brand-orange mt-auto flex h-[46px] w-full items-center justify-center gap-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wide text-white disabled:opacity-60"
          >
            Enregistrer
            <span aria-hidden="true" className="text-base leading-none">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}

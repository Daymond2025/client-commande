"use client";

import { useState } from "react";
import { ErreurApi, passerCommande } from "@/lib/api";
import { formaterPrix, type Origine, type Produit, type ReponseCommande, type Vendeur } from "@/lib/types";
import { CarteConseiller } from "@/components/CarteConseiller";
import { CocheIcon, FermerIcon, MoinsIcon, PlusIcon } from "@/components/icons";

const QUANTITE_MAX = 5;

const CHAMP =
  "mt-1 w-full rounded-xl border border-brand-line bg-[#F7F9FF] px-3.5 py-3 text-[15px] font-semibold text-brand-ink outline-none focus:border-[color:var(--brand-blue-end)] focus:bg-white";
const LIBELLE = "block text-[11px] font-bold uppercase tracking-wide text-brand-muted";

function Confirmation({ commande, onFermer }: { commande: ReponseCommande; onFermer: () => void }) {
  return (
    <div className="flex flex-col items-center px-1 pb-2 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DDF7E8] text-[#16A34A]">
        <CocheIcon className="h-8 w-8" />
      </span>
      <h2 className="mt-4 text-xl font-extrabold text-brand-ink">Commande enregistrée !</h2>
      <p className="mt-1 text-sm text-brand-muted">
        Référence <span className="font-extrabold text-brand-ink">n°{commande.reference}</span>
      </p>

      <div className="mt-5 w-full rounded-2xl bg-[#F4F7FF] p-4 text-left text-sm">
        <p className="font-extrabold text-brand-ink">
          {commande.quantite > 1 ? `${commande.quantite} × ` : ""}
          {commande.nom_produit}
        </p>
        <div className="mt-2 flex justify-between text-brand-muted">
          <span>Produit</span>
          <span className="font-semibold text-brand-ink">{formaterPrix(commande.montant_produits)} FCFA</span>
        </div>
        <div className="mt-1 flex justify-between text-brand-muted">
          <span>Livraison</span>
          <span className="font-semibold text-brand-ink">{formaterPrix(commande.frais_livraison)} FCFA</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-brand-line pt-2">
          <span className="font-bold text-brand-ink">À payer à la livraison</span>
          <span className="font-extrabold text-[#EA6A12]">{formaterPrix(commande.total_a_payer)} FCFA</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-brand-muted">
        Notre équipe vous appelle très vite pour confirmer votre commande et organiser la livraison. Vous ne payez qu&apos;à la réception.
      </p>

      <div className="mt-4 w-full">
        <CarteConseiller vendeur={commande.vendeur} titre="Une question ? Votre conseiller" />
      </div>

      <button type="button" onClick={onFermer} className="mt-5 h-12 w-full rounded-xl border border-brand-line text-sm font-extrabold text-brand-ink">
        Fermer
      </button>
    </div>
  );
}

/**
 * Feuille de commande (sans compte) : coordonnées de l'acheteur, commune de
 * livraison — limitée à celles que le produit dessert, avec leur tarif — et
 * adresse précise. Le paiement se fait à la livraison ; la commande arrive
 * "en attente" chez l'équipe, qui rappelle l'acheteur pour la valider.
 */
export function FormulaireCommande({
  produit,
  vendeur,
  origine,
  onFermer,
}: {
  produit: Produit;
  vendeur: Vendeur;
  origine: Origine;
  onFermer: () => void;
}) {
  const [quantite, setQuantite] = useState(1);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [localiteId, setLocaliteId] = useState("");
  const [adresse, setAdresse] = useState("");
  const [notes, setNotes] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [commande, setCommande] = useState<ReponseCommande | null>(null);

  const max = Math.max(1, Math.min(QUANTITE_MAX, produit.quantite_stock));
  const frais = produit.frais_livraison.find((f) => String(f.localite_id) === localiteId)?.montant ?? null;
  const total = produit.prix_vente * quantite + (frais ?? 0);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (envoi) return;

    if (!nom.trim()) return setErreur("Indiquez votre nom.");
    if (telephone.replace(/\D/g, "").length < 8) return setErreur("Indiquez un numéro de téléphone valide.");
    if (!localiteId) return setErreur("Choisissez votre commune de livraison.");
    if (adresse.trim().length < 5) return setErreur("Précisez votre adresse (quartier, repère…).");

    setEnvoi(true);
    setErreur(null);
    try {
      const reponse = await passerCommande({
        origine: origine.type,
        code: origine.code,
        ...(origine.type === "vitrine" ? { produit_id: produit.id, ...(origine.src ? { src: origine.src } : {}) } : {}),
        quantite,
        nom: nom.trim(),
        ...(prenom.trim() ? { prenom: prenom.trim() } : {}),
        telephone,
        localite_id: Number(localiteId),
        adresse: adresse.trim(),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      setCommande(reponse);
    } catch (err) {
      const champs = err instanceof ErreurApi ? Object.values(err.champs).flat() : [];
      setErreur(champs[0] ?? (err instanceof Error ? err.message : "Une erreur est survenue, réessayez."));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center" onClick={commande ? undefined : onFermer}>
      <div
        className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-white px-5 pb-6 pt-5 md:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Passer la commande"
      >
        {!commande ? (
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F5FA] text-brand-ink"
          >
            <FermerIcon className="h-4 w-4" />
          </button>
        ) : null}

        {commande ? (
          <Confirmation commande={commande} onFermer={onFermer} />
        ) : (
          // onChange remonte de tous les champs : le message d'erreur disparaît dès que l'acheteur corrige quelque chose.
          <form onSubmit={envoyer} onChange={() => setErreur(null)} noValidate>
            <h2 className="pr-10 text-xl font-extrabold text-brand-ink">Commander</h2>
            <p className="mt-0.5 text-sm text-brand-muted">
              Paiement à la livraison — rien à payer maintenant.
            </p>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F4F7FF] p-3">
              <p className="min-w-0 flex-1 truncate pr-3 text-sm font-extrabold text-brand-ink">{produit.nom_produit}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                  disabled={quantite <= 1}
                  aria-label="Retirer un exemplaire"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-ink shadow-sm disabled:opacity-40"
                >
                  <MoinsIcon className="h-4 w-4" />
                </button>
                <span className="w-5 text-center text-sm font-extrabold">{quantite}</span>
                <button
                  type="button"
                  onClick={() => setQuantite((q) => Math.min(max, q + 1))}
                  disabled={quantite >= max}
                  aria-label="Ajouter un exemplaire"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-ink shadow-sm disabled:opacity-40"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className={LIBELLE}>
                Nom
                <input value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="family-name" placeholder="Kouassi" className={CHAMP} />
              </label>
              <label className={LIBELLE}>
                Prénom
                <input value={prenom} onChange={(e) => setPrenom(e.target.value)} autoComplete="given-name" placeholder="Awa" className={CHAMP} />
              </label>
            </div>

            <label className={`${LIBELLE} mt-3`}>
              Téléphone (WhatsApp de préférence)
              <input
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="07 11 22 33 44"
                className={CHAMP}
              />
            </label>

            <label className={`${LIBELLE} mt-3`}>
              Commune de livraison
              <select value={localiteId} onChange={(e) => setLocaliteId(e.target.value)} className={CHAMP} disabled={produit.frais_livraison.length === 0}>
                <option value="">{produit.frais_livraison.length === 0 ? "Livraison indisponible pour ce produit" : "Choisir la commune ou la ville"}</option>
                {produit.frais_livraison.map((f) => (
                  <option key={f.localite_id} value={f.localite_id}>
                    {f.localite} — livraison {formaterPrix(f.montant)} F
                  </option>
                ))}
              </select>
            </label>

            <label className={`${LIBELLE} mt-3`}>
              Adresse précise
              <textarea
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                rows={2}
                autoComplete="street-address"
                placeholder="Quartier, rue, repère (ex. près de la pharmacie)"
                className={`${CHAMP} resize-none`}
              />
            </label>

            <label className={`${LIBELLE} mt-3`}>
              Message pour le livreur (facultatif)
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex. appeler avant de passer" className={CHAMP} />
            </label>

            <div className="mt-5 rounded-2xl bg-[#F4F7FF] p-4 text-sm">
              <div className="flex justify-between text-brand-muted">
                <span>{quantite > 1 ? `${quantite} × ${formaterPrix(produit.prix_vente)} FCFA` : "Produit"}</span>
                <span className="font-semibold text-brand-ink">{formaterPrix(produit.prix_vente * quantite)} FCFA</span>
              </div>
              <div className="mt-1 flex justify-between text-brand-muted">
                <span>Livraison</span>
                <span className="font-semibold text-brand-ink">{frais === null ? "selon la commune" : `${formaterPrix(frais)} FCFA`}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-brand-line pt-2">
                <span className="font-bold text-brand-ink">À payer à la livraison</span>
                <span className="text-lg font-extrabold text-[#EA6A12]">{frais === null ? "—" : `${formaterPrix(total)} FCFA`}</span>
              </div>
            </div>

            {erreur ? <p className="mt-3 text-sm font-semibold text-red-500">{erreur}</p> : null}

            <button
              type="submit"
              disabled={envoi || produit.frais_livraison.length === 0}
              className="bg-gradient-brand-orange mt-4 h-13 w-full rounded-xl py-3.5 text-[15px] font-extrabold text-white shadow-[0_6px_14px_rgba(255,122,0,0.3)] disabled:opacity-60"
            >
              {envoi ? "Envoi en cours…" : "Confirmer ma commande"}
            </button>
            <p className="mt-2 text-center text-[11px] text-brand-muted">
              En commandant, vous acceptez d&apos;être rappelé par {vendeur.nom || "notre équipe"} ou un conseiller Ordi&apos;Space.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

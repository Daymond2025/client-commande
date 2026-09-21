"use client";

import { useEffect, useState } from "react";
import { lireConfirmation } from "@/lib/api";
import { formaterPrixPoints, type Confirmation } from "@/lib/types";
import { CarteConseiller } from "@/components/CarteConseiller";
import { CocheIcon, FermerIcon } from "@/components/icons";

const INTERVALLE_MS = 2500;
/** Wave prévient le serveur en quelques secondes ; au-delà, on cesse d'interroger et on rassure. */
const TENTATIVES_MAX = 24;

function Enveloppe({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#F5F5FF] pb-10 md:my-6 md:min-h-0 md:overflow-hidden md:rounded-[28px] md:shadow-2xl md:shadow-slate-900/10">
      <header className="bg-gradient-brand-blue px-5 py-4 text-white">
        <p className="text-base font-extrabold tracking-wide">ORDI&apos;SPACE</p>
      </header>
      <div className="px-4 pt-6">{children}</div>
    </main>
  );
}

function Icone({ ok }: { ok: boolean }) {
  return (
    <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${ok ? "bg-[#DDF7E8] text-[#16A34A]" : "bg-[#FFE9E4] text-[#E8231C]"}`}>
      {ok ? <CocheIcon className="h-8 w-8" /> : <FermerIcon className="h-7 w-7" />}
    </span>
  );
}

function Ligne({ libelle, valeur, fort = false }: { libelle: string; valeur: string; fort?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 ${fort ? "border-t border-brand-line pt-2" : "mt-1"}`}>
      <span className={fort ? "font-bold text-brand-ink" : "text-brand-muted"}>{libelle}</span>
      <span className={`whitespace-nowrap ${fort ? "text-lg font-extrabold text-[#EA6A12]" : "font-semibold text-brand-ink"}`}>{valeur}&nbsp;FCFA</span>
    </div>
  );
}

/**
 * Page où Wave ramène l'acheteur après le paiement de confirmation. Elle ne se fie pas à
 * l'adresse : elle lit le statut réel (GET /public/confirmations/{token}), qui ne passe à
 * "confirmé" que sur le webhook de Wave — et attend un instant que celui-ci arrive.
 */
export function ResultatConfirmation({ initiale }: { initiale: Confirmation }) {
  const [confirmation, setConfirmation] = useState(initiale);
  const [tentatives, setTentatives] = useState(0);
  const enAttente = confirmation.statut === "en_attente";

  useEffect(() => {
    if (!enAttente || tentatives >= TENTATIVES_MAX) return;
    const attente = setTimeout(() => {
      lireConfirmation(initiale.token)
        .then(setConfirmation)
        .catch(() => {})
        .finally(() => setTentatives((n) => n + 1));
    }, INTERVALLE_MS);
    return () => clearTimeout(attente);
  }, [enAttente, tentatives, initiale.token]);

  if (enAttente) {
    const abandon = tentatives >= TENTATIVES_MAX;
    return (
      <Enveloppe>
        <div className="rounded-2xl bg-white p-6 text-center shadow-[0_2px_10px_rgba(0,80,200,0.08)]">
          {abandon ? null : <span className="mx-auto block h-12 w-12 animate-spin rounded-full border-4 border-[#DDE8FF] border-t-[color:var(--brand-blue-end)]" aria-hidden="true" />}
          <h1 className="mt-4 text-xl font-extrabold text-brand-ink">{abandon ? "Paiement non reçu pour l'instant" : "Vérification de votre paiement…"}</h1>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">
            {abandon
              ? "Nous n'avons pas encore reçu la confirmation de Wave. Si vous avez payé, votre commande apparaîtra dans quelques instants ; sinon, vous pouvez réessayer."
              : "Ne fermez pas cette page, cela ne prend que quelques secondes."}
          </p>
          {abandon && confirmation.wave_launch_url ? (
            <a href={confirmation.wave_launch_url} className="bg-gradient-brand-orange mt-5 flex h-12 items-center justify-center rounded-xl text-sm font-extrabold uppercase text-white">
              Réessayer le paiement
            </a>
          ) : null}
        </div>
      </Enveloppe>
    );
  }

  if (confirmation.statut === "echoue") {
    return (
      <Enveloppe>
        <div className="rounded-2xl bg-white p-6 text-center shadow-[0_2px_10px_rgba(0,80,200,0.08)]">
          <Icone ok={false} />
          <h1 className="mt-4 text-xl font-extrabold text-brand-ink">Le paiement n&apos;a pas abouti</h1>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">
            Votre commande n&apos;a pas été enregistrée et rien n&apos;a été débité. Rouvrez le lien de votre conseiller pour recommencer.
          </p>
        </div>
        {confirmation.vendeur ? (
          <div className="mt-4">
            <CarteConseiller vendeur={confirmation.vendeur} titre="Une question ? Votre conseiller" />
          </div>
        ) : null}
      </Enveloppe>
    );
  }

  // Payé — la commande existe, ou (anomalie) n'a pas pu être créée et l'équipe rappelle l'acheteur.
  const anomalie = confirmation.anomalie || confirmation.reference === null;

  return (
    <Enveloppe>
      <div className="rounded-2xl bg-white p-6 text-center shadow-[0_2px_10px_rgba(0,80,200,0.08)]">
        <Icone ok />
        <h1 className="mt-4 text-xl font-extrabold text-brand-ink">{anomalie ? "Paiement reçu, merci !" : "Commande confirmée !"}</h1>
        {anomalie ? (
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">
            Votre confirmation de {formaterPrixPoints(confirmation.montant_confirmation)} FCFA est bien reçue, mais nous n&apos;avons pas pu enregistrer la commande (le produit vient de
            changer de disponibilité). Notre équipe vous appelle très vite.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-brand-muted">
              Référence <span className="font-extrabold text-brand-ink">n°{confirmation.reference}</span>
            </p>

            <div className="mt-5 rounded-2xl bg-[#F4F7FF] p-4 text-left text-sm">
              <p className="font-extrabold text-brand-ink">
                {confirmation.quantite > 1 ? `${confirmation.quantite} × ` : ""}
                {confirmation.nom_produit}
              </p>
              <div className="mt-2">
                <Ligne libelle="Produit" valeur={formaterPrixPoints(confirmation.montant_produits)} />
                <Ligne libelle="Livraison" valeur={formaterPrixPoints(confirmation.frais_livraison)} />
                <Ligne libelle="Confirmation payée" valeur={`− ${formaterPrixPoints(confirmation.montant_confirmation)}`} />
              </div>
              <div className="mt-2">
                <Ligne libelle="Reliquat à payer à la livraison" valeur={formaterPrixPoints(confirmation.reliquat)} fort />
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-brand-muted">
              Notre équipe vous appelle très vite pour valider votre commande et organiser la livraison. Vous ne paierez plus que le reliquat à la réception.
            </p>
          </>
        )}
      </div>

      {confirmation.vendeur ? (
        <div className="mt-4">
          <CarteConseiller vendeur={confirmation.vendeur} titre="Une question ? Votre conseiller" />
        </div>
      ) : null}
    </Enveloppe>
  );
}

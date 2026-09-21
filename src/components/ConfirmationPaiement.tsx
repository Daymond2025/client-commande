"use client";

import { useState } from "react";
import type { Confirmation } from "@/lib/types";
import { BarrePaiement } from "@/components/BarrePaiement";
import { CadenasIcon, FlecheGaucheIcon } from "@/components/icons";

/**
 * "Confirmation" — étape après le récapitulatif : le paiement de confirmation sur Wave
 * (jamais remboursé, compris dans le total), pour prouver que l'achat aura lieu ; le
 * reliquat se paie à la livraison. "Payer" emmène sur Wave ; au retour, la page
 * /boutique/confirmation/{token} lit le statut réel du paiement.
 */
export function ConfirmationPaiement({ confirmation, onRetour }: { confirmation: Confirmation; onRetour: () => void }) {
  const [redirection, setRedirection] = useState(false);

  function payer() {
    if (!confirmation.wave_launch_url || redirection) return;
    setRedirection(true);
    window.location.assign(confirmation.wave_launch_url);
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#F5F5FF] pb-40 md:my-6 md:min-h-0 md:overflow-hidden md:rounded-[28px] md:shadow-2xl md:shadow-slate-900/10">
      <header className="bg-gradient-brand-blue relative h-[160px] rounded-bl-[44px] px-6 pt-6 text-white">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onRetour} aria-label="Retour au récapitulatif" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/25">
            <FlecheGaucheIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-[22px] font-extrabold leading-tight">Confirmation</h1>
            <p className="text-[10px] text-white/85">Paiement sécurisé via wave</p>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-6 -mt-[74px] flex min-h-[340px] flex-col items-center rounded-[36px] bg-white px-6 pt-8 shadow-[0_10px_30px_rgba(20,20,60,0.12)]">
        <p className="text-[12px] text-brand-ink">Montant à deposer</p>
        <p className="mt-0.5 text-[42px] font-extrabold leading-none text-black">{confirmation.montant_confirmation} F</p>
        {/* eslint-disable-next-line @next/next/no-img-element -- logo local, pas besoin de next/image */}
        <img src="/images/wave.jpg" alt="Wave" className="mt-5 h-[92px] w-[92px] rounded-xl border-[3px] border-[#1D63E0] object-cover" />
      </section>

      <p className="mx-6 mt-6 rounded-xl border border-[#FFE0B8] bg-white px-4 py-4 text-[12px] leading-relaxed text-[#FF8A00]">
        Vous allez payer {confirmation.montant_confirmation} CFA sur wave pour la confirmation de votre commande. Ce montant est inclus dans le montant total.
      </p>

      <div className="mt-16 flex flex-col items-center px-10 text-center">
        <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8B93A5]">
          <CadenasIcon className="h-5 w-5" />
          Paiement 100% sécurisé
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-[#A0A7B7]">
          Toutes les transactions sont chiffrées et sécurisées par Ordi&apos;Space conformément aux normes internationales.
        </p>
      </div>

      <BarrePaiement montant={confirmation.montant_confirmation} enCours={redirection} onPayer={payer} />
    </main>
  );
}

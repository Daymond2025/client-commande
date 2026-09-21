import type { ReactNode } from "react";

/**
 * Barre du bas des étapes de paiement : le montant de la confirmation à gauche (non
 * remboursable, déjà compris dans le total) et le bouton "PAYER" à droite.
 */
export function BarrePaiement({
  montant,
  enCours = false,
  onPayer,
  children,
}: {
  montant: number;
  enCours?: boolean;
  onPayer?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md rounded-t-[22px] bg-white px-4 pb-5 pt-3.5 shadow-[0_-4px_14px_rgba(0,0,0,0.1)]">
      {children}
      <div className="flex items-center gap-4">
        <div className="shrink-0">
          <p className="text-[11px] font-extrabold text-brand-ink">Confirmation</p>
          <p className="text-[22px] font-extrabold leading-tight text-black">{montant} Fr</p>
          <p className="mt-0.5 max-w-[150px] rounded bg-[#FFE9E4] px-1.5 py-0.5 text-[8px] leading-tight text-[#E8231C]">
            À payer pour confirmer, Inclus dans le montant total
          </p>
        </div>
        <button
          type="button"
          onClick={onPayer}
          disabled={enCours}
          className="bg-gradient-brand-orange h-14 flex-1 rounded-xl text-[18px] font-extrabold uppercase tracking-wide text-white shadow-[0_4px_10px_rgba(255,122,0,0.25)] disabled:opacity-60"
        >
          {enCours ? "…" : "Payer"}
        </button>
      </div>
    </div>
  );
}

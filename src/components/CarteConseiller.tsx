import type { Vendeur } from "@/lib/types";
import { TelephoneIcon, WhatsappIcon } from "@/components/icons";

/** "Votre conseiller" : la personne qui a partagé le lien, joignable par WhatsApp ou téléphone. */
export function CarteConseiller({ vendeur, titre = "Votre conseiller Ordi'Space" }: { vendeur: Vendeur; titre?: string }) {
  const initiale = vendeur.nom.trim().charAt(0).toUpperCase() || "O";

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_2px_10px_rgba(0,80,200,0.08)]">
      {vendeur.photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- photo servie par le backend, domaine dynamique
        <img src={vendeur.photo} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="bg-gradient-brand-blue flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-white">
          {initiale}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-brand-muted">{titre}</p>
        <p className="truncate text-base font-extrabold text-brand-ink">{vendeur.nom}</p>
      </div>
      {vendeur.whatsapp_url ? (
        <a
          href={vendeur.whatsapp_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Écrire au conseiller sur WhatsApp"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white"
        >
          <WhatsappIcon className="h-5 w-5" />
        </a>
      ) : null}
      {vendeur.telephone ? (
        <a
          href={`tel:${vendeur.telephone}`}
          aria-label="Appeler le conseiller"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F1FE] text-[color:var(--brand-blue-end)]"
        >
          <TelephoneIcon className="h-[18px] w-[18px]" />
        </a>
      ) : null}
    </div>
  );
}

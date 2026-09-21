import { CocheIcon, PlusIcon } from "@/components/icons";

export function PastillePlus() {
  return (
    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#E8231C] text-white">
      <PlusIcon className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}

/**
 * Frise verticale des éléments reçus à la livraison : une pastille rouge "+" par
 * élément, reliées par un fil, chaque élément dans une pilule verte cochée.
 * Commune à l'onglet "Pack complet" (avec le point noir de tête) et au récapitulatif.
 */
export function FriseElements({ elements, pointNoir = false }: { elements: string[]; pointNoir?: boolean }) {
  return (
    <ul className={`relative ${pointNoir ? "mt-6" : "mt-4"} space-y-3 pl-1`}>
      <span className={`absolute bottom-3 left-[11px] w-0.5 bg-[#D5D8E8] ${pointNoir ? "-top-3.5" : "top-0"}`} aria-hidden="true" />
      {pointNoir ? <span className="absolute -top-4 left-[6px] h-3 w-3 rounded-full bg-black" aria-hidden="true" /> : null}
      {elements.map((element, index) => (
        <li key={`${element}-${index}`} className="relative flex items-center gap-3">
          <span className="relative z-10 flex h-[22px] w-[22px] shrink-0 items-center justify-center">
            <PastillePlus />
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-[#DDF3E8] px-3 py-2 text-[13px] font-semibold text-brand-ink">
            <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-white">
              <CocheIcon className="h-3 w-3" strokeWidth={3.2} />
            </span>
            <span className="min-w-0">{element}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

import Link from "next/link";
import { LIBELLE_ETAT, formaterPrix, type ReponseVitrine } from "@/lib/types";
import { CarteConseiller } from "@/components/CarteConseiller";
import { ImageIcon } from "@/components/icons";

/** Vitrine d'un vendeur : sa sélection de produits en grille, chaque carte ouvre la page produit (et la commande). */
export function CatalogueVitrine({ donnees, code, src }: { donnees: ReponseVitrine; code: string; src?: "qr" }) {
  const suffixe = src ? `?src=${src}` : "";

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#F4F7FF] pb-8 md:my-6 md:min-h-0 md:overflow-hidden md:rounded-[28px] md:shadow-2xl md:shadow-slate-900/10">
      <header className="bg-gradient-brand-blue rounded-b-[28px] px-4 pb-6 pt-4 text-white">
        <p className="text-base font-extrabold tracking-wide">ORDI&apos;SPACE</p>
        <h1 className="mt-4 text-2xl font-extrabold leading-tight">Votre ordinateur, livré chez vous</h1>
        <p className="mt-1 text-sm text-white/90">Neufs, quasi neufs ou reconditionnés. Paiement à la réception.</p>
      </header>

      <div className="-mt-4 px-3">
        <CarteConseiller vendeur={donnees.vendeur} titre="La sélection de votre conseiller" />
      </div>

      {donnees.produits.length === 0 ? (
        <p className="px-6 pt-10 text-center text-sm text-brand-muted">Aucun produit disponible pour le moment. Contactez votre conseiller.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 px-3">
          {donnees.produits.map((produit) => (
            <Link
              key={produit.id}
              href={`/boutique/vitrine/${code}/produit/${produit.id}${suffixe}`}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,80,200,0.08)]"
            >
              <div className="relative aspect-[4/3] w-full bg-[#F2F5FA]">
                {produit.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- photo servie par le backend, domaine dynamique
                  <img src={produit.image} alt={produit.nom_produit} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-brand-muted">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                {produit.etat_produit ? (
                  <span className="absolute left-2 top-2 rounded-md bg-gradient-to-r from-[#FFCC00] to-[#FF7800] px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                    {LIBELLE_ETAT[produit.etat_produit]}
                  </span>
                ) : null}
                {produit.pourcentage_reduction ? (
                  <span className="absolute right-2 top-2 rounded bg-[#FF9700] px-1.5 py-0.5 text-[10px] font-extrabold text-white">-{produit.pourcentage_reduction}%</span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="line-clamp-2 text-[13px] font-extrabold leading-tight text-brand-ink">{produit.nom_produit}</p>
                {produit.specs.length > 0 ? <p className="mt-1 line-clamp-2 text-[10px] text-brand-muted">{produit.specs.join(" • ")}</p> : null}
                <div className="mt-auto pt-2">
                  <p className="text-base font-extrabold text-[#EA6A12]">{formaterPrix(produit.prix_vente)} F</p>
                  {produit.prix_barre ? <p className="text-[10px] text-brand-muted line-through">{formaterPrix(produit.prix_barre)} F</p> : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

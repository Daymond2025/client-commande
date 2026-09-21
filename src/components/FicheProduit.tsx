"use client";

import Link from "next/link";
import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { ErreurApi, ouvrirConfirmation } from "@/lib/api";
import { LIBELLE_ETAT, formaterPrix, type Confirmation, type InfosLivraison, type Origine, type Produit, type ReponseProduit } from "@/lib/types";
import { CarteConseiller } from "@/components/CarteConseiller";
import { ConfirmationPaiement } from "@/components/ConfirmationPaiement";
import { FormulaireInformationLivraison } from "@/components/FormulaireInformationLivraison";
import { FriseElements, PastillePlus } from "@/components/FriseElements";
import { RecapitulatifCommande } from "@/components/RecapitulatifCommande";
import {
  CarteGraphiqueIcon,
  CocheIcon,
  DisqueIcon,
  EcranIcon,
  FenetresIcon,
  FlecheGaucheIcon,
  ImageIcon,
  MemoireIcon,
  ProcesseurIcon,
  WhatsappIcon,
} from "@/components/icons";

type IconeSvg = ComponentType<SVGProps<SVGSVGElement>>;

const ONGLETS = [
  { id: "cadeaux", label: "Les cadeaux" },
  { id: "description", label: "Description" },
  { id: "pack", label: "Pack complet" },
] as const;

type IdOnglet = (typeof ONGLETS)[number]["id"];

const DEGRADE_ORANGE = "linear-gradient(90deg, #FF7A00 0%, #FFC400 100%)";

/** Visuel d'un cadeau : les trois les plus courants ont leur image, les autres une boîte cadeau. */
function imageCadeau(cadeau: string): string {
  const nom = cadeau.toLowerCase();
  if (nom.includes("souris")) return "/images/souris.png";
  if (nom.includes("sac")) return "/images/sac-pc.png";
  if (nom.includes("chargeur")) return "/images/chargeur.png";
  return "/images/image-bonus-offert.png";
}

const FONDS_CADEAUX = ["#FFFFFF", "#DCEBFF", "#FBEBD9", "#E3F4FB", "#FBE3F0"];

function PanneauCadeaux({ cadeaux }: { cadeaux: string[] }) {
  if (cadeaux.length === 0) return <p className="py-6 text-center text-sm text-brand-muted">Aucun cadeau offert avec ce produit.</p>;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {cadeaux.map((cadeau, index) => (
          <div
            key={`${cadeau}-${index}`}
            className="flex aspect-square items-center justify-center rounded-2xl p-3"
            style={{ background: FONDS_CADEAUX[index % FONDS_CADEAUX.length] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- petit visuel local, pas besoin de next/image */}
            <img src={imageCadeau(cadeau)} alt={cadeau} className="h-full w-full object-contain" />
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-2.5">
        {cadeaux.map((cadeau, index) => (
          <span key={`${cadeau}-${index}`} className="flex items-center gap-2">
            <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-brand-ink shadow-[0_1px_3px_rgba(0,0,0,0.08)]">{cadeau}</span>
            {index < cadeaux.length - 1 ? <PastillePlus /> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function PanneauDescription({ description }: { description: string | null }) {
  if (!description) return <p className="py-6 text-center text-sm text-brand-muted">Aucune description pour ce produit.</p>;
  return <p className="whitespace-pre-line text-sm leading-relaxed text-brand-muted">{description}</p>;
}

function PanneauPack({ produit }: { produit: Produit }) {
  const cadeaux = produit.cadeaux ?? [];
  const elements = [`1 ${produit.nom_produit}`, ...cadeaux.map((c) => `1 ${c}`), ...(cadeaux.length > 0 ? ["Et tous les bonus offerts"] : [])];

  return (
    <div>
      <p className="text-center text-[13px] font-extrabold uppercase leading-tight text-brand-ink">
        À la livraison, vous recevrez tous les éléments listés ci-dessous
      </p>

      <FriseElements elements={elements} pointNoir />
    </div>
  );
}

/**
 * Page produit de l'acheteur (refonte) : galerie, marque/stock, prix, six
 * caractéristiques, puis trois onglets — Les cadeaux, Description, Pack complet
 * — et le conseiller qui a partagé le lien. "Je passe la commande" ouvre
 * "Information de livraison", le récapitulatif, puis la confirmation : "Payer" ouvre
 * le paiement de confirmation sur Wave (la commande n'est créée qu'une fois celui-ci
 * confirmé, voir /boutique/confirmation/{token}). `retour` n'existe que depuis une vitrine.
 */
export function FicheProduit({ donnees, origine, retour }: { donnees: ReponseProduit; origine: Origine; retour?: string }) {
  const { produit, vendeur } = donnees;
  const cadeaux = produit.cadeaux ?? [];
  const [imageActive, setImageActive] = useState(0);
  const [onglet, setOnglet] = useState<IdOnglet>(cadeaux.length > 0 ? "cadeaux" : "description");
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [infos, setInfos] = useState<InfosLivraison | null>(null);
  const [etape, setEtape] = useState<"fiche" | "recapitulatif" | "confirmation">("fiche");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreurPaiement, setErreurPaiement] = useState<string | null>(null);

  const enRupture = produit.quantite_stock <= 0;
  const economie = produit.prix_barre && produit.prix_barre > produit.prix_vente ? produit.prix_barre - produit.prix_vente : null;
  const resume = [produit.processeur, produit.memoire_ram && `${produit.memoire_ram} RAM`, produit.stockage, produit.taille].filter(Boolean).join(" • ");

  const caracteristiques = (
    [
      { label: "Processeur", valeur: produit.processeur, Icone: ProcesseurIcon },
      { label: "Disque dur", valeur: produit.stockage, Icone: DisqueIcon },
      { label: "Ram", valeur: produit.memoire_ram, Icone: MemoireIcon },
      { label: "Carte graphique", valeur: produit.carte_graphique, Icone: CarteGraphiqueIcon },
      { label: "Taille d'écran", valeur: produit.taille, Icone: EcranIcon },
      { label: "Système installé", valeur: produit.systeme_exploitation, Icone: FenetresIcon },
    ] as { label: string; valeur: string | null; Icone: IconeSvg }[]
  ).filter((c): c is { label: string; valeur: string; Icone: IconeSvg } => Boolean(c.valeur));

  /** "Payer" : ouvre la confirmation (aucune commande n'existe tant que Wave n'a pas confirmé le paiement). */
  async function ouvrirPaiement(quantite: number) {
    if (!infos || envoi) return;
    setEnvoi(true);
    setErreurPaiement(null);
    try {
      setConfirmation(
        await ouvrirConfirmation({
          origine: origine.type,
          code: origine.code,
          ...(origine.type === "vitrine" ? { produit_id: produit.id, ...(origine.src ? { src: origine.src } : {}) } : {}),
          quantite,
          nom: infos.nom,
          telephone: infos.telephone,
          localite_id: infos.localiteId,
        }),
      );
      setEtape("confirmation");
      window.scrollTo({ top: 0 });
    } catch (err) {
      const champs = err instanceof ErreurApi ? Object.values(err.champs).flat() : [];
      setErreurPaiement(champs[0] ?? (err instanceof Error ? err.message : "Une erreur est survenue, réessayez."));
    } finally {
      setEnvoi(false);
    }
  }

  if (etape === "confirmation" && confirmation) {
    return <ConfirmationPaiement confirmation={confirmation} onRetour={() => setEtape("recapitulatif")} />;
  }

  if (etape === "recapitulatif" && infos) {
    return (
      <RecapitulatifCommande
        produit={produit}
        infos={infos}
        onRetour={() => setEtape("fiche")}
        onPayer={ouvrirPaiement}
        enCours={envoi}
        erreur={erreurPaiement}
      />
    );
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-[#F5F5FF] pb-32 md:my-6 md:min-h-0 md:overflow-hidden md:rounded-[28px] md:shadow-2xl md:shadow-slate-900/10">
      <header className="bg-gradient-brand-blue flex items-center gap-3 px-4 py-3.5 text-white">
        {retour ? (
          <Link href={retour} aria-label="Retour à la boutique" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/25">
            <FlecheGaucheIcon className="h-5 w-5" />
          </Link>
        ) : null}
        <p className="flex-1 text-base font-extrabold tracking-wide">ORDI&apos;SPACE</p>
        <p className="text-[11px] font-semibold text-white/90">Livraison à domicile</p>
      </header>

      <div className="rounded-b-[20px] bg-white pb-3 shadow-[0_2px_8px_rgba(20,20,60,0.06)]">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2F5FA]">
          {produit.images[imageActive] ? (
            // eslint-disable-next-line @next/next/no-img-element -- photo servie par le backend, domaine dynamique
            <img src={produit.images[imageActive]} alt={produit.nom_produit} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-brand-muted">
              <ImageIcon className="h-12 w-12" />
            </div>
          )}

          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {produit.etat_produit ? (
                <span className="rounded-lg px-3 py-1 text-xs font-extrabold text-white shadow-sm" style={{ background: DEGRADE_ORANGE }}>
                  {LIBELLE_ETAT[produit.etat_produit]}
                </span>
              ) : null}
              {produit.duree_garantie_mois ? (
                <span className="flex items-center gap-1.5 rounded-lg bg-[#E6F9EE] px-2.5 py-1 text-xs font-extrabold text-[#0F7A3B] shadow-sm">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#16A34A] text-white">
                    <CocheIcon className="h-2.5 w-2.5" strokeWidth={3.4} />
                  </span>
                  Garantie&nbsp;{produit.duree_garantie_mois}&nbsp;mois
                </span>
              ) : null}
            </div>
            {produit.pourcentage_reduction ? (
              <span className="shrink-0 rounded-md px-2 py-1 text-xs font-extrabold text-white" style={{ background: "linear-gradient(135deg, #FF9700, #FFB800)" }}>
                -{produit.pourcentage_reduction}%
              </span>
            ) : null}
          </div>
        </div>

        {produit.images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto px-2 pt-2.5">
            {produit.images.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => setImageActive(index)}
                aria-label={`Photo ${index + 1}`}
                className={`h-[68px] w-[112px] shrink-0 overflow-hidden rounded-lg border-2 bg-[#F2F5FA] ${index === imageActive ? "border-[color:var(--brand-blue-end)]" : "border-transparent"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- photo servie par le backend, domaine dynamique */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <section className="mx-2.5 mt-3.5 rounded-[18px] bg-white p-3.5 shadow-[0_1px_3px_rgba(20,20,60,0.06)]">
        <div className="flex flex-wrap items-center gap-2">
          {produit.marque ? <span className="rounded-md bg-black px-2.5 py-1 text-[11px] font-bold uppercase text-white">{produit.marque}</span> : null}
          <span className="flex items-center gap-1.5 rounded-md bg-[#F2F3FA] px-2.5 py-1 text-[12px] text-[#4B5563]">
            <span className={`h-2 w-2 rounded-full ${enRupture ? "bg-red-500" : "bg-[#16A34A]"}`} />
            {enRupture ? "Rupture de stock" : `${produit.quantite_stock} pièce${produit.quantite_stock > 1 ? "s" : ""} disponible${produit.quantite_stock > 1 ? "s" : ""}`}
            {!enRupture ? <span className="font-semibold text-brand-ink">En stock</span> : null}
          </span>
        </div>

        <h1 className="mt-3 text-[26px] font-extrabold leading-tight tracking-tight text-brand-ink">{produit.nom_produit}</h1>
        {resume ? <p className="mt-1 text-[13px] text-brand-muted">{resume}</p> : null}

        {/* Un montant ne se coupe jamais : espace insécable avant "FCFA" + nowrap. */}
        <div className="mt-3 flex min-h-[64px] flex-wrap items-end justify-between gap-x-3 gap-y-1 rounded-xl px-3 py-2.5" style={{ background: "rgba(242, 243, 255, 0.7)" }}>
          <div className="whitespace-nowrap">
            {produit.prix_barre ? <p className="text-xs text-brand-muted line-through">{formaterPrix(produit.prix_barre)}&nbsp;FCFA</p> : null}
            <p className="text-[32px] font-extrabold leading-none text-[#FF8A00]">
              {formaterPrix(produit.prix_vente)}
              <span className="text-[15px]">&nbsp;FCFA</span>
            </p>
          </div>
          {economie ? (
            <span className="mb-1 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#FFF1DC] px-2.5 py-1 text-[11px] font-bold text-[#EA7A0B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
              Économie&nbsp;{formaterPrix(economie)}&nbsp;F
            </span>
          ) : null}
        </div>
      </section>

      <section className="mx-2.5 mt-3.5 rounded-[18px] bg-white p-3.5 shadow-[0_1px_3px_rgba(20,20,60,0.06)]">
        {caracteristiques.length > 0 ? (
          <dl className="grid grid-cols-3 gap-2">
            {caracteristiques.map(({ label, valeur, Icone }) => (
              <div key={label} className="flex min-w-0 items-center gap-2 rounded-lg bg-[#F4F5FF] px-2.5 py-2">
                <Icone className="h-5 w-5 shrink-0 text-[#FF7A00]" />
                <div className="min-w-0">
                  <dt className="truncate text-[9px] text-brand-muted">{label}</dt>
                  <dd className="text-[11px] font-extrabold leading-tight text-brand-ink">{valeur}</dd>
                </div>
              </div>
            ))}
          </dl>
        ) : null}

        <div role="tablist" className={`${caracteristiques.length > 0 ? "mt-5" : ""} flex items-center rounded-full bg-[#F5F6FB] p-1`}>
          {ONGLETS.map((o) => {
            const actif = onglet === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="tab"
                aria-selected={actif}
                onClick={() => setOnglet(o.id)}
                className={`h-10 flex-1 rounded-full text-[13px] transition-colors ${actif ? "font-extrabold text-white shadow-[0_3px_8px_rgba(255,122,0,0.35)]" : "font-medium text-brand-ink"}`}
                style={actif ? { background: DEGRADE_ORANGE } : undefined}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="mt-3 rounded-2xl bg-[#F5F5FF] p-4">
          {onglet === "cadeaux" ? <PanneauCadeaux cadeaux={cadeaux} /> : onglet === "description" ? <PanneauDescription description={produit.description} /> : <PanneauPack produit={produit} />}
        </div>
      </section>

      <div className="mx-2.5 mt-3.5">
        <CarteConseiller vendeur={vendeur} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md rounded-t-[26px] bg-white px-5 pb-5 pt-4 shadow-[0_-4px_14px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3.5">
          {/* Ouvre "Information de livraison" ; rien n'est envoye au serveur a ce stade. */}
          <button
            type="button"
            onClick={() => setFormulaireOuvert(true)}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-[15px] font-extrabold text-white shadow-[0_4px_10px_rgba(255,122,0,0.25)]"
            style={{ background: DEGRADE_ORANGE }}
          >
            Je passe la commande
            <span aria-hidden="true">→</span>
          </button>
          {vendeur.whatsapp_url ? (
            <a
              href={vendeur.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Écrire au conseiller sur WhatsApp"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DDF7E8] text-[#25D366]"
            >
              <WhatsappIcon className="h-7 w-7" />
            </a>
          ) : null}
        </div>
      </div>

      {formulaireOuvert ? (
        <FormulaireInformationLivraison
          produit={produit}
          initiales={infos}
          onFermer={() => setFormulaireOuvert(false)}
          onEnregistrer={(saisie) => {
            setInfos(saisie);
            setFormulaireOuvert(false);
            setErreurPaiement(null);
            setEtape("recapitulatif");
            window.scrollTo({ top: 0 });
          }}
        />
      ) : null}
    </main>
  );
}

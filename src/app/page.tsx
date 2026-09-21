/** Racine : pas de contenu propre — on n'arrive ici que par un lien de vente, une vitrine ou un QR. */
export default function Accueil() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-8 text-center">
      <p className="text-2xl font-extrabold tracking-wide text-[color:var(--brand-blue-end)]">ORDI&apos;SPACE</p>
      <p className="mt-3 text-sm text-brand-muted">
        Pour commander, ouvrez le lien que vous a envoyé votre conseiller ou scannez son affiche.
      </p>
    </main>
  );
}

export default function LienIntrouvable() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-8 text-center">
      <p className="text-2xl font-extrabold tracking-wide text-[color:var(--brand-blue-end)]">ORDI&apos;SPACE</p>
      <h1 className="mt-4 text-lg font-extrabold text-brand-ink">Ce lien n&apos;est plus disponible</h1>
      <p className="mt-2 text-sm text-brand-muted">
        Le produit a peut-être été retiré de la vente. Demandez un nouveau lien à votre conseiller.
      </p>
    </main>
  );
}

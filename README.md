# Ordi'Space — Page de commande (acheteur)

Application Next.js publique, **sans compte**, où arrive l'acheteur qui ouvre un lien de vente, la vitrine d'un
vendeur ou le QR d'une affiche. Elle affiche la fiche produit et permet de commander (paiement à la livraison).

## Routes

| URL | Rôle |
| --- | --- |
| `/boutique/produit/{code}` | Fiche d'un produit partagé (lien affilié, `LienAffilie::url()`) |
| `/boutique/vitrine/{code}` | Sélection complète d'un vendeur (`Vitrine::url()`) — `?src=qr` quand l'acheteur a scanné l'affiche |
| `/boutique/vitrine/{code}/produit/{id}` | Un produit de la vitrine |

Les codes sont générés par le backend ; les adresses complètes sont construites avec `PAGE_COMMANDE_URL` (`.env` du backend).

## Lancer

```bash
npm install
npm run dev        # http://localhost:3010
```

`NEXT_PUBLIC_API_URL` (défaut `http://127.0.0.1:8000/api/v1`) : voir `.env.example`. Le backend doit autoriser
l'origine de cette app dans `CORS_ALLOWED_ORIGINS`.

## API utilisée (publique — `BoutiquePubliqueController`)

- `GET /public/liens/{code}`, `GET /public/vitrines/{code}`, `GET /public/vitrines/{code}/produits/{id}`
- `POST /public/liens/{code}/vue`, `POST /public/vitrines/{code}/vue[?src=qr]` — compteurs de visite, appelés une fois par onglet depuis le navigateur
- `POST /public/commandes` — crée le client (par téléphone), la commande « en attente » et la vente du vendeur (commission figée)

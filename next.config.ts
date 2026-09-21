import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";
const API_ORIGIN = new URL(API_URL).origin;

// 'unsafe-eval' n'est nécessaire qu'en dev (source maps/HMR de Turbopack) —
// jamais en production.
const scriptSrc = process.env.NODE_ENV === "development" ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'";

// Les photos produit sont servies par le backend Laravel via son APP_URL
// (Storage::disk('public')->url()) : en dev local ça peut être "localhost"
// alors que l'API est jointe en "127.0.0.1" — on autorise les deux alias de
// boucle locale, uniquement en dev.
const imgOrigins =
  process.env.NODE_ENV === "development"
    ? Array.from(new Set([API_ORIGIN, "http://127.0.0.1:8000", "http://localhost:8000"]))
    : [API_ORIGIN];

const CSP = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: ${imgOrigins.join(" ")}`,
  "font-src 'self' data:",
  `connect-src 'self' ${API_ORIGIN}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  // Les boutons "WhatsApp" / "Appeler" ouvrent wa.me et tel: : navigation, pas un envoi de formulaire.
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ordi'Space — Commander",
  description: "Commandez votre ordinateur, livré chez vous, avec paiement à la réception.",
};

export const viewport: Viewport = {
  themeColor: "#1d63e0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${nunitoSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-brand-ink">{children}</body>
    </html>
  );
}

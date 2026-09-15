import type { Metadata } from "next";
import { Schibsted_Grotesk, Spectral } from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "calorias — Seu assistente de alimentação",
  description:
    "Envie uma foto da sua refeição, bebida ou embalagem e converse com uma IA que identifica alimentos, lê rótulos e estima calorias.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "calorias — Seu assistente de alimentação",
    description:
      "Envie uma foto da sua refeição e descubra os alimentos, as porções e as calorias.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${schibsted.variable} ${spectral.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

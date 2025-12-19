import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chloé | Développeuse Full-stack",
  description: "Portfolio de Chloé, développeuse Full-stack avec 3 ans d'expérience en TypeScript, React, Laravel et PHP. Découvrez mes projets et mon expertise.",
  keywords: ["développeuse", "full-stack", "TypeScript", "React", "Laravel", "PHP", "Next.js", "Tailwind CSS"],
  authors: [{ name: "Chloé" }],
  creator: "Chloé",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://chloe-portfolio.com",
    siteName: "Chloé | Portfolio",
    title: "Chloé | Développeuse Full-stack",
    description: "Portfolio de Chloé, développeuse Full-stack avec 3 ans d'expérience.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chloé | Développeuse Full-stack",
    description: "Portfolio de Chloé, développeuse Full-stack avec 3 ans d'expérience.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#214E34" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

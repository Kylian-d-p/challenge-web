import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fit&Flex",
  description: "Réservez vos séances chez Fit&Flex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}

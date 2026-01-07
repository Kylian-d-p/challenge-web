import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";
import { Header} from "@/components/layout/header";

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
      <body className="antialiased">
        <Header/>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

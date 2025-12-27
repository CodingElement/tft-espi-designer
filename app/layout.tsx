import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TFT-eSPI Designer",
  description: "Online Designer für TFT-eSPI Bibliothek mit Code-Editor und Live-Vorschau",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}

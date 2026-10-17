import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Institución Prueba - Sistema de Votaciones",
  description: "Sistema Institucional de Votaciones Estudiantiles - Institución Prueba.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="text-brand-950 antialiased">{children}</body>
    </html>
  );
}

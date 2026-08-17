import type { Metadata } from "next";
import { DemoBanner } from "@/components/layout/DemoBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SquadRidge",
    template: "%s · SquadRidge",
  },
  description:
    "A private, facilitator-led space for difficult conversations—and a clear path to the commitments people choose to keep.",
  openGraph: {
    title: "SquadRidge",
    description:
      "Difficult conversations deserve better infrastructure. Private rooms, structured dialogue, approved commitments only.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { GlobalBackground } from "@/components/ui/GlobalBackground";

export const metadata: Metadata = {
  title: "AZX GTM Brain — AI-Powered Go-to-Market Intelligence",
  description:
    "A working AI GTM system built for AZX: Prospect Intelligence Engine, GTM Architecture, and AI Readiness Score. Built by Abdul Shaik.",
  openGraph: {
    title: "AZX GTM Brain",
    description:
      "Live prospect intelligence, interactive GTM architecture, and AI readiness scoring — built as a job application for AZX.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-azx-dark antialiased font-sans">
        <GlobalBackground />
        {/* Page content sits above the background */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

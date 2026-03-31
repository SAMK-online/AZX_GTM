import type { Metadata } from "next";
import "./globals.css";
import { GlobalBackground } from "@/components/ui/GlobalBackground";
import { BottomNavBar } from "@/components/ui/bottom-nav-bar";

export const metadata: Metadata = {
  title: "GTM Brain — AI-Powered Go-to-Market Intelligence",
  description:
    "A working AI GTM system: Prospect Intelligence Engine, GTM Architecture, and AI Readiness Score. Built by Abdul Shaik.",
  openGraph: {
    title: "GTM Brain",
    description:
      "Live prospect intelligence, interactive GTM architecture, and AI readiness scoring — a working AI-native GTM platform.",
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
        <div className="relative z-10 pt-20">{children}</div>
        {/* Bottom nav — rendered outside page content so it floats above everything */}
        <BottomNavBar />
      </body>
    </html>
  );
}

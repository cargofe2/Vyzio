import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ZaiProvider } from "@/lib/ZaiContext";
import ZaiFloatingCompanion from "@/components/ZaiFloatingCompanion";
import FeedbackButton from "@/components/FeedbackButton";

export const metadata: Metadata = {
  title: { default: "Bymyzai", template: "%s · Bymyzai" },
  description: "Build the future. Master the AI era. 1,284 lessons · 84 worlds · Personal AI tutor · Verifiable certificates.",
  keywords: ["AI", "artificial intelligence", "learn AI", "inteligencia artificial", "aprender IA"],
  openGraph: {
    title: "Bymyzai – Build the future. Master the AI era.",
    description: "1,284 lessons · 84 worlds · Personal AI tutor · Verifiable certificates. The platform where you build real capability with AI.",
    url: "https://www.bymyzai.com",
    siteName: "Bymyzai",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body>
          <ZaiProvider>
            {children}
            <ZaiFloatingCompanion />
            <FeedbackButton />
          </ZaiProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

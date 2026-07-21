import type { Metadata } from "next";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import FeedbackButton from "@/components/FeedbackButton";
import ZaiFloatingCompanion from "@/components/ZaiFloatingCompanion";
import { ZaiProvider } from "@/lib/ZaiContext";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Bymyzai", template: "%s · Bymyzai" },
  description: "La academia de IA para la nueva generacion. 630+ lecciones, 84 mundos, tutor IA personal y certificados verificables.",
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
            <SignedIn>
              <FeedbackButton />
              <ZaiFloatingCompanion />
            </SignedIn>
          </ZaiProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

import type { Metadata } from "next";
import DisclaimerClient from "./DisclaimerClient";

export const metadata: Metadata = {
  title: "Disclaimer — Bymyzai",
  description: "Aviso legal de Bymyzai. Contenido educativo, uso de IA, menores de edad y GDPR.",
  alternates: { canonical: "https://www.bymyzai.com/disclaimer" },
};

export default function DisclaimerPage() {
  return <DisclaimerClient />;
}

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VY_SYSTEM = `Eres VY, el tutor de IA de VYZIO — plataforma para aprender Inteligencia Artificial.

PERSONALIDAD: Directo, entusiasta, sin condescendencia. El amigo más listo de la clase.
NUNCA digas: "¡Gran pregunta!", "Por supuesto!", "¡Claro!".
Si no sabes algo: dilo directamente.

FORMATO:
- Máximo 120 palabras por respuesta
- Usa **negritas** para términos técnicos clave
- Termina con una acción concreta cuando sea relevante
- Para código: usa backticks con el lenguaje

SCOPE: Solo hablas de IA, tecnología y aprendizaje. Si preguntan otra cosa, reconduces amablemente.
IDIOMA: Siempre en español.`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message?.trim()) return NextResponse.json({ message: "Mensaje vacío." }, { status: 400 });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 350,
      system: VY_SYSTEM,
      messages: [{ role: "user", content: message }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("VY API error:", error);
    return NextResponse.json({ message: "VY no está disponible ahora. Intenta en unos segundos." }, { status: 500 });
  }
}

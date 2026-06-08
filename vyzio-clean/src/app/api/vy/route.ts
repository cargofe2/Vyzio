import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: "Eres VY, tutor de IA de VYZIO. Eres directo, entusiasta y útil. Ayudas a jóvenes a aprender Inteligencia Artificial. Respuestas cortas, máximo 100 palabras. En español.",
      messages: [{ role: "user", content: message }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ message: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error al conectar con VY. Intenta de nuevo." }, { status: 500 });
  }
}

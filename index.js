export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ message: "PIXELLAB45 API" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    try {

      const { tema, tipo, formato } = await request.json();

      let prompt = "";

      // 🖼️ VISUALES
      if (tipo === "visuales") {

        prompt = `
Genera prompts visuales cinematográficos para IA de imágenes y video.

Tema: ${tema}

Devuelve:
🎨 IMAGEN PRINCIPAL
📱 MINIATURA YOUTUBE
🎬 VIDEO IA

Cada prompt debe ser detallado, cinematográfico, futurista, profesional y en inglés.
`;

      }

      // 🧾 PROMPT POR FORMATO
      else if (tipo === "prompt") {

        prompt = `
Actúa como un experto en creación de contenido.

Genera un prompt profesional para ${formato}.

Tema: ${tema}

Si el formato es TikTok:
- Gancho viral
- Duración 30 a 60 segundos
- CTA

Si el formato es YouTube:
- Título SEO
- Estructura
- Retención

Si el formato es Instagram:
- Copy + hashtags + CTA

Si el formato es Blog:
- SEO completo

Si el formato es Ebook:
- Estructura completa

Devuelve únicamente el contenido final.
`;

      }

      // 🎬 SCRIPT (NUEVO)
      else if (tipo === "script") {

        prompt = `
Eres un creador experto de contenido viral para redes sociales (TikTok, Reels, Shorts).

Convierte el tema en un guion corto altamente viral.

Reglas:
- Máximo 35 segundos
- Estilo PIXELLAB45 (IA, futurista, tecnología, impacto emocional)
- Lenguaje simple, directo y potente
- No emojis
- No explicaciones

Estructura:

HOOK:
CONTEXTO:
DESARROLLO:
CIERRE:
CTA:

TEMA:
${tema}
`;

      }

      // 🧠 IDEAS (default)
      else {

        prompt = `
Genera 10 ideas virales sobre ${tema}.

Devuelve solo una lista numerada.
`;
      }

      const result = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        {
          messages: [
            { role: "user", content: prompt }
          ]
        }
      );

      let response;

      if (tipo === "visuales" || tipo === "prompt" || tipo === "script") {
        response = { resultado: result.response };
      } else {
        response = { ideas: result.response };
      }

      return new Response(
        JSON.stringify(response),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {

      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};

export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          message: "PIXELLAB45 API"
        }),
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
else if (tipo === "prompt") {

  prompt = `
Actúa como un experto en creación de contenido.

Genera un prompt profesional para ${formato}.

Tema: ${tema}

Si el formato es TikTok:
- Gancho viral de 3 segundos
- Duración 30 a 60 segundos
- CTA para seguir la cuenta

Si el formato es YouTube:
- Título SEO
- Estructura completa del video
- Retención de audiencia

Si el formato es Instagram:
- Texto para carrusel o reel
- Hashtags
- CTA para interacción

Si el formato es Blog:
- Título SEO
- Introducción
- Subtítulos H2 y H3
- Conclusión

Si el formato es Ebook:
- Índice
- Capítulos
- Desarrollo detallado

Devuelve únicamente el prompt final listo para usar.
`;



} else {

  prompt = `
Genera 10 ideas virales sobre ${tema}.

Devuelve únicamente una lista numerada de títulos cortos.
No expliques las ideas.
`;

}
      

      const result = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        {
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        }
      );

      if (tipo === "visuales" || tipo === "prompt") {
        return new Response(
          JSON.stringify({
            resultado: result.response
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          }
          else if (tipo === "script") {

  prompt = `
Eres un creador experto de contenido viral para redes sociales (TikTok, Reels, Shorts).

Convierte el tema en un guion corto altamente viral.

Reglas:
- Máximo 35 segundos de lectura
- Estilo PIXELLAB45 (IA, futurista, tecnología, impacto emocional)
- Lenguaje simple, directo y potente
- No explicaciones adicionales
- No emojis

Estructura obligatoria:

HOOK:
(Frase que capture atención en 1-2 líneas)

CONTEXTO:
(Explicación rápida del tema)

DESARROLLO:
(Parte central con valor o historia)

CIERRE:
(Remate fuerte o reflexión)

CTA:
(Llamado a la acción corto)

TEMA:
${tema}
`;
      }
        );

      }

      return new Response(
        JSON.stringify({
          ideas: result.response
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {

      return new Response(
        JSON.stringify({
          error: error.message
        }),
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

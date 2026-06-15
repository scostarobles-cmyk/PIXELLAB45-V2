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

    // 🧠 GET simple
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ message: "PIXELLAB45 API OK" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    try {

      const body = await request.json();

      const {
        tipo,
        tema,
        formato,
        guion,
        escenas,
        estilo,
        nombre,
        imagenBase64,
        categoria
      } = body;

      let prompt = "";

      // 🖼️ VISUALES
      if (tipo === "visuales") {

        prompt = `
Genera prompts visuales cinematográficos.

Tema: ${tema}

Devuelve:
IMAGEN PRINCIPAL
MINIATURA YOUTUBE
VIDEO IA

En inglés, estilo cinematográfico y futurista.
        `;
      }

      // 🧾 PROMPTS
      else if (tipo === "prompt") {

        prompt = `
Actúa como experto en contenido.

Genera prompt para ${formato}.

Tema: ${tema}
        `;
      }

      // 🎬 SCRIPT
      else if (tipo === "script") {

        prompt = `
Guion para video corto de IA.

Tema: ${tema}

Estructura:
GANCHO
DESARROLLO
CIERRE
CTA
        `;
      }

      // 🎬 STORYBOARD
      else if (tipo === "storyboard") {

        prompt = `
Convierte guion en storyboard.

Guion:
${guion}

Escenas: ${escenas}

Estilo: ${estilo}
        `;
      }

      // 🖼️ GENERAR IMAGEN
      else if (tipo === "imagen") {

        const imagen = await env.AI.run(
          "@cf/lykon/dreamshaper-8-lcm",
          {
            prompt: `
${tema},
cinematic lighting,
ultra detailed,
8k, realistic
            `
          }
        );

        return new Response(imagen, {
          headers: {
            ...corsHeaders,
            "Content-Type": "image/png"
          }
        });
      }

      // 💾 GUARDAR IMAGEN EN R2
      else if (tipo === "guardar-imagen") {

        if (!imagenBase64) {
          return new Response(
            JSON.stringify({ error: "imagenBase64 faltante" }),
            { headers: corsHeaders }
          );
        }

        // 🔥 limpiar base64 si viene con prefijo
        const base64 = imagenBase64.replace(/^data:image\/\w+;base64,/, "");

        const bytes = Uint8Array.from(atob(base64), c =>
          c.charCodeAt(0)
        );

        // 🔥 nombre seguro (SIN carpetas)
        const nombreFinal = `img-${categoria || "general"}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.png`;

        await env.GALERIA.put(nombreFinal, bytes, {
          httpMetadata: {
            contentType: "image/png"
          }
        });

        return new Response(
          JSON.stringify({
            success: true,
            nombre: nombreFinal
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          }
        );
      }

      // 🧠 IDEAS (default)
      else {

        prompt = `
Genera 10 ideas virales sobre ${tema}.
        `;
      }

      // 🤖 IA TEXT
      const result = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fp8",
        {
          messages: [
            { role: "user", content: prompt }
          ]
        }
      );

      const isTextType =
        tipo === "visuales" ||
        tipo === "prompt" ||
        tipo === "script" ||
        tipo === "storyboard";

      const response = isTextType
        ? { resultado: result.response }
        : { ideas: result.response };

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

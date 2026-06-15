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
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {

      const body = await request.json();
      const { tipo, tema, formato, guion, escenas, estilo, nombre, imagenBase64 } = body;

      // 🖼️ GENERAR IMAGEN
      if (tipo === "imagen") {

        const imagen = await env.AI.run(
          "@cf/lykon/dreamshaper-8-lcm",
          {
            prompt: `
${tema},
cinematic lighting,
ultra detailed,
highly realistic,
sharp focus,
depth of field,
8k
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

      // ☁️ GUARDAR EN R2
      if (tipo === "guardar-imagen") {

        if (!imagenBase64 || !nombre) {
          return new Response(
            JSON.stringify({ error: "Faltan datos" }),
            { headers: corsHeaders }
          );
        }

        // convertir base64 → buffer
        const binary = Uint8Array.from(
          atob(imagenBase64),
          c => c.charCodeAt(0)
        );

        await env.R2.put(nombre, binary, {
          httpMetadata: {
            contentType: "image/png"
          }
        });

        return new Response(
          JSON.stringify({
            ok: true,
            mensaje: "Imagen guardada en R2",
            nombre
          }),
          { headers: corsHeaders }
        );
      }

      // 🧠 PROMPT IA
      let prompt = "";

      if (tipo === "prompt") {

        prompt = `
Actúa como experto en contenido.

Genera un prompt para ${formato}.
Tema: ${tema}
`;
      }

      else if (tipo === "script") {

        prompt = `
Guion narrado de 60s sobre tecnología.
Tema: ${tema}

GANCHO / DESARROLLO / CTA
`;
      }

      else if (tipo === "visuales") {

        prompt = `
Genera prompts visuales cinematográficos.
Tema: ${tema}
`;
      }

      else {
        prompt = `Genera ideas virales sobre ${tema}`;
      }

      const result = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fp8",
        {
          messages: [{ role: "user", content: prompt }]
        }
      );

      const response =
        (tipo === "ideas")
          ? { ideas: result.response }
          : { resultado: result.response };

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

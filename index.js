export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // GET simple
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
      const { imagenBase64, categoria } = body;

      // Validación básica
      if (!imagenBase64) {
        return new Response(
          JSON.stringify({ error: "imagenBase64 faltante" }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          }
        );
      }

      // 🔥 limpiar base64
      const base64 = imagenBase64.replace(
        /^data:image\/\w+;base64,/,
        ""
      );

      const bytes = Uint8Array.from(atob(base64), c =>
        c.charCodeAt(0)
      );

      // 🔥 nombre seguro
      const nombreFinal =
        `img-${categoria || "general"}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}.png`;

      // Guardar en R2
      await env.GALERIA.put(nombreFinal, bytes, {
        httpMetadata: {
          contentType: "image/png"
        }
      });

      // Respuesta
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

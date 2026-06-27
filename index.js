export default {
  async fetch(request, env) {

    // CORS SIEMPRE
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "*",
    };

    // Preflight (ESTO ES CLAVE)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    try {
      let body = {};

      if (request.method === "POST") {
        body = await request.json().catch(() => ({}));
      }

      const prompt = body.prompt || "sin prompt";

      // RESPUESTA SIMULADA (cambia esto por tu IA luego)
      const result = {
        ok: true,
        prompt,
        imageUrl: "https://via.placeholder.com/512"
      };

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({
        ok: false,
        error: err.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
  }
};
// ========================================
// PIXELLAB45 WORKER BASE
// ========================================

export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json"
    };

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // Si abren el Worker desde el navegador
    if (request.method === "GET") {
      return new Response(
        JSON.stringify({
          success: true,
          mensaje: "PIXELLAB45 Worker activo y funcionando"
        }),
        {
          headers: corsHeaders
        }
      );
    }

    let data;

    try {
      data = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: "JSON inválido"
        }),
        {
          headers: corsHeaders
        }
      );
    }

    const {
      tipo,
      tema,
      formato,
      categoria,
      imagenBase64,
      contenido,
      indice,
      duracion,
      plataforma,
      estilo
    } = data;

    if (!tipo) {
      return new Response(
        JSON.stringify({
          error: "Falta tipo"
        }),
        {
          headers: corsHeaders
        }
      );
    }

    // ========================================
    // SWITCH PRINCIPAL
    // ========================================

    switch (tipo) {

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: "Tipo no válido",
            recibido: tipo
          }),
          {
            headers: corsHeaders
          }
        );

    }

  }
};
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
      case "listar-imagenes": {
          try {
              if (!env.IMAGES) {
                    return new Response(
                            JSON.stringify({
                                      mensaje: "Bucket IMAGES no configurado",
                                                error: "Falta bucket"
                                                        }),
                                                                {
                                                                          headers: corsHeaders
                                                                                  }
                                                                                        );
                                                                                            }

                                                                                                const objs = await env.IMAGES.list();
                                                                                                    const imagenes = objs.objects.map(obj => ({
                                                                                                          nombre: obj.key,
                                                                                                                url: `${R2_PUBLIC_URL}/${obj.key}`
                                                                                                                    }));

                                                                                                                        return new Response(
                                                                                                                              JSON.stringify({
                                                                                                                                      mensaje: "Galería cargada con éxito",
                                                                                                                                              datos: imagenes
                                                                                                                                                    }),
                                                                                                                                                          {
                                                                                                                                                                  headers: corsHeaders
                                                                                                                                                                        }
                                                                                                                                                                            );
                                                                                                                                                                              } catch (error) {
                                                                                                                                                                                  return new Response(
                                                                                                                                                                                        JSON.stringify({
                                                                                                                                                                                                mensaje:
                                                                                                                                                                                                
      } catch (error) {
  return new Response(
    JSON.stringify({
      mensaje: "Error al cargar imágenes",
      error: error.message
    }),
    {
      headers: corsHeaders
    }
  );
}
      

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
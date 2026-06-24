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
  case "listar-imagenes":
        return listarImagenes(env, json);

      default:
        return json({ error: "Tipo no válido" }, 400);
    }
  }
};
async function listarImagenes(env, json) {
  if (!env.IMAGES) {
    return json({ error: "Bucket IMAGES no configurado" }, 500);
  }

  try {
    const objs = await env.IMAGES.list();

    const images = objs.objects.map((obj) => ({
      nombre: obj.key,
      url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`
    }));

    return json({
      success: true,
      images: images, // Aseguramos que se envía un objeto con images
      total: images.length, // opcional, solo si quieres
    });

  } catch (error) {
    return json({
      error: "Error al leer IMAGES",
      detail: error.message,
    }, 500);
  }
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

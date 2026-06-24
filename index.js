export default {
  async fetch(request, env) {

    // ============================
    // CORS
    // ============================
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json"
    };

    // ============================
    // PRE-FLIGHT
    // ============================
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ============================
    // JSON HELPER
    // ============================
    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: corsHeaders
      });

    // ============================
    // PARSEO REQUEST
    // ============================
    let data = {};

    try {
      if (request.method === "POST") {
        data = await request.json();
      }
    } catch (e) {
      return json({ error: "JSON inválido" }, 400);
    }

    // ============================
    // ROUTER PRINCIPAL
    // ============================
    const tipo = data.tipo;

    if (!tipo) {
      return json({ error: "Falta tipo" }, 400);
    }

    switch (tipo) {

      // ============================
      // 🖼️ GALERÍA DINÁMICA (PRUEBA BASE)
      // ============================
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
export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Método no permitido" }), {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      const data = await request.json();
      const { tipo, categoria } = data;

      let responseData;

      switch (tipo) {
        case "listar-imagenes":
          responseData = await listarImagenes(env);
          break;
        case "filtrar-categoria":
          responseData = await filtrarImagenesPorCategoria(env, categoria);
          break;
        default:
          return new Response(
            JSON.stringify({ error: "Tipo de acción no válido" }),
            { status: 400, headers: corsHeaders }
          );
      }

      return new Response(JSON.stringify(responseData), {
        headers: corsHeaders,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Error en el servidor" }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

async function listarImagenes(env) {
  // Lógica para listar imágenes desde R2
  return { success: true, images: [] };
}

async function filtrarImagenesPorCategoria(env, categoria) {
  // Lógica para filtrar imágenes por categoría
  return { success: true, images: [] };
}

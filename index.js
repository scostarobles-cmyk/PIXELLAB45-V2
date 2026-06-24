export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: corsHeaders
      });

    let data = {};

    try {
      if (request.method === "POST") {
        data = await request.json();
      }
    } catch {
      return json({ error: "JSON inválido" }, 400);
    }

    switch (data.tipo) {

      case "listar-imagenes":
        return listarImagenes(env, json);

      default:
        return json({
          error: "Tipo no válido"
        }, 400);

    }
  }
};

async function listarImagenes(env, json) {

  const lista = await env.IMAGES.list();

  const imagenes = lista.objects.map(obj => ({
    nombre: obj.key,
    url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`
  }));

  return json({
    success: true,
    images: imagenes,
    total: imagenes.length
  });

}
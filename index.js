export default {  
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
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
        return json({
          success: true,
          mensaje: "Funcionó"
        });

      default:
        return json({
          error: "Tipo no válido"
        }, 400);

    }

  }
};

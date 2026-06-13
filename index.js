export default {
  async fetch(request, env) {

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    try {

      const respuesta = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.HF_API_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: "A futuristic cyberpunk city with blue neon lights"
          })
        }
      );

      const texto = await respuesta.text();

      return new Response(
        texto,
        {
          status: respuesta.status,
          headers: {
            ...cors,
            "Content-Type": respuesta.headers.get("content-type") || "text/plain"
          }
        }
      );

    } catch (error) {

      return new Response(
        JSON.stringify({
          ok: false,
          error: error.message
        }),
        {
          status: 500,
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );

    }
  }
}

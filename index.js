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

    if (request.method !== "POST") {
      return Response.json({
        ok: true,
        mensaje: "PIXELLAB45 Image Generator"
      });
    }

    try {

      const { prompt } = await request.json();

      const replicateResponse = await fetch(
        "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions",
        {
          method: "POST",
          headers: {
            "Authorization": `Token ${env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
            "Prefer": "wait"
          },
          body: JSON.stringify({
            input: {
              prompt: prompt
            }
          })
        }
      );

      const data = await replicateResponse.json();

      return new Response(
        JSON.stringify(data),
        {
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {

      return Response.json({
        ok: false,
        error: error.message
      });

    }

  }
};

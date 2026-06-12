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
      return new Response(
        JSON.stringify({
          ok: true,
          mensaje: "PIXELLAB45 Worker activo"
        }),
        {
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );
    }

    try {

      const { prompt } = await request.json();

      const replicateResponse = await fetch(
        "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
            "Prefer": "wait"
          },
          body: JSON.stringify({
            input: {
              prompt: prompt,
              aspect_ratio: "1:1",
              output_format: "webp",
              output_quality: 80,
              prompt_upsampling: true
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

      return new Response(
        JSON.stringify({
          ok: false,
          error: error.message
        }),
        {
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );

    }

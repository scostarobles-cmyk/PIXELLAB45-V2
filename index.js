export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {

      if (request.method !== "POST") {
        return new Response("PIXELLAB45 Worker Online", {
          headers: corsHeaders
        });
      }

      const { prompt } = await request.json();

      if (!prompt) {
        return new Response(JSON.stringify({
          ok: false,
          error: "Prompt vacío"
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 1️⃣ Crear predicción (FLUX correcto)
      const create = await fetch(
        "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions",
        {
          method: "POST",
          headers: {
            "Authorization": `Token ${env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            input: { prompt }
          })
        }
      );

      const prediction = await create.json();

      if (!prediction.id) {
        return new Response(JSON.stringify({
          ok: false,
          error: "No se pudo crear predicción",
          raw: prediction
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 2️⃣ Polling interno
      let result = prediction;

      for (let i = 0; i < 25; i++) {

        await new Promise(r => setTimeout(r, 2000));

        const poll = await fetch(
          `https://api.replicate.com/v1/predictions/${prediction.id}`,
          {
            headers: {
              "Authorization": `Token ${env.REPLICATE_API_TOKEN}`
            }
          }
        );

        result = await poll.json();

        if (result.status === "succeeded") break;
        if (result.status === "failed") break;
      }

      // 3️⃣ Error model
      if (result.status !== "succeeded") {
        return new Response(JSON.stringify({
          ok: false,
          error: "Fallo en generación",
          detail: result.error || result.status
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 4️⃣ Replicate devuelve array o string
      const image = Array.isArray(result.output)
        ? result.output[0]
        : result.output;

      return new Response(JSON.stringify({
        ok: true,
        image_url: image
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({
        ok: false,
        error: err.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

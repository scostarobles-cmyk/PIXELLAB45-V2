export default {
  async fetch(request, env) {

    const cors = {
      1"Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    try {

      if (request.method !== "POST") {
        return new Response("PIXELLAB45 Worker Online", { headers: cors });
      }

      const { prompt } = await request.json();

      if (!prompt) {
        return new Response(JSON.stringify({
          ok: false,
          error: "Prompt vacío"
        }), { headers: cors });
      }

      // 1️⃣ Crear predicción
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
          error: "No se creó predicción",
          raw: prediction
        }), { headers: cors });
      }

      // 2️⃣ Polling robusto
      let result = prediction;

      for (let i = 0; i < 30; i++) {

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

      // 3️⃣ VALIDACIÓN REAL DE OUTPUT
      if (result.status !== "succeeded") {
        return new Response(JSON.stringify({
          ok: false,
          error: result.error || "Fallo en generación",
          status: result.status
        }), { headers: cors });
      }

      // 4️⃣ EXTRAER IMAGEN (IMPORTANTE)
      let image = null;

      if (Array.isArray(result.output)) {
        image = result.output[0];
      } else {
        image = result.output;
      }

      if (!image) {
        return new Response(JSON.stringify({
          ok: false,
          error: "Replicate no devolvió imagen",
          raw: result
        }), { headers: cors });
      }

      return new Response(JSON.stringify({
        ok: true,
        image_url: image
      }), {
        headers: {
          ...cors,
          "Content-Type": "application/json"
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({
        ok: false,
        error: err.message
      }), {
        status: 500,
        headers: cors
      });
    }
  }
};

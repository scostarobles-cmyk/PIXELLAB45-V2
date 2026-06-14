export default {
  async fetch(request, env) {

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response("PIXELLAB45 OK", {
        headers: cors
      });
    }

    if (url.pathname === "/generate" && request.method === "POST") {
      const { prompt } = await request.json();

      const image = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        { prompt }
      );

      // Subimos a R2
      const key = `gallery/${Date.now()}-pixellab45.png`;

      await env.PIXELLAB45_BUCKET.put(key, image, {
        httpMetadata: {
          contentType: "image/png"
        }
      });

      // Devolvemos la URL de la imagen en R2
      const imageUrl = `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.PIXELLAB45_BUCKET.name}/${key}`;

      return new Response(
        JSON.stringify({ ok: true, imageUrl }),
        {
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response("Not Found", {
      status: 404,
      headers: cors
    });
  }
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    // 🧪 TEST
    if (url.pathname === "/") {
      return new Response("PIXELLAB45 OK", { headers: cors });
    }

    // 🎨 GENERAR IMAGEN
    if (url.pathname === "/generate" && request.method === "POST") {
      const { prompt } = await request.json();

      const result = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        { prompt }
      );

      const image = new Uint8Array(result);

      // 📤 SUBIR A R2
      const key = `gallery/${Date.now()}-pixellab45.png`;

      await env.PIXELLAB45_BUCKET.put(key, image, {
        httpMetadata: {
          contentType: "image/png"
        }
      });

      // Devolvemos la URL de la imagen
      const imageUrl = `https://pixellab45-v2.scostarobles.workers.dev/image/${key}`;

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

    // 🖼️ LISTAR GALERÍA
    if (url.pathname === "/gallery") {
      const objects = await env.PIXELLAB45_BUCKET.list({
        prefix: "gallery/"
      });

      const files = objects.objects.map(obj => ({
        key: obj.key
      }));

      return Response.json(files, { headers: cors });
    }

    // 📷 SERVIR IMAGEN
    if (url.pathname.startsWith("/image/")) {
      const key = decodeURIComponent(
        url.pathname.replace("/image/", "")
      );

      const object = await env.PIXELLAB45_BUCKET.get(key);

      if (!object) {
        return new Response(
          "Imagen no encontrada",
          { status: 404 }
        );
      }

      return new Response(
        object.body,
        {
          headers: {
            ...cors,
            "Content-Type":
              object.httpMetadata?.contentType || "image/png"
          }
        }
      );
    }

    return new Response("OK", { headers: cors });
  }
};

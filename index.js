export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 🧪 TEST
    if (url.pathname === "/") {
      return new Response("PIXELLAB45 OK");
    }

    // 🎨 GENERAR IMAGEN
    if (url.pathname === "/generate" && request.method === "POST") {
      const { prompt } = await request.json();

      const result = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        { prompt }
      );

      return new Response(result, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 📤 UPLOAD A R2
    if (url.pathname === "/upload" && request.method === "POST") {
      const formData = await request.formData();
      const file = formData.get("file");

      const key = `gallery/${Date.now()}-${file.name}`;

      await env.PIXELLAB45_BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type }
      });

      return Response.json({ ok: true, key });
    }

    // 🖼️ GALERÍA
    if (url.pathname === "/gallery") {
      const list = await env.PIXELLAB45_BUCKET.list({ prefix: "gallery/" });

      return Response.json(
        list.objects.map(o => ({
          key: o.key
        }))
      );
    }

    return new Response("OK");
  }
};

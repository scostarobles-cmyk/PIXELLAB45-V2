export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 📤 UPLOAD
    if (url.pathname === "/upload" && request.method === "POST") {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file) {
        return new Response("No file", { status: 400 });
      }

      const key = `gallery/${Date.now()}-${file.name}`;

      await env.PIXELLAB45_BUCKET.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type,
        },
      });

      return Response.json({
        ok: true,
        key,
        url: `/image/${key}`
      });
    }

    // 🖼️ VER IMAGEN
    if (url.pathname.startsWith("/image/")) {
      const key = url.pathname.replace("/image/", "");
      const object = await env.PIXELLAB45_BUCKET.get(key);

      if (!object) {
        return new Response("Not found", { status: 404 });
      }

      return new Response(object.body, {
        headers: {
          "Content-Type": object.httpMetadata?.contentType || "image/png",
          "Cache-Control": "public, max-age=31536000"
        },
      });
    }

    // 📚 GALERÍA
    if (url.pathname === "/gallery") {
      const list = await env.PIXELLAB45_BUCKET.list({ prefix: "gallery/" });

      const images = list.objects
        .sort((a, b) => b.uploaded - a.uploaded)
        .map(obj => ({
          key: obj.key,
          url: `/image/${obj.key}`
        }));

      return Response.json(images);
    }

    return new Response("PIXELLAB45 OK");
  }
};

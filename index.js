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

    // 🎨 GENERAR IMAGEN (CORRECTO REAL)
    if (url.pathname === "/generate" && request.method === "POST") {
      const { prompt } = await request.json();

      const result = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        { prompt }
      );

      // 👉 ESTE ES EL PUNTO CLAVE
      const image = new Uint8Array(result);

      return new Response(image, {
        headers: {
          ...cors,
          "Content-Type": "image/png"
        }
      });
    }

    // 📤 UPLOAD A R2
if (url.pathname === "/upload" && request.method === "POST") {

  const formData = await request.formData();

  const file = formData.get("file");

  const key =
    `gallery/${Date.now()}-${file.name}`;

  const buffer =
    await file.arrayBuffer();

  await env.PIXELLAB45_BUCKET.put(
    key,
    buffer,
    {
      httpMetadata: {
        contentType: "image/png"
      }
    }
  );

  return Response.json(
    {
      ok: true,
      key
    },
    {
      headers: cors
    }
  );
}
// 🖼️ LISTAR GALERÍA
if (url.pathname === "/gallery") {

  const objects = await env.PIXELLAB45_BUCKET.list({
    prefix: "gallery/"
  });

  const files = objects.objects.map(obj => ({
    key: obj.key,
    size: obj.size
  }));

  return Response.json(files, {
    headers: cors
  });
}

// 📷 SERVIR IMAGEN
if (url.pathname.startsWith("/image/")) {

  const key =
    decodeURIComponent(
      url.pathname.replace("/image/", "")
    );

  const object =
    await env.PIXELLAB45_BUCKET.get(key);

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
          object.httpMetadata?.contentType
          || "image/png"
      }
    }
  );
}
    return new Response("OK", { headers: cors });
  }
};

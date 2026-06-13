export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Ruta principal de prueba
    if (url.pathname === "/") {
      return new Response("PIXELLAB45 OK", {
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Generar imagen usando IA
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

    // Subir imagen a R2
    if (url.pathname === "/upload" && request.method === "POST") {
      const formData = await request.formData();
      const file = formData.get("file");

      const key = `gallery/${Date.now()}-${file.name}`;

      await env.PIXELLAB45_BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type }
      });

      return Response.json({ ok: true, key }, {
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Si no es ninguna ruta, responde OK genérico
    return new Response("OK PIXELLAB45", {
      headers: { "Access-Control-Allow-Origin": "*" }
    });

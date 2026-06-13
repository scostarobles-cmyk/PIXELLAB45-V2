export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Ruta de prueba
    if (url.pathname === "/") {
      return new Response("PIXELLAB45 OK", {
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Generar imagen usando IA
    if (url.pathname === "/generate" && request.method === "POST") {
      try {
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
      } catch (err) {
        return new Response("Error en la generación de imagen", { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
      }
    }

    // Subir imagen a R2
    if (url.pathname === "/upload" && request.method === "POST") {
      try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
          return new Response("No se recibió archivo", { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
        }

        const key = `gallery/${Date.now()}-${file.name}`;

        await env.PIXELLAB45_BUCKET.put(key, file.stream(), {
          httpMetadata: { contentType: file.type }
        });

        return Response.json({ ok: true, key }, {
          headers: { "Access-Control-Allow-Origin": "*" }
        });
      } catch (err) {
        return new Response("Error subiendo la imagen", { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
      }
    }

    // Si no es ninguna ruta conocida, responde un OK genérico
    return new Response("OK PIXELLAB45", {
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
};

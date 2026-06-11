export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Ruta principal
    if (url.pathname === "/") {
      return new Response("Pixellab45 worker online", {
        headers: { "content-type": "text/plain" },
      });
    }

    // Endpoint de prueba API
    if (url.pathname === "/api") {
      return new Response(
        JSON.stringify({
          status: "ok",
          message: "Pixellab45 API funcionando",
        }),
        {
          headers: { "content-type": "application/json" },
        }
      );
    }

    // Ejemplo endpoint futuro para generación de imagen
    if (url.pathname === "/generate-image") {
      const prompt = url.searchParams.get("prompt");

      if (!prompt) {
        return new Response(
          JSON.stringify({ error: "Falta prompt" }),
          {
            status: 400,
            headers: { "content-type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          prompt: prompt,
          message: "Aquí irá la IA generadora de imágenes",
        }),
        {
          headers: { "content-type": "application/json" },
        }
      );
    }

    // 404 fallback
    return new Response("Not found", { status: 404 });
  },
};

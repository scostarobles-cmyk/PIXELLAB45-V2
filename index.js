export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 🧠 TEST
    if (url.pathname === "/") {
      return new Response("PIXELLAB45 OK");
    }

    // 🎨 IA (TEST SIMPLE PRIMERO)
    if (url.pathname === "/generate") {
      const { searchParams } = url;
      const prompt = searchParams.get("prompt") || "test";

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

    return new Response("OK");
  }
};

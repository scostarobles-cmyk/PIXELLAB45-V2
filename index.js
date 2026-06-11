export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/") {
      return new Response("PIXELLAB45 WORKER ONLINE 🚀");
    }

    // Generador
    if (url.pathname === "/generate") {
      try {
        const body = await request.json();
        const prompt = body?.prompt;

        if (!prompt) {
          return new Response(
            JSON.stringify({ error: "missing prompt" }),
            { status: 400 }
          );
        }

        // 🔥 AQUÍ después conectamos Replicate
        return new Response(
          JSON.stringify({
            ok: true,
            message: "prompt recibido",
            prompt: prompt
          }),
          {
            headers: { "Content-Type": "application/json" }
          }
        );

      } catch (err) {
        return new Response(
          JSON.stringify({ error: "invalid request" }),
          { status: 400 }
        );
      }
    }

    return new Response("Not found", { status: 404 });
  }
};

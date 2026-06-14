export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    // CORS (evita errores en frontend)
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (url.pathname === "/api/ideas" && request.method === "POST") {

      try {
        const { tema } = await request.json();

        const result = await env.AI.run(
          "llama-3.2-3b-instruct",
          {
            messages: [
              {
                role: "system",
                content: "Eres un generador de ideas virales para TikTok, Reels y YouTube Shorts."
              },
              {
                role: "user",
                content: `Genera 6 ideas virales sobre: ${tema}`
              }
            ]
          }
        );

        const text = result.response || "";

        const ideas = text
          .split("\n")
          .map(i => i.replace(/^[-•]\s*/, "").trim())
          .filter(Boolean);

        return new Response(JSON.stringify({ ideas }), {
          headers: {
            "Content-Type": "application/json",
            ...cors
          }
        });

      } catch (err) {
        return new Response(JSON.stringify({
          error: err.message
        }), {
          status: 500,
          headers: cors
        });
      }
    }

    return new Response("PIXELLAB45 AI OK");
  }
};

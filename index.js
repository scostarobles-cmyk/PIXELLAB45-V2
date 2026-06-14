export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    // 🧪 TEST en navegador (GET)
    if (request.method === "GET") {
      return new Response("PIXELLAB45 OK - usa POST /api/ideas");
    }

    // 📌 SOLO POST
    if (url.pathname === "/api/ideas" && request.method === "POST") {

      try {
        const body = await request.json();
        const tema = body.tema || "IA";

        const result = await env.AI.run(
          "@cf/meta/llama-3.2-3b-instruct",
          {
            messages: [
              {
                role: "system",
                content: "Eres generador de ideas virales"
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
            "Access-Control-Allow-Origin": "*"
          }
        });

      } catch (err) {
        return new Response(JSON.stringify({
          error: err.message
        }), { status: 500 });
      }
    }

    return new Response("OK");
  }
};

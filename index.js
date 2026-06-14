export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (url.pathname === "/api/ideas" && request.method === "POST") {

      const { tema } = await request.json();

      const result = await env.AI.run(
        "llama-3.2-3b-instruct",
        {
          messages: [
            {
              role: "system",
              content: "Eres generador de ideas virales"
            },
            {
              role: "user",
              content: `Genera 6 ideas sobre: ${tema}`
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
    }

    return new Response("PIXELLAB45 OK");
  }
};

/*export default {
  async fetch(request, env) {

    const result = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          {
            role: "user",
            content: "Genera 6 ideas virales sobre inteligencia artificial para TikTok"
          }
        ]
      }
    );

    const text = result.response || "";

    const ideas = text
      .split("\n")
      .map(i => i.replace(/^[-•0-9.\s]+/, "").trim())
      .filter(Boolean);

    return new Response(JSON.stringify({ ideas }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};*/
export default {
  async fetch() {
    return new Response("PIXELLAB45 está activo y funcionando.");
  }
};

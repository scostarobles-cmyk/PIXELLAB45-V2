export default {
  async fetch(request, env) {

    try {
      const result = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        "Genera 6 ideas virales sobre inteligencia artificial para TikTok"
      );

      const text = typeof result === "string"
        ? result
        : result.response || result.result || "";

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
      return new Response("ERROR: " + err.message, { status: 500 });
    }
  }
};

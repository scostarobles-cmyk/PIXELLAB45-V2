export default {
  async fetch(request, env) {

    try {
      const result = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        "Genera SOLO 6 ideas virales para TikTok sobre inteligencia artificial. Solo lista, sin explicación, una idea por línea, máximo 12 palabras por idea."
      );

      const text = typeof result === "string"
        ? result
        : result.response || result.result || "";

      const ideas = text
        .split("\n")
        .map(i => i.replace(/^[-•0-9.\s]+/, "").trim())
        .filter(i => i.length > 0);

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

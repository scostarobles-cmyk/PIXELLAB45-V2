export default {
  async fetch(request, env) {

    const { tema } = await request.json();

    const input = `Genera 6 ideas virales sobre: ${tema}`;

    const result = await env.AI.run(
      "@cf/meta/llama-3.2-3b-instruct",
      input
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
  }
};

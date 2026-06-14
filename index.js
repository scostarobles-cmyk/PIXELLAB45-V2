export default {
  async fetch(request, env) {

    try {
      const result = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        "Genera 6 ideas virales sobre inteligencia artificial"
      );

      const text = typeof result === "string"
        ? result
        : result.response || result.result || "";

      return new Response(text, {
        headers: {
          "Content-Type": "text/plain"
        }
      });

    } catch (err) {
      return new Response("ERROR: " + err.message, { status: 500 });
    }
  }
};

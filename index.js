export default {
  async fetch(request, env) {

    try {
      const result = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        {
          messages: [
            {
              role: "user",
              content: "Genera 6 ideas virales sobre inteligencia artificial para TikTok"
            }
          ]
        }
      );

      const text =
        result?.response ||
        result?.result ||
        result ||
        "";

      const ideas = text
        .toString()
        .split("\n")
        .map(i => i.replace(/^[-•0-9.\s]+/, "").trim())
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
};

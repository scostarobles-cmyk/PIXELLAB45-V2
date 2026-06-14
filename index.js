export default {
  async fetch(request, env) {
    try {

      const result = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        {
          prompt: "Genera 5 ideas virales sobre inteligencia artificial para TikTok"
        }
      );

      return new Response(
        JSON.stringify(result),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {

      return new Response(
        JSON.stringify({
          error: error.message,
          stack: error.stack
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

    }
  }
};

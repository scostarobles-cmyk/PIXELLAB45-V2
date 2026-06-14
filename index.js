export default {
  async fetch(request, env) {

    if (request.method !== "POST") {
      return new Response("PIXELLAB45 Ideas API");
    }

    try {

      const { tema } = await request.json();

      const result = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        {
          messages: [
            {
              role: "system",
              content: "Eres un experto en contenido viral para TikTok, Reels y Shorts."
            },
            {
              role: "user",
              content: `Genera 6 ideas virales sobre ${tema}. Devuelve una lista simple.`
            }
          ]
        }
      );

      return Response.json({
        ideas: result.response
      });

    } catch (error) {

      return Response.json({
        error: error.message
      }, {
        status: 500
      });

    }
  }
}

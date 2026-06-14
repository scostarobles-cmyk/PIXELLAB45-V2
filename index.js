/*export default {
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
}*/
export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          message: "PIXELLAB45 Ideas API"
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    try {

      const { tema } = await request.json();

      const result = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        {
          messages: [
            {
              role: "user",
              content: `Genera 5 ideas virales sobre ${tema}`
            }
          ]
        }
      );

      return new Response(
        JSON.stringify({
          ideas: result.response
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {

      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );

    }
  }
};

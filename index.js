//inico 
export default {
  async fetch(request, env) {
    try {
      const { searchParams } = new URL(request.url);

      const prompt = searchParams.get("prompt") 
        || "Genera 3 ideas virales sobre tecnología";

      const result = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        { prompt }
      );

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (err) {
      return new Response(
        JSON.stringify({
          error: "AI_ERROR",
          message: err.message
        }),
        { status: 500 }
      );
    }
  }
};

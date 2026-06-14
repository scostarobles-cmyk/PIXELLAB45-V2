export default {
  async fetch(request, env) {
    try {

      const r = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        {
          messages: [
            {
              role: "user",
              content: "hola"
            }
          ]
        }
      );

      return Response.json(r);

    } catch (e) {

      return Response.json({
        error: String(e),
        message: e.message
      });

    }
  }
}

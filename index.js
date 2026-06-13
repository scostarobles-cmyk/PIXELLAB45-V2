export default {
  async fetch(request, env) {
    try {
      const result = await env.AI.run(
        "@cf/black-forest-labs/flux-2-klein-9b",
        {
          prompt: "robot futurista azul"
        }
      );

      return Response.json(result);

    } catch (error) {
      return Response.json({
        error: error.message,
        details: String(error)
      });
    }
  }
}

export default {
  async fetch(request, env) {
    try {

      const imagen = await env.AI.run(
        "black-forest-labs/flux-2-pro-preview",
        {
          prompt: "Robot futurista cyberpunk con luces azules, estilo cinematográfico, ultra detallado",
          width: 1024,
          height: 1024
        }
      );

      return Response.json(imagen);

    } catch (error) {

      return Response.json({
        error: error.message
      });

    }
  }
}

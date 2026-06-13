export default {
  async fetch(request, env) {
    try {

      const respuesta = await env.AI.run(
        "@cf/moonshotai/kimi-k2-instruct",
        {
          prompt: "Responde únicamente: PIXELLAB45 conectado correctamente"
        }
      );

      return Response.json(respuesta);

    } catch (error) {

      return Response.json({
        error: error.message
      });

    }
  }
}

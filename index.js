export default {
  async fetch(request, env) {
    try {

      const respuesta = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          messages: [
            {
              role: "user",
              content: "Responde únicamente: PIXELLAB45 conectado"
            }
          ]
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

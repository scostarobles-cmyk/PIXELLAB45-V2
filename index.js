export default {
  async fetch(request, env) {

    const respuesta = await env.Ai.run(
      "@cf/meta/llama-3-8b-instruct",
      {
        prompt: "Responde únicamente: PIXELLAB45 conectado correctamente"
      }
    );

    return Response.json(respuesta);
  }
}

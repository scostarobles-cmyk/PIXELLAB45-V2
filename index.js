export default {
  async fetch(request, env) {

    const imagen = await env.AI.run(
      "@cf/black-forest-labs/flux-2-klein-9b",
      {
        prompt: "Un robot futurista en una ciudad cyberpunk"
      }
    );

    return new Response(imagen, {
      headers: {
        "Content-Type": "image/png"
      }
    });
  }
}

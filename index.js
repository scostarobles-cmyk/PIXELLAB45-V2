export default {
  async fetch(request, env) {
    try {
      const result = await env.AI.run(
        "@cf/black-forest-labs/flux-2-klein-9b",
        {
          prompt: "Un robot futurista en una ciudad cyberpunk"
        }
      );

      // 🔥 FIX: convertir correctamente a bytes
      const image = result.image
        ? result.image
        : result;

      return new Response(image, {
        headers: {
          "Content-Type": "image/png"
        }
      });

    } catch (err) {
      console.log("ERROR AI:", err);

      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500 }
      );
    }
  }
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      const prompt =
        url.searchParams.get("prompt") ||
        "Un robot futurista en una ciudad cyberpunk";

      const result = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        { prompt }
      );

      let image = result.image || result;

      if (typeof image === "string") {
        image = Uint8Array.from(atob(image), c =>
          c.charCodeAt(0)
        );
      }

      return new Response(image, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-store"
        }
      });

    } catch (err) {
      return new Response(
        JSON.stringify({
          error: "PIXELLAB45_ERROR",
          message: err.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};

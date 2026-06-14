export default {
  async fetch(request, env) {

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response("PIXELLAB45 OK", {
        headers: cors
      });
    }

    if (
      url.pathname === "/generate" &&
      request.method === "POST"
    ) {

      const { prompt } =
        await request.json();

      const image =
        await env.AI.run(
          "@cf/stabilityai/stable-diffusion-xl-base-1.0",
          { prompt }
        );

      return new Response(image, {
        headers: {
          ...cors,
          "Content-Type": "image/png"
        }
      });
    }

    return new Response("Not Found", {
      status: 404,
      headers: cors
    });
  }
};

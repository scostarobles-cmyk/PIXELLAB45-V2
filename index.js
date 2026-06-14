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

    // TEST
    if (url.pathname === "/") {
      return new Response("PIXELLAB45 OK", {
        headers: cors
      });
    }

    // GENERAR IMAGEN
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

      const key =
        `gallery/${Date.now()}-pixellab45.png`;

      await env.PIXELLAB45_BUCKET.put(
        key,
        image,
        {
          httpMetadata: {
            contentType: "image/png"
          }
        }
      );

      const imageUrl =
        `https://pixellab45-v2.scostarobles.workers.dev/image/${key}`;

      return new Response(
        JSON.stringify({
          ok: true,
          imageUrl
        }),
        {
          headers: {
            ...cors,
            "Content-Type":
              "application/json"
          }
        }
      );
    }

    // MOSTRAR IMAGEN DESDE R2
    if (
      url.pathname.startsWith("/image/")
    ) {

      const key =
        decodeURIComponent(
          url.pathname.replace(
            "/image/",
            ""
          )
        );

      const object =
        await env.PIXELLAB45_BUCKET.get(
          key
        );

      if (!object) {

        return new Response(
          "Imagen no encontrada",
          {
            status: 404,
            headers: cors
          }
        );
      }

      return new Response(
        object.body,
        {
          headers: {
            ...cors,
            "Content-Type":
              object.httpMetadata?.contentType ||
              "image/png"
          }
        }
      );
    }

    return new Response(
      "Not Found",
      {
        status: 404,
        headers: cors
      }
    );
  }
};

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

    /* =========================
       TEST
    ========================= */

    if (url.pathname === "/") {
      return new Response("PIXELLAB45 funcions ", {
        headers: cors
      });
    }

    //gwnerador de ideas 
    const respuesta = await env.AI.run(
  "@cf/openai/gpt-oss-20b",
  {
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  }
);
 
    /* =========================
       GENERAR IMAGEN
    ========================= */

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
    // video 
    if (
  url.pathname === "/generate-video" &&
  request.method === "POST"
) {

  const { prompt } = await request.json();

  // 🎥 VIDEO AI (elige el modelo)
  const video = await env.AI.run(
    "@cf/bytedance/seedance-2.0-fast",
    {
      prompt,
      // algunos modelos aceptan duración
      duration: 5
    }
  );

  // Cloudflare devuelve binario (video)
  const key = `videos/${Date.now()}-pixellab45.mp4`;

  await env.PIXELLAB45_BUCKET.put(key, video, {
    httpMetadata: {
      contentType: "video/mp4"
    }
  });

  const videoUrl =
    `https://pixellab45-v2.scostarobles.workers.dev/video/${key}`;

  return new Response(
    JSON.stringify({
      ok: true,
      videoUrl
    }),
    {
      headers: {
        ...cors,
        "Content-Type": "application/json"
      }
    }
  );
    }

    /* =========================
       SERVIR IMAGEN
    ========================= */

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

    /* =========================
       GALERÍA
    ========================= */

    if (url.pathname === "/gallery") {

      const objects =
        await env.PIXELLAB45_BUCKET.list({
          prefix: "gallery/"
        });

      const files =
        objects.objects.map(obj => ({
          key: obj.key,
          url:
            `https://pixellab45-v2.scostarobles.workers.dev/image/${obj.key}`
        }));

      return new Response(
        JSON.stringify(files),
        {
          headers: {
            ...cors,
            "Content-Type":
              "application/json"
          }
        }
      );
    }

    if (
  url.pathname === "/generate-text" &&
  request.method === "POST"
) {

  const { prompt } =
    await request.json();

  const respuesta =
    await env.AI.run(
      "@cf/openai/gpt-oss-20b",
      {
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      }
    );

  return new Response(
    JSON.stringify({
      ok: true,
      text:
        respuesta.response ||
        respuesta.result ||
        JSON.stringify(respuesta)
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
    /* =========================
       404
    ========================= */

    return new Response(
      "Not Found",
      {
        status: 404,
        headers: cors
      }
    );
  }
};

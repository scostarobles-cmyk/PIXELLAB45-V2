export default {
  async fetch(request, env) {

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Solo POST permitido"
        }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    try {

      const body = await request.json();
      const prompt = body.prompt;

      if (!prompt) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "Prompt requerido"
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      const image = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        {
          prompt: `
cinematic ultra realistic 8k,
futuristic cyberpunk lighting,
high detail,
professional digital art,

${prompt}
`,
          width: 1024,
          height: 1024,
          num_steps: 20
        }
      );

      return new Response(image, {
        headers: {
          "Content-Type": "image/png",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (err) {

      return new Response(
        JSON.stringify({
          ok: false,
          error: err.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  }
};

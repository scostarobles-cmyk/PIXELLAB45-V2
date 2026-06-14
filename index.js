export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          message: "PIXELLAB45 API"
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    try {

      const { tema, tipo } = await request.json();

      let prompt = "";

      if (tipo === "visuales") {

        prompt = `
Genera prompts visuales cinematográficos para IA de imágenes y video.

Tema: ${tema}

Devuelve:

🎨 IMAGEN PRINCIPAL

📱 MINIATURA YOUTUBE

🎬 VIDEO IA

Cada prompt debe ser detallado, cinematográfico, futurista, profesional y en inglés.
`;

      } else {

        prompt = `
Genera 10 ideas virales sobre ${tema}.

Devuelve únicamente una lista numerada de títulos cortos.
No expliques las ideas.
`;

      }

      const result = await env.AI.run(
        "@cf/meta/llama-3.2-3b-instruct",
        {
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        }
      );

      if (tipo === "visuales") {

        return new Response(
          JSON.stringify({
            resultado: result.response
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          }
        );

      }

      return new Response(
        JSON.stringify({
          ideas: result.response
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {

      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );

    }
  }
};

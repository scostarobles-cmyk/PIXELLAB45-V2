// ============================
// PIXELLAB45 WORKER
// ============================

function crearPromptSistema() {
  return `
Eres PIXELLAB45 AI.
Actúas como un sistema experto en IA, marketing y contenido viral.
Respuestas claras, útiles y accionables.
`;
}

async function consultarIA(env, promptUsuario) {
  const resultado = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      messages: [
        { role: "system", content: crearPromptSistema() },
        { role: "user", content: promptUsuario }
      ]
    }
  );

  return resultado.response;
}

// ============================
// EXPORT DEFAULT (WORKER)
// ============================

export default {
  async fetch(request, env) {

    // ✅ CORS SIEMPRE AQUÍ (UNA SOLA VEZ)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json"
    };

    // ✅ PRE-FLIGHT (OBLIGATORIO)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    try {

      // ⚠️ SOLO JSON POST
      let data = {};
      
      if (request.method === "POST") {
        try {
          data = await request.json();
        } catch (e) {
          return new Response(
            JSON.stringify({ error: "JSON inválido" }),
            { headers: corsHeaders }
          );
        }
      }

      const { tipo } = data;

      if (!tipo) {
        return new Response(
          JSON.stringify({ error: "Falta tipo" }),
          { headers: corsHeaders }
        );
      }

      // ============================
      // ROUTER
      // ============================
      switch (tipo) {

        case "ping":
          return new Response(
            JSON.stringify({ ok: true }),
            { headers: corsHeaders }
          );

        case "ideas": {
          const ideas = await consultarIA(env, `Dame ideas sobre: ${data.tema}`);
          return new Response(
            JSON.stringify({ ideas }),
            { headers: corsHeaders }
          );
        }

        case "prompt": {
          const resultado = await consultarIA(env, data.tema);
          return new Response(
            JSON.stringify({ resultado }),
            { headers: corsHeaders }
          );
        }

        case "listar-imagenes": {
          const objetos = await env.IMAGES.list();

          const imagenes = objetos.objects.map(obj => ({
            nombre: obj.key,
            url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`
          }));

          return new Response(
            JSON.stringify(imagenes),
            { headers: corsHeaders }
          );
        }

        default:
          return new Response(
            JSON.stringify({ error: "Tipo no válido" }),
            { headers: corsHeaders }
          );
      }

    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: corsHeaders }
      );
    }
  }
};

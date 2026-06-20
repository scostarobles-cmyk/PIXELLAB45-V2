// ============================
// PIXELLAB45 WORKER LIMPIO (CORREGIDO)
// ============================

function crearPromptSistema() {
  return `
Eres PIXELLAB45 AI.

Actúas como un equipo completo formado por:
- Experto en Inteligencia Artificial
- Experto en Tecnología
- Guionista profesional
- Copywriter de marketing digital
- Especialista en contenido viral
- Consultor SEO
- Diseñador de prompts para IA
- Productor audiovisual

OBJETIVO:
Crear contenido de máxima calidad para creadores digitales, emprendedores y entusiastas de la tecnología.

REGLAS:
- Evita respuestas genéricas.
- Evita relleno innecesario.
- Sé específico y práctico.
- Entrega contenido listo para usar.
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

export default {
  async fetch(request, env) {
    try {

      const contentType = request.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        return new Response(JSON.stringify({
          error: "Content-Type inválido"
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      const text = await request.text();

      let data = {};
      if (text && text.trim().length > 0) {
        if (text.trim().startsWith("{")) {
          data = JSON.parse(text);
        }
      }

      const {
        tipo,
        tema,
        formato,
        guion,
        escenas,
        estilo,
        imagenBase64,
        categoria
      } = data;

      if (!tipo) {
        return new Response(JSON.stringify({
          error: "Payload inválido: se requiere 'tipo'"
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      // ============================
      // SWITCH PRINCIPAL
      // ============================
      switch (tipo) {

        case "ideas": {
          const prompt = `Genera 10 ideas sobre: ${tema}`;
          const respuesta = await consultarIA(env, prompt);

          return new Response(JSON.stringify({
            ideas: respuesta
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }

        case "prompt": {
          const prompt = `Genera un prompt para: ${tema} en formato ${formato}`;
          const respuesta = await consultarIA(env, prompt);

          return new Response(JSON.stringify({
            resultado: respuesta
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }

        case "script": {
          const prompt = `Guion sobre: ${tema}`;
          const respuesta = await consultarIA(env, prompt);

          return new Response(JSON.stringify({
            resultado: respuesta
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }

        case "visuales": {
          const prompt = `Prompts visuales cinematográficos sobre: ${tema}`;
          const respuesta = await consultarIA(env, prompt);

          return new Response(JSON.stringify({
            resultado: respuesta
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }

        case "storyboard": {
          const prompt = `Storyboard: ${guion}`;
          const respuesta = await consultarIA(env, prompt);

          return new Response(JSON.stringify({
            resultado: respuesta
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }

        case "guardar-imagen": {
          if (!env.IMAGES) {
            return new Response(JSON.stringify({
              success: false,
              error: "Bucket IMAGES no configurado"
            }), {
              headers: { "Content-Type": "application/json" }
            });
          }

          const base64 = imagenBase64.replace(/^data:image\/\w+;base64,/, "");
          const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

          const nombre = `${categoria || "general"}/${Date.now()}.png`;

          await env.IMAGES.put(nombre, bytes, {
            httpMetadata: { contentType: "image/png" }
          });

          return new Response(JSON.stringify({
            success: true,
            nombre
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }

        case "listar-imagenes": {
          if (!env.IMAGES) {
            return new Response(JSON.stringify({
              success: false,
              error: "Bucket IMAGES no configurado"
            }), {
              headers: { "Content-Type": "application/json" }
            });
          }

          try {
            const objetos = await env.IMAGES.list({ limit: 1000 });

            const imagenes = objetos.objects.map(obj => ({
              nombre: obj.key,
              url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`
            }));

            return new Response(JSON.stringify({
              success: true,
              imagenes
            }), {
              headers: { "Content-Type": "application/json" }
            });

          } catch (error) {
            return new Response(JSON.stringify({
              success: false,
              error: error.message
            }), {
              headers: { "Content-Type": "application/json" }
            });
          }
        }

        default: {
          return new Response(JSON.stringify({
            error: "Tipo no válido"
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
      }

    } catch (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};

export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "JSON inválido" }), { headers: corsHeaders });
    }

    const { tipo, tema, formato, categoria, imagenBase64 } = data;

    if (!tipo) {
      return new Response(JSON.stringify({ error: "Falta tipo" }), { headers: corsHeaders });
    }

    // 🧠 SISTEMA INTELIGENTE (menos repetición)
    const ai = async (prompt) => {
      const res = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fp8",
        {
          messages: [
            {
              role: "system",
              content:
                "Eres PIXELLAB45 AI. Eres creativo, nunca repites ideas, siempre generas variaciones nuevas, estilos distintos, enfoques diferentes."
            },
            { role: "user", content: prompt }
          ]
        }
      );
      return res.response;
    };

    switch (tipo) {

      // 🎯 IDEAS VIRALMENTE DIFERENTES
      case "ideas": {
        const r = await ai(
          `Genera 5 ideas COMPLETAMENTE distintas entre sí sobre: ${tema}. 
           Cada una debe tener un enfoque diferente (educativo, viral, storytelling, emocional, técnico).`
        );

        return new Response(JSON.stringify({ ideas: r }), { headers: corsHeaders });
      }

      // ✍️ PROMPTS
      case "prompt": {
        const r = await ai(
          `Crea un prompt profesional cinematográfico sobre: ${tema}. 
           Incluye estilo visual, cámara, iluminación y ambiente único.`
        );

        return new Response(JSON.stringify({ resultado: r }), { headers: corsHeaders });
      }

      // 🎬 GUIONES
      case "script": {
        const r = await ai(
          `Escribe un guion viral corto sobre: ${tema}. 
           Debe tener gancho inicial, desarrollo rápido y cierre impactante.`
        );

        return new Response(JSON.stringify({ resultado: r }), { headers: corsHeaders });
      }

      // 🎨 VISUALES
      case "visuales": {
        const r = await ai(
          `Genera prompts visuales cinematográficos ultra detallados sobre: ${tema}. 
           Estilo cyberpunk, futurista o realista según convenga.`
        );

        return new Response(JSON.stringify({ resultado: r }), { headers: corsHeaders });
      }

      // 🎬 STORYBOARD
      case "storyboard": {
        const r = await ai(
          `Crea un storyboard escena por escena sobre: ${tema}. 
           Cada escena debe ser diferente y progresiva.`
        );

        return new Response(JSON.stringify({ resultado: r }), { headers: corsHeaders });
      }

      // 🖼️ GALERÍA R2
      case "listar-imagenes": {
        const objs = await env.IMAGES.list();

        const imgs = objs.objects.map(o => ({
          nombre: o.key,
          url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${o.key}`
        }));

        return new Response(JSON.stringify(imgs), { headers: corsHeaders });
      }

      // 🖼️ GUARDAR IMAGEN
      case "guardar-imagen": {
        try {
          const base64 = imagenBase64.split(",")[1];
          const bin = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

          const key = `${categoria}/${Date.now()}.png`;

          await env.IMAGES.put(key, bin, {
            httpMetadata: { contentType: "image/png" }
          });

          return new Response(JSON.stringify({ success: true, nombre: key }), { headers: corsHeaders });

        } catch (e) {
          return new Response(JSON.stringify({ success: false, error: e.message }), { headers: corsHeaders });
        }
      }

      default:
        return new Response(JSON.stringify({ error: "Tipo no válido" }), { headers: corsHeaders });
    }
  }
};

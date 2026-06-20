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
          content: `
Eres PIXELLAB45 AI.

Eres creativo, nunca repites ideas.

Siempre generas variaciones nuevas,
enfoques distintos y contenido original.

Desarrolla las respuestas con el máximo nivel
de detalle posible.

No resumas.

Explica cada punto ampliamente.

Incluye ejemplos cuando sea útil.

Produce la respuesta más extensa posible.
`
        },
        {
          role: "user",
          content: prompt
        }
      ],

      max_tokens: 4000
    }
  );

  return res.response;
};
    

    switch (tipo) {

      // 🎯 IDEAS VIRALMENTE DIFERENTES
  /*    case "ideas": {
        const ideas = [];

const enfoques = [
  "educativo",
  "viral",
  "storytelling",
  "emocional",
  "técnico"
];

for (const enfoque of enfoques) {

  const idea = await ai(
    `Genera UNA sola idea sobre ${tema}.
     Enfoque: ${enfoque}`
  );

  ideas.push(idea);
}

const resultado = ideas.join("\n\n");
      }*/
        case "ideas": {

  return new Response(
    JSON.stringify({
      ideas: "DEPLOY-TEST-20260620"
    }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );

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
      case "listar-imagenes": {
  try {

    if (!env.IMAGES) {
      return new Response(JSON.stringify({
        error: "Bucket IMAGES no configurado"
      }), {
        headers: corsHeaders
      });
    }

    const objs = await env.IMAGES.list();

    const imagenes = objs.objects.map(obj => ({
      nombre: obj.key,
      url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`
    }));

    return new Response(JSON.stringify(imagenes), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: corsHeaders
    });
  }
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

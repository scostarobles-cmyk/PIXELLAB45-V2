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

      max_tokens: 3000
    }
  );

  return res.response;
};
    const safe = (v) => v?.trim() || "No especificado";

    switch (tipo) {

      // 🎯 IDEAS VIRALMENTE DIFERENTES
  case "ideas": {

  const match = tema.match(/\d+/);
  let cantidad = match ? parseInt(match[0]) : 5;

  if (cantidad > 20) cantidad = 20;

  const resultado = await ai(`
Eres un generador de ideas estructurado.

Genera EXACTAMENTE ${cantidad} ideas sobre: ${tema}

REGLAS OBLIGATORIAS:
- No repitas ideas
- No mezcles numeración
- No hagas bloques separados
- No reinicies la cuenta
- No agregues texto fuera de las ideas

FORMATO ESTRICTO:

Idea 1:
Título:
Gancho:
Desarrollo:

Idea 2:
Título:
Gancho:
Desarrollo:

(continuar así hasta Idea ${cantidad})

Cada idea debe ser completamente diferente.
`);

  return new Response(
    JSON.stringify({
      ideas: resultado
    }),
    {
      headers: corsHeaders
    }
  );

  }

      // ✍️ PROMPTS
      case "prompt": {

  const { titulo, gancho, descripcion } = data;

  const secciones = [
    "GANCHO",
    "DESCRIPCIÓN VISUAL",
    "CÁMARA Y ÁNGULOS",
    "ILUMINACIÓN",
    "AMBIENTE Y TONO"
  ];

  const partes = [];

  for (const sec of secciones) {

    const r = await ai(
      `Basado en:
TÍTULO: ${safe(titulo)}
GANCHO: ${safe(gancho)}
DESCRIPCIÓN: ${safe(descripcion)}

Genera SOLO la sección: ${sec}
Máximo claridad, sin texto extra.`
    );

    partes.push(`**${sec}**\n${r}`);
  }

  const resultado = partes.join("\n\n");

  return new Response(
    JSON.stringify({ resultado }),
    { headers: corsHeaders }
  );
      }


      // 🎬 GUIONES
      case "script": {
        const r = await ai(`
TÍTULO: ${safe(titulo)}
GANCHO: ${safe(gancho)}
DESCRIPCIÓN: ${safe(descripcion)}

IMPORTANTE:
- Nunca pidas información
- Nunca digas “no hay datos”
- Si algo está vacío, INFIERE contenido cinematográfico futurista
- No expliques teoría
- No definas conceptos

Genera SOLO esta sección: ${sec}

Reglas:
- Es contenido para video viral
- No texto educativo
- No introducciones
- No conclusiones
`);

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

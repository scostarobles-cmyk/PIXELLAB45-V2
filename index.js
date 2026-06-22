// ========================================
// PIXELLAB45 WORKER
// SECCIÓN 1 - FETCH + CORS + JSON
// ========================================

export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    let data;

    try {
      data = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: "JSON inválido"
        }),
        {
          headers: corsHeaders
        }
      );
    }

    const {
      tipo,
      tema,
      formato,
      categoria,
      imagenBase64,
      contenido
    } = data;

    if (!tipo) {
      return new Response(
        JSON.stringify({
          error: "Falta tipo"
        }),
        {
          headers: corsHeaders
        }
      );
    }
    // ========================================
// PIXELLAB45 WORKER
// SECCIÓN 2 - MOTOR IA
// ========================================

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

          max_tokens: 1000
        }
      );

      return res.response;
    };

    switch (tipo) {
    	
    // ========================================
      // 🖼️ GALERÍA R2 - LISTAR IMÁGENES
      // ========================================

      case "listar-imagenes": {

        try {

          if (!env.IMAGES) {
            return new Response(
              JSON.stringify({
                error: "Bucket IMAGES no configurado"
              }),
              {
                headers: corsHeaders
              }
            );
          }

          const objs = await env.IMAGES.list();

          const imagenes = objs.objects.map(obj => ({
            nombre: obj.key,
            url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`
          }));

          return new Response(
            JSON.stringify(imagenes),
            {
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
                "Cache-Control": "no-store"
              }
            }
          );

        } catch (error) {

          return new Response(
            JSON.stringify({
              error: error.message
            }),
            {
              headers: corsHeaders
            }
          );

        }

      }
      // ========================================
      // 🎯 GENERADOR DE IDEAS
      // ========================================

      case "ideas": {

  const r = await ai(`
Genera ideas de contenido sobre: ${tema}

Devuelve entre 5 y 10 líneas.

Cada línea debe empezar con:
Idea:
`);

  return new Response(
    JSON.stringify({
      ideas: r
    }),
    {
      headers: corsHeaders
    }
  );

}
      // ========================================
      // ✍️ GENERADOR DE PROMPTS
      // ========================================

      case "prompt": {

  const r = await ai(
`Eres un generador de prompts para IA de imágenes.

Convierte el tema en una lista de prompts listos para generar imágenes.

REGLAS:
- No historias
- No explicaciones
- No sinopsis
- No texto extra
- Solo prompts de imagen

Devuelve una lista numerada clara (entre 5 y 7 prompts).

FORMATO:

Prompt 1: descripción visual cinematográfica
Prompt 2: descripción visual cinematográfica
Prompt 3: descripción visual cinematográfica
Prompt 4: descripción visual cinematográfica
Prompt 5: descripción visual cinematográfica

TEMA:
${tema}
`
  );

  return new Response(
    JSON.stringify({
      resultado: r
    }),
    {
      headers: corsHeaders
    }
  );

}
      // ========================================
// 🎨 VISUALES
// ========================================

case "visuales": {
  const r = await ai(
    `Genera prompts visuales cinematográficos ultra detallados sobre: ${tema}. 
     Estilo cyberpunk, futurista o realista según convenga.`
  );

  return new Response(
    JSON.stringify({ resultado: r }),
    {
      headers: corsHeaders
    }
  );
}
      // ========================================
// 🎬 GENERADOR DE GUIONES
// ========================================

case "script": {

  const r = await ai(
    `Escribe un guion viral corto sobre: ${tema}. 
     Debe tener gancho inicial, desarrollo rápido y cierre impactante.`
  );

  return new Response(
    JSON.stringify({
      resultado: r
    }),
    {
      headers: corsHeaders
    }
  );

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
// ========================================
      // 🖼️ GENERADOR DE IMAGEN
      // ========================================

      case "imagen": {

        const imagen = await env.AI.run(
          "@cf/lykon/dreamshaper-8-lcm",
          {
            prompt: `
${tema},
cinematic lighting,
ultra detailed,
highly realistic,
sharp focus,
depth of field,
8k
            `
          }
        );

        return new Response(
          imagen,
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "image/png"
            }
          }
        );

      }
      // ========================================
// 🎬 STORYBOARD IA
// ========================================

case "storyboard": {

  const r = await ai(
    `
Convierte el siguiente guion en un storyboard cinematográfico.

Guion:
${guion}

Cantidad de escenas: ${escenas}

Estilo visual: ${estilo}

Reglas:

- Genera exactamente ${escenas} escenas.
- Distribuye el contenido del guion entre las escenas.
- Cada escena debe incluir:

🎬 ESCENA X

🎙️ Narración

🎥 Visual

📷 Cámara

🎨 Estilo

⏱️ Duración

- El estilo visual debe respetar:
${estilo}

- Compatible con Kling, Veo, Runway, Pika y Minimax.
- Formato profesional cinematográfico.
`
  );

  return new Response(
    JSON.stringify({
      resultado: r
    }),
    {
      headers: corsHeaders
    }
  );

}

// 📚 GUARDAR IDEA
case "copiar-ideas": {
  const nombreArchivo = `ideas/${Date.now()}.txt`;

  await env.IMAGES.put(
    nombreArchivo,
    contenido,
    {
      httpMetadata: {
        contentType: "text/plain"
      }
    }
  );

  return new Response(
    JSON.stringify({
      success: true,
      nombre: nombreArchivo
    }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );
}
      //CIERRE DEL WORKER 
      default:
        return new Response(
          JSON.stringify({
            error: "Tipo no válido"
          }),
          {
            headers: corsHeaders
          }
        );
    }
  }
};
      
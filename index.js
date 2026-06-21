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
      imagenBase64
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
      // ========================================
      // ✍️ GENERADOR DE PROMPTS
      // ========================================

      case "prompt": {

        const r = await ai(
          `Crea un prompt profesional cinematográfico sobre: ${tema}. 
           Incluye estilo visual, cámara, iluminación y ambiente único.`
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
      
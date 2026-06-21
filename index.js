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

  const r = await ai(`
Eres un generador profesional de PROMPTS PARA IA DE VIDEO (Kling / Runway / Pika).

A partir del tema:

"${tema}"

🔥 REGLAS ABSOLUTAS (NO SE PUEDEN VIOLAR):
- Describe UNA SOLA ESCENA fija
- NO narración
- NO historia
- NO transformación
- NO secuencia temporal
- NO palabras como: luego, después, de repente, al final
- NO storytelling
- NO guion
- NO títulos
- NO explicaciones

🎯 OBJETIVO:
Un solo párrafo continuo como prompt técnico para IA de video.

📌 DEBE INCLUIR:
- sujeto principal
- entorno
- acción única congelada o mínima
- cámara (ángulo y lente si aplica)
- iluminación
- estilo visual

🎬 ESTILO:
Cinematográfico hiper realista o futurista según el tema.
Texto directo tipo instrucción de generación de video.
`);

  return new Response(
    JSON.stringify({ resultado: r }),
    { headers: corsHeaders }
  );
}


      // 🎬 GUIONES
      case "script": {

  const r = await ai(`
Actúa como un guionista profesional experto en videos virales de tecnología e inteligencia artificial.

Tema:
${tema}

Genera un guion completo.

Estructura obligatoria:

🎯 GANCHO

🎬 DESARROLLO

🔥 CIERRE

📢 CTA

Reglas:

- Duración aproximada 60 segundos.
- Escribir en español.
- No pedir información adicional.
- No explicar teoría.
- No escribir instrucciones para cámara.
- No escribir escenas.
- No escribir storyboard.
- Solo narración lista para voz en off.
- El contenido debe ser dinámico y viral.

Devuelve únicamente el guion.
`);

  return new Response(
    JSON.stringify({ resultado: r }),
    {
      headers: corsHeaders
    }
  );
}

      // 🎨 VISUALES
      case "visuales": {

  const r = await ai(`
Eres un experto en prompts para Midjourney, Flux, Stable Diffusion, Ideogram y Kling.

TEMA:
${tema}

Genera EXACTAMENTE 5 prompts visuales.

REGLAS OBLIGATORIAS:

- Cada prompt debe ser completamente diferente.
- Todos los prompts deben estar relacionados con el tema.
- No escribir historias.
- No escribir párrafos.
- No escribir explicaciones.
- No escribir instrucciones.
- No usar numeración interna.
- No usar frases completas.
- No usar puntos.
- No usar verbos narrativos.
- No usar:
  "una escena"
  "una imagen"
  "la cámara"
  "la iluminación"
  "capturada con"
  "ubicada en"
  "se encuentra"

- Escribir únicamente elementos visuales separados por comas.

- Incluir de forma natural:
  personaje o sujeto,
  entorno,
  objetos,
  materiales,
  colores,
  iluminación,
  atmósfera,
  composición cinematográfica,
  lente,
  profundidad de campo.

- Priorizar escenas cinematográficas complejas.
- Evitar fondos vacíos.
- Evitar prompts genéricos.
- Evitar repetir estructuras.

FORMATO OBLIGATORIO:

PROMPT 1:
contenido

PROMPT 2:
contenido

PROMPT 3:
contenido

PROMPT 4:
contenido

PROMPT 5:
contenido

Todos los prompts deben terminar exactamente con:

ultra detailed, cinematic lighting, professional cinematography, depth of field, volumetric lighting, photorealistic, highly detailed, 8k, masterpiece

Devuelve únicamente los 5 prompts.
`);

  return new Response(
    JSON.stringify({ resultado: r }),
    { headers: corsHeaders }
  );
      }
        // generasor de imagen 
      case "imagen": {

  const promptImagen = `${tema}`;

  const imagen = await env.AI.run(
    "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    {
      prompt: promptImagen,

      negative_prompt: `
extra objects,
duplicate objects,
multiple subjects,
blurry,
low quality,
distorted,
bad anatomy,
unwanted reflections
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

      // 🎬 STORYBOARD
      case "storyboard": {

  const r = await ai(`
Actúa como un director cinematográfico profesional.

Convierte el siguiente guion en un storyboard cinematográfico profesional.

GUION:
${guion}

CANTIDAD DE ESCENAS:
${escenas}

ESTILO VISUAL:
${estilo}

REGLAS OBLIGATORIAS:

- Genera exactamente ${escenas} escenas.
- No generes menos escenas.
- No resumas el guion.
- Distribuye el contenido completo del guion entre todas las escenas.
- Cada escena debe avanzar la historia.
- Cada escena debe ser diferente.
- Compatible con Kling, Veo, Runway, Pika y Minimax.

FORMATO OBLIGATORIO:

🎬 ESCENA 1

🎙️ Narración:
(texto)

🎥 Prompt Visual:
(descripción cinematográfica completa)

📷 Cámara:
(movimiento de cámara)

🎨 Estilo:
${estilo}

⏱️ Duración:
(segundos)

--------------------------------

Repetir hasta completar las ${escenas} escenas.

No agregues explicaciones.
No agregues introducciones.
Devuelve únicamente el storyboard completo.
`);

  return new Response(
    JSON.stringify({ resultado: r }),
    {
      headers: corsHeaders
    }
  );
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

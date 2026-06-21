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

//    const { tipo, tema, formato, categoria, imagenBase64 } = data;

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
    const safe = (v) => v?.trim() || "No especificado";
const { tipo, tema, formato, categoria, imagenBase64, guion, escenas, estilo } = data;
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
Eres un guionista experto en contenido viral para TikTok, Reels y Shorts.

TEMA:
${tema}

Genera un guion viral.

FORMATO OBLIGATORIO:

🎯 GANCHO
(frase impactante de máximo 2 líneas)

🎬 DESARROLLO
(contenido dinámico y entretenido)

🔥 CIERRE
(remate potente)

📢 CTA
(llamada a la acción)

REGLAS:

- Hablar directamente al espectador.
- Crear curiosidad.
- Crear emoción.
- Evitar tono académico.
- Evitar explicaciones largas.
- Evitar frases motivacionales genéricas.
- No decir "bienvenidos".
- No decir "hola a todos".
- No escribir como un profesor.
- Escribir como creador de contenido viral.
- Duración aproximada 60 segundos.

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
REGLAS ABSOLUTAS:

- No inventes personajes.
- No inventes animales.
- No inventes ejemplos.
- No agregues historias nuevas.
- Usa únicamente la información presente en el guion.
- Si falta información visual, crea una representación visual coherente sin alterar el significado.
- Mantén continuidad visual entre escenas.
- No cambies el mensaje del autor.
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

  return new Response(
    JSON.stringify({
      ok: true,
      storyboard: "TEST STORYBOARD"
    }),
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

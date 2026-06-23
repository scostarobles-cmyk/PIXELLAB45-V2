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
      contenido,
      indice
      
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
You are PIXELLAB45 AI.

When the user requests prompts:

- Respond ONLY with prompts.
- NEVER explain.
- NEVER tell stories.
- NEVER add introductions.
- NEVER add conclusions.
- ALWAYS write prompts in English.
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
  const cantidad = match ? parseInt(match[0]) : 5;

  const r = await ai(`
Devuelve EXACTAMENTE ${cantidad} ideas.

REGLA PRINCIPAL:
Cada idea debe ser SOLO un título corto.

PROHIBIDO:
- explicaciones
- descripciones
- ejemplos
- frases largas

FORMATO:
Idea 1: título
Idea 2: título
Idea 3: título
Idea ${cantidad}: título

TEMA: ${tema}
`);

  return new Response(
    JSON.stringify({ ideas: r }),
    { headers: corsHeaders }
  );

}
   // ========================================
      // ✍️ GENERADOR DE PROMPTS
      // ========================================

      case "prompt": {

  const r = await ai(`
IMPORTANT:

YOU MUST RESPOND ONLY IN ENGLISH.

Generate EXACTLY 5 image generation prompts.

Rules:

- English only.
- One line per prompt.
- No explanations.
- No descriptions outside the prompts.
- No introduction.
- No conclusion.

Format exactly:

Prompt 1: [prompt]

Prompt 2: [prompt]

Prompt 3: [prompt]

Prompt 4: [prompt]

Prompt 5: [prompt]

Topic: ${tema}

Visual style: ${formato}
`);

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

  const match = tema.match(/\d+/);
  const cantidad = match ? parseInt(match[0]) : 5;

  const r = await ai(`
IMPORTANT:

YOU MUST RESPOND ONLY IN ENGLISH.

Generate EXACTLY ${cantidad} cinematic visual prompts.

Rules:

- English only.
- Each prompt must be on a single line.
- Do not explain anything.
- Do not add introductions.
- Do not add conclusions.
- Do not add notes.

Format exactly:

Prompt 1: ...

Prompt 2: ...

Prompt 3: ...

Prompt 4: ...

Prompt 5: ...

Topic: ${tema}
`);

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
// 🎬 GENERADOR DE GUIONES
// ========================================

case "guion": {

  const tema =
    data.tema || "";

  const plataforma =
    data.plataforma || "";

  const duracion =
    data.duracion || "";

  const estilo =
    data.estilo || "";

  const prompt = `
Actúa como un guionista profesional especializado en contenido viral para redes sociales.

Genera un guion completo para ${plataforma}.

Tema: ${tema}

Duración: ${duracion}

Estilo: ${estilo}

Estructura obligatoria:

🎯 GANCHO (primeros 3 segundos)

📝 DESARROLLO

🔥 MOMENTO DE MAYOR IMPACTO

📢 LLAMADA A LA ACCIÓN

Reglas:

- Lenguaje natural.
- Ritmo dinámico.
- Optimizado para retención.
- Sin explicaciones externas.
- Devuelve únicamente el guion final.
`;

  const respuesta =
    await ai(prompt);

  return Response.json({
    success: true,
    resultado: respuesta
  });

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

case "copiar-prompts": {

  const contenido = data.contenido;
  const categoria = data.categoria;
  const tema = data.tema;

  const nombreArchivo =
    `prompts/${categoria}/${Date.now()}.txt`;

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

// 📚 GUARDAR VISUAL

case "copiar-visuales": {

  const contenido =
    data.contenido;

  const nombreArchivo =
    `visuales/${Date.now()}.txt`;

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

//CIERRE FINAL 
      default:
  return new Response(
    JSON.stringify({
      error: "Tipo no válido"
    }),
    {
      headers: corsHeaders
    }
  );

    } // fin switch

  } // fin fetch

}; // fin export default
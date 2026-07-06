 const R2_BASE_URL =
  "https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json"
};
 
export default {
  async fetch(request, env) {

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: CORS_HEADERS
      });
    }

    // Helper JSON seguro
    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: CORS_HEADERS
      });

    let data = {};

    // Parse seguro del body
    try {
      if (request.method === "POST") {
        data = await request.json();
      }


    } catch (err) {
      console.log("JSON ERROR:", err);

      return json({
        error: "JSON inválido"
      }, 400);
    }

    const tipo = data.action || "";

try {

  switch (tipo) {

    case "listar-imagenes":
      return listarImagenes(env, json);

    case "listar-categoria":
      return listarCategoria(env, data, json);

    case "ideas":
      return generarIdeas(data, env, json);

    case "guardar-ideas":
      return guardarIdeas(data, env, json);

    case "prompt":
      return generarPrompts(data, env, json);

    case "guardar-prompts":
      return guardarPrompts(data, env, json);

    case "visual":
      return generarVisualesPrompts(data, env, json);

    case "guardar-visuales":
      return guardarVisuales(data, env, json);

    case "script":
      return generarGuion(data, env, json);

    case "guardar-guion":
      return guardarGuion(data, env, json);

    case "storyboard":
      return generarStoryboard(data, env, json);

    case "guardar-storyboard":
      return guardarStoryboard(data, env, json);

    case "imagen":
      return generarImagen(data, env, json);

    case "guardar-imagen":
      return guardarImagen(data, env, json);

    
    case "generar-plan":
  return await generarPlan(data, env);

  case "generar-indice":
    return await generarIndice(json, env);

  case "generar-legales":
    return await generarLegales(json, env);

  case "generar-introduccion":
    return await generarIntroduccion(json, env);

  case "generar-capitulo":
    return await generarCapitulo(json, env);

  // ...


    default:
      return json({
        ok: false,
        error: "Tipo no válido: " + tipo
      }, 400);
  }

} catch (err) {

  return json({
    ok: false,
    error: err.message || String(err)
  }, 500);
}

  }
};
// =====================================
// CEREBRO IA
// =====================================

async function ai(env, prompt) {

  const res = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      messages: [
        {
          role: "system",
          content: `
You are PIXELLAB45 AI.

You are NOT a chatbot.
You are a professional content generation engine.

GENERAL RULES:

- Execute exactly what the user requests.
- Never invent information.
- Never change the requested task.
- Never add introductions.
- Never add conclusions.
- Never explain your answer.
- Never apologize.
- Never tell stories unless explicitly requested.
- Never add unnecessary adjectives.
- Keep the response focused.
- Follow the requested format exactly.

TASK RULES:

If the user requests IDEAS:
- Return only ideas.
- Each idea must be specific.
- Each idea must be independent.
- Do not describe complete scenes.
- Do not create stories.
- Do not invent names or characters unless requested.

If the user requests PROMPTS:
- Return only AI-ready prompts in English.
- Prompts must be clear, direct and descriptive.
- Describe only the requested subject.
- Do not create stories.
- Do not invent unnecessary environments.
- Do not include explanations.

If the user requests VISUAL PROMPTS:
- Return professional image-generation prompts.
- Describe exactly the requested subject.
- Add only details necessary to visualize it.
- Do not invent people, buildings or scenery unless requested.

If the user requests a SCRIPT:
- Return only the script.
- No introductions.
- No explanations.

If the user requests a STORYBOARD:
- Return only storyboard scenes.
- Follow the requested structure exactly.

Always prioritize precision over creativity.
Always be literal.
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

console.log(JSON.stringify(res, null, 2));

return res.response;;

}

// =====================================
// GENERADOR DE IDEAS 
// =====================================
async function generarIdeas(data, env, json) {

  const tema = data.tema || "";

  const match = tema.match(/\d+/);

  let cantidad = match
    ? parseInt(match[0])
    : 1;

  if (cantidad > 20)
    cantidad = 20;

  const resultado = await ai(
    env,
`
Generate EXACTLY ${cantidad} ideas. Be strict: if I request one idea, return only one. If I request three, return exactly three. Do not add more or fewer. Each idea must be a short concept, between 3 and 8 words. Return ONLY the numbered list.

CRITICAL RULES:

- Return ONLY ideas.
- An idea is a short concept.
- NOT a story.
- NOT a paragraph.
- NOT a description.
- Each idea must contain between 3 and 8 words.
- Be specific.
- Be creative.
- Do not repeat ideas.
- Do not invent names.
- Do not add explanations.

Format:

1 - Idea

2 - Idea

3 - Idea

Return ONLY the numbered list.

Topic:
${tema}
`
  );
const ideas = resultado.split("\n").map(i => i.trim()).filter(i => i);

// Limitar al número de ideas solicitadas
const ideasLimitadas = ideas.slice(0, cantidad);

return json({
  success: true,
  ideas: ideasLimitadas.join("\n")
});
  

}
// =====================================
// GUARDAR IDEAS
// =====================================
async function guardarIdeas(
  data,
  env,
  json
) {

  const contenido =
    data.contenido || "";

  const ideas = contenido
    .split("\n")
    .map(i => i.trim())
    .filter(i => i);

  let guardadas = 0;

  for (const idea of ideas) {

    const nombre =
      `ideas/${Date.now()}-${crypto.randomUUID()}.txt`;

    await env.IMAGES.put(
      nombre,
      idea
    );

    guardadas++;

  }

  return json({
    ok: true,
    mensaje:
      `✅ ${guardadas} ideas guardadas`
  });

}
// =====================================
// GALERÍA COMPLETA
// =====================================

async function listarImagenes(
  env,
  json
) {

  const lista =
    await env.IMAGES.list();

  const imagenes = lista.objects
  .filter(obj => {

    const key = obj.key;

    return !(
      key.startsWith("ideas/") ||
      key.startsWith("prompts/") ||
      key.startsWith("visuals/") ||
      key.startsWith("scripts/") ||
      key.startsWith("storyboards/") ||
      key.startsWith("Ebook/")
    );

  })
  .map(obj => ({
    nombre: obj.key,
    url: `${R2_BASE_URL}/${obj.key}`
  }));

  return json({
    success: true,
    images: imagenes,
    total: imagenes.length
  });

}

// =====================================
// GALERÍA CATEGORÍA
// =====================================

async function listarCategoria(env, data, json) {

  const categoria = data.categoria;

  console.log("DATA:", data);
  console.log("Categoría:", categoria);

  const lista = await env.IMAGES.list({
    prefix: `${categoria}/`
  });

  const archivos = lista.objects.map(obj => ({
    nombre: obj.key,
    url: `${R2_BASE_URL}/${obj.key}`
  }));

  return json({
    success: true,
    categoria,
    prefix: `${categoria}/`,
    archivos,
    total: archivos.length
  });

}
// =====================================
// GENERAR PROMPTS
// =====================================
async function generarPrompts(data, env, json) {

  let tema = data.tema || "";
  const formato = data.formato || "";

  // Detecta cantidad SOLO si el número está al principio
  const match = tema.match(/^\s*(\d+)\s+/);

  let cantidad = 1;

  if (match) {
    cantidad = Math.min(parseInt(match[1]), 20);
    tema = tema.replace(match[0], "").trim();
  }

  // =====================================
  // CASO ESPECIAL: EBOOK
  // =====================================

  if (formato.toLowerCase() === "ebook") {

    const resultado = await ai(env, `
You are one of the world's best AI prompt engineers.

Transform the user's request into ONE professional master prompt for an AI ebook generation engine.

Rules:

- Keep the user's original topic.
- Never change the title.
- Never invent a title.
- Never invent a target audience.
- Never invent ages.
- Never invent professions.
- Never invent experience levels.
- Never invent chapters.
- Never invent the ebook length.
- Expand ONLY the information provided by the user.
- Return ONLY ONE prompt.
- English only.
- Do not number anything.
- Do not explain anything.
- Do not use markdown.

The prompt must preserve the user's original request.

Expand only the information explicitly provided.

If the user omitted audience, style, scope or objectives, keep them generic instead of inventing details.

User request:

${tema}
`);

    return json({
      success: true,
      resultado
    });
  }

  // =====================================
  // RESTO DE FORMATOS
  // =====================================

  let reglas = "";

  switch (formato.toLowerCase()) {

    case "tiktok":
      reglas = `
Generate professional AI prompts for viral TikTok videos.

Rules:
- Vertical 9:16.
- Short-form content.
- Strong visual impact.
- Cinematic quality.
- High engagement.
- Optimized for AI video generation.
`;
      break;

    case "instagram":
      reglas = `
Generate professional AI prompts for Instagram content.

Rules:
- Reels or posts.
- Visually attractive.
- Premium aesthetic.
- Cinematic composition.
- Optimized for AI image or video generation.
`;
      break;

    case "facebook":
      reglas = `
Generate professional AI prompts for Facebook content.

Rules:
- Engaging.
- Shareable.
- Realistic.
- Professional quality.
`;
      break;

    case "blog":
      reglas = `
Generate professional writing prompts for blog articles.

Rules:
- SEO oriented.
- Educational.
- Well structured.
- Professional writing.
`;
      break;

    default:
      reglas = `
Generate universal AI prompts.

Rules:
- Adaptable.
- Professional.
- High quality.
`;
  }

  const instruccionesCantidad = cantidad === 1
    ? `
Generate ONE prompt ONLY.

CRITICAL:
- Return exactly ONE prompt.
- Do NOT number the output.
- Do NOT generate alternatives.
- Do NOT generate multiple prompts.
- The entire response must contain only one prompt.
`
    : `
Generate EXACTLY ${cantidad} prompts.

CRITICAL:
- Return exactly ${cantidad} prompts.
- Number every prompt.
- Leave one blank line between prompts.

OUTPUT FORMAT:

1- Prompt...

2- Prompt...

3- Prompt...
`;

  const resultado = await ai(env, `
You are one of the world's best AI prompt engineers.

${instruccionesCantidad}

${reglas}

CRITICAL RULES:

- Return ONLY prompts.
- English only.
- Never write ideas.
- Never write stories.
- Never write scripts.
- Never write explanations.
- Never write titles.
- Never write introductions.
- Never write markdown.
- Never write instructions for a human.

Never start with:
Create
Make
Record
Show
Write

Never use words like:
trying
attempt
attempting
while
before
after
then
finally
because
but

Each prompt must describe ONE final scene or ONE complete writing objective depending on the selected category.

Every prompt must be professional and immediately usable by an AI.

${cantidad > 1 ? `
Leave ONE blank line between every prompt.
` : ""}

User request:

${tema}
`);

  return json({
    success: true,
    resultado
  });

}
// =====================================
// GUARDAR PROMT
// =====================================
async function guardarPrompts(data, env, json) {

  const contenido =
    data.contenido || "";

  const prompts = contenido
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  let guardados = 0;

  for (const prompt of prompts) {

    const nombre =
      `prompts/${Date.now()}-${guardados + 1}.txt`;

    await env.IMAGES.put(
      nombre,
      prompt
    );

    guardados++;

  }

  return json({
    mensaje: `✅ ${guardados} prompts guardados`
  });

}

//Generar Visuales 
async function generarVisualesPrompts(data, env, json) {

  const tema = data.tema || "";

  const ai = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      messages: [
        {
          role: "system",
          content: `
You are a world-class AI image prompt engineer.

Your job is to convert any user request into a professional image-generation prompt.

CRITICAL RULES:

- Return ONLY the final prompt.
- English only.
- Never explain anything.
- Never add titles.
- Never add numbering.
- Never add introductions.
- Never add markdown.
- Never ask questions.

PROMPT RULES:

- Preserve the user's original intent.
- Do not change the subject.
- Do not invent important objects, people or animals.
- If the user specifies text, letters, numbers or symbols, preserve them exactly.
- If the user specifies a style, preserve it.
- If no style is specified, choose the most appropriate style.
- Improve composition, lighting, colors, camera angle, realism and quality only when appropriate.
- Add useful artistic and photographic details without changing the request.
- Produce a single optimized prompt ready for Stable Diffusion XL, Flux, Midjourney or similar models.

Return ONLY the prompt.
`
        },
        {
          role: "user",
          content: `
Create visual AI prompts about:

${tema}
`
        }
      ]
    }
  );

  const resultado = ai.response;

  // Si se usa como función interna
  if (typeof json !== "function") {
    return resultado;
  }

  // Si se llama desde el endpoint /visual
  return json({
    success: true,
    resultado
  });

}
//GUARDAR Visuales 
async function guardarVisuales(data, env, json) {

  const contenido = data.contenido || "";

  const items = contenido
    .split(/\n(?=\d+-)/)
    .map(i => i.trim())
    .filter(Boolean);

  let guardados = 0;

  for (const item of items) {

    const nombre = `visuals/${Date.now()}-${guardados + 1}.txt`;

    await env.IMAGES.put(nombre, item);

    guardados++;
  }

  return json({
    mensaje: `✅ ${guardados} visual prompts guardados`
  });

}
//Generar guión 
async function generarGuion(data, env, json) {

  let reglas = "";

  switch ((data.formato || "").toLowerCase()) {

    case "automático":
      reglas = `
Choose automatically the best script style according to the topic.
`;
      break;

    case "tiktok / reels":
      reglas = `
Write a viral TikTok/Reels script.

Rules:
- Duration exactly as requested.
- Hook in first 3 seconds.
- Fast pacing.
- Short dialogue.
- Visual actions.
- Strong ending.
`;
      break;

    case "youtube":
      reglas = `
Write a YouTube video script.

Rules:
- Strong introduction.
- Clear structure.
- Development.
- Conclusion.
- Natural narration.
`;
      break;

    case "cinematográfico":
      reglas = `
Write a professional cinematic screenplay.

Rules:
- Divide into scenes.
- Camera directions.
- Character actions.
- Natural dialogue.
- Cinematic pacing.
`;
      break;

    case "podcast":
      reglas = `
Write a podcast script.

Rules:
- Conversational.
- Narration focused.
- Natural dialogue.
- Audio oriented.
`;
      break;

    case "novela":
      reglas = `
Write a novel chapter.

Rules:
- Narrative style.
- Rich descriptions.
- Character emotions.
- No screenplay format.
`;
      break;

    case "teatro":
      reglas = `
Write a theater play.

Rules:
- Characters.
- Dialogues.
- Stage directions.
- Theater format.
`;
      break;

    default:
      reglas = `
Choose automatically the best writing style.
`;
  }

  const ai = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      max_tokens: 3500,
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: `
You are PIXELLAB45 Script Engine.

Generate professional scripts.

${reglas}

GENERAL RULES:

- Return ONLY the script.
- Never explain.
- Never apologize.
- Never add markdown.
- Never add introductions.
- Never add conclusions.
- Respect exactly the requested duration.
- Be coherent from beginning to end.
`
        },
        {
          role: "user",
          content: `
Topic:
${data.tema}

Duration:
${data.duracion}
`
        }
      ]
    }
  );

  return json({
    success: true,
    resultado: ai.response
  });

}
//Guardar guion 
async function guardarGuion(data, env, json) {

  const contenido = data.contenido || "";

  if (!contenido.trim()) {

    return json({
      success: false,
      error: "Guion vacío"
    });

  }

  const nombre = `scripts/${Date.now()}.txt`;

  await env.IMAGES.put(
    nombre,
    contenido
  );

  return json({
    success: true,
    mensaje: "✅ Guion guardado correctamente"
  });

}
//Generar Storyboard 
// =====================================
// GENERAR STORYBOARD
// =====================================
async function generarStoryboard(data, env, json) {

  try {

    const guion = (data.guion || "").trim();
    const escenas = parseInt(data.escenas || "8");
    const estilo = (data.estilo || "Realista").trim();

    if (!guion) {
      return json({
        success: false,
        error: "Falta el guion"
      }, 400);
    }

    const prompt = `
You are an expert storyboard artist.

Convert the following script into a storyboard.

Generate EXACTLY ${escenas} scenes.

Visual style:
${estilo}

For each scene use exactly this format:

SCENE X

TIME:

NARRATION:

CAMERA:

LIGHTING:

VISUAL PROMPT:

SCRIPT:

Script:

${guion}
`;

    const resultado = await ai(env, prompt);

    return json({
      success: true,
      resultado
    });

  } catch (err) {

    return json({
      success: false,
      error: err.message || String(err)
    }, 500);

  }

}
// =====================================
// GUARDAR STORYBOARD
// =====================================
async function guardarStoryboard(data, env, json) {

  const contenido = data.contenido || "";

  if (!contenido.trim()) {

    return json({
      success: false,
      error: "Storyboard vacío"
    }, 400);

  }

  const nombre =
    `storyboards/${Date.now()}.txt`;

  await env.IMAGES.put(
    nombre,
    contenido
  );

  return json({
    success: true,
    mensaje: "✅ Storyboard guardado"
  });

}
//Generar imagen 
async function generarImagen(data, env,json) {
  try {
    const promptUsuario =
      (data.prompt || data.tema || "").trim();
    if (!promptUsuario) {

      return new Response(JSON.stringify({
        success: false,
        error: "Sin prompt"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });

    }
   

    // Obtener el prompt visual optimizado
    const promptVisual = await generarVisualesPrompts(
  {
    tema: promptUsuario
  },
  env
);
    const promptFinal = `
Generate exactly what is described below.

CRITICAL RULES:

- Do not change the subject.
- Do not invent new objects.
- Preserve any text, letters, numbers or symbols exactly as requested.
- High quality.
- Highly detailed.
- Sharp focus.
- Natural lighting unless another style is requested.

${promptVisual}
`;

    const imageBytes = await env.AI.run(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      {
        prompt: promptFinal
      }
    );
    
    return new Response(imageBytes, {
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*"
      }
    });
    

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });

  }

}

async function guardarImagen(data, env, json) {
console.log("Entró a guardarImagen");
console.log("Categoría:", data.categoria);
console.log("Base64 length:", data.imagen?.length);
  try {

    const categoria = data.categoria || "imagenes";
    const base64 = data.imagen || "";

    if (!base64) {
      return json({
        success: false,
        error: "Imagen no recibida"
      }, 400);
    }

    // Base64 → bytes
    const bytes = Uint8Array.from(
      atob(base64),
      c => c.charCodeAt(0)
    );

    const nombre =
      `${Date.now()}-${crypto.randomUUID()}.png`;

    await env.IMAGES.put(
      `${categoria}/${nombre}`,
      bytes,
      {
        httpMetadata: {
          contentType: "image/png"
        }
      }
    );

    return json({
      success: true,
      nombre,
      mensaje: "✅ Imagen guardada correctamente"
    });

  } catch (err) {

    return json({
      success: false,
      error: err.message || String(err)
    }, 500);

  }

}

// =====================================================
// PIXELLAB45 - EBOOK V3
// FUNCIÓN: generarPlanEbook()
// =====================================================
async function generarPlan(data, env) {
  const paginas = Number(data.paginas);
  const tema = data.tema;
  const autor = data.autor;

  // Generamos un ID único basado en el título
  const id = `${Date.now()}-${tema.replace(/\s+/g, "-").toLowerCase()}`;

  // Cálculo de capítulos (regla: 15 páginas promedio)
  let capitulos = Math.round(paginas / 15);
  if (capitulos < 3) capitulos = 3;

  const base = Math.floor(paginas / capitulos);
  let resto = paginas % capitulos;

  const capitulosOrdenados = [];

  for (let i = 0; i < capitulos; i++) {
    let paginasCap = base;
    if (resto > 0) {
      paginasCap++;
      resto--;
    }
    capitulosOrdenados.push({
      capitulo: i + 1,
      titulo: `Capítulo ${i + 1}`,
      paginas: paginasCap,
      descripcion: `Parte ${i + 1} del libro`
    });
  }

  const plan = {
    id: id,
    titulo: tema,
    nombre: autor,
    paginasTotales: paginas,
    cantidadCapitulos: capitulos,
    capitulos: capitulosOrdenados,
    metadatos: {
      creado: new Date().toISOString(),
      motor: "PIXELLAB45 eBook Engine",
      version: "1.0"
    }
  };

  // Guardar en R2 (bucket eBooks en mayúscula)
/*  const key = `eBooks/${id}.json`;

  await env.EBOOKS.put(key, JSON.stringify(plan), {
    httpMetadata: {
      contentType: "application/json"
    }
  });*/

  return new Response(JSON.stringify({
    ok: true,
    id: id,
    plan: plan
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
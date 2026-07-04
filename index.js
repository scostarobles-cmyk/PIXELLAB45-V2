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

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: CORS_HEADERS
      });
    }

    const json = (obj, status = 200) =>
      new Response(
        JSON.stringify(obj),
        {
          status,
          headers: CORS_HEADERS 
        }
      );

    let data = {};

    try {

      if (request.method === "POST") {
        data = await request.json();
      }

    } catch {

      return json({
        error: "JSON inválido"
      }, 400);

    }

    const tipo =
      data.action || "";
 
    switch (tipo) {

      case "listar-imagenes":
        return listarImagenes(
          env,
          json
        );

      case "listar-categoria":
        return listarCategoria(
          data.categoria,
          env,
          json
        );

      case "ideas":
        return generarIdeas(
          data,
          env,
          json
        );
        case "guardar-ideas":
              return guardarIdeas(
                 data,
                 env,
                json
            );
      case "prompt":
          return json({
               resultado: await generarPrompts(
               data.tema,
               data.formato,
               env
               )
            });
      case "guardar-prompts":
           return guardarPrompts(
          data,
          env,
         json
         );
  case "visual":
  return generarVisualesPrompts(
    data.tema,
    env,
    json
  );
  case "guardar-visuales":
  return guardarVisuales(
    data,
    env,
    json
  );
case "script":
  return generarGuion(
    data,
    env,
    json
  );
  case "guardar-guion":
  return guardarGuion(
    data,
    env,
    json
  );
  case "storyboard":
  return generarStoryboard(
    data,
    env,
    json
  );
  case "guardar-storyboard":
  return guardarStoryboard(
    data,
    env,
    json
  );
  case "imagen":
  return generarImagen(
    data,
    env
  );

case "guardar-imagen":
  return guardarImagen(
    data,
    env
  );
case "planificar-ebook":
  const result = await planificarEbook(data, env);
  console.log(result);
  return json({
    ok: true,
    data: result.data
  });
default:
  return json({
    ok: false,
    error: "Tipo no válido: " + tipo
  }, 400);

} // ← FIN DEL SWITCH

} // ← FIN DE fetch()

}; // ← FIN DE export default

async function guardarEbook(data, env, json) {

  try {

    const ebook = data.ebook;

    if (!ebook) {
      return json({ ok: false, error: "Falta ebook" }, 400);
    }

    const id = ebook.id || crypto.randomUUID();

    const ebookFinal = {
      ...ebook,
      id,
      fechaGuardado: new Date().toISOString()
    };

    const nombreArchivo = `ebook-proyectos/${id}.json`;

    await env.IMAGES.put(
      nombreArchivo,
      JSON.stringify(ebookFinal),
      {
        httpMetadata: {
          contentType: "application/json"
        }
      }
    );

    return json({
      ok: true,
      id,
      archivo: nombreArchivo
    });

  } catch (err) {

    return json({
      ok: false,
      error: err.message
    }, 500);
  }
}

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

  return res.response;

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

async function listarCategoria(
  categoria,
  env,
  json
) {

  const lista =
    await env.IMAGES.list({
      prefix: categoria + "/"
    });

  const imagenes =
    lista.objects.map(obj => ({
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
// GENERAR PROMPTS
// =====================================
async function generarPrompts(tema, formato, env) {

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

  if ((formato || "").toLowerCase() === "ebook") {

    return await ai(env, `
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
  }

  // =====================================
  // RESTO DE FORMATOS
  // =====================================

  let reglas = "";

  switch ((formato || "").toLowerCase()) {

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

  const resultado = await ai(
    env,
`
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
`
  );

  return resultado;
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
async function generarVisualesPrompts(tema, env, json = null) {

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

  if (json) {
  return json({
    resultado: ai.response
  });
}

return ai.response;

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
    resultado: ai.response
  });

}
//Guardar guion 
async function guardarGuion(data, env, json) {

  const contenido =
    data.contenido || "";

  const nombre =
    `scripts/${Date.now()}.txt`;

  await env.IMAGES.put(
    nombre,
    contenido
  );

  return json({
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
        ok: false,
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
      ok: true,
      resultado
    });

  } catch (err) {

    return json({
      ok: false,
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
      ok: false,
      error: "Storyboard vacío"
    }, 400);
  }

  const nombre = `storyboards/${Date.now()}.txt`;

  await env.IMAGES.put(nombre, contenido);

  return json({
    ok: true,
    mensaje: "✅ Storyboard guardado"
  });

}
//Generar imagen 
async function generarImagen(data, env) {

  try {

    const promptUsuario =
      (data.prompt || data.tema || "").trim();

    if (!promptUsuario) {

      return new Response(JSON.stringify({
        ok: false,
        error: "Sin prompt"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });

    }

    // Obtener el prompt profesional desde Visuales
    const promptVisual =
      await generarVisualesPrompts(
        promptUsuario,
        env
      );

    // Reglas específicas para Stable Diffusion
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
      ok: false,
      error: err.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });

  }

}

async function guardarImagen(data, env) {

  try {

    const categoria = data.categoria || "imagenes";
    const base64 = data.imagen;

    if (!base64) {
      return new Response(JSON.stringify({
  ok: false,
  error: "Imagen no recibida"
}), {
  status: 400,
  headers: CORS_HEADERS
});
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

    return new Response(JSON.stringify({
  ok: true,
  nombre
}), {
  headers: CORS_HEADERS
});

  } catch (err) {

    return new Response(JSON.stringify({
  ok: false,
  error: err.message
}), {
  status: 500,
  headers: CORS_HEADERS
});

  }

}


// =====================================
// BLOQUE 2 V2
// CREAR PROYECTO EBOOK
// =====================================

async function crearProyectoEbook(data, env, json) {

  try {

    const tema = (data.tema || "").trim();
    const paginas = parseInt(data.paginas || 30);

    if (!tema) {
      return json({
        ok: false,
        error: "Debe indicar un tema."
      }, 400);
    }

    // =====================================
    // PROMPT ENGINE
    // =====================================

    const concepto = await generarPrompts(
      tema,
      "ebook",
      env
    );

    // =====================================
    // PLANIFICACIÓN
    // =====================================

    const plan = planificarEbook(paginas);

    // =====================================
    // ÍNDICE
    // =====================================

    const indice = await generarIndice(
      concepto,
      plan,
      env
    );

    // =====================================
    // COPIAR DATOS DEL ÍNDICE AL PLAN
    // =====================================

    if (
      indice.indice &&
      Array.isArray(indice.indice)
    ) {

      indice.indice.forEach((cap, i) => {

        if (!plan.estructura[i]) return;

        plan.estructura[i].titulo =
          cap.titulo || "";

        plan.estructura[i].objetivo =
          cap.objetivo || "";

      });

    }

    // =====================================
    // ID DEL PROYECTO
    // =====================================

    const proyectoId =
      crypto.randomUUID();

    // =====================================
    // OBJETO DEL PROYECTO
    // =====================================

    const proyecto = {

      version: 2,

      id: proyectoId,

      estado: "creado",

      temaOriginal: tema,

      concepto,

      titulo:
        indice.titulo || tema,

      subtitulo:
        indice.subtitulo || "",

      descripcion:
        indice.descripcion || "",

      categoria:
        indice.categoria || "",

      keywords:
        indice.keywords || [],

      fechaCreacion:
        new Date().toISOString(),

      plan,

      indice,

      introduccion: null,

      conclusion: null,

      legales: `
Todos los derechos reservados.

Queda prohibida la reproducción total o parcial.

Contenido generado por PIXELLAB45 IA.
`.trim(),

      capitulos: {},

      progreso: {

        introduccion: false,

        capitulos: 0,

        conclusion: false,

        ensamblado: false,

        porcentaje: 0

      }

    };

    // =====================================
    // GUARDAR PROYECTO
    // =====================================

    await env.IMAGES.put(

      `ebook-proyectos/${proyectoId}.json`,

      JSON.stringify(
        proyecto,
        null,
        2
      ),

      {

        httpMetadata: {

          contentType:
            "application/json"

        }

      }

    );

    return json({

      ok: true,

      proyecto: proyectoId,

      titulo:
        proyecto.titulo,

      capitulos:
        plan.capitulos,

      paginas:
        plan.paginasTotales,

      estado:
        proyecto.estado

    });

  }

  catch (err) {

    return json({

      ok: false,

      error: err.message,

      stack: err.stack

    }, 500);

  }

}
// =====================================
// BLOQUE 2 V2
// CARGAR PROYECTO EBOOK
// =====================================

async function cargarProyectoEbook(data, env, json) {

  try {

    const proyectoId = (data.proyecto || "").trim();

    if (!proyectoId) {
      return json({
        ok: false,
        error: "Falta el ID del proyecto."
      }, 400);
    }

    const objeto = await env.IMAGES.get(
      `ebook-proyectos/${proyectoId}.json`
    );

    if (!objeto) {
      return json({
        ok: false,
        error: "Proyecto no encontrado."
      }, 404);
    }

    const proyecto = await objeto.json();

    return json({
      ok: true,
      proyecto
    });

  } catch (err) {

    return json({
      ok: false,
      error: err.message,
      stack: err.stack
    }, 500);

  }

}

// =====================================
// BLOQUE 2 V2
// GUARDAR PROYECTO EBOOK
// =====================================

async function guardarProyectoEbook(proyecto, env) {

  await env.IMAGES.put(

    `ebook-proyectos/${proyecto.id}.json`,

    JSON.stringify(
      proyecto,
      null,
      2
    ),

    {
      httpMetadata: {
        contentType: "application/json"
      }
    }

  );

}

// =====================================
// BLOQUE 2 V2
// ACTUALIZAR PROGRESO
// =====================================

function actualizarProgresoProyecto(proyecto) {

  const total = proyecto.plan.capitulos;

  let completados = 0;

  for (const cap of proyecto.plan.estructura) {

    if (cap.estado === "completo") {
      completados++;
    }

  }

  proyecto.plan.progreso.completados = completados;

  proyecto.plan.progreso.porcentaje =
    Math.round((completados / total) * 100);

  proyecto.progreso.capitulos = completados;

  proyecto.progreso.porcentaje =
    proyecto.plan.progreso.porcentaje;

  if (completados >= total) {
    proyecto.estado = "capitulos_completos";
  }

  return proyecto;

}
// =====================================
// BLOQUE 2 V2
// GENERAR UN CAPÍTULO POR PETICIÓN
// =====================================

async function generarCapituloProyecto(data, env, json) {

  try {

    const proyectoId = (data.proyecto || "").trim();

    const numeroCapitulo =
      parseInt(data.capitulo);

    if (!proyectoId) {

      return json({
        ok: false,
        error: "Falta el proyecto."
      }, 400);

    }

    if (isNaN(numeroCapitulo)) {

      return json({
        ok: false,
        error: "Capítulo inválido."
      }, 400);

    }

    // ===============================
    // CARGAR PROYECTO
    // ===============================

    const objeto = await env.IMAGES.get(
      `ebook-proyectos/${proyectoId}.json`
    );

    if (!objeto) {

      return json({
        ok: false,
        error: "Proyecto no encontrado."
      }, 404);

    }

    const proyecto = await objeto.json();

    const info =
      proyecto.plan.estructura.find(
        c => c.numero === numeroCapitulo
      );

    if (!info) {

      return json({
        ok: false,
        error: "Capítulo inexistente."
      }, 404);

    }

    if (info.estado === "completo") {

      return json({
        ok: true,
        mensaje: "El capítulo ya fue generado.",
        capitulo: numeroCapitulo,
        archivo: info.archivo
      });

    }

    // ===============================
    // CONTEXTO
    // ===============================

    let contexto = "";

    if (numeroCapitulo > 1) {

      const anterior =
        proyecto.capitulos[
          numeroCapitulo - 1
        ];

      if (anterior) {

        contexto =
          anterior.substring(
            Math.max(
              0,
              anterior.length - 4000
            )
          );

      }

    }

    // ===============================
    // GENERAR
    // ===============================

    const contenido =
      await generarCapitulo(

        proyecto.concepto,

        proyecto.indice,

        numeroCapitulo,

        contexto,

        proyecto.plan,

        env

      );

    // ===============================
    // GUARDAR CAPÍTULO
    // ===============================

    const ruta =
      `ebook-proyectos/${proyecto.id}/capitulo-${numeroCapitulo}.txt`;

    await env.IMAGES.put(

      ruta,

      contenido,

      {

        httpMetadata: {

          contentType: "text/plain"

        }

      }

    );

    proyecto.capitulos[
      numeroCapitulo
    ] = contenido;

    info.estado = "completo";

    info.archivo = ruta;

    actualizarProgresoProyecto(
      proyecto
    );

    await guardarProyectoEbook(
      proyecto,
      env
    );

    return json({

      ok: true,

      proyecto:
        proyecto.id,

      capitulo:
        numeroCapitulo,

      progreso:
        proyecto.plan.progreso,

      archivo:
        ruta

    });

  }

  catch (err) {

    return json({

      ok: false,

      error:
        err.message,

      stack:
        err.stack

    }, 500);

  }

}
// =====================================
// BLOQUE 2 V2
// OBTENER SIGUIENTE CAPÍTULO PENDIENTE
// =====================================

async function siguienteCapituloProyecto(data, env, json) {

  try {

    const proyectoId = (data.proyecto || "").trim();

    if (!proyectoId) {

      return json({
        ok: false,
        error: "Falta el ID del proyecto."
      }, 400);

    }

    const objeto = await env.IMAGES.get(
      `ebook-proyectos/${proyectoId}.json`
    );

    if (!objeto) {

      return json({
        ok: false,
        error: "Proyecto no encontrado."
      }, 404);

    }

    const proyecto = await objeto.json();

    const pendiente = proyecto.plan.estructura.find(
      c => c.estado !== "completo"
    );

    if (!pendiente) {

      proyecto.estado = "capitulos_completos";

      await guardarProyectoEbook(
        proyecto,
        env
      );

      return json({

        ok: true,

        terminado: true,

        proyecto: proyecto.id,

        mensaje: "Todos los capítulos fueron generados."

      });

    }

    return json({

      ok: true,

      terminado: false,

      proyecto: proyecto.id,

      capitulo: pendiente.numero,

      titulo: pendiente.titulo,

      objetivo: pendiente.objetivo,

      paginas: pendiente.paginas

    });

  }

  catch (err) {

    return json({

      ok: false,

      error: err.message,

      stack: err.stack

    }, 500);

  }

}

// =====================================
// BLOQUE 2 V2
// ELIMINAR PROYECTO
// =====================================

async function eliminarProyectoEbook(data, env, json) {

  try {

    const proyectoId = (data.proyecto || "").trim();

    if (!proyectoId) {

      return json({
        ok: false,
        error: "Falta el ID del proyecto."
      }, 400);

    }

    const objeto = await env.IMAGES.get(
      `ebook-proyectos/${proyectoId}.json`
    );

    if (!objeto) {

      return json({
        ok: false,
        error: "Proyecto no encontrado."
      }, 404);

    }

    const proyecto = await objeto.json();

    for (const cap of proyecto.plan.estructura) {

      if (cap.archivo) {

        await env.IMAGES.delete(
          cap.archivo
        );

      }

    }

    await env.IMAGES.delete(
      `ebook-proyectos/${proyectoId}.json`
    );

    return json({

      ok: true,

      mensaje: "Proyecto eliminado correctamente."

    });

  }

  catch (err) {

    return json({

      ok: false,

      error: err.message,

      stack: err.stack

    }, 500);

  }

}

// =====================================
// BLOQUE 3 V2
// EDITOR IA DE CAPÍTULOS
// =====================================

async function editarCapituloIA(data, env, json) {

  try {

    const proyectoId = (data.proyecto || "").trim();
    const numeroCapitulo = parseInt(data.capitulo);
    const modo = (data.modo || "mejorar").trim(); 
    const instruccionExtra = (data.instruccion || "").trim();

    if (!proyectoId) {
      return json({ ok: false, error: "Falta proyecto" }, 400);
    }

    if (isNaN(numeroCapitulo)) {
      return json({ ok: false, error: "Capítulo inválido" }, 400);
    }

    const objeto = await env.IMAGES.get(
      `ebook-proyectos/${proyectoId}.json`
    );

    if (!objeto) {
      return json({ ok: false, error: "Proyecto no encontrado" }, 404);
    }

    const proyecto = await objeto.json();

    const capitulo = proyecto.capitulos[numeroCapitulo];

    if (!capitulo) {
      return json({ ok: false, error: "Capítulo no existe" }, 404);
    }

    // =====================================
    // PROMPT DE EDICIÓN
    // =====================================

    let prompt = "";

    if (modo === "mejorar") {

      prompt = `
You are a professional book editor.

Improve the following chapter WITHOUT changing its meaning.

Rules:
- Keep original language (Spanish)
- Do not add new topics
- Do not remove important content
- Improve clarity, flow, grammar and structure
- Make it more readable and professional
- Do NOT summarize

CHAPTER:
${capitulo}
`;

    }

    else if (modo === "expandir") {

      prompt = `
You are a professional book writer.

Expand the following chapter with more depth.

Rules:
- Keep original language (Spanish)
- Do not change original meaning
- Add explanations, examples and detail
- Maintain coherence
- Do NOT repeat content

CHAPTER:
${capitulo}
`;

    }

    else if (modo === "corregir") {

      prompt = `
You are a professional editor.

Correct grammar, spelling and structure.

Rules:
- Do not change meaning
- Fix errors only
- Improve readability

CHAPTER:
${capitulo}
`;

    }

    else if (modo === "custom") {

      prompt = `
You are a professional book editor.

Edit the chapter following this instruction:

INSTRUCTION:
${instruccionExtra}

CHAPTER:
${capitulo}
`;

    }

    // =====================================
    // IA
    // =====================================

    const resultado = await ai(env, prompt);

    // =====================================
    // GUARDAR
    // =====================================

    proyecto.capitulos[numeroCapitulo] = resultado;

    await guardarProyectoEbook(proyecto, env);

    return json({
      ok: true,
      proyecto: proyectoId,
      capitulo: numeroCapitulo,
      modo,
      resultado
    });

  }

  catch (err) {

    return json({
      ok: false,
      error: err.message,
      stack: err.stack
    }, 500);

  }

}

// =====================================
// BLOQUE 4 V2
// TRADUCTOR IA DE CAPÍTULOS
// =====================================

async function traducirCapituloIA(data, env, json) {

  try {

    const proyectoId = (data.proyecto || "").trim();
    const numeroCapitulo = parseInt(data.capitulo);
    const idioma = (data.idioma || "ingles").trim();

    if (!proyectoId) {
      return json({ ok: false, error: "Falta proyecto" }, 400);
    }

    if (isNaN(numeroCapitulo)) {
      return json({ ok: false, error: "Capítulo inválido" }, 400);
    }

    const objeto = await env.IMAGES.get(
      `ebook-proyectos/${proyectoId}.json`
    );

    if (!objeto) {
      return json({ ok: false, error: "Proyecto no encontrado" }, 404);
    }

    const proyecto = await objeto.json();

    const capitulo = proyecto.capitulos[numeroCapitulo];

    if (!capitulo) {
      return json({ ok: false, error: "Capítulo no existe" }, 404);
    }

    // =====================================
    // PROMPT DE TRADUCCIÓN
    // =====================================

    const prompt = `
You are a professional translator.

Translate the following chapter.

Rules:
- Preserve meaning exactly
- Do not summarize
- Do not add explanations
- Keep formatting as plain text
- Translate into: ${idioma}

CHAPTER:
${capitulo}
`;

    // =====================================
    // IA
    // =====================================

    const resultado = await ai(env, prompt);

    // =====================================
    // GUARDAR TRADUCCIÓN
    // =====================================

    if (!proyecto.traducciones) {
      proyecto.traducciones = {};
    }

    if (!proyecto.traducciones[numeroCapitulo]) {
      proyecto.traducciones[numeroCapitulo] = {};
    }

    proyecto.traducciones[numeroCapitulo][idioma] = resultado;

    await guardarProyectoEbook(proyecto, env);

    return json({
      ok: true,
      proyecto: proyectoId,
      capitulo: numeroCapitulo,
      idioma,
      resultado
    });

  }

  catch (err) {

    return json({
      ok: false,
      error: err.message,
      stack: err.stack
    }, 500);

  }

}

// =====================================
// BLOQUE 5 V2
// GENERADOR DE IMÁGENES PARA CAPÍTULOS
// =====================================

async function generarImagenCapitulo(data, env, json) {

  try {

    const proyectoId = (data.proyecto || "").trim();
    const numeroCapitulo = parseInt(data.capitulo);
    const estilo = (data.estilo || "cinematic").trim();

    if (!proyectoId) {
      return json({ ok: false, error: "Falta proyecto" }, 400);
    }

    if (isNaN(numeroCapitulo)) {
      return json({ ok: false, error: "Capítulo inválido" }, 400);
    }

    const objeto = await env.IMAGES.get(
      `ebook-proyectos/${proyectoId}.json`
    );

    if (!objeto) {
      return json({ ok: false, error: "Proyecto no encontrado" }, 404);
    }

    const proyecto = await objeto.json();

    const capitulo = proyecto.capitulos[numeroCapitulo];

    const info = proyecto.plan.estructura.find(
      c => c.numero === numeroCapitulo
    );

    if (!capitulo || !info) {
      return json({ ok: false, error: "Capítulo no existe" }, 404);
    }

    // =====================================
    // PROMPT VISUAL
    // =====================================

    const prompt = `
You are an expert cinematic prompt engineer.

Create a high-quality AI image prompt based on this chapter.

Rules:
- English only
- Cinematic, ultra-detailed
- No text in image
- No logos
- No watermark
- Focus on visual storytelling
- Based ONLY on chapter content

STYLE:
${estilo}

CHAPTER TITLE:
${info.titulo}

CHAPTER CONTENT:
${capitulo.substring(0, 3000)}

Return ONLY the image prompt.
`;

    const visualPrompt = await ai(env, prompt);

    // =====================================
    // GUARDAR PROMPT
    // =====================================

    const rutaPrompt =
      `ebook-proyectos/${proyectoId}/imagenes/capitulo-${numeroCapitulo}.txt`;

    await env.IMAGES.put(
      rutaPrompt,
      visualPrompt,
      {
        httpMetadata: {
          contentType: "text/plain"
        }
      }
    );

    // =====================================
    // (OPCIONAL) SI TENÉS GENERADOR DE IMAGEN
    // =====================================

    let imagenUrl = null;

    if (env.AI_IMAGE) {

      const img = await env.AI_IMAGE.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        {
          prompt: visualPrompt
        }
      );

      imagenUrl = img?.image || null;
    }

    // =====================================
    // GUARDAR EN PROYECTO
    // =====================================

    if (!proyecto.imagenes) {
      proyecto.imagenes = {};
    }

    proyecto.imagenes[numeroCapitulo] = {
      prompt: visualPrompt,
      url: imagenUrl,
      estilo
    };

    await guardarProyectoEbook(proyecto, env);

    return json({
      ok: true,
      proyecto: proyectoId,
      capitulo: numeroCapitulo,
      prompt: visualPrompt,
      imagen: imagenUrl
    });

  }

  catch (err) {

    return json({
      ok: false,
      error: err.message,
      stack: err.stack
    }, 500);

  }

}

// =====================================
// BLOQUE 6 V2
// ENSAMBLADOR FINAL DEL EBOOK
// =====================================

async function ensamblarEbookV2(data, env, json) {

  try {

    const proyectoId = (data.proyecto || "").trim();

    if (!proyectoId) {
      return json({ ok: false, error: "Falta proyecto" }, 400);
    }

    const objeto = await env.IMAGES.get(
      `ebook-proyectos/${proyectoId}.json`
    );

    if (!objeto) {
      return json({ ok: false, error: "Proyecto no encontrado" }, 404);
    }

    const proyecto = await objeto.json();

    // =====================================
    // VALIDACIÓN FINAL
    // =====================================

    const total = proyecto.plan.capitulos;

    for (let i = 1; i <= total; i++) {

      if (!proyecto.capitulos[i]) {
        return json({
          ok: false,
          error: `Falta el capítulo ${i}`
        }, 400);
      }

    }

    // =====================================
    // INTRODUCCIÓN Y CONCLUSIÓN (si faltan)
    // =====================================

    if (!proyecto.introduccion) {

      proyecto.introduccion = await generarIntroduccion(
        proyecto.concepto,
        proyecto.indice,
        env
      );

    }

    if (!proyecto.conclusion) {

      proyecto.conclusion = await generarConclusion(
        proyecto.concepto,
        proyecto.indice,
        env
      );

    }

    // =====================================
    // ENSAMBLADO FINAL
    // =====================================

    let ebook = "";

    // METADATOS
    ebook += "METADATOS\n\n";
    ebook += JSON.stringify({
      titulo: proyecto.titulo,
      subtitulo: proyecto.subtitulo,
      descripcion: proyecto.descripcion,
      categoria: proyecto.categoria,
      fecha: proyecto.fechaCreacion,
      version: "V2"
    }, null, 2) + "\n\n";

    ebook += "====================================\n\n";

    // INTRODUCCIÓN
    ebook += "INTRODUCCIÓN\n\n";
    ebook += proyecto.introduccion + "\n\n";
    ebook += "====================================\n\n";

    // CAPÍTULOS
    for (let i = 1; i <= total; i++) {

      const cap = proyecto.plan.estructura.find(
        c => c.numero === i
      );

      ebook += `CAPÍTULO ${i}: ${cap?.titulo || ""}\n\n`;
      ebook += proyecto.capitulos[i] + "\n\n";
      ebook += "------------------------------------\n\n";

    }

    // CONCLUSIÓN
    ebook += "CONCLUSIÓN\n\n";
    ebook += proyecto.conclusion + "\n\n";

    // =====================================
    // GUARDAR EBOOK FINAL
    // =====================================

    const ruta =
      `Ebook/final-${proyectoId}.txt`;

    await env.IMAGES.put(
      ruta,
      ebook,
      {
        httpMetadata: {
          contentType: "text/plain"
        }
      }
    );

    proyecto.estado = "finalizado";
    proyecto.ebookFinal = ruta;

    await guardarProyectoEbook(proyecto, env);

    return json({
      ok: true,
      proyecto: proyectoId,
      estado: "finalizado",
      archivo: ruta,
      paginas: proyecto.plan.paginasTotales
    });

  }

  catch (err) {

    return json({
      ok: false,
      error: err.message,
      stack: err.stack
    }, 500);

  }

}// =====================================
// BLOQUE 7 V2
// EXPORTADORES (TXT, JSON, HTML)
// =====================================

async function exportarEbookV2(data, env, json) {

  try {

    const proyectoId = (data.proyecto || "").trim();
    const formato = (data.formato || "txt").toLowerCase();

    if (!proyectoId) {
      return json({ ok: false, error: "Falta proyecto" }, 400);
    }

    const objeto = await env.IMAGES.get(
      `ebook-proyectos/${proyectoId}.json`
    );

    if (!objeto) {
      return json({ ok: false, error: "Proyecto no encontrado" }, 404);
    }

    const proyecto = await objeto.json();

    if (!proyecto.ebookFinal) {
      return json({
        ok: false,
        error: "El ebook aún no fue ensamblado"
      }, 400);
    }

    const ebookObj = await env.IMAGES.get(
      proyecto.ebookFinal
    );

    if (!ebookObj) {
      return json({
        ok: false,
        error: "Archivo final no encontrado"
      }, 404);
    }

    const contenido = await ebookObj.text();

    // =====================================
    // EXPORTACIÓN TXT
    // =====================================

    if (formato === "txt") {

      return new Response(contenido, {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition":
            `attachment; filename="${proyectoId}.txt"`
        }
      });

    }

    // =====================================
    // EXPORTACIÓN JSON
    // =====================================

    if (formato === "json") {

      return json({
        ok: true,
        proyecto: proyectoId,
        ebook: contenido
      });

    }

    // =====================================
    // EXPORTACIÓN HTML
    // =====================================

    if (formato === "html") {

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${proyecto.titulo}</title>
  <style>
    body {
      font-family: Arial;
      max-width: 900px;
      margin: auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1, h2 {
      color: #333;
    }
    pre {
      white-space: pre-wrap;
    }
  </style>
</head>
<body>

<h1>${proyecto.titulo}</h1>
<h3>${proyecto.subtitulo || ""}</h3>

<pre>${contenido}</pre>

</body>
</html>
      `;

      return new Response(html, {
        headers: {
          "Content-Type": "text/html"
        }
      });

    }

    return json({
      ok: false,
      error: "Formato no soportado"
    }, 400);

  }

  catch (err) {

    return json({
      ok: false,
      error: err.message,
      stack: err.stack
    }, 500);

  }

}



async function generarIndice(concepto, plan, env) {

  if (!concepto || !plan) {
    throw new Error("Falta tema o plan del ebook");
  }

  const prompt = `
Eres un experto en estructuración de libros en español.

Tu tarea es crear el índice completo de un ebook.

REGLAS ESTRICTAS:
- TODO en español neutro
- Devuelve SOLO JSON válido
- Sin texto extra

FORMATO:

{
  "titulo": "",
  "subtitulo": "",
  "descripcion": "",
  "categoria": "",
  "keywords": [],
  "indice": [
    {
      "capitulo": 1,
      "titulo": "",
      "objetivo": ""
    }
  ]
}

REGLAS:
- EXACTAMENTE ${plan.capitulos} capítulos
- Progresión lógica del tema: "${concepto}"
- No repetir ideas

`;

  const response = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      messages: [
        {
          role: "system",
          content: "Devuelve SOLO JSON válido en español."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 2500
    }
  );

  const raw = response.response;

  const match = raw.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("JSON inválido en índice");
  }

  return JSON.parse(match[0]);
}

async function listarEbooks(env, json) {

  const lista = await env.IMAGES.list({ prefix: "ebook-proyectos/" });

  const ebooks = lista.objects.map(obj => ({
    id: obj.key,
    nombre: obj.key.replace("ebook-proyectos/", "")
  }));

  return json({
    ok: true,
    ebooks
  });
}

// =====================================================
// PIXELLAB45 - EBOOK V3
// FUNCIÓN: planificarEbook()
// RESPONSABILIDAD:
// Diseñar la estructura del ebook.
// NO genera contenido.
// =====================================================

async function planificarEbook(data, env) {

  try {

    const {
      tema,
      paginas,
      idioma = "es",
      tono = "Profesional",
      publico = "General",
      autor = "PIXELLAB45"
    } = data;

    if (!tema)
      throw new Error("Falta el tema.");

    if (!paginas || paginas < 10)
      throw new Error("Cantidad de páginas inválida.");

    const prompt = `
Eres un editor profesional.

Diseña únicamente el PLAN de un ebook.

NO escribas contenido.

Devuelve EXCLUSIVAMENTE JSON válido.

Tema:
${tema}

Páginas:
${paginas}

Idioma:
${idioma}

Tono:
${tono}

Público:
${publico}

Calcula automáticamente:

- cantidad de capítulos
- páginas por capítulo
- título de cada capítulo
- objetivo de cada capítulo

Formato:

{
  "capitulos":[
    {
      "numero":1,
      "titulo":"",
      "objetivo":"",
      "paginas":0
    }
  ]
}
`;
   
   const respuesta = await AI(prompt, env);

    if (!respuesta?.capitulos)
      throw new Error("AI devolvió un plan inválido.");

    const plan = {

      version:3,

      id: crypto.randomUUID(),

      estado:"planificado",

      fechaCreacion:new Date().toISOString(),

      autor,

      tema,

      idioma,

      tono,

      publico,

      paginasTotales: paginas,

      capitulos: respuesta.capitulos.length,

      paginasPorCapitulo: Math.floor(
        paginas / respuesta.capitulos.length
      ),

      estructura: respuesta.capitulos.map(c => ({
        numero: c.numero,
        titulo: c.titulo,
        objetivo: c.objetivo,
        paginas: c.paginas,
        estado:"pendiente"
      }))

    };

    return {
      ok:true,
      data:plan
    };

  }
  catch(error){

    return{
      ok:false,
      error:error.message
    };

  }

}
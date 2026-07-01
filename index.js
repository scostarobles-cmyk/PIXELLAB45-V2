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
      data.tipo || "";

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
  case "ebook":
  return generarEbook(data, env, json);
  case "listar-ebooks":
  return await listarEbooks(env, json);
  case "cargar-ebook":
  return await cargarEbook(data, env, json);
  case "ebookPlan":
  return await generarEbookPlan(data, env, json);


return json({
    ok:true,
    introduccion:intro
});
default:
  return json({
    ok: false,
    error: "Tipo no válido: " + tipo
  }, 400);

} // ← FIN DEL SWITCH

} // ← FIN DE fetch()

}; // ← FIN DE export default

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
// GENERAR PROMT
// =====================================
async function generarPrompts(tema, formato, env) {

  const match = tema.match(/\d+/);

  let cantidad = match
    ? parseInt(match[0])
    : 1;

  if (cantidad > 20)
    cantidad = 20;

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

    case "ebook":
  reglas = `
Keep the user's topic exactly.
Do not change the title.
Return one optimized ebook prompt.
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

  const resultado = await ai(
    env,
`
You are one of the world's best AI prompt engineers.

Generate EXACTLY ${cantidad} prompts.

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
- Never start with:
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

Leave ONE blank line between every prompt.

OUTPUT FORMAT:

1- Prompt...

2- Prompt...

3- Prompt...

Topic:

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
// BLOQUE 1
// PLANIFICADOR DEL EBOOK
// =====================================

function planificarEbook(paginas) {

  paginas = parseInt(paginas || 30, 10);

  if (isNaN(paginas))
    paginas = 30;

  if (paginas < 5)
    paginas = 5;

  if (paginas > 200)
    paginas = 200;

  const paginasFijas = {
    portada: 1,
    legales: 1,
    indice: 1,
    introduccion: 1,
    conclusion: 1
  };

  const paginasDisponibles =
    Math.max(
      1,
      paginas -
      paginasFijas.portada -
      paginasFijas.legales -
      paginasFijas.indice -
      paginasFijas.introduccion -
      paginasFijas.conclusion
    );

  let capitulos;

  if (paginas <= 10)
    capitulos = 4;
  else if (paginas <= 20)
    capitulos = 6;
  else if (paginas <= 40)
    capitulos = 8;
  else if (paginas <= 60)
    capitulos = 10;
  else if (paginas <= 100)
    capitulos = 12;
  else if (paginas <= 150)
    capitulos = 15;
  else
    capitulos = 18;

  const paginasPorCapitulo =
    Math.max(
      2,
      Math.floor(
        paginasDisponibles / capitulos
      )
    );

  const estructura = [];

  for (let i = 1; i <= capitulos; i++) {

    estructura.push({
      numero: i,
      titulo: "",
      paginas: paginasPorCapitulo
    });

  }

  return {

    paginasTotales: paginas,

    paginasDisponibles,

    capitulos,

    paginasPorCapitulo,

    portada: paginasFijas.portada,

    legales: paginasFijas.legales,

    indice: paginasFijas.indice,

    introduccion: paginasFijas.introduccion,

    conclusion: paginasFijas.conclusion,

    estructura

  };

}
// =====================================
// BLOQUE 2
// GENERADOR DE ÍNDICE ESTRUCTURADO
// =====================================

async function generarIndice(concepto, plan, env) {

  if (!concepto || !plan) {
    throw new Error("Falta tema o plan del ebook");
  }

  const prompt = `
Eres un experto en estructuración de libros en español.

Tu tarea es crear el índice completo de un ebook.

REGLAS ESTRICTAS:
- TODO debe estar en español neutro.
- No uses inglés en ninguna parte.
- No inventes temas fuera del concepto.
- No repitas capítulos ni ideas.
- No agregues texto fuera del JSON.
- Devuelve SOLO JSON válido.

ESTRUCTURA OBLIGATORIA:

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

REGLAS DEL ÍNDICE:
- Debe tener EXACTAMENTE ${plan.capitulos} capítulos.
- Cada capítulo debe avanzar lógicamente del anterior.
- El contenido debe estar estrictamente relacionado con el tema: "${concepto}".
- No mezclar subtemas aleatorios.
- No repetir títulos ni ideas.
- Mantener enfoque educativo y progresivo.

INFORMACIÓN DEL LIBRO:
Tema: ${concepto}
Páginas totales: ${plan.paginasTotales}
Capítulos: ${plan.capitulos}
Páginas por capítulo: ${plan.paginasPorCapitulo}
`;

  const response = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      messages: [
        {
          role: "system",
          content: `
Eres un generador estricto de estructuras de libros.
Solo respondes en español.
Solo devuelves JSON válido.
No explicas nada.
No agregas texto fuera del JSON.
`
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

  try {

    const raw = response.response;

    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON generado");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed;

  } catch (err) {

    throw new Error("Error parseando índice: " + err.message);

  }
}
// =====================================
// BLOQUE 3
// GENERADOR DE INTRODUCCIÓN
// =====================================

async function generarIntroduccion(concepto, indice, env) {

  if (!concepto || !indice) {
    throw new Error("Falta tema o índice para la introducción");
  }

  const prompt = `
You are a professional book writer.

Write ONLY the introduction of an ebook.

CRITICAL RULES:
- Return ONLY the introduction text.
- No titles.
- No markdown.
- No explanations.
- No chapter content.
- No conclusions.

The introduction must:
- Present the topic clearly.
- Be engaging.
- Prepare the reader for the book.
- Be 1 to 3 paragraphs max.

BOOK INFO:
Topic: ${concepto}

INDEX (for context only):
${JSON.stringify(indice, null, 2)}
`;

  const response = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      messages: [
      {
  role: "system",
  content: `
You are a professional book writing engine.
You ALWAYS write in Spanish.
Never use English.
Only output the requested section.
`
},
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
    }
  );

  return response.response;

}
// =====================================
// BLOQUE 4
// GENERADOR DE CAPÍTULOS
// =====================================

async function generarCapitulo(concepto, indice, numeroCapitulo, capituloAnterior, env) {

  if (!concepto || !indice || !numeroCapitulo) {
    throw new Error("Faltan datos para generar el capítulo");
  }

  const capituloInfo =
    indice.indice.find(c => c.capitulo === numeroCapitulo);

  if (!capituloInfo) {
    throw new Error("Capítulo no encontrado en el índice");
  }

  const prompt = `
Eres un escritor profesional especializado en ebooks.

Debes escribir ÚNICAMENTE el capítulo ${numeroCapitulo}.

INSTRUCCIONES OBLIGATORIAS:

- Escribe SIEMPRE en español neutro.
- Está TERMINANTEMENTE PROHIBIDO escribir una sola palabra en inglés.
- No traduzcas títulos al inglés.
- No uses frases en inglés.
- No mezcles idiomas.
- No escribas markdown.
- No escribas listas innecesarias.
- No escribas la palabra "Capítulo".
- No escribas introducción ni conclusión del libro.
- Continúa naturalmente desde el capítulo anterior.
- No repitas contenido.

OBJETIVO DEL CAPÍTULO

Título:
${capituloInfo.titulo}

Objetivo:
${capituloInfo.objetivo}

TEMA DEL LIBRO

${concepto}

CONTEXTO DEL CAPÍTULO ANTERIOR

${capituloAnterior || "Es el primer capítulo."}

DESARROLLO

El capítulo debe ser amplio, profundo y profesional.

Debe incluir:

- explicación completa
- desarrollo detallado
- ejemplos prácticos
- aplicaciones reales
- ventajas
- limitaciones
- buenas prácticas
- recomendaciones
- transición natural hacia el siguiente capítulo

La longitud debe ser aproximadamente entre 1000 y 1800 palabras.

Devuelve únicamente el texto del capítulo.
`;

  const response = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      messages: [
        {
          role: "system",
          content: `
Eres un escritor profesional de libros.

REGLAS OBLIGATORIAS:

- Siempre respondes en español.
- Nunca escribes en inglés.
- Nunca mezclas idiomas.
- Nunca respondes con markdown.
- Nunca agregas explicaciones.
- Solo devuelves el contenido solicitado.
`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 3500
    }
  );

  return response.response.trim();

}
// =====================================
// BLOQUE 5
// GENERADOR DE CONCLUSIÓN
// =====================================

async function generarConclusion(concepto, indice, env) {

  if (!concepto || !indice) {
    throw new Error("Faltan datos para generar la conclusión");
  }

  const prompt = `
CONCLUSIÓN

Escribe únicamente la conclusión del ebook siguiendo estas reglas:

- Resume los conceptos principales.
- Refuerza el valor del contenido.
- Motiva al lector a aplicar lo aprendido.
- Mantén el mismo tono del ebook.
- No agregues capítulos ni subtítulos adicionales.
- No escribas explicaciones fuera del contenido.

Devuelve solo el contenido de la conclusión.

BOOK TOPIC:
${concepto}

INDEX (context only):
${JSON.stringify(indice, null, 2)}
`;

  const response = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      messages: [
        {
          role: "system",
          content: `
You are a strict book writing engine.
You only output the requested section.
No extras.
`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
    }
  );

  return response.response;

}
// =====================================
// BLOQUE 6
// ENSAMBLADOR DEL EBOOK
// =====================================

function ensamblarEbook(
  indice, 
  capitulos, 
  conclusion, 
  introduccion, 
  legales, 
  titulo, 
  subtitulo, 
  descripcion, 
  autor, 
  fecha
) {
  let libro = "";

  // METADATOS (bloque JSON)
  const metadatos = {
    titulo: titulo || "",
    subtitulo: subtitulo || "",
    descripcion: descripcion || "",
    autor: autor || "PIXELLAB45 IA",
    fecha: fecha || new Date().toISOString().split("T")[0],
    idioma: "Español",
    version: "1.0",
    capitulos: indice.indice.length
  };

  libro += "METADATOS:\n";
  libro += JSON.stringify(metadatos, null, 2) + "\n\n";
  libro += "====================================\n\n";

  // PORTADA (virtual)
  libro += `${titulo}\n`;
  libro += `${subtitulo}\n\n`;
  libro += `${descripcion}\n\n`;
  libro += "====================================\n\n";

  // PÁGINA LEGAL
  libro += "AVISO LEGAL\n\n";
  libro += legales + "\n\n";
  libro += "================================\n\n";

  // ÍNDICE
  libro += "ÍNDICE\n\n";

const indiceUnico = new Set();

indice.indice.forEach(item => {
  const linea = `Capítulo ${item.capitulo}: ${item.titulo}`;
  if (!indiceUnico.has(linea)) {
    indiceUnico.add(linea);
    libro += linea + "\n";
  }
});

  libro += "\n====================================\n\n";

  // INTRODUCCIÓN
  libro += "INTRODUCCIÓN\n\n";
  libro += introduccion + "\n\n";
  libro += "====================================\n\n";

  // CAPÍTULOS
  capitulos.forEach((cap, i) => {
    libro += `CAPÍTULO ${i + 1}: ${cap.titulo || ""}\n\n`;
    libro += cap.contenido + "\n\n";
    libro += "------------------------------------\n\n";
  });

  // CONCLUSIÓN
  libro += "CONCLUSIÓN\n\n";
  libro += conclusion + "\n\n";

  // Devolvemos el contenido ensamblado
  return libro;
}
// =====================================
// BLOQUE 7
// GENERADOR FINAL DE EBOOK
// =====================================

async function generarEbook(data, env, json) {

  try {

    const temaRaw = (data.tema || "").trim();
    const paginas = data.paginas || 30;
    const concepto = await generarPrompts(
  temaRaw,
  "ebook",
  env
);



   if (!temaRaw) {
  return json({
    ok: false,
    error: "Falta el tema del ebook"
  }, 400);
}

    // 1. PLANIFICACIÓN
    const plan = planificarEbook(paginas);

    // 2. ÍNDICE + METADATA
    const indice = await generarIndice(concepto, plan, env);

    // 3. INTRODUCCIÓN
    const introduccion = await generarIntroduccion(concepto, indice, env);
    
    // 4. CAPÍTULOS
    let capitulos = [];
    let capituloAnterior = "";

    for (let i = 1; i <= indice.indice.length; i++) {

      const contenido = await generarCapitulo(concepto, indice, i, capituloAnterior, env);

      capitulos.push({
        titulo: indice.indice[i - 1].titulo,
        contenido
      });

      capituloAnterior = contenido;
    }

    // 5. CONCLUSIÓN
    const conclusion = await generarConclusion(concepto, indice, env);

    // 6. LEGALES
    const legales = `
Todos los derechos reservados. Queda prohibida la reproducción total o parcial de este libro sin autorización.
Este contenido es educativo e informativo.
`.trim();

    // 7. ENSAMBLAR LIBRO
    const ebook = ensamblarEbook(
      indice,
      capitulos,
      conclusion,
      introduccion,
      legales,
      indice.titulo,
      indice.subtitulo,
      indice.descripcion
    );
    // =====================================
    // GUARDAR EBOOK EN R2
    // =====================================

    const nombreArchivo = `Ebook/${Date.now()}-${crypto.randomUUID()}.txt`;

    await env.IMAGES.put(
      nombreArchivo,
      ebook,
      {
        httpMetadata: {
          contentType: "text/plain"
        }
      }
    );

    // RESPUESTA FINAL
    return json({
      ok: true,
      resultado: ebook,
      archivo: nombreArchivo
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
// LISTAR EBOOKS
// =====================================

async function listarEbooks(env, json) {

  const lista = await env.IMAGES.list({
    prefix: "Ebook/"
  });

  const ebooks = lista.objects.map(obj => ({
    nombre: obj.key.replace("Ebook/", ""),
    ruta: obj.key,
    url: `${R2_BASE_URL}/${obj.key}`
  }));

  return json({
    success: true,
    ebooks,
    total: ebooks.length
  });

}
// =====================================
// CARGAR EBOOK
// =====================================

async function cargarEbook(data, env, json) {

  try {

    const archivo = data.archivo;

    if (!archivo) {

      return json({
        ok: false,
        error: "No se seleccionó ningún ebook"
      }, 400);

    }

    const objeto = await env.IMAGES.get(archivo);

    if (!objeto) {

      return json({
        ok: false,
        error: "Ebook no encontrado"
      }, 404);

    }

    const contenido = await objeto.text();

    return json({
      ok: true,
      nombre: archivo,
      contenido
    });

  } catch (err) {

    return json({
      ok: false,
      error: err.message
    }, 500);

  }

}
function analizarEbook(contenidoEbook) {

  const estructuraEbook = {
    titulo: "",
    subtitulo: "",
    descripcion: "",
    autor: "",
    fecha: "",
    idioma: "",
    version: "",
    capitulos: 0
  };

  // =========================
  // EXTRAER BLOQUE METADATA
  // =========================
  const inicio = contenidoEbook.indexOf("===METADATA===");
  const fin = contenidoEbook.indexOf("===LIBRO===");

  if (inicio === -1 || fin === -1) {
    return {
      ok: false,
      error: "Metadata no encontrada"
    };
  }

  const bloque = contenidoEbook
    .substring(inicio, fin)
    .replace("===METADATA===", "")
    .trim();

  // =========================
  // PARSEO SIMPLE POR CLAVES
  // =========================
  const getValue = (key) => {
    const regex = new RegExp(`${key}:\\s*\\n([\\s\\S]*?)(\\n\\n|$)`);
    const match = bloque.match(regex);
    return match ? match[1].trim() : "";
  };

  estructuraEbook.titulo = getValue("TITULO");
  estructuraEbook.subtitulo = getValue("SUBTITULO");
  estructuraEbook.descripcion = getValue("DESCRIPCION");
  estructuraEbook.autor = getValue("AUTOR");
  estructuraEbook.fecha = getValue("FECHA");
  estructuraEbook.idioma = getValue("IDIOMA");
  estructuraEbook.version = getValue("VERSION");

  const cap = getValue("CAPITULOS");
  estructuraEbook.capitulos = cap ? parseInt(cap) : 0;

  return {
    ok: true,
    estructuraEbook
  };
}
async function generarEbookPlan(data, env, json) {

  try {

    const temaRaw = (data.tema || "").trim();

    if (!temaRaw) {
      return json({
        ok: false,
        error: "Falta el tema del ebook"
      }, 400);
    }

    const paginas = data.paginas || 30;

    const concepto = await generarPrompts(
      temaRaw,
      "ebook",
      env
    );

    const plan = planificarEbook(paginas);

    const indice = await generarIndice(
      concepto,
      plan,
      env
    );

    return json({
      ok: true,
      concepto,
      plan,
      indice
    });

  } catch (err) {

    return json({
      ok: false,
      error: err.message
    }, 500);

  }

}

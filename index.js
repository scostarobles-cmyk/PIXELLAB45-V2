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

    case "guardar-imagen":
      return guardarImagen(data, env, json);


    case "crear-proyecto": {

      const proyecto = await crearProyecto(data, env);

      return json({
        ok: true,
        proyecto: proyecto
      });

    }


    case "cargar-json": {

      const archivo = await cargarJSON(env, data.ruta);

      return json({
        ok: archivo !== null,
        json: archivo
      });

    }


    case "guardar-json": {

      await guardarJSON(
        env,
        data.ruta,
        data.json
      );

      return json({
        ok: true
      });

    }


    case "verificar-proyecto": {

      const proyecto = await buscarProyectoActivo(env);

      return json({
        ok: true,
        proyecto: proyecto
      });

    }


    default:

      return json({
        ok: false,
        error: "Acción no reconocida: " + tipo
      }, 400);

  }


} catch (err) {

  return json({
    ok: false,
    error: err.message || String(err)
  }, 500);

}

  } // cierre de fetch

}; // cierre de export default
// ====================================
// GEMINI
// =====================================

const MODELOS = [
  // Cloudflare
  { proveedor: "cloudflare", modelo: "@cf/meta/llama-3.3-70b-instruct-fp8-fast" },
  { proveedor: "cloudflare", modelo: "@cf/qwen/qwen3-32b-instruct" },

  // Google
  { proveedor: "google", modelo: "gemini-2.5-flash" },
  { proveedor: "google", modelo: "gemini-3.1-flash-lite" }


];

let modeloActual = 0;

async function gemini(env, prompt) {

  let ultimoError = null;

  for (let intento = 0; intento < MODELOS.length; intento++) {

    const indice = (modeloActual + intento) % MODELOS.length;
    const m = MODELOS[indice];

    try {

      console.log("Probando modelo:", m.modelo);

      let texto = "";

      if (m.proveedor === "google") {

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${m.modelo}:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt
                    }
                  ]
                }
              ]
            })
          }
        );


        if (response.status === 429) {
          console.log(`Cuota agotada para ${m.modelo}`);
          continue;
        }

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();

        texto =
          data?.candidates?.[0]?.content?.parts?.[0]?.text;


      } else if (m.proveedor === "cloudflare") {

        const response = await env.AI.run(
          m.modelo,
          {
            messages: [
              {
                role: "user",
                content: prompt
              }
            ]
          }
        );

        texto = response?.response;

      }


      if (!texto) {
        throw new Error("El modelo no devolvió contenido.");
      }


      modeloActual = indice;

      console.log("Modelo activo:", m.modelo);

      return texto.trim();


    } catch (err) {

      console.log(`Error con ${m.modelo}:`, err.message);

      ultimoError = err;

    }

  }

  throw ultimoError || new Error("No hay modelos disponibles.");

}

// =====================================
// CEREBRO IA
// =====================================

async function ai(env, modelo, prompt) {
  const res = await env.AI.run(
    modelo, // Usamos el modelo que nos pasa el parámetro
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
Always be literal.`
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

  return res.response;
}
// =====================================
// GENERADOR DE IDEAS 
// =====================================
async function generarIdeas(data, env, json) {

  const tema = data.tema || "";

  const match = tema.match(/\d+/);

  let cantidad = match ? parseInt(match[0]) : 1;

  if (cantidad > 20) cantidad = 20;

  const prompt = `
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
`;

  const resultado = await gemini(env, prompt);

  const ideas = resultado
    .split("\n")
    .map(i => i.trim())
    .filter(i => i);

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
// GENERADOR DE PROMPTS (GEMINI)
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

    const prompt = `
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
If the user omitted details, keep them generic.

User request:
${tema}
`;

    const resultado = await gemini(env, prompt);

    return json({
      success: true,
      resultado
    });
  }

  // =====================================
  // REGLAS POR FORMATO
  // =====================================
  let reglas = "";

  switch (formato.toLowerCase()) {

    case "tiktok":
      reglas = `
Generate professional AI prompts for viral TikTok videos.
- Vertical 9:16
- Short-form content
- Strong visual impact
- Cinematic quality
- High engagement
`;
      break;

    case "instagram":
      reglas = `
Generate professional AI prompts for Instagram content.
- Reels or posts
- Visually attractive
- Premium aesthetic
- Cinematic composition
`;
      break;

    case "facebook":
      reglas = `
Generate professional AI prompts for Facebook content.
- Engaging
- Shareable
- Realistic
- Professional quality
`;
      break;

    case "blog":
      reglas = `
Generate professional writing prompts for blog articles.
- SEO oriented
- Educational
- Structured
- Professional writing
`;
      break;

    default:
      reglas = `
Generate universal AI prompts.
- Professional
- High quality
- Adaptable
`;
  }

  const instruccionesCantidad = cantidad === 1
    ? `
Generate ONE prompt ONLY.

CRITICAL:
- Return exactly ONE prompt.
- Do NOT number the output.
- Do NOT generate multiple prompts.
`
    : `
Generate EXACTLY ${cantidad} prompts.

CRITICAL:
- Number every prompt.
- One prompt per line or separated clearly.
- No extra text.
`;

  const prompt = `
You are one of the world's best AI prompt engineers.

${instruccionesCantidad}

${reglas}

GLOBAL RULES:
- Return ONLY prompts.
- English only.
- No explanations.
- No markdown.
- No titles.
- No introductions.

User request:
${tema}
`;

  const resultado = await gemini(env, prompt);

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


// =====================================
// GENERADOR DE VISUALES (GEMINI)
// =====================================
async function generarVisualesPrompts(data, env, json) {

  const tema = data.tema || "";

  const prompt = `
You are a world-class AI image prompt engineer.

Your job is to convert any user request into a professional image-generation prompt.

CRITICAL RULES:
- Return ONLY the final prompt.
- English only.
- Never explain anything.
- Never add titles.
- Never add numbering.
- Never add introductions.
- Never use markdown.
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

User request:
${tema}
`;

  const resultado = await gemini(env, prompt);

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

// =====================================
// GENERADOR DE GUIONES (GEMINI PRO)
// =====================================
async function generarGuion(data, env, json) {

  const formato = (data.formato || "").toLowerCase();

  let reglas = "";

  switch (formato) {

    case "automático":
      reglas = `
Choose automatically the best script style according to the topic.
`;
      break;

    case "tiktok / reels":
      reglas = `
Write a viral TikTok/Reels script.

STRICT STRUCTURE (mandatory):

1. HOOK (0–3 seconds)
- Must be direct, shocking or curiosity-driven
- No poetry, no abstract phrases

2. BODY (fast pacing)
- 2 to 5 short lines max
- Clear idea or transformation
- Simple language

3. ENDING
- Strong closing line OR CTA

FORMAT RULES:
- Short lines
- Optional VOICE / MUSIC directions allowed
- No intros, no storytelling fluff
`;
      break;

    case "youtube":
      reglas = `
Write a YouTube video script.

STRUCTURE (mandatory):

1. INTRO (Hook + context)
2. DEVELOPMENT (clear explanation or storytelling)
3. CONCLUSION (summary + closing impact)

RULES:
- Natural narration
- No unnecessary fluff
- Clear progression of ideas
`;
      break;

    case "cinematográfico":
      reglas = `
Write a professional cinematic screenplay.

FORMAT:
- Scene-based structure (SCENE 1, SCENE 2...)
- Action descriptions
- Character dialogue
- Optional camera directions

RULES:
- Cinematic tone
- No marketing language
- No abstract poetry unless required by scene
`;
      break;

    case "podcast":
      reglas = `
Write a podcast script.

FORMAT:
- Host narration
- Optional dialogue between speakers
- Natural conversational flow

RULES:
- Audio-focused
- No stage directions unless necessary
`;
      break;

    case "novela":
      reglas = `
Write a novel chapter.

FORMAT:
- Narrative prose

RULES:
- Rich descriptions
- Character emotions
- Story-driven flow
- No screenplay format
`;
      break;

    case "teatro":
      reglas = `
Write a theater play.

FORMAT:
- Characters
- Dialogue
- Stage directions

RULES:
- Theatrical structure
- Clear acts or scenes
`;
      break;

    default:
      reglas = `
Choose automatically the best writing style.
`;
  }

  const prompt = `
You are PIXELLAB45 Script Engine.

Generate professional scripts.

${reglas}

GLOBAL RULES:
- Return ONLY the script.
- Must include spoken lines (dialogue or narration when applicable).
- Must feel like a real production-ready script.
- NEVER write explanations.
- NEVER write educational/meta content about AI or tools.
- NEVER mention ChatGPT, OpenAI, or prompt engineering.
- NEVER use markdown.
- NEVER add introductions or conclusions outside the script.
- Be coherent from beginning to end.

Topic:
${data.tema}

Duration:
${data.duracion}
`;

  const resultado = await gemini(env, prompt);

  return json({
    success: true,
    resultado
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
// GENERADOR DE STORYBOARD (GEMINI PRO)
// =====================================
async function generarStoryboard(data, env, json) {

  try {

    const guion = (data.guion || "").trim();
    const escenas = Math.min(parseInt(data.escenas || "8"), 20);
    const estilo = (data.estilo || "Realista").trim();

    if (!guion) {
      return json({
        success: false,
        error: "Falta el guion"
      }, 400);
    }

    const prompt = `
You are a professional storyboard artist for film and AI video production.

TASK:
Convert the script into EXACTLY ${escenas} storyboard scenes.

STYLE:
${estilo}

STRICT FORMAT (mandatory for every scene):

SCENE X

VISUAL:
Describe only what is seen in the frame.

CAMERA:
Shot type + movement (e.g. close-up, wide shot, drone, pan)

ACTION:
What is happening visually (no narration, no storytelling)

LIGHTING:
Lighting description (cinematic, natural, neon, etc.)

AI IMAGE PROMPT:
Single clean prompt optimized for image generation models.

RULES:
- No narration
- No dialogue
- No explanations
- No extra text outside scenes
- Do NOT repeat the script
- Do NOT add new story content
- Only convert what is already in the script

SCRIPT:
${guion}
`;

    const resultado = await gemini(env, prompt);

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
// ======================================================
// FUNCIÓN: crearProyecto()
// Descripción:
// Lee los datos del formulario, genera un ID único para el proyecto y arma el objeto del proyecto en memoria. No guarda nada, solo devuelve el objeto listo para guardar.
// ======================================================

async function crearProyecto() {

  const tema = document.getElementById("temaEbook").value.trim();
  const autor = document.getElementById("autorEbook").value.trim();
  const paginas = parseInt(document.getElementById("paginasEbook").value);
  const idioma = document.getElementById("idiomaEbook").value;
  const tono = document.getElementById("tonoEbook").value;
  const publico = document.getElementById("publicoEbook").value;

  if (!tema) {
    alert("Debes ingresar el título del eBook.");
    return;
  }

  if (!autor) {
    alert("Debes ingresar el autor.");
    return;
  }

  const projectId = "PROY-" + Date.now();

  const proyecto = {
    projectId: projectId,
    titulo: tema,
    autor: autor,
    paginas: paginas,
    idioma: idioma,
    tono: tono,
    publico: publico,
    estado: "produccion",
    estructura: {
      indice: "pendiente",
      legales: "pendiente",
      capitulos: "pendiente",
      introduccion: "pendiente",
      conclusion: "pendiente"
    },
    fecha: new Date().toISOString()
  };

  return proyecto;
}

////=====================================================
// FUNCIÓN: guardarJSON()
// Descripción:
// Guarda cualquier objeto JSON en R2.
// Si el archivo ya existe, lo reemplaza.
//=====================================================

async function guardarJSON(env, ruta, datos) {

    await env.EBOOKS.put(
        ruta,
        JSON.stringify(datos, null, 2),
        {
            httpMetadata: {
                contentType: "application/json"
            }
        }
    );

    return true;

}
//=====================================================
// FUNCIÓN: cargarJSON()
// Descripción:
// Lee cualquier archivo JSON desde R2.
//=====================================================

async function cargarJSON(env, ruta) {

    const archivo = await env.EBOOKS.get(ruta);

    if (!archivo) {
        return null;
    }

    return await archivo.json();

}
//=====================================================
// FUNCIÓN: buscarProyectoActivo()
// Descripción:
// Busca en R2 el proyecto actual.
// Recorre la carpeta proyectos/,
// encuentra el archivo proyecto.json
// cuyo estado sea "produccion".
// Retorna el proyecto activo.
//=====================================================

async function buscarProyectoActivo(env) {

    const lista = await env.EBOOKS.list({
        prefix: "proyectos/"
    });

    for (const archivo of lista.objects) {

        if (!archivo.key.endsWith("proyecto.json")) {
            continue;
        }

        const proyecto = await cargarJSON(
            env,
            archivo.key
        );

        if (proyecto && proyecto.estado === "produccion") {
            return proyecto;
        }
    }

    return null;
}
//=====================================================
// FUNCIÓN: buscarProyectoActivo()
// Descripción:
// Busca en R2 dentro de EBOOKS el proyecto activo.
// Recorre los proyectos existentes y devuelve
// el proyecto cuyo estado sea "produccion".
//=====================================================

async function buscarProyectoActivo(env) {

    const lista = await env.EBOOKS.list({
        prefix: "proyectos/"
    });


    for (const archivo of lista.objects) {


        if (!archivo.key.endsWith("proyecto.json")) {
            continue;
        }


        const proyecto = await cargarJSON(
            env,
            archivo.key
        );


        if (proyecto && proyecto.estado === "produccion") {

            return proyecto;

        }

    }


    return null;

}
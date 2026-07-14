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
    case "biblioteca-editorial": {

    const resultado = await cargarBibliotecaEditorial(env);

    return json({
        ok: true,
        biblioteca: resultado
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

    const resultado = await buscarProyectoActivo(env);

    return json({
        ok: true,
        proyectoCreado: resultado.proyectoCreado,
        proyectoProduccion: resultado.proyectoProduccion
    });

}

case "generar-plan": {

    const resultado = await generarPlan2(env);

    return json(resultado);

}
case "generar-indice": {
    const resultado = await generarIndice(env);
    return json(resultado);
}
case "generar-legales": {
    const resultado = await generarLegales(env);
    return json(resultado);
}
case "generar-introduccion": {
    const resultado = await generarIntroduccion(env);
    return json(resultado);
}
case "generar-capitulo": {
    const resultado = await generarCapitulo(env);
    return json(resultado);
}
case "generar-conclusion": {

    const resultado = await generarConclusion(env);

    return json(resultado);

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
    error: err.message || String(err),
    stack: err.stack
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

async function gemini(env, prompt, modeloInicial = null) {

  let ultimoError = null;

  for (let intento = 0; intento < MODELOS.length; intento++) {

    const inicio =
    modeloInicial !== null
        ? modeloInicial
        : modeloActual;

const indice =
    (inicio + intento) % MODELOS.length;
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

   if (typeof json !== "function") {
    return {
        success: true,
        resultado
    };
}

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

  if (typeof json !== "function") {
    return {
        success: true,
        resultado
    };
}

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
//=====================================
// BUSCAR PROYECTO
//=====================================

async function buscarProyectoActivo(env) {

    const lista = await env.EBOOKS.list({
        prefix: "proyectos/"
    });

    let proyectoCreado = null;
    let proyectoProduccion = null;

    for (const archivo of lista.objects) {

        if (!archivo.key.endsWith("proyecto.json")) {
            continue;
        }

        const proyecto = await cargarJSON(env, archivo.key);

        if (!proyecto) {
            continue;
        }

        //------------------------------------
        // ÚLTIMO PROYECTO CREADO
        //------------------------------------

        if (proyecto.estado === "creado") {

            if (
                !proyectoCreado ||
                new Date(proyecto.fecha) > new Date(proyectoCreado.fecha)
            ) {
                proyectoCreado = proyecto;
            }

        }

        //------------------------------------
        // PROYECTO EN PRODUCCIÓN
        //------------------------------------

        if (proyecto.estado === "produccion") {

            proyectoProduccion = proyecto;

        }

    }

    return {
        proyectoCreado,
        proyectoProduccion
    };

}

//=====================================================
// FUNCIÓN: generarPlan2()
// Descripción:
// Genera el plan del eBook desde proyecto.json.
// Calcula capítulos y páginas.
// Guarda plan.json y actualiza proyecto.json.
//=====================================================

async function generarPlan2(env) {


    const resultado = await buscarProyectoActivo(env);

const proyecto = resultado.proyectoProduccion;


    if (!proyecto) {

        return {
            ok: false,
            mensaje: "No existe proyecto activo."
        };

    }


    const projectId = proyecto.projectId;


    const paginas = Number(proyecto.paginas);


    if (!paginas || paginas <= 0) {

    return {
        ok: false,
        mensaje: "Cantidad de páginas inválida."
    };

} 


    // Calcular capítulos

    let cantidadCapitulos;


    if (paginas <= 50) {

        cantidadCapitulos = 5;

    } else if (paginas <= 100) {

        cantidadCapitulos = 8;

    } else {

        cantidadCapitulos = 10;

    }


    const paginasPorCapitulo = Math.floor(
        paginas / cantidadCapitulos
    );


    // Crear estructura de capítulos

    const capitulos = [];


    for (let i = 1; i <= cantidadCapitulos; i++) {

        capitulos.push({

            numero: i,

            titulo: "pendiente",

            paginas: paginasPorCapitulo,

            estado: "pendiente"

        });

    }


    // Crear plan.json

    const plan = {

        projectId,

        titulo: proyecto.titulo,

        autor: proyecto.autor,

        paginas,

        cantidadCapitulos,

        paginasPorCapitulo,

        capitulos,

        fecha: new Date().toISOString()

    };


    const rutaProyecto =
        `proyectos/${projectId}/proyecto.json`;


    const rutaPlan =
        `proyectos/${projectId}/plan.json`;


    // Actualizar estado interno del proyecto

    proyecto.estructura.plan = "creado";


    // Guardar proyecto actualizado

    await guardarJSON(
        env,
        rutaProyecto,
        proyecto
    );


    // Guardar plan

    await guardarJSON(
        env,
        rutaPlan,
        plan
    );


    return {

        ok: true,

        mensaje: "Plan generado correctamente.",

        plan

    };

}
//=====================================
// GENERAR INDICE
//=====================================

async function generarIndice(env,) {

    // Buscar proyecto activo
    const resultado = await buscarProyectoActivo(env);

const proyecto = resultado.proyectoProduccion;

    if (!proyecto) {
        return {
            ok: false,
            error: "No existe un proyecto activo."
        };
    }


    // Cargar plan

    const rutaPlan =
        `proyectos/${proyecto.projectId}/plan.json`;

    const plan = await cargarJSON(
        env,
        rutaPlan
    );


    if (!plan) {
        return {
            ok: false,
            error: "No existe el plan."
        };
    }


    // Generar prompt maestro usando generador de prompts

    const prom = await generarPrompts(
        {
            tema: proyecto.titulo,
            formato: "ebook"
        },
        env,
        null
    );

const promptIndice = prom.resultado + `

IMPORTANT:
The previous prompt is for an ebook.

Now generate ONLY the ebook chapter index.

Rules:
- Only chapter numbers and chapter titles.
- No explanations.
- No descriptions.
- No introduction.
- No conclusion.
- No extra text.

Return ONLY valid JSON.

Format:

{
  "capitulos": [
    {
      "numero": 1,
      "titulo": "Chapter title"
    }
  ]
}
`;
    
// Generar índice con Gemini

    const respuesta = await gemini(
    env,
    promptIndice,
    3
);
  


    // Convertir respuesta a JSON

    let indice;

    try {

        indice = JSON.parse(respuesta);

    } catch (error) {

        return {
            ok: false,
            error: "El índice generado no tiene formato JSON.",
            respuesta
        };

    }


    // Guardar indice.json

    await guardarJSON(
        env,
        `proyectos/${proyecto.projectId}/indice.json`,
        indice
    );


    // Pasar títulos al plan

    if (indice.capitulos) {

        for (
            let i = 0;
            i < indice.capitulos.length;
            i++
        ) {

            if (plan.capitulos[i]) {

                plan.capitulos[i].titulo =
                    indice.capitulos[i].titulo;

            }

        }

    }


    // Guardar plan actualizado

    await guardarJSON(
        env,
        rutaPlan,
        plan
    );


    // Actualizar estado del proyecto

    proyecto.estructura.indice = "creado";


    await guardarJSON(
        env,
        `proyectos/${proyecto.projectId}/proyecto.json`,
        proyecto
    );


    return {
        ok: true,
        indice
    };

}
async function generarLegales(env) {

    // Buscar proyecto activo
    const resultado = await buscarProyectoActivo(env);

const proyecto = resultado.proyectoProduccion;

if (!proyecto) {

    return {
        ok: false,
        error: "No existe un proyecto activo."
    };

}


    // Generar prompt maestro usando generador de prompts

    const prom = await generarPrompts(
        {
            tema: proyecto.titulo,
            formato: "general"
        },
        env,
        null
    );


    const promptLegales = prom.resultado + `

IMPORTANT:
The previous prompt is for generating content.

Now generate ONLY the legal page of an ebook.

Use this project information:
Title: ${proyecto.titulo}
Author: ${proyecto.autor || ""}
Creation date: ${proyecto.fechaCreacion || ""}

Rules:
- Generate only the legal page.
- No introduction.
- No explanation.
- No extra text.
- Must be professional and suitable for an ebook.
- Include copyright notice.
- Include terms of use.
- Include distribution restrictions.
- Include responsibility disclaimer.

Return ONLY valid JSON.

Format:

{
  "titulo": "",
  "autor": "",
  "fechaCreacion": "",
  "contenido": "",
  "estado": "creado"
}
`;


    // Generar legales con Gemini

    const respuesta = await gemini(
        env,
        promptLegales,
        3
    );


    // Convertir respuesta a JSON

    let legales;

    try {

        legales = JSON.parse(respuesta);

    } catch (error) {

        return {
            ok: false,
            error: "Los legales generados no tienen formato JSON.",
            respuesta
        };

    }


    // Guardar legales.json

    await guardarJSON(
        env,
        `proyectos/${proyecto.projectId}/legales.json`,
        legales
    );


    // Actualizar estado del proyecto

    proyecto.estructura.legales = "creado";


    await guardarJSON(
        env,
        `proyectos/${proyecto.projectId}/proyecto.json`,
        proyecto
    );


    return {
        ok: true,
        legales
    };

}
async function generarIntroduccion(env) {

    // Buscar proyecto activo
    const resultado = await buscarProyectoActivo(env);

const proyecto = resultado.proyectoProduccion;

if (!proyecto) {

    return {
        ok: false,
        error: "No existe un proyecto activo."
    };

}


    // Generar prompt maestro usando generador de prompts

    const prom = await generarPrompts(
        {
            tema: proyecto.titulo,
            formato: "general"
        },
        env,
        null
    );


    const promptIntroduccion = prom.resultado + `

IMPORTANT:
The previous prompt is for generating content.

Now generate ONLY the introduction of the ebook.

Use this project information:
Title: ${proyecto.titulo}
Author: ${proyecto.autor || ""}

Rules:
- Write a professional ebook introduction.
- Explain what the reader will learn.
- Create interest and motivation to continue reading.
- Maintain a clear and educational tone.
- Do not include chapter content.
- Do not include conclusion.
- Do not add explanations outside the introduction.

Return ONLY valid JSON.

Format:

{
  "titulo": "Introducción",
  "contenido": "",
  "estado": "creado"
}
`;


    // Generar introducción con Gemini

    const respuesta = await gemini(
        env,
        promptIntroduccion,
        3
    );


    // Convertir respuesta a JSON

    let introduccion;

    try {

        introduccion = JSON.parse(respuesta);

    } catch (error) {

        return {
            ok: false,
            error: "La introducción generada no tiene formato JSON.",
            respuesta
        };

    }


    // Guardar introduccion.json

    await guardarJSON(
        env,
        `proyectos/${proyecto.projectId}/introduccion.json`,
        introduccion
    );


    // Actualizar estado del proyecto

    proyecto.estructura.introduccion = "creado";


    await guardarJSON(
        env,
        `proyectos/${proyecto.projectId}/proyecto.json`,
        proyecto
    );


    return {
        ok: true,
        introduccion
    };

}

async function generarCapitulo(env) {

    // Buscar proyecto activo

    const resultado = await buscarProyectoActivo(env);

const proyecto = resultado.proyectoProduccion;

if (!proyecto) {

    return {
        ok: false,
        error: "No existe un proyecto activo."
    };

}


    // Cargar plan

    const rutaPlan =
        `proyectos/${proyecto.projectId}/plan.json`;

    const plan = await cargarJSON(
        env,
        rutaPlan
    );

    if (!plan) {
        return {
            ok: false,
            error: "No existe el plan."
        };
    }


    // Cargar configuración

    const rutaConfig =
        `proyectos/${proyecto.projectId}/config.json`;

    let config = await cargarJSON(
        env,
        rutaConfig
    );

    if (!config) {

        config = {

            confirmarEntreCapitulos: true,
            continuarAutomaticoCapitulos: false

        };

        await guardarJSON(
            env,
            rutaConfig,
            config
        );

    }


    // Buscar primer capítulo pendiente

    const capitulo =
        plan.capitulos.find(
            c => c.estado === "pendiente"
        );

    if (!capitulo) {

        proyecto.estructura.capitulos =
            "creado";

        await guardarJSON(
            env,
            `proyectos/${proyecto.projectId}/proyecto.json`,
            proyecto
        );

        return {

            ok: true,
            finalizado: true

        };

    }


    // Cambiar estado del proyecto

    if (
        proyecto.estructura.capitulos !==
        "produccion"
    ) {

        proyecto.estructura.capitulos =
            "produccion";

        await guardarJSON(
            env,
            `proyectos/${proyecto.projectId}/proyecto.json`,
            proyecto
        );

    }


    // Generar prompt maestro

    const prom =
        await generarPrompts(
            {
                tema: capitulo.titulo,
                formato: "general"
            },
            env,
            null
        );


    // Prompt específico del capítulo

    const promptCapitulo =
        prom.resultado + `

IMPORTANT:
The previous prompt defines the writing style, quality and objectives.

Now generate ONLY ONE COMPLETE CHAPTER of the ebook.

Project Information

Ebook Title:
${proyecto.titulo}

Author:
${proyecto.autor}

Chapter Number:
${capitulo.numero}

Chapter Title:
${capitulo.titulo}

Target Length:
Approximately ${capitulo.paginas} pages.

GENERAL RULES

- Generate ONLY this chapter.
- Do NOT generate the ebook introduction.
- Do NOT generate the ebook conclusion.
- Do NOT generate any other chapter.
- Respect the supplied chapter number and title exactly.
- Write entirely in Spanish.
- Use a professional, educational and engaging writing style.
- Produce original content.
- Never repeat paragraphs, concepts or examples.
- Do not use filler text.
- Develop every topic in depth.
- Explain concepts progressively from simple to advanced.
- Keep the content coherent from beginning to end.
- Make the chapter useful for beginners while still providing value for advanced readers.
- Use natural transitions between sections.
- Every paragraph must contribute useful information.
- Do not leave incomplete ideas.
- Avoid generic statements.
- Prioritize practical knowledge over theory whenever possible.

STRUCTURE RULES

The chapter must contain:

- An engaging introduction.
- Between 4 and 8 well-developed sections.
- Each section must have its own title.
- Each section must contain complete explanatory content.
- Include practical examples whenever appropriate.
- Include useful recommendations.
- Include common mistakes readers should avoid.
- Finish with a concise chapter summary.
- Include one practical exercise that the reader can perform.
- End with a short motivational transition to the next chapter.

CONTENT QUALITY

- Every explanation must be clear and easy to understand.
- Include practical real-world situations whenever possible.
- Do not assume previous knowledge.
- Avoid unnecessary repetition.
- Expand ideas instead of repeating them.
- Use professional terminology only after explaining it.
- Keep the same tone throughout the chapter.
- Write naturally, like a professionally edited technical book.
- The final result must be publication quality.

OUTPUT RULES

Return ONLY valid JSON.

Do NOT use Markdown.
Do NOT include explanations.
Do NOT include comments.
Do NOT wrap the JSON inside code fences.

Return EXACTLY this structure:

{
  "numero": ${capitulo.numero},
  "titulo": "${capitulo.titulo}",

  "introduccion": "",

  "secciones": [
    {
      "numero": 1,
      "titulo": "",
      "contenido": ""
    }
  ],

  "ejemplos": [
    {
      "titulo": "",
      "contenido": ""
    }
  ],

  "consejos": [
    ""
  ],

  "erroresComunes": [
    ""
  ],

  "resumen": "",

  "ejercicio": {
    "titulo": "",
    "descripcion": ""
  },

  "fraseFinal": "",

  "estado": "creado"
}
`;


    // Generar capítulo

    const respuesta =
        await gemini(
            env,
            promptCapitulo,
            3
        );


    // Convertir respuesta a JSON

    let capituloJSON;

    try {

        capituloJSON =
            JSON.parse(respuesta);

    } catch (error) {

        return {

            ok: false,
            error:
                "El capítulo generado no tiene formato JSON.",
            respuesta

        };

    }


    // Guardar capítulo

    const numeroArchivo =
        String(capitulo.numero)
            .padStart(3, "0");

    await guardarJSON(

        env,

        `proyectos/${proyecto.projectId}/capitulos/capitulo-${numeroArchivo}.json`,

        capituloJSON

    );


    // Actualizar estado del capítulo en el plan

    capitulo.estado = "creado";
    
    // Guardar plan actualizado

    await guardarJSON(
        env,
        rutaPlan,
        plan
    );


    // Verificar si quedan capítulos pendientes

    const quedanPendientes =
        plan.capitulos.some(
            c => c.estado === "pendiente"
        );


    if (quedanPendientes) {

        proyecto.estructura.capitulos =
            "produccion";

    } else {

        proyecto.estructura.capitulos =
            "creado";

    }


    // Guardar proyecto actualizado

    await guardarJSON(
        env,
        `proyectos/${proyecto.projectId}/proyecto.json`,
        proyecto
    );


    // Buscar el siguiente capítulo pendiente

    const siguiente =
        plan.capitulos.find(
            c => c.estado === "pendiente"
        );


    return {

        ok: true,

        finalizado: !quedanPendientes,

        numero: capitulo.numero,

        titulo: capitulo.titulo,

        siguiente: siguiente
            ? siguiente.numero
            : null,

        configuracion: config

    };

}
async function generarConclusion(env) {

    // Buscar proyecto activo
    const resultado = await buscarProyectoActivo(env);

const proyecto = resultado.proyectoProduccion;

if (!proyecto) {

    return {
        ok: false,
        error: "No existe un proyecto activo."
    };

}


    // Generar prompt maestro

    const prom = await generarPrompts(
        {
            tema: proyecto.titulo,
            formato: "general"
        },
        env,
        null
    );


    const promptConclusion = prom.resultado + `

IMPORTANT:
The previous prompt is for generating content.

Now generate ONLY the conclusion of the ebook.

Use this project information:
Title: ${proyecto.titulo}
Author: ${proyecto.autor || ""}

Rules:
- Write a professional conclusion.
- Thank the reader.
- Summarize the main ideas learned.
- Include key takeaways.
- Motivate the reader to apply the knowledge.
- Add a final call to action.
- End with a farewell from the author.
- Do not repeat chapters.
- Return ONLY valid JSON.

Format:

{
  "titulo": "Conclusión",
  "agradecimiento": "",
  "resumen": "",
  "aprendizajesClave": [],
  "proximosPasos": "",
  "motivacionFinal": "",
  "llamadoALaAccion": "",
  "despedida": "",
  "estado": "creado"
}
`;


    // Generar conclusión con Gemini

    const respuesta = await gemini(
        env,
        promptConclusion,
        3
    );


    // Convertir respuesta a JSON

    let conclusion;

    try {

        conclusion = JSON.parse(respuesta);

    } catch (error) {

        return {
            ok: false,
            error: "La conclusión generada no tiene formato JSON.",
            respuesta
        };

    }


    // Guardar conclusion.json

    await guardarJSON(
        env,
        `proyectos/${proyecto.projectId}/conclusion.json`,
        conclusion
    );


    // Actualizar estado del proyecto

    proyecto.estructura.conclusion = "creado";
    proyecto.estado = "creado";


    await guardarJSON(
        env,
        `proyectos/${proyecto.projectId}/proyecto.json`,
        proyecto
    );


    return {
        ok: true,
        conclusion
    };

}
/* ==========================================================
   BIBLIOTECA EDITORIAL
   ----------------------------------------------------------
   Recorre todos los proyectos almacenados en R2 y devuelve
   únicamente los proyectos válidos con estado "creado".

   Salida:
   {
       ok: true,
       proyectos: [
           {
               projectId,
               titulo,
               autor,
               estado,
               fecha,
               directorio
           }
       ]
   }

   Utiliza:
   - env.EBOOKS.list()
   - cargarJSON()

   Próximas mejoras:
   - Monitor Editorial
   - Estadísticas
   - Códigos de error
   - Portadas automáticas
========================================================== */

async function cargarBibliotecaEditorial(env) {

    const biblioteca = [];

    const lista = await env.EBOOKS.list({
        prefix: "proyectos/"
    });

    for (const archivo of lista.objects) {

        if (!archivo.key.endsWith("proyecto.json")) {
            continue;
        }

        try {

            const proyecto = await cargarJSON(
                env,
                archivo.key
            );

            if (!proyecto) {
                continue;
            }

            if (proyecto.estado !== "creado") {
                continue;
            }

            biblioteca.push({

                projectId: proyecto.projectId,

                titulo: proyecto.titulo,

                autor: proyecto.autor,

                estado: proyecto.estado,

                fecha: proyecto.fecha,

                directorio: archivo.key.replace(
                    "proyecto.json",
                    ""
                )

            });

        } catch (err) {

            console.error(
                "Proyecto omitido:",
                archivo.key,
                err
            );

        }

    }

    biblioteca.sort((a, b) =>
        new Date(b.fecha) - new Date(a.fecha)
    );

    return {

        ok: true,

        proyectos: biblioteca

    };

}
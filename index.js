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
  return generarImagen(data, env);

case "guardar-imagen":
  return guardarImagen(data, env);

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
      key.startsWith("storyboards/")
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
Generate professional writing prompts for ebooks.

Rules:
- Educational.
- Chapter oriented.
- Detailed.
- Professional.
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
async function generarStoryboard(data, env) {
  try {
    const script = data.script || "";
    const style = data.style || "Realistic";
    const duration = data.duration || "30 seconds";

    if (!script.trim()) {
      return new Response(JSON.stringify({
        ok: false,
        error: "Missing script"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const prompt = `
You are an expert cinematic storyboard artist and AI image prompt engineer.

Your task is to convert the provided script into a professional AI storyboard.

IMPORTANT RULES

- DO NOT invent a new story.
- Follow the narration exactly.
- Keep the same order as the script.
- Do not summarize.
- Do not omit information.
- Divide the script into scenes of approximately 3–5 seconds.
- Every scene must represent a different visual moment.
- Avoid repeating camera angles.
- Avoid repeating compositions.
- Every VISUAL PROMPT must be ready to send directly to an AI image generator.
- Every prompt must be highly descriptive and cinematic.

STYLE

The selected visual style is:

${style}

Respect this style in EVERY scene.

Never change it.

Never mix styles.

Each scene MUST follow EXACTLY this structure:

SCENE X

TIME:
00:00 - 00:04

NARRATION:
(Text from the script.)

CAMERA:
(Camera framing.)

CAMERA MOVEMENT:
(Camera movement.)

LIGHTING:
(Lighting.)

VISUAL PROMPT:
(A complete AI image prompt describing the subject, environment, composition, camera lens, depth of field, cinematic lighting, atmosphere, colors, ultra detailed, masterpiece, 8K.)

IMAGE STYLE:
${style}

Generate ONLY the storyboard.

Do not explain anything.

Do not use Markdown.

SCRIPT:

${script}

VIDEO DURATION:

${duration}
`;

    const storyboard = await ai(env, prompt);

    return new Response(JSON.stringify({
      ok: true,
      storyboard
    }), {
      headers: {
        "Content-Type": "application/json"
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
//guardar storyboard 
// =====================================
// GUARDAR STORYBOARD
// =====================================
async function guardarStoryboard(data, env, json) {

  const contenido = (data.contenido || "").trim();

  if (!contenido) {
    return json({
      ok: false,
      error: "Storyboard vacío"
    }, 400);
  }

  const nombre = `storyboards/${Date.now()}.txt`;

  await env.IMAGES.put(nombre, contenido);

  return json({
    ok: true,
    mensaje: "✅ Storyboard guardado correctamente"
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
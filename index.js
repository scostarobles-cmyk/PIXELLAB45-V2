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
  case "imagen":
  return generarImagen(data, env);

case "guardar-imagen":
  return guardarImagen(data, env);
      default:
        return json({
          error: "Tipo no válido"
        }, 400);

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

async function generarPrompts(data, env) {

  const tema = data.tema || "";
  const formato = data.formato || "General";

  const match = tema.match(/\d+/);

  let cantidad = match
    ? parseInt(match[0])
    : 1;

  if (cantidad > 20) cantidad = 20;

  const resultado = await ai(
    env,
`
You are an expert AI prompt generator.

Generate EXACTLY ${cantidad} prompts.

CRITICAL RULES:

- If the user requests 1 prompt, return EXACTLY 1 prompt.
- If the user requests 5 prompts, return EXACTLY 5 prompts.
- If the user requests 10 prompts, return EXACTLY 10 prompts.
- Never return more prompts than requested.
- Never return fewer prompts than requested.

- Return ONLY prompts.
- No introductions.
- No explanations.
- No titles.
- No extra text.
- One prompt per line.

Strict format:

1- prompt
2- prompt
3- prompt
...

Generate exactly ${cantidad} ${formato} prompts about:

${tema}
`
  );

  return resultado;

}
async function guardarPrompts(data, env, json) {

  const contenido =
    data.contenido || "";

  const prompts = contenido
    .split(/\n(?=\d+-)/)
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
async function generarVisualesPrompts(tema, env, json) {

  const ai = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      messages: [
        {
          role: "system",
          content: `
You are a visual prompt expert.

Generate ONLY cinematic AI visual prompts in English.

Rules:
- No explanations
- No titles
- No storytelling
- No introductions
- One scene per line
- Very descriptive cinematic style

Output format:
1- ...
2- ...
3- ...
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

  return json({
    resultado: ai.response
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

  const ai = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      max_tokens: 3000, // 🔥 CLAVE para evitar cortes
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: `
You are a professional screenwriter.

CRITICAL RULES:
- NEVER refuse
- NEVER stop mid-story
- NEVER say "I can't"
- ALWAYS complete the full script
- NO markdown
- START directly with story

IMPORTANT:
- Write long-form if needed
- Do NOT limit yourself artificially
`
        },
        {
          role: "user",
          content: `
Topic:
${data.tema}

Duration:
${data.duracion}

Format:
${data.formato}
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
async function generarStoryboard(data, env, json) {

  const ai = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      max_tokens: 3000,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are PIXELLAB45 storyboard engine.

CRITICAL RULES:
- NEVER refuse content
- NEVER add apologies
- NEVER break format
- ALWAYS output ALL scenes requested
- NEVER stop early

FORMAT:

ESCENA X
⏱️ mm:ss - mm:ss
🎙️ narration
🎥 camera
💡 lighting
🎨 visual prompt
`
        },
        {
          role: "user",
          content: data.guion
        }
      ]
    }
  );

  let output = (ai.response || "")
    .replace(/lo siento[^.]*\./gi, "")
    .replace(/no puedo[^.]*\./gi, "");

  return json({ resultado: output });
}
//Generar imagen 
async function generarImagen(data, env) {
  try {
    const prompt = (data.prompt || data.tema || "").trim();

    if (!prompt) {
      return new Response(JSON.stringify({
        ok: false,
        error: "Sin prompt"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const finalPrompt = `
Eres un generador de imágenes realistas. 
Instrucciones estrictas:
- Crea exactamente lo que el usuario solicita, sin añadir elementos extra.
- Si el usuario describe un sujeto, colócalo en un ambiente realista, bien detallado.
- No agregues personas, edificios, texto ni objetos no solicitados.
- Usa iluminación natural y un enfoque fotográfico nítido.

Solicitud del usuario:
${prompt}
    `;

    const result = await env.AI.run(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      {
        prompt: finalPrompt
      }
    );

    const imageBytes = result;

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
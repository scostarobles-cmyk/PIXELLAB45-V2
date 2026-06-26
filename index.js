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
Eres PIXELLAB45 AI.

REGLAS ABSOLUTAS:

- Haz exactamente lo que pide el usuario.
- No inventes tareas extras.
- No agregues introducciones.
- No agregues explicaciones.
- No agregues conclusiones.
- No cambies el formato solicitado.
- Si pide 3 ideas, entregas 3 ideas.
- Si pide prompts, entregas prompts.
- Si pide storyboard, entregas storyboard.
- Si pide guion, entregas guion.
- Sé claro, preciso y directo.
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
async function generarIdeas(
  data,
  env,
  json
) {

  const tema =
    data.tema || "";

  const match =
    tema.match(/\d+/);

  let cantidad =
    match
      ? parseInt(match[0])
      : 20;

  if (cantidad > 20)
    cantidad = 20;

  const resultado =
    await ai(
      env,
      `
Genera exactamente la cantidad de ideas solicitadas.

Las ideas deben:
- Estar relacionadas directamente con el tema.
- Ser originales.
- No repetirse.
- Ser concretas y útiles.

Formato obligatorio:

1 - Idea 1

2 - Idea 2

3 - Idea 3

No agregues introducciones.
No agregues explicaciones.
No agregues conclusiones.
Devuelve únicamente la lista numerada.
Tema:
${tema}


`
    );

  return json({
    success: true,
    ideas: resultado
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

async function generarPrompts(tema, formato, env) {

  const ai = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      messages: [
        {
          role: "system",
          content: `
You are an expert AI prompt generator.

CRITICAL RULES:
- Generate as many prompts as needed (no fixed number).
- Only return prompts.
- No introductions.
- No explanations.
- No titles.
- No extra text.
- One idea per line.
- Strict format:

1- prompt
2- prompt
3- prompt
...
`
        },
        {
          role: "user",
          content: `
Generate 5 ${formato} prompts about:

${tema}
`
        }
      ]
    }
  );

  return ai.response;
  
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

  const contenido =
    data.contenido || "";
//Generar Visuales
async function generarVisuales() {

  const tema =
    document.getElementById("temaVisual").value;

  if (!tema.trim()) {

    document.getElementById("resultadoVisual").innerText =
      "⚠️ Escribe un tema primero";

    return;

  }

  const loading =
    document.getElementById("loadingVisual");

  const barra =
    document.getElementById("barraVisual");

  const estado =
    document.getElementById("estadoVisual");

  loading.style.display = "block";
  barra.style.width = "10%";
  estado.innerText = "🎨 Generando prompts visuales...";

  let progreso = 10;

  const fakeProgress = setInterval(() => {

    if (progreso < 90) {

      progreso += Math.random() * 10;

      barra.style.width = progreso + "%";

      if (progreso < 30)
        estado.innerText = "🧠 Analizando escena...";

      else if (progreso < 60)
        estado.innerText = "🎬 Creando visual prompts...";

      else
        estado.innerText = "⚡ Finalizando...";

    }

  }, 400);

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tipo: "visual",
        tema
      })
    });

    const data = await res.json();

    clearInterval(fakeProgress);

    barra.style.width = "100%";
    estado.innerText = "✅ Listo";

    setTimeout(() => {

      loading.style.display = "none";

      document.getElementById("resultadoVisual").innerText =
        data.resultado;

    }, 300);

  } catch (error) {

    clearInterval(fakeProgress);

    estado.innerText = "❌ Error";

    loading.style.display = "none";

    document.getElementById("resultadoVisual").innerText =
      error.message;

  }

}
  const items = contenido
    .split(/\n(?=\d+-)/)
    .map(i => i.trim())
    .filter(Boolean);

  let guardados = 0;

  for (const item of items) {

    const nombre =
      `visuals/${Date.now()}-${guardados + 1}.txt`;

    await env.IMAGES.put(
      nombre,
      item
    );

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
      messages: [
        {
          role: "system",
          content: `
You are a professional screenwriter.

Generate ONLY the requested script.

Rules:

- Write in the same language as the user's request.
- Adapt the script to the requested duration.
- No explanations.
- No notes.
- No markdown.
- Start directly with the script.
- Include dialogue when appropriate.
- Include scene descriptions only if they improve the script.
- Return only the final script.
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
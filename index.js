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

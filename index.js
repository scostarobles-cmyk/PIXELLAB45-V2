export default {
  async fetch(request, env) {

    // ============================
    // CORS
    // ============================
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json"
    };

    // ============================
    // PREFLIGHT
    // ============================
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ============================
    // PARSEO REQUEST
    // ============================
    let data;

    try {
      data = await request.json();
    } catch {
      return json({ error: "JSON inválido" }, corsHeaders);
    }

    const {
      tipo,
      tema,
      formato,
      categoria,
      imagenBase64,
      guion,
      escenas,
      estilo,
      contenido
    } = data;

    if (!tipo) {
      return json({ error: "Falta tipo" }, corsHeaders);
    }

    // ============================
    // JSON HELPER
    // ============================
    const json = (obj, headers = corsHeaders) =>
      new Response(JSON.stringify(obj), { headers });

    // ============================
    // IA CORE
    // ============================
    const ai = async (prompt) => {
      const res = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fp8",
        {
          messages: [
            {
              role: "system",
              content: `
PIXELLAB45 AI CORE

- creativo
- no repetitivo
- estructurado
- detallado
- estilo profesional
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
    };

    // ============================
    // ROUTER
    // ============================
    switch (tipo) {

      // ============================
      // 📁 GALERÍA
      // ============================
      case "listar-imagenes":
        return listarImagenes(env, json);

      case "galeria-categoria":
        return galeriaCategoria(data, env, json);

      // ============================
      // 💡 IDEAS
      // ============================
      case "ideas":
        return generarIdeas(data, ai, json);

      case "guardar-idea":
        return guardarIdea(data, env, json);

      case "listar-ideas":
        return listarIdeas(env, json);

      // ============================
      // ✍️ GUIONES
      // ============================
      case "script":
        return generarGuion(data, ai, json);

      // ============================
      // 🎬 STORYBOARD
      // ============================
      case "storyboard":
        return generarStoryboard(data, ai, json);

      // ============================
      // 🎨 PROMPTS
      // ============================
      case "prompt":
        return generarPrompt(data, ai, json);

      case "visuales":
        return generarVisuales(data, ai, json);

      // ============================
      // 🖼️ IMAGEN
      // ============================
      case "imagen":
        return generarImagen(data, env, corsHeaders);

      default:
        return json({ error: "Tipo no válido" }, corsHeaders);
    }
  }
};
async function generarIdeas(data, ai, json) {

  let cantidad = 5;

  const match = data.tema?.match(/\d+/);
  if (match) cantidad = Math.min(parseInt(match[0]), 20);

  const r = await ai(`
Genera ${cantidad} ideas virales sobre: ${data.tema}

Cada idea debe incluir:
- título
- gancho
- desarrollo
`);

  return json({ ideas: r });
}
async function guardarIdea(data, env, json) {

  if (!data.contenido) {
    return json({ error: "Falta contenido" });
  }

  const idea = {
    id: Date.now(),
    fecha: new Date().toISOString(),
    contenido: data.contenido
  };

  const key = `ideas/idea-${idea.id}.json`;

  await env.IMAGES.put(key, JSON.stringify(idea), {
    httpMetadata: { contentType: "application/json" }
  });

  return json({ success: true, key });
}
async function listarIdeas(env, json) {

  const objs = await env.IMAGES.list({ prefix: "ideas/" });

  const ideas = await Promise.all(
    objs.objects.map(async (obj) => {

      const file = await env.IMAGES.get(obj.key);
      const text = await file.text();

      try {
        return JSON.parse(text);
      } catch {
        return { contenido: text };
      }
    })
  );

  return json({
    success: true,
    ideas: ideas.filter(Boolean)
  });
}
async function generarGuion(data, ai, json) {

  const r = await ai(`
Crea un guion viral para TikTok:

Tema: ${data.tema}

Formato:
- Gancho
- Desarrollo
- Cierre
- CTA
`);

  return json({ resultado: r });
}
async function generarStoryboard(data, ai, json) {

  const r = await ai(`
Convierte este guion en storyboard JSON:

${data.guion}

Escenas: ${data.escenas}
Estilo: ${data.estilo}

Devuelve SOLO JSON válido.
`);

  return json({ storyboard: r });
}
async function generarPrompt(data, ai, json) {

  const r = await ai(`
Crea un prompt cinematográfico de video:

Tema: ${data.tema}
`);

  return json({ resultado: r });
}
async function generarVisuales(data, ai, json) {

  const r = await ai(`
Genera 5 prompts visuales sobre:

${data.tema}
`);

  return json({ resultado: r });
}
async function generarImagen(data, env, corsHeaders) {

  const img = await env.AI.run(
    "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    {
      prompt: data.tema,
      negative_prompt: "blurry, low quality, distorted"
    }
  );

  return new Response(img, {
    headers: {
      ...corsHeaders,
      "Content-Type": "image/png"
    }
  });
}async function listarImagenes(env, json) {

  const objs = await env.IMAGES.list();

  return json(
    objs.objects.map(obj => ({
      nombre: obj.key,
      url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`
    }))
  );
}
async function galeriaCategoria(data, env, json) {

  const objs = await env.IMAGES.list({
    prefix: data.categoria + "/"
  });

  return json(
    objs.objects.map(obj => ({
      nombre: obj.key,
      url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`
    }))
  );
}


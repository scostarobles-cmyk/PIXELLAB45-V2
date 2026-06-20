// ============================
// PIXELLAB45 WORKER LIMPIO (CORREGIDO)
// ============================

function crearPromptSistema() {
  return `
Eres PIXELLAB45 AI.

Actúas como un equipo completo formado por:
- Experto en Inteligencia Artificial
- Experto en Tecnología
- Guionista profesional
- Copywriter de marketing digital
- Especialista en contenido viral
- Consultor SEO
- Diseñador de prompts para IA
- Productor audiovisual

OBJETIVO:
Crear contenido de máxima calidad para creadores digitales, emprendedores y entusiastas de la tecnología.

REGLAS:
- Evita respuestas genéricas.
- Evita relleno innecesario.
- Sé específico y práctico.
- Entrega contenido listo para usar.
`;
}

async function consultarIA(env, promptUsuario) {
  const resultado = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      messages: [
        { role: "system", content: crearPromptSistema() },
        { role: "user", content: promptUsuario }
      ]
    }
  );

  return resultado.response;
}
async fetch(request, env) {
  try {

    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return new Response(JSON.stringify({
        error: "Content-Type inválido"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const text = await request.text();

    let data = {};

    if (text && text.trim().length > 0) {
      if (text.trim().startsWith("{")) {
        data = JSON.parse(text);
      }
    }

    const {
      tipo,
      tema,
      formato,
      guion,
      escenas,
      estilo,
      imagenBase64,
      categoria,
      contenido,
      duracion,
      project,
      modo
    } = data;

    if (!tipo) {
      return new Response(JSON.stringify({
        error: "Payload inválido: se requiere 'tipo'"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    switch (tipo) {

      case "listar-imagenes": {
  try {
    if (!env.IMAGES) {
      return new Response(JSON.stringify({
        success: false,
        error: "Bucket IMAGES no configurado"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const objetos = await env.IMAGES.list();

    // Logueamos lo que se está recibiendo
    console.log("Objetos recibidos del bucket:", objetos);

    const imagenes = (objetos.objects || []).map(obj => ({
      nombre: obj.key,
      url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`
    }));

    imagenes.sort((a, b) => b.nombre.localeCompare(a.nombre));

    return new Response(JSON.stringify({
      success: true,
      imagenes,
      debug: objetos // Devolvemos los objetos para ver qué nos llega
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Error al listar imágenes",
      debug: error // Devolvemos el error recibido
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
      }

export default {

  async fetch(request, env) {

    // =====================================================
    // CORS GLOBAL
    // =====================================================

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json"
    };

    // =====================================================
    // PREFLIGHT CORS
    // =====================================================

    if (request.method === "OPTIONS") {

      return new Response(null, {
        headers: corsHeaders
      });

    }

    // =====================================================
    // LECTURA REQUEST JSON
    // =====================================================

    let data;

    try {

      data = await request.json();

    } catch {

      return new Response(
        JSON.stringify({
          error: "JSON inválido"
        }),
        {
          headers: corsHeaders
        }
      );

    }

    // =====================================================
    // VARIABLES GLOBALES REQUEST
    // =====================================================

    const {
      tipo,
      tema,
      formato,
      categoria,
      imagenBase64,
      guion,
      escenas,
      estilo
    } = data;

    // =====================================================
    // VALIDACIÓN GENERAL
    // =====================================================

    if (!tipo) {

      return new Response(
        JSON.stringify({
          error: "Falta tipo"
        }),
        {
          headers: corsHeaders
        }
      );

    }

    // =====================================================
    // HELPERS GLOBALES
    // =====================================================

    const safe = (v) =>
      v?.trim() || "No especificado";

    // =====================================================
    // RESPUESTAS JSON
    // =====================================================

    const ok = (data) =>
      new Response(
        JSON.stringify(data),
        {
          headers: corsHeaders
        }
      );

    const fail = (error) =>
      new Response(
        JSON.stringify({
          error
        }),
        {
          headers: corsHeaders
        }
      );

    // =====================================================
    // IA GLOBAL PIXELLAB45
    // =====================================================

    const ai = async (prompt) => {

      const res = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fp8",
        {
          messages: [

            {
              role: "system",
              content: `
Eres PIXELLAB45 AI.

Eres creativo.

No repites ideas.

Generas contenido original.

Desarrollas respuestas extensas.

No resumes.
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

    // =====================================================
    // ROUTER PRINCIPAL PIXELLAB45
    // =====================================================

    switch (tipo) {

      // =====================================================
// LISTAR IMÁGENES
// Devuelve todas las imágenes almacenadas en R2
// =====================================================

case "listar-imagenes": {

  try {

    if (!env.IMAGES) {
      return fail("Bucket IMAGES no configurado");
    }

    const objetos =
      await env.IMAGES.list();

    const imagenes =
      objetos.objects.map(obj => ({

        nombre: obj.key,

        url:
          `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`

      }));

    return ok(imagenes);

  } catch (error) {

    return fail(error.message);

  }

}

   // =====================================================
// GUARDAR IMAGEN
// Guarda una imagen PNG en R2
// =====================================================

case "guardar-imagen": {

  try {

    if (!env.IMAGES) {

      return fail(
        "Bucket IMAGES no configurado"
      );

    }

    if (!imagenBase64) {

      return fail(
        "No se recibió imagenBase64"
      );

    }

    if (!categoria) {

      return fail(
        "No se recibió categoría"
      );

    }

    const base64 =
      imagenBase64.split(",")[1];

    const binario =
      Uint8Array.from(
        atob(base64),
        c => c.charCodeAt(0)
      );

    const nombreArchivo =
      `${categoria}/${Date.now()}.png`;

    await env.IMAGES.put(
      nombreArchivo,
      binario,
      {
        httpMetadata: {
          contentType: "image/png"
        }
      }
    );

    return ok({
      success: true,
      nombre: nombreArchivo
    });

  } catch (error) {

    return fail(
      error.message
    );

  }

}
      // =====================================================
// IDEAS DE CONTENIDO
// Genera ideas virales para redes sociales
// =====================================================

case "ideas": {

  try {

    const match =
      tema?.match(/\d+/);

    let cantidad =
      match
        ? parseInt(match[0])
        : 5;

    if (cantidad > 20) {
      cantidad = 20;
    }

    const resultado =
      await ai(`
Eres un generador profesional de ideas virales.

Genera EXACTAMENTE ${cantidad} ideas sobre:

${tema}

REGLAS:

- No repetir ideas.
- Cada idea debe ser diferente.
- No agregar texto fuera de las ideas.
- Pensar como creador de contenido viral.

FORMATO:

Idea 1:
Título:
Gancho:
Desarrollo:

Idea 2:
Título:
Gancho:
Desarrollo:

Continúa hasta completar ${cantidad} ideas.
`);

    return ok({
      ideas: resultado
    });

  } catch (error) {

    return fail(
      error.message
    );

  }

}
      // =====================================================
      // PROMPTS VIDEO
      // =====================================================

      case "prompt": {

        break;

      }

      // =====================================================
      // PROMPTS VISUALES
      // =====================================================

      case "visuales": {

        break;

      }

      // =====================================================
      // GUIONES
      // =====================================================

      case "script": {

        break;

      }

      // =====================================================
      // STORYBOARD
      // =====================================================

      case "storyboard": {

        break;

      }

      // =====================================================
      // GENERADOR DE IMÁGENES
      // =====================================================

      case "imagen": {

        break;

      }

      // =====================================================
      // EBOOKS
      // =====================================================

      case "ebook": {

        break;

      }

      // =====================================================
      // KLING
      // =====================================================

      case "kling": {

        break;

      }

      // =====================================================
      // DEFAULT
      // =====================================================

      default:

        return fail("Tipo no válido");

    }

  }

};
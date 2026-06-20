// ============================
// PIXELLAB45 WORKER LIMPIO
// ============================  

// ============================
// CEREBRO PIXELLAB45
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

Crear contenido de máxima calidad
para creadores digitales, emprendedores
y entusiastas de la tecnología.

REGLAS:

- Evita respuestas genéricas.
- Evita relleno innecesario.
- Sé específico.
- Sé práctico.
- Usa ejemplos reales cuando sea útil.
- Prioriza claridad y valor.
- Piensa paso a paso antes de responder.
- Entrega contenido listo para usar.
- Mantén un nivel profesional.
- Utiliza lenguaje natural y moderno.

TEMÁTICAS PRIORITARIAS:

- Inteligencia Artificial
- ChatGPT
- Automatización
- Herramientas IA
- Productividad
- Marketing Digital
- Redes Sociales
- Creación de Contenido
- Tecnología
- Futuro Digital

Si el usuario solicita:

IDEAS:
Genera ideas originales, virales y accionables.

PROMPTS:
Genera prompts completos, optimizados y detallados.

VISUALES:
Genera prompts cinematográficos profesionales para:

- Imagen IA
- Thumbnail YouTube
- Video IA

Cada prompt debe incluir:

- Descripción visual detallada
- Iluminación
- Cámara
- Estilo artístico
- Composición
- Nivel de detalle cinematográfico

Los prompts visuales deben estar en inglés
y ser compatibles con:

- Kling
- Veo
- Runway
- Pika
- Minimax
- Midjourney
- Flux
- Stable Diffusion

GUIONES:
Genera guiones con gancho, desarrollo y CTA.

STORYBOARDS:
Genera escenas cinematográficas detalladas.

EBOOKS:
Genera contenido educativo profundo y estructurado.
`;

}

// Llamada al modelo de texto
async function consultarIA(env, promptUsuario) {

  const resultado = await env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    {
      messages: [
        {
          role: "system",
          content: crearPromptSistema()
        },
        {
          role: "user",
          content: promptUsuario
        }
      ]
    }
  );

  return resultado.response;

}

// ============================
// WORKER
// ============================

export default {
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
        categoria
      } = data;

      if (!data || !data.tipo) {
        return new Response(
          JSON.stringify({
            error: "Payload inválido: se requiere 'tipo'"
          }),
          {
            headers: { "Content-Type": "application/json"
  
  
    switch (tipo) {

      
case "ideas": {

  const variacion =
    Math.floor(Math.random() * 100000);

  const prompt = `
Variación creativa: ${variacion}

Genera 10 ideas NUEVAS sobre:

${tema}

IMPORTANTE:

- No repitas ideas comunes.
- Si este tema ya fue consultado antes, crea enfoques diferentes.
- Busca ángulos originales.
- Combina tendencias tecnológicas actuales.
- Prioriza curiosidad, sorpresa y utilidad.
- Cada idea debe ser distinta de las demás.
- Evita reformular la misma idea.

Formato:

1. Título
   Breve descripción

2. Título
   Breve descripción

...

10. Título
    Breve descripción
`;

  const respuesta =
    await consultarIA(env, prompt);

  return new Response(
    JSON.stringify({
      ideas: respuesta
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

}
    
    case "prompt": {

  const variacion =
    Math.floor(Math.random() * 100000);

  const prompt = `
Variación creativa: ${variacion}

Genera un prompt profesional para crear contenido.

Tema:
${tema}

Formato:
${formato}

IMPORTANTE:

- Genera una versión diferente cada vez.
- Evita reutilizar estructuras idénticas.
- Busca enfoques nuevos.
- Cambia ángulos, ejemplos y estrategias.
- Mantén alta calidad profesional.
- El resultado debe ser listo para usar.

Incluye:

- Objetivo
- Público objetivo
- Estructura recomendada
- Estilo de comunicación
- CTA
- Consejos de ejecución

Entrega únicamente el prompt final.
`;

  const respuesta =
    await consultarIA(env, prompt);

  return new Response(
    JSON.stringify({
      resultado: respuesta
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

    }

      case "script": {

  const variacion =
    Math.floor(Math.random() * 100000);

  const prompt = `
Variación creativa: ${variacion}

Crea un guion profesional sobre:

${tema}

REQUISITOS:

- Genera una versión diferente cada vez.
- Evita estructuras repetidas.
- Usa un gancho potente en los primeros segundos.
- Mantén ritmo dinámico.
- Aporta valor real.
- Utiliza lenguaje natural.
- Diseñado para contenido viral.

ESTRUCTURA:

🎯 GANCHO

Captar atención inmediatamente.

📚 DESARROLLO

Explicar el tema paso a paso.

💡 DATO IMPACTANTE

Agregar una curiosidad,
estadística o hecho sorprendente.

🚀 CIERRE

Resumen breve.

📢 CTA

Invitación a comentar,
seguir o compartir.

IMPORTANTE:

- Listo para narrar.
- Sin explicaciones adicionales.
- Entrega únicamente el guion final.
`;

  const respuesta =
    await consultarIA(env, prompt);

  return new Response(
    JSON.stringify({
      resultado: respuesta
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

    }
case "visuales": {

  const variacion =
    Math.floor(Math.random() * 100000);

  const prompt = `
Variación creativa: ${variacion}

Tema:

${tema}

Genera 3 prompts visuales profesionales.

PROMPT 1:
Imagen IA

PROMPT 2:
Thumbnail YouTube

PROMPT 3:
Video IA

REQUISITOS:

- Todos los prompts deben estar en inglés.
- Calidad cinematográfica.
- Ultra detallados.
- Diferentes entre sí.
- Evitar repeticiones.
- Incluir composición visual.
- Incluir iluminación.
- Incluir lente o cámara.
- Incluir profundidad de campo.
- Incluir estilo visual.
- Incluir ambiente.
- Incluir nivel de detalle profesional.

Compatibles con:

- Kling
- Veo
- Runway
- Pika
- Minimax
- Midjourney
- Flux
- Stable Diffusion

FORMATO:

🎨 IMAGEN IA

[prompt]

────────────────

📺 THUMBNAIL

[prompt]

────────────────

🎬 VIDEO IA

[prompt]

Entrega únicamente los prompts.
`;

  const respuesta =
    await consultarIA(env, prompt);

  return new Response(
    JSON.stringify({
      resultado: respuesta
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

      }
        case "storyboard": {

  const variacion =
    Math.floor(Math.random() * 100000);

  const prompt = `
Variación creativa: ${variacion}

Convierte el siguiente guion en un storyboard cinematográfico profesional.

GUION:

${guion}

REQUISITOS:

- Genera una versión diferente cada vez.
- Crea escenas claras y visuales.
- Divide el contenido en secuencias lógicas.
- Mantén coherencia narrativa.
- Piensa en videos para IA.

Para cada escena incluye:

🎬 ESCENA X

⏱️ Duración

🎙️ Narración

🎥 Descripción visual

📷 Movimiento de cámara

💡 Iluminación

🎨 Estilo visual

📝 Prompt Kling

IMPORTANTE:

- Calidad cinematográfica.
- Descripciones detalladas.
- Pensado para Kling, Veo y Runway.
- No agregues explicaciones fuera del storyboard.

Entrega únicamente el storyboard final.
`;

  const respuesta =
    await consultarIA(env, prompt);

  return new Response(
    JSON.stringify({
      resultado: respuesta
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

        }
        case "guardar-imagen": {

  if (!env.IMAGES) {
    return new Response(JSON.stringify({
      success: false,
      error: "Bucket IMAGES no configurado"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!imagenBase64) {
    return new Response(JSON.stringify({
      success: false,
      error: "Falta imagenBase64"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  const base64 = imagenBase64.replace(
    /^data:image\/\w+;base64,/,
    ""
  ).trim();

  const bytes = Uint8Array.from(
    atob(base64),
    c => c.charCodeAt(0)
  );

  const nombre = `${categoria || "general"}/${Date.now()}-pixellab45.png`;

  await env.IMAGES.put(nombre, bytes, {
    httpMetadata: {
      contentType: "image/png"
    }
  });

  return new Response(JSON.stringify({
    success: true,
    nombre,
    url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${nombre}`
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
    }
        case "listar-imagenes": {

  if (!env.IMAGES) {
    return new Response(JSON.stringify({
      success: false,
      error: "Bucket IMAGES no configurado"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  const objetos = await env.IMAGES.list({
    limit: 1000
  });

  const imagenes = objetos.objects.map(obj => ({
    nombre: obj.key,
    url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`,
    size: obj.size,
    fecha: obj.uploaded
  }));

  // ordenar por más recientes primero (por nombre timestamp)
  imagenes.sort((a, b) => b.nombre.localeCompare(a.nombre));

  return new Response(JSON.stringify({
    success: true,
    total: imagenes.length,
    imagenes
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
        }
      default:

  return new Response(
    JSON.stringify({
      error: "Tipo no válido"
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

    }

  }

};
return new Response(
  JSON.stringify({
    debugData: data
  }),
  {
    headers: { "Content-Type": "application/json" }
  }
);

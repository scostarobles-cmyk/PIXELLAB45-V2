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

    const {
      tipo,
      tema,
      formato,
      guion,
      escenas,
      estilo
    } = await request.json();

    

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
    
      case "prompt":

        // código prompt

        break;

      case "script":

        // código guion

        break;

      default:

        return new Response(
          JSON.stringify({
            error: "Tipo no válido"
          })
        );

    }

  }

};

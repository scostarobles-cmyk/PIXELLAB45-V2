export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ message: "PIXELLAB45 API" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    try {

      const {
  tema,
  tipo,
  formato,
  guion,
  escenas,
  estilo
} = await request.json();

      let prompt = "";

      // 🖼️ VISUALES
      if (tipo === "visuales") {

        prompt = `
Genera prompts visuales cinematográficos para IA de imágenes y video.

Tema: ${tema}

Devuelve:
🎨 IMAGEN PRINCIPAL
📱 MINIATURA YOUTUBE
🎬 VIDEO IA

Cada prompt debe ser detallado, cinematográfico, futurista, profesional y en inglés.
`;

      }

      // 🧾 PROMPT POR FORMATO
      else if (tipo === "prompt") {

        prompt = `
Actúa como un experto en creación de contenido.

Genera un prompt profesional para ${formato}.

Tema: ${tema}

Si el formato es TikTok:
- Gancho viral
- Duración 30 a 60 segundos
- CTA

Si el formato es YouTube:
- Título SEO
- Estructura
- Retención

Si el formato es Instagram:
- Copy + hashtags + CTA

Si el formato es Blog:
- SEO completo

Si el formato es Ebook:
- Estructura completa

Devuelve únicamente el contenido final.
`;

      }
        // 🎬 GUIONES IA
else if (tipo === "script") {

  prompt = `
Actúa como un guionista experto en videos cortos sobre tecnología e inteligencia artificial.

Tema: ${tema}

Genera un guion de narración para TikTok, Reels o Shorts.

Estructura obligatoria:

🎯 GANCHO

🎬 DESARROLLO

🔥 CIERRE

📢 CTA

Duración aproximada: 60 segundos.

No incluyas escenas.
No incluyas instrucciones visuales.
Solo la narración lista para voz en off.
`;

}

     // 🎬 STORYBOARD IA
else if (tipo === "storyboard") {

  prompt = `
Convierte el siguiente guion en un storyboard cinematográfico.

Guion:
${guion}

Cantidad de escenas: ${escenas}

Estilo visual: ${estilo}

Reglas:

- Genera exactamente ${escenas} escenas.
- Distribuye el contenido del guion entre las escenas.
- Cada escena debe incluir:

🎬 ESCENA X

🎙️ Narración

🎥 Visual

📷 Cámara

🎨 Estilo

⏱️ Duración

- El estilo visual debe respetar:
${estilo}

- Compatible con Kling, Veo, Runway, Pika y Minimax.
- Formato profesional cinematográfico.
`;

}

//  🖼️ GENERADOR DE IMAGEN
else if (tipo === "imagen") {

  const result = await env.AI.run(
    "@cf/lykon/dreamshaper-8-lcm",
    {
      prompt: `
${tema},
cinematic lighting, ultra detailed, highly realistic, sharp focus, depth of field, 8k
      `
    }
  );

  return new Response(result, {
    headers: {
      ...corsHeaders,
      "Content-Type": "image/png"
    }
  });
}// 🧠 IDEAS (default)
      else {

        prompt = `
Genera 10 ideas virales sobre ${tema}.

Devuelve solo una lista numerada.
`;
      }

      const result = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fp8",
        {
          messages: [
            { role: "user", content: prompt }
          ]
        }
      );

      let response;

      if (
  tipo === "visuales" ||
  tipo === "prompt" ||
  tipo === "script" ||
  tipo === "storyboard"
) {
  response = { resultado: result.response };
} else {
  response = { ideas: result.response };
}

      return new Response(
        JSON.stringify(response),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {

      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};

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
  estilo,
        categoria,
        imagenBase64,
        video,
        contenido,
        modo,
        duracion
        
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

  // 📚 EBOOK IA
else if (tipo === "ebook") {

  prompt = `
Actúa como un autor profesional especializado en crear ebooks educativos.

Tema: ${tema}

Genera un ebook completo con la siguiente estructura:

# TÍTULO

## INTRODUCCIÓN

Explica por qué el tema es importante y qué aprenderá el lector.

## CAPÍTULO 1

Desarrolla los conceptos fundamentales.

## CAPÍTULO 2

Profundiza en aplicaciones prácticas, ejemplos y casos de uso.

## CAPÍTULO 3

Explica estrategias, recomendaciones y buenas prácticas.

## CONCLUSIÓN

Resume los puntos principales y propone próximos pasos para el lector.

Reglas importantes:

- Escribe en español neutro.
- Utiliza subtítulos cuando sea necesario.
- Usa párrafos completos.
- Aporta ejemplos concretos.
- Mantén un tono profesional y didáctico.
- Evita listas excesivas.
- No expliques que eres una IA.
- Devuelve únicamente el ebook terminado.
`;

}
  else if (tipo === "video") {

  try {

    const resultado = await env.AI.run(
      "alibaba/wan-2.7-i2v",
      {
        image: "https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/personajes/1781750593334-pixellab45.png",
        prompt: contenido || "A gentle camera push-in on the scene with soft ambient lighting"
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        modelo: "alibaba/wan-2.7-i2v",
        resultado
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: String(error)
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  }

  }
  // ☁️ GUARDAR IMAGEN EN R2
else if (tipo === "guardar-imagen") {

  const base64 = imagenBase64.replace(
    /^data:image\/\w+;base64,/,
    ""
  );

  const bytes = Uint8Array.from(
    atob(base64),
    c => c.charCodeAt(0)
  );

  const nombreFinal =
  `${categoria || "general"}/${Date.now()}-pixellab45.png`;

  await env.IMAGES.put(
    nombreFinal,
    bytes,
    {
      httpMetadata: {
        contentType: "image/png"
      }
    }
  );

  return new Response(
    JSON.stringify({
      success: true,
      nombre: nombreFinal
    }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );
}
  // 📂 LISTAR IMÁGENES
else if (tipo === "listar-imagenes") {

  const objetos = await env.IMAGES.list();

  const imagenes = objetos.objects.map(obj => ({
    nombre: obj.key,
    url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`
  }));

  return new Response(
    JSON.stringify(imagenes),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );
    }

// 🖼️ GENERADOR DE IMAGEN
else if (tipo === "imagen") {

  const imagen = await env.AI.run(
    "@cf/lykon/dreamshaper-8-lcm",
    {
      prompt: `
${tema},
cinematic lighting,
ultra detailed,
highly realistic,
sharp focus,
depth of field,
8k
      `
    }
  );

  return new Response(
    imagen,
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png"
      }
    }
  );

}
// 🧠 IDEAS (default)
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
  tipo === "storyboard"|| 
  tipo === "ebooks"
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

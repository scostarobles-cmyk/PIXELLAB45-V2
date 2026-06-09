function generarPrompt(){

  const tema =
    document.getElementById("temaPrompt").value;

  const tipo =
    document.getElementById("tipoContenido").value;

  let resultado = "";

  if(tipo === "TikTok"){

    resultado = `
🎯 TEMA:
${tema}

🔥 GANCHO:
"Si todavía no conoces ${tema}, estás perdiendo una oportunidad enorme."

🎬 GUION:
Explica rápidamente qué es ${tema},
por qué está de moda y cómo puede ayudar.

📢 CTA:
"Sígueme para más contenido de IA."

🎨 PROMPT IMAGEN:
Futuristic ${tema}, neon blue lights,
ultra realistic, cinematic.

🎥 PROMPT VIDEO:
Fast paced social media video about ${tema},
dynamic camera movement, cyberpunk style.
`;

  }

  else if(tipo === "YouTube"){

    resultado = `
🎯 TEMA:
${tema}

📺 TÍTULO:
Todo lo que debes saber sobre ${tema}

📝 DESCRIPCIÓN:
Aprende cómo funciona ${tema},
sus ventajas y aplicaciones reales.

🎬 GUION:
Introducción
Conceptos básicos
Ejemplos prácticos
Conclusión

📢 CTA:
Suscríbete para más contenido tecnológico.

🎨 PROMPT MINIATURA:
Professional YouTube thumbnail,
${tema}, futuristic technology,
blue neon glow.
`;

  }

  else if(tipo === "Instagram"){

    resultado = `
📸 POST INSTAGRAM

Tema:
${tema}

✍️ TEXTO:

¿Conoces ${tema}?

Aquí tienes una explicación rápida
para entender por qué cada vez más
personas hablan de ello.

🔥 HASHTAGS:

#IA
#Tecnologia
#Innovacion
#PIXELLAB45
#InteligenciaArtificial

🎨 PROMPT IMAGEN:
Instagram tech artwork,
${tema},
cyberpunk aesthetics.
`;

  }

  else if(tipo === "Blog"){

    resultado = `
📰 ARTÍCULO BLOG

Título:
Guía completa sobre ${tema}

Introducción

¿Qué es ${tema}?

Ventajas

Aplicaciones

Conclusión

SEO Keywords:
${tema}
tecnología
inteligencia artificial

🎨 Imagen destacada:
Professional blog cover about ${tema},
modern technology theme.
`;

  }

  else if(tipo === "Ebook"){

    resultado = `
📚 EBOOK

Título:
Domina ${tema}

ÍNDICE

Capítulo 1:
Introducción

Capítulo 2:
Conceptos fundamentales

Capítulo 3:
Herramientas recomendadas

Capítulo 4:
Casos prácticos

Capítulo 5:
Estrategias avanzadas

Conclusión

🎨 PORTADA:

Premium ebook cover about ${tema},
futuristic technology,
blue neon lights,
professional publishing design.
`;

  }

  document.getElementById(
    "resultadoPrompt"
  ).innerText = resultado;
}
function copiarPrompt(){

  const texto =
    document.getElementById("resultadoPrompt").innerText;

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeCopiado").innerText =
    "✅ Prompt copiado correctamente";

  setTimeout(() => {
    document.getElementById("mensajeCopiado").innerText = "";
  }, 3000);
  console.log("Botón copiar funcionando");

  document.getElementById("mensajeCopiado").innerText =
  "✅ BOTÓN FUNCIONANDO";
  

}
function generarGuion(){

  const tema =
    document.getElementById("temaGuion").value;

  const duracion =
    document.getElementById("duracionGuion").value;

  let guion = "";

  if(duracion === "15 segundos"){

    guion = `
🎬 GUION CORTO

🎯 Gancho:
"¿Sabías esto sobre ${tema}?"

📝 Desarrollo:
Explica rápidamente qué es y por qué importa.

📢 CTA:
"Sígueme para más contenido."
`;

  }

  else if(duracion === "30 segundos"){

    guion = `
🎬 GUION MEDIO

🎯 Gancho:
"Lo que nadie te cuenta sobre ${tema}"

📝 Desarrollo:
Explica el concepto.

Muestra ejemplos.

Beneficios principales.

📢 CTA:
"Guarda este video y sígueme."
`;

  }

  else{

    guion = `
🎬 GUION LARGO

🎯 Introducción

¿Qué es ${tema}?

📝 Desarrollo

Cómo funciona.

Ventajas.

Ejemplos reales.

Errores comunes.

📢 Conclusión

Resumen final.

CTA para seguir la cuenta.
`;

  }

  document.getElementById(
    "resultadoGuion"
  ).innerText = guion;
}
function copiarGuion(){

  const texto =
    document.getElementById("resultadoGuion").innerText;

  if(texto.trim() === ""){
    document.getElementById("mensajeGuionCopiado").innerText =
      "⚠️ Primero genera un guion";
    return;
  }

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeGuionCopiado").innerText =
    "✅ Guion copiado correctamente";

  setTimeout(() => {
    document.getElementById("mensajeGuionCopiado").innerText = "";
  }, 3000);
}
function generarIdeas(){

  const tema =
    document.getElementById("temaIdea").value;

  let ideas = `
💡 IDEAS DE CONTENIDO SOBRE ${tema}

1. ¿Qué es ${tema} y por qué todos hablan de ello?
2. 5 herramientas relacionadas con ${tema}
3. Errores comunes al usar ${tema}
4. Cómo empezar con ${tema}
5. Tendencias futuras de ${tema}
6. Casos reales de uso de ${tema}
7. Mitos y verdades sobre ${tema}
8. Cómo ganar dinero usando ${tema}
9. Comparativa de herramientas de ${tema}
10. Lo que nadie te cuenta sobre ${tema}
`;

  document.getElementById(
    "resultadoIdeas"
  ).innerText = ideas;
}

function copiarIdeas(){

  const texto =
    document.getElementById("resultadoIdeas").innerText;

  if(texto.trim() === ""){
    document.getElementById("mensajeIdeasCopiadas").innerText =
      "⚠️ Primero genera ideas";
    return;
  }

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeIdeasCopiadas").innerText =
    "✅ Ideas copiadas correctamente";

  setTimeout(() => {
    document.getElementById("mensajeIdeasCopiadas").innerText = "";
  }, 3000);
}
function generarStoryboard(){

  const guion =
    document.getElementById("textoStoryboard").value;

  if(guion.trim() === ""){

    document.getElementById("mensajeStoryboard").innerText =
      "⚠️ Primero pega un guion";

    return;
  }

  const storyboard = `
🎬 STORYBOARD PIXELLAB45

ESCENA 1
⏱️ Duración: 3 segundos

🎙️ Narración:
Gancho inicial.

🎥 Visual:
Plano futurista relacionado con el tema.

──────────────────

ESCENA 2
⏱️ Duración: 5 segundos

🎙️ Narración:
Desarrollo principal.

🎥 Visual:
Interfaz de IA mostrando información.

──────────────────

ESCENA 3
⏱️ Duración: 4 segundos

🎙️ Narración:
Llamado a la acción.

🎥 Visual:
Logo PIXELLAB45 con efecto neón.
`;

  document.getElementById(
    "resultadoStoryboard"
  ).innerText = storyboard;
}

function copiarStoryboard(){

  const texto =
    document.getElementById("resultadoStoryboard").innerText;

  if(texto.trim() === ""){

    document.getElementById("mensajeStoryboard").innerText =
      "⚠️ Primero genera un storyboard";

    return;
  }

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeStoryboard").innerText =
    "✅ Storyboard copiado correctamente";

  setTimeout(() => {
    document.getElementById("mensajeStoryboard").innerText = "";
  }, 3000);
}

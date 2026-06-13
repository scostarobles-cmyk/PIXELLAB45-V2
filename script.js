console.log("SCRIPT CARGADO OK");
function generarPrompt() {

  const tema =
    document.getElementById("temaPrompt").value;

  const tipo =
    document.getElementById("tipoContenido").value;

  if (tema.trim() === "") {

    document.getElementById("resultadoPrompt").innerText =
      "⚠️ Escribe un tema primero";

    return;
  }
let prompt = "";

if(tipo === "TikTok"){

prompt = `
🚀 PROMPT PIXELLAB45 - TIKTOK VIRAL

Actúa como un creador experto en TikTok.

Crea un video viral sobre:

"${tema}"

Incluye:

🔥 Hook de máximo 3 segundos

🎯 Problema que identifique el público

💡 Solución clara y rápida

📱 Ejemplo práctico

🚀 Cierre impactante

📢 CTA:
"Sígueme para más contenido sobre IA y tecnología"

Duración:
30 segundos

Estilo:
Dinámico, viral y fácil de entender.
`;

}

else if(tipo === "YouTube"){

prompt = `
🚀 PROMPT PIXELLAB45 - YOUTUBE

Actúa como un experto en tecnología.

Crea un guion de YouTube sobre:

"${tema}"

Incluye:

🎬 Introducción atractiva

📚 Explicación detallada

🛠 Casos prácticos

⚠️ Errores comunes

🚀 Conclusión potente

📢 CTA para suscribirse

Duración:
5 a 10 minutos

Estilo:
Educativo y entretenido.
`;

}

else if(tipo === "Instagram"){

prompt = `
🚀 PROMPT PIXELLAB45 - INSTAGRAM

Actúa como creador de contenido para Instagram.

Crea una publicación sobre:

"${tema}"

Incluye:

📸 Texto principal

🔥 Hook inicial

💡 Valor para la audiencia

📢 Llamado a comentar

#️⃣ Hashtags recomendados

Estilo:
Moderno, cercano y visual.
`;

}

else if(tipo === "Blog"){

prompt = `
🚀 PROMPT PIXELLAB45 - BLOG SEO

Actúa como redactor profesional.

Escribe un artículo sobre:

"${tema}"

Incluye:

📝 Título SEO

📚 Introducción

🎯 Desarrollo estructurado

💡 Consejos prácticos

❓ Preguntas frecuentes

🚀 Conclusión

Extensión:
1000 a 1500 palabras.
`;

}

else if(tipo === "Ebook"){

prompt = `
🚀 PROMPT PIXELLAB45 - EBOOK

Actúa como autor profesional.

Crea un ebook completo sobre:

"${tema}"

Incluye:

📖 Índice

📚 Capítulos

🛠 Ejemplos prácticos

💡 Consejos

⚠️ Errores comunes

🚀 Conclusión

Formato:
Profesional y educativo.
`;

}

  document.getElementById(
    "resultadoPrompt"
  ).innerText = prompt;
}

function copiarPrompt(){

  const texto =
    document.getElementById("resultadoPrompt").innerText;

  if(texto.trim() === ""){

    document.getElementById("mensajeCopiado").innerText =
      "⚠️ Primero genera un prompt";

    return;
  }

  const area = document.createElement("textarea");
  area.value = texto;

  document.body.appendChild(area);

  area.select();
  area.setSelectionRange(0, 99999);

  document.execCommand("copy");

  document.body.removeChild(area);

  document.getElementById("mensajeCopiado").innerText =
    "✅ Prompt copiado correctamente";

  setTimeout(() => {
    document.getElementById("mensajeCopiado").innerText = "";
  }, 3000);
}
function generarGuion(){

  const tema =
    document.getElementById("temaGuion").value;

  const duracion =
    document.getElementById("duracionGuion").value;

  if(tema.trim() === ""){

    document.getElementById("resultadoGuion").innerText =
      "⚠️ Escribe un tema primero";

    return;
  }

  function random(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const hooks = [
    `Nadie te cuenta esto sobre ${tema}`,
    `La mayoría usa mal ${tema}`,
    `Este truco con ${tema} te sorprenderá`,
    `Probé ${tema} y ocurrió algo increíble`,
    `Si usas ${tema}, mira esto primero`
  ];

  const ejemplos = [
    `Imagina que usas ${tema} para ahorrar horas de trabajo.`,
    `Un creador de contenido utilizó ${tema} y duplicó su productividad.`,
    `Muchos profesionales ya usan ${tema} diariamente.`,
    `Con ${tema} puedes automatizar tareas repetitivas.`,
    `Las empresas están adoptando ${tema} a gran velocidad.`
  ];

  const cierres = [
    `El futuro de ${tema} recién comienza.`,
    `Ahora sabes por qué ${tema} es tan importante.`,
    `Este cambio está transformando la tecnología.`,
    `Quien aprenda ${tema} tendrá ventaja.`,
    `Estamos viendo solo el comienzo de esta revolución.`
  ];

  const ctas = [
    `Sígueme para más contenido de IA y tecnología.`,
    `Guarda este video para verlo después.`,
    `Comparte esto con alguien que necesite conocerlo.`,
    `Déjame tu opinión en los comentarios.`,
    `¿Ya conocías este truco?`
  ];

  let desarrollo = "";

  if(duracion === "15 segundos"){

    desarrollo = `
🎯 Explica rápidamente qué es ${tema}

💡 Muestra un beneficio clave
`;

  }

  else if(duracion === "30 segundos"){

    desarrollo = `
🎯 Presenta un problema común

💡 Explica cómo ${tema} puede ayudar

📱 Da un ejemplo práctico
`;

  }

  else {

    desarrollo = `
🎯 Presenta el tema

📚 Explica cómo funciona

🛠️ Muestra un caso práctico

⚠️ Comenta un error común
`;

  }

  const guion = `
🎬 GUION PIXELLAB45

Tema:
${tema}

Duración:
${duracion}

━━━━━━━━━━━━━━

🔥 HOOK

${random(hooks)}

━━━━━━━━━━━━━━

🎙️ DESARROLLO

${desarrollo}

━━━━━━━━━━━━━━

📱 EJEMPLO

${random(ejemplos)}

━━━━━━━━━━━━━━

🚀 CIERRE

${random(cierres)}

━━━━━━━━━━━━━━

📢 CTA

${random(ctas)}
`;

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

  const area =
    document.createElement("textarea");

  area.value = texto;

  document.body.appendChild(area);

  area.select();
  area.setSelectionRange(0, 99999);

  document.execCommand("copy");

  document.body.removeChild(area);

  document.getElementById("mensajeGuionCopiado").innerText =
    "✅ Guion copiado correctamente";

  setTimeout(() => {
    document.getElementById("mensajeGuionCopiado").innerText = "";
  }, 3000);


}
function generarStoryboard() {

  const guion =
    document.getElementById("textoStoryboard").value;

  if (guion.trim() === "") {

    document.getElementById("mensajeStoryboard").innerText =
      "⚠️ Primero pega un guion";

    return;
  }

  const lineas =
    guion.split("\n")
    .filter(linea => linea.trim() !== "");

  let storyboard =
    "🎬 STORYBOARD PIXELLAB45\n\n";

  lineas.forEach((linea, index) => {

    storyboard +=
      `ESCENA ${index + 1}\n`;

    storyboard +=
      `⏱️ Duración: 4 segundos\n\n`;

    storyboard +=
      `🎙️ Narración:\n${linea}\n\n`;

    storyboard +=
      `🎥 Visual:\nEscena futurista relacionada con el tema.\n\n`;

    storyboard +=
      `──────────────────\n\n`;
  });

  document.getElementById(
    "resultadoStoryboard"
  ).innerText = storyboard;
}

function copiarStoryboard() {

  const texto =
    document.getElementById("resultadoStoryboard").innerText;

  if (texto.trim() === "") {

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
function generarIdeas(){
 
  const tema =
    document.getElementById("temaIdea").value;

  if(tema.trim() === ""){

    document.getElementById("resultadoIdeas").innerText =
      "⚠️ Escribe un tema primero";

    return;
  }

  function random(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const viral = [
    `Nadie te cuenta esto sobre ${tema}`,
    `La verdad oculta de ${tema}`,
    `Probé ${tema} y esto ocurrió`,
    `Lo que descubrí usando ${tema}`,
    `Todos hablan de ${tema}, pero ignoran esto`
  ];

  const impactante = [
    `Probé ${tema} durante 30 días`,
    `El experimento que hice con ${tema}`,
    `Qué pasó cuando usé ${tema} todos los días`,
    `Mi experiencia real usando ${tema}`,
    `Los resultados inesperados de ${tema}`
  ];

  const dinero = [
    `Cómo ganar dinero usando ${tema}`,
    `5 formas de monetizar ${tema}`,
    `Cómo convertir ${tema} en ingresos`,
    `Cómo conseguir clientes con ${tema}`,
    `Ideas de negocio usando ${tema}`
  ];

  const errores = [
    `Errores que todos cometen con ${tema}`,
    `Lo que nunca debes hacer con ${tema}`,
    `Los fallos más comunes al usar ${tema}`,
    `Por qué la mayoría fracasa con ${tema}`,
    `Errores que te hacen perder tiempo con ${tema}`
  ];

  const educativo = [
    `Guía rápida para dominar ${tema}`,
    `Aprende ${tema} desde cero`,
    `Todo lo básico sobre ${tema}`,
    `Cómo empezar con ${tema}`,
    `Curso express de ${tema}`
  ];

  const futuro = [
    `El futuro de ${tema}`,
    `Cómo cambiará ${tema} en los próximos años`,
    `Las tendencias de ${tema} para 2027`,
    `Qué viene después para ${tema}`,
    `La evolución de ${tema}`
  ];

  const herramientas = [
    `Las mejores herramientas para ${tema}`,
    `Apps que potencian ${tema}`,
    `Herramientas gratuitas para ${tema}`,
    `Top recursos para trabajar con ${tema}`,
    `Kit esencial para usar ${tema}`
  ];

  const shorts = [
    `3 cosas que debes saber sobre ${tema}`,
    `5 datos rápidos sobre ${tema}`,
    `Todo sobre ${tema} en 60 segundos`,
    `Lo más importante de ${tema}`,
    `Resumen express de ${tema}`
  ];

  let ideas = `
🚀 IDEAS PIXELLAB45

━━━━━━━━━━━━━━━━━━

🔥 IDEA VIRAL

${random(viral)}

━━━━━━━━━━━━━━━━━━

🤯 IDEA IMPACTANTE

${random(impactante)}

━━━━━━━━━━━━━━━━━━

💰 IDEA MONETIZACIÓN

${random(dinero)}

━━━━━━━━━━━━━━━━━━

⚠️ IDEA ERROR COMÚN

${random(errores)}

━━━━━━━━━━━━━━━━━━

🎓 IDEA EDUCATIVA

${random(educativo)}

━━━━━━━━━━━━━━━━━━

🔮 IDEA FUTURISTA

${random(futuro)}

━━━━━━━━━━━━━━━━━━

🛠 IDEA HERRAMIENTAS

${random(herramientas)}

━━━━━━━━━━━━━━━━━━

🎬 IDEA SHORTS / TIKTOK

${random(shorts)}
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

  navigator.clipboard.writeText(texto)
    .then(() => {

      document.getElementById("mensajeIdeasCopiadas").innerText =
        "✅ Ideas copiadas correctamente";

      setTimeout(() => {
        document.getElementById("mensajeIdeasCopiadas").innerText = "";
      }, 3000);

    })
    .catch(error => {

      console.error(error);

      alert(
        "No se pudo copiar automáticamente. Intenta mantener presionado el texto y copiar manualmente."
      );

    });

}function generarVisuales(){

  const tema =
    document.getElementById("temaVisual").value;

  let resultado = `
🖼️ PROMPTS VISUALES PIXELLAB45

━━━━━━━━━━━━━━━━━━

🎨 IMAGEN PRINCIPAL

${tema},
futuristic technology,
cyberpunk style,
blue neon lights,
ultra realistic,
cinematic lighting,
8k detail.

━━━━━━━━━━━━━━━━━━

📺 MINIATURA YOUTUBE

Professional YouTube thumbnail,
${tema},
technology background,
blue neon glow,
high contrast.

━━━━━━━━━━━━━━━━━━

📱 PORTADA TIKTOK

${tema},
vertical composition,
social media style,
modern futuristic design.

━━━━━━━━━━━━━━━━━━

🎥 VIDEO IA

${tema},
cinematic camera movement,
futuristic environment,
dynamic motion,
blue neon lighting,
technology atmosphere.
`;

  document.getElementById(
    "resultadoVisual"
  ).innerText = resultado;
}

function copiarVisuales(){

  const texto =
    document.getElementById("resultadoVisual").innerText;

  if(texto.trim() === ""){

    document.getElementById("mensajeVisual").innerText =
      "⚠️ Primero genera prompts";

    return;
  }

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeVisual").innerText =
    "✅ Prompts copiados correctamente";

  setTimeout(() => {
    document.getElementById("mensajeVisual").innerText = "";
  }, 3000);
}

async function generarImagen() {

const prompt =
document.getElementById("promptImagen").value;

const resultado =
document.getElementById("resultadoImagen");

if (!prompt.trim()) {

resultado.innerHTML =
  "⚠️ Escribe un prompt primero";

return;

}

try {

resultado.innerHTML =
  "🎨 Generando imagen...";

const respuesta = await fetch(
  "https://pixellab45-v2.scostarobles.workers.dev/",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt
    })
  }
);

const datos =
  await respuesta.json();

console.log("Respuesta Worker:", datos);

if (!datos.ok) {

  resultado.innerHTML =
    `❌ ${datos.error || "Error desconocido"}`;

  return;
}

const prediction =
  datos.data;

if (
  prediction.status === "succeeded"
) {

  let imagen = prediction.output;

  if (Array.isArray(imagen)) {
    imagen = imagen[0];
  }

  resultado.innerHTML = `
    <img
      src="${imagen}"
      alt="Imagen generada"
      style="
        width:100%;
        max-width:600px;
        border-radius:12px;
        margin-top:10px;
      ">
  `;

} else {

  resultado.innerHTML =
    `❌ Estado: ${prediction.status}`;

}

} catch(error) {

console.error(error);

resultado.innerHTML =
  `❌ ${error.message}`;

}

}

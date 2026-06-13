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

  let prompt = `
Crea contenido para ${tipo}
sobre:

${tema}

Incluye:

✅ Título atractivo
✅ Introducción
✅ Desarrollo
✅ Llamado a la acción
`;

  document.getElementById(
    "resultadoPrompt"
  ).innerText = prompt;
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

}function generarGuion(){

  const tema =
    document.getElementById("temaGuion").value;

  const duracion =
    document.getElementById("duracionGuion").value;

  let guion = `
🎬 GUION PIXELLAB45

Tema:
${tema}

Duración:
${duracion}

━━━━━━━━━━━━━━

🎙️ INTRO

¿Sabías que ${tema}
está cambiando el mundo?

━━━━━━━━━━━━━━

🎙️ DESARROLLO

Explica los beneficios,
casos de uso y ejemplos.

━━━━━━━━━━━━━━

🎙️ CTA

Sígueme para más contenido
sobre IA y tecnología.
`;

  document.getElementById(
    "resultadoGuion"
  ).innerText = guion;
}

function copiarGuion(){

  const texto =
    document.getElementById("resultadoGuion").innerText;

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeGuionCopiado").innerText =
    "✅ Guion copiado correctamente";

  setTimeout(() => {
    document.getElementById("mensajeGuionCopiado").innerText = "";
  }, 3000);

}function generarStoryboard() {

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
 alert("Generador funcionando");
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

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeIdeasCopiadas").innerText =
    "✅ Ideas copiadas correctamente";

  setTimeout(() => {
    document.getElementById("mensajeIdeasCopiadas").innerText = "";
  }, 3000);

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

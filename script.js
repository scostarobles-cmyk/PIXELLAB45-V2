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
async function generarIdeas() {

  const tema = document.getElementById("tema").value;

  if (!tema.trim()) {
    document.getElementById("resultado").innerHTML =
      "<li>⚠️ Escribe un tema primero</li>";
    return;
  }

  try {

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tema })
      }
    );

    const data = await res.json();

    console.log("DATA:", data);

    const texto =
      data.ideas ||
      data.response ||
      "No se recibieron ideas";

    const ideas = texto
      .split("\n")
      .filter(i => i.trim());

    document.getElementById("resultado").innerHTML =
      ideas.map(i => `<li>${i}</li>`).join("");

  } catch (error) {

    console.error("ERROR:", error);

    document.getElementById("resultado").innerHTML =
      `<li>❌ ${error.message}</li>`;
  }
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

  try {

    resultado.innerHTML = "🎨 Generando imagen...";

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

    const datos = await respuesta.json();

    if (
      datos.status === "succeeded" &&
      datos.output
    ) {

      resultado.innerHTML = `
        <img
          src="${datos.output}"
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
        "❌ Error generando imagen";

    }

  } catch(error) {

    resultado.innerHTML =
      "❌ " + error.message;

  }

  }

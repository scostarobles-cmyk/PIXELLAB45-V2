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


async function generarIdeas() {

  const tema = document.getElementById("tema").value;

  try {

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tema,
          tipo: "ideas"
        })
      }
    );

    const data = await res.json();

    document.getElementById("resultado").innerHTML = `
<div style="white-space: pre-wrap;">
${data.ideas}
</div>
`;

  } catch (error) {

    document.getElementById("resultado").innerHTML =
      "<li>ERROR: " + error.message + "</li>";

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

  async function generarVisuales() {

  const tema =
    document.getElementById("temaVisual").value;

  if (!tema.trim()) {

    document.getElementById("resultadoVisual").innerHTML =
      "⚠️ Escribe un tema primero";

    return;
  }

  try {

    document.getElementById("resultadoVisual").innerHTML =
      "🎨 Generando prompts visuales...";

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "visuales",
          tema
        })
      }
    );

    const data = await res.json();

    document.getElementById("resultadoVisual").innerHTML =
      `<div style="white-space: pre-wrap;">${data.resultado}</div>`;

  } catch (error) {

    document.getElementById("resultadoVisual").innerHTML =
      `❌ ${error.message}`;

  }

}
}function generarVisuales(){

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

console.log("SCRIPT CARGADO OK");
async function generarPrompt() {

  const tema =
    document.getElementById("temaPrompt").value;

  const tipo =
    document.getElementById("tipoContenido").value;

  if (!tema.trim()) {

    document.getElementById("resultadoPrompt").innerText =
      "⚠️ Escribe un tema primero";

    return;
  }

  try {

    document.getElementById("resultadoPrompt").innerText =
      "✍️ Generando prompt...";

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "prompt",
          tema,
          formato: tipo
        })
      }
    );

    const data = await res.json();

    document.getElementById("resultadoPrompt").innerText =
      data.resultado;

  } catch (error) {

    document.getElementById("resultadoPrompt").innerText =
      "❌ " + error.message;

  }

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

}async function generarGuion(){

  const tema =
    document.getElementById("temaGuion").value;

  const resultado =
    document.getElementById("resultadoGuion");

  if (!tema.trim()) {
    resultado.innerText = "⚠️ Escribe un tema primero";
    return;
  }

  try {

    resultado.innerText = "🎬 Generando guion...";

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tema,
          tipo: "script"
        })
      }
    );

    const data = await res.json();

    resultado.innerText = data.resultado;

  } catch (error) {
    resultado.innerText = "❌ " + error.message;
  }
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

}
async function generarStoryboard() {

  const guion =
    document.getElementById("textoStoryboard").value;

  const escenas =
    document.getElementById("cantidadEscenas").value;

  const estilo =
    document.getElementById("estiloStoryboard").value;

  const resultado =
    document.getElementById("resultadoStoryboard");

  if (!guion.trim()) {

    document.getElementById("mensajeStoryboard").innerText =
      "⚠️ Primero pega un guion";

    return;
  }

  try {

    resultado.innerText =
      "🎬 Generando storyboard...";

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "storyboard",
          guion,
          escenas,
          estilo
        })
      }
    );

    const data = await res.json();

    resultado.innerText =
      data.resultado;

  } catch (error) {

    resultado.innerText =
      "❌ " + error.message;

  }

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

    document.getElementById("resultadoIdeas").innerHTML = `
<div style="white-space: pre-wrap;">
${data.ideas}
</div>
`;

  } catch (error) {

    document.getElementById("resultadoIdeas").innerHTML =
  "<div>ERROR: " + error.message + "</div>";
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

}

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
          tema,
          tipo: "visuales"
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

  const respuesta = await fetch(
  "https://pixellab45-v2.scostarobles.workers.dev/",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tipo: "imagen",
      tema: prompt
    })
  }
);

const blob = await respuesta.blob();
const url = URL.createObjectURL(blob);

resultado.innerHTML = `
  <img src="${url}" style="width:100%;max-width:600px;border-radius:12px;">
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
function toggleMenu(){

  document
    .querySelector(".nav-links")
    .classList
    .toggle("active");

}
document.querySelectorAll(".nav-links a")
.forEach(link => {

  link.addEventListener("click", () => {

    document
      .querySelector(".nav-links")
      .classList.remove("active");

  });

});

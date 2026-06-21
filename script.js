console.log("SCRIPT CARGADO OK");
async function generarPrompt() {

  const tema = document.getElementById("temaPrompt").value;
  const tipo = document.getElementById("tipoContenido").value;

  if (!tema.trim()) {
    document.getElementById("resultadoPrompt").innerText =
      "⚠️ Escribe un tema primero";
    return;
  }

  const loading = document.getElementById("loadingPrompt");
  const resultado = document.getElementById("resultadoPrompt");

  try {

    loading.style.display = "block";
    resultado.innerText = "";

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "prompt",
          tema,
          formato: tipo
        })
      }
    );

    const data = await res.json();

    loading.style.display = "none";

    resultado.innerHTML =
      `<div style="white-space:pre-wrap">${data.resultado}</div>`;

  } catch (error) {

    loading.style.display = "none";
    resultado.innerText = "❌ " + error.message;
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

}async function generarStoryboard() {

  const guion = document.getElementById("textoStoryboard").value;
  const escenas = document.getElementById("cantidadEscenas").value;
  const estilo = document.getElementById("estiloStoryboard").value;

  const resultado = document.getElementById("resultadoStoryboard");
  const mensaje = document.getElementById("mensajeStoryboard");

  resultado.innerHTML = "";
  mensaje.innerText = "";

  if (!guion.trim()) {

    mensaje.innerText = "⚠️ Primero pega un guion";
    return;

  }

  mensaje.innerText = "⏳ Generando storyboard IA...";

  try {

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

    const texto = await res.text();

resultado.innerHTML =
  `<pre style="white-space:pre-wrap">${texto}</pre>`;

mensaje.innerText = "Respuesta recibida";

return;
    resultado.innerHTML =
      `<div style="white-space:pre-wrap">${data.storyboard}</div>`;

    mensaje.innerText =
      "✅ Storyboard generado correctamente";

  } catch (error) {

    mensaje.innerText =
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

  const loading = document.getElementById("loadingIdeas");
  const barra = document.getElementById("barraIdeas");
  const estado = document.getElementById("estadoIdeas");

  loading.style.display = "block";
  barra.style.width = "10%";
  estado.innerText = "🧠 Analizando tema...";

  let progreso = 10;

  const fakeProgress = setInterval(() => {

    if (progreso < 90) {
      progreso += Math.random() * 10;
      barra.style.width = progreso + "%";

      if (progreso < 30) estado.innerText = "💡 Generando ideas...";
      else if (progreso < 60) estado.innerText = "🎯 Estructurando contenido...";
      else estado.innerText = "⚡ Finalizando respuesta...";
    }

  }, 400);

  try {

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "ideas",
          tema
        })
      }
    );

    const data = await res.json();

    clearInterval(fakeProgress);

    barra.style.width = "100%";
    estado.innerText = "✅ Listo";

    setTimeout(() => {
      loading.style.display = "none";
      document.getElementById("resultadoIdeas").innerHTML =
        `<div style="white-space: pre-wrap;">${data.ideas}</div>`;
    }, 300);

  } catch (error) {

    clearInterval(fakeProgress);

    estado.innerText = "❌ Error";
    console.log(error);

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

  const prompt =
    document.getElementById("promptImagen").value;

  const categoria =
    document.getElementById("categoriaImagen").value;

  const resultado =
    document.getElementById("resultadoImagen");

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
          tipo: "imagen",
          tema: prompt,
          categoria
        })
      }
    );

    const blob = await respuesta.blob();

    const url =
      URL.createObjectURL(blob);

    resultado.innerHTML = `
      <img
        src="${url}"
        style="width:100%;max-width:600px;border-radius:12px;">
      <p>💾 Guardando imagen...</p>
    `;

    const reader = new FileReader();

    reader.onloadend = async () => {

      try {

        const guardar =
          await fetch(
            "https://pixellab45-v2.scostarobles.workers.dev/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                tipo: "guardar-imagen",
                imagenBase64: reader.result,
                categoria
              })
            }
          );

        const data =
          await guardar.json();

        if (data.success) {

  resultado.innerHTML += `
    <p>✅ Guardada: ${data.nombre}</p>
  `;

} else {

  resultado.innerHTML += `
    <p>❌ ${data.error || JSON.stringify(data)}</p>
  `;
}

      } catch (error) {

        resultado.innerHTML += `
          <p>
            ❌ ${error.message}
          </p>
        `;
      }
    };

    reader.readAsDataURL(blob);

  } catch (error) {

    resultado.innerHTML =
      `❌ ${error.message}`;
  }
}
function toggleMenu(){

  document
    .querySelector(".nav-links")
    .classList
    .toggle("active");

                            }
document.querySelectorAll(".nav-links a").forEach(link => {

  link.addEventListener("click", () => {

    document
      .querySelector(".nav-links")
      .classList
      .remove("active");

  });

});
async function cargarCategoria(categoria) {

  const contenedor =
    document.getElementById("galeriaDinamica");

  contenedor.innerHTML =
    "⏳ Cargando imágenes...";

  try {

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "listar-imagenes"
        })
      }
    );

    const imagenes = await res.json();

    const filtradas =
      imagenes.filter(img =>
        img.nombre.startsWith(categoria + "/")
      );

    contenedor.innerHTML = "";

    filtradas.forEach(img => {

      contenedor.innerHTML += `
        <div class="project-card">
          <img src="${img.url}">
          <p>${img.nombre}</p>
        </div>
      `;

    });

  } catch(error) {

    contenedor.innerHTML =
      "❌ Error cargando imágenes";

  }
}
window.addEventListener("load", () => {

  cargarGaleriaCompleta();

  cargarCategoria("avatares");
});
async function cargarGaleriaCompleta() {

  const contenedor =
    document.getElementById("galeriaCompleta");

  contenedor.innerHTML =
    "⏳ Cargando galería completa...";

  try {

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "listar-imagenes"
        })
      }
    );

    const imagenes =
      await res.json();

    contenedor.innerHTML = "";

    imagenes.forEach(img => {

      contenedor.innerHTML += `
        <div class="project-card">
          <img src="${img.url}">
        </div>
      `;

    });

  } catch(error) {

   /* contenedor.innerHTML =
      "❌ Error cargando galería";*/
    contenedor.innerHTML = "❌ Error: " + error.message + "\nRespuesta: " + JSON.stringify(error);

  }
}
async function generarVideo() {

  const modo =
    document.getElementById("modoVideo").value;

  const contenido =
    document.getElementById("promptVideo").value;

  const duracion =
    document.getElementById("duracionVideo").value;

  const resultado =
    document.getElementById("resultadoVideo");

  if (!contenido.trim()) {
    resultado.innerHTML =
      "⚠️ Escribe un prompt o storyboard.";
    return;
  }

  resultado.innerHTML =
    "⏳ Enviando datos al Worker...";

  try {

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "video",
          modo: modo,
          contenido: contenido,
          duracion: duracion
        })
      }
    );

    const data = await res.json();

    if (data.success && data.project) {

  resultado.innerHTML =
    "⏳ Generando video...";

  consultarVideo(data.project);

    }

  } catch (error) {

    resultado.innerHTML =
      "❌ Error: " + error.message;

  }
}
async function consultarVideo(project) {

  const estado =
    document.getElementById("estadoVideo");

  const preview =
    document.getElementById("previewVideo");

  const intervalo = setInterval(async () => {

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "estado-video",
          project
        })
      }
    );

    const data = await res.json();

    estado.innerHTML =
      "Estado: " + data.movie?.status;

    if (data.movie?.status === "done") {

      clearInterval(intervalo);

      preview.innerHTML = `
        <video controls width="100%">
          <source
            src="${data.movie.url}"
            type="video/mp4">
        </video>
      `;
    }

  }, 5000);

}

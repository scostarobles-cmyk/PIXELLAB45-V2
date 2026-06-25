console.log("SCRIPT CARGADO OK");
//Variable global worker 
const WORKER_URL =
  "https://pixellab45-v2.scostarobles.workers.dev/";
//Función global 
const FETCH_CONFIG = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};
//Galería completa 
async function cargarGaleriaCompleta() {

  const contenedor =
    document.getElementById("galeriaCompleta");

  contenedor.innerHTML =
    "⏳ Cargando galería...";

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tipo: "listar-imagenes"
      })
    });

    const data = await res.json();

    contenedor.innerHTML = "";

    data.images.forEach(img => {

      contenedor.innerHTML += `
        <div class="project-card">
          <img
            src="${img.url}"
            alt="${img.nombre}">
        </div>
      `;

    });

  } catch (error) {

    console.error(error);

    contenedor.innerHTML =
      "❌ Error cargando galería";
  }
}

//Galería por categoría 
async function cargarCategoria(categoria) {

  const contenedor =
    document.getElementById("galeriaCategoria");

  contenedor.innerHTML =
    "⏳ Cargando categoría...";

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tipo: "listar-categoria",
        categoria: categoria
      })
    });

    const data = await res.json();

    contenedor.innerHTML = "";

    data.images.forEach(img => {

      contenedor.innerHTML += `
        <div class="project-card">
          <img
            src="${img.url}"
            alt="${img.nombre}">
        </div>
      `;

    });

  } catch (error) {

    contenedor.innerHTML =
      "❌ Error cargando categoría";

    console.error(error);

  }

}

async function generarIdeas() {
  const tema = document.getElementById("tema").value;

  if (!tema.trim()) {
    alert("Escribe un tema");
    return;
  }

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
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: "ideas",
        tema: tema
      })
    });

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
    console.error(error);
  }
  }
  
  async function guardarIdeas() {

  const texto =
    document.getElementById("resultadoIdeas").innerText;

  if (!texto.trim()) {
    alert("No hay ideas para guardar");
    return;
  }

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tipo: "guardar-ideas",
        contenido: texto
      })
    });

    const data = await res.json();

    //alert(data.mensaje || "✅ Ideas guardadas");
    contenedor.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;

  } catch (error) {

    console.error(error);
 //   alert("❌ Error al guardar");
contenedor.innerHTML = "<pre>" + error + "</pre>";
  }

}

//Inicio y Menú 
document.addEventListener(
  "DOMContentLoaded",
  cargarGaleriaCompleta
);

function toggleMenu(){

  document
    .querySelector(".nav-links")
    .classList
    .toggle("active");

}
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

    contenedor.innerHTML ="";

return;

  /data.images.forEach(img => {

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
//GENERADOR DE IDEAS 
async function generarIdeas() {

  document.getElementById(
    "resultadoIdeas"
  ).innerHTML =
    "FUNCION IDEAS EJECUTADA";

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

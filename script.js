console.log("SCRIPT CARGADO OK");

const WORKER_URL =
  "https://pixellab45-v2.scostarobles.workers.dev/";

const FETCH_CONFIG = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};
async function cargarGaleriaCompleta() {

  const contenedor =
    document.getElementById("galeriaCompleta");

  contenedor.innerHTML =
    "⏳ Probando Worker...";

  try {

    const res = await fetch(
  WORKER_URL,
  {
    ...FETCH_CONFIG,
    body: JSON.stringify({
      tipo: "listar-imagenes"
    })
  }
);
    const data =
      await res.json();

    contenedor.innerHTML =
      `<h2>${data.mensaje}</h2>`;

  } catch(error) {

    contenedor.innerHTML =
      `❌ ${error.message}`;

  }

}

window.addEventListener(
  "DOMContentLoaded",
  cargarGaleriaCompleta
);

function toggleMenu(){

  document
    .querySelector(".nav-links")
    .classList
    .toggle("active");

}
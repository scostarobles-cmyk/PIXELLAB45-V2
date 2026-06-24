async function cargarGaleriaCompleta() {

  const contenedor =
    document.getElementById("galeriaCompleta");

  contenedor.innerHTML =
    "⏳ Probando Worker...";

  try {

    const res = await fetch(
      "https://TU-WORKER.workers.dev/",
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
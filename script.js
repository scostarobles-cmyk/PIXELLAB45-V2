console.log("SCRIPT CARGADO OK");

const WORKER_URL =
"https://pixellab45-v2.scostarobles.workers.dev/";
const R2_PUBLIC_URL =
"https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev";
/// ========================================
// GALERÍA POR CATEGORÍA
// ========================================

async function cargarCategoria(categoria) {

  const contenedor =
    document.getElementById("galeriaDinamica");

  if (!contenedor) return;

  contenedor.innerHTML =
    "⏳ Cargando imágenes...";

  try {

    const res = await fetch(
      WORKER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "listar-imagenes-categoria",
          categoria: categoria
        })
      }
    );

    const respuesta =
      await res.json();

    const imagenes =
      respuesta.datos || [];

    contenedor.innerHTML = "";

    if (imagenes.length === 0) {

      contenedor.innerHTML =
        "⚠️ No hay imágenes en esta categoría";

      return;

    }

    imagenes.forEach(img => {

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
      `❌ ${error.message}`;

  }

}
// ========================================
// GALERÍA POR CATEGORÍA 
// ========================================
async function cargarCategoria(categoria) {

  const contenedor =
    document.getElementById("galeriaDinamica");

  if (!contenedor) return;

  contenedor.innerHTML =
    "⏳ Cargando imágenes...";

  try {

    const res = await fetch(
      WORKER_URL,
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

    const respuesta =
      await res.json();

    const imagenes =
      respuesta.datos;

    const filtradas =
      imagenes.filter(img =>
        img.nombre.startsWith(
          categoria + "/"
        )
      );

    contenedor.innerHTML = "";

    filtradas.forEach(img => {

      contenedor.innerHTML += `
        <div class="project-card">
          <img
            src="${img.url}"
            alt="${img.nombre}">
          <p>${img.nombre}</p>
        </div>
      `;

    });

  } catch (error) {

    contenedor.innerHTML =
      `❌ ${error.message}`;

  }

}


// ========================================
// MENÚ HAMBURGUESA
// ========================================

function toggleMenu() {

document
.querySelector(".nav-links")
.classList
.toggle("active");

}

document
.querySelectorAll(".nav-links a")
.forEach(link => {

link.addEventListener("click", () => {

  document
    .querySelector(".nav-links")
    .classList
    .remove("active");

});

});
// 
// ========================================
// INICIO
// ========================================

window.addEventListener("load", () => {

cargarGaleriaCompleta();


});
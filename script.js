console.log("SCRIPT CARGADO OK");

const WORKER_URL =
"https://pixellab45-v2.scostarobles.workers.dev/";
const R2_PUBLIC_URL =
"https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev";
/// ========================================
// GALERÍA POR CATEGORÍA
// ========================================
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

    contenedor.innerHTML =
      "❌ Error cargando galería";

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

  cargarCategoria("avatares");
});
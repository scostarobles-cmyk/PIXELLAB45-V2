console.log("SCRIPT CARGADO OK");

const WORKER_URL =
"https://pixellab45-v2.scostarobles.workers.dev/";

// ========================================
// GALERÍA COMPLETA
// ========================================

async function cargarGaleriaCompleta() {

const contenedor =
document.getElementById("galeriaCompleta");

if (!contenedor) return;

contenedor.innerHTML =
"⏳ Cargando galería completa...";

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

const imagenes =
  await res.json();

contenedor.innerHTML = "";

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

console.error(error);

      contenedor.innerHTML = `❌ Error cargando galería: ${error.message}`;
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
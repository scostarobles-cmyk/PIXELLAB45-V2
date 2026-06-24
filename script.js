console.log("SCRIPT CARGADO OK");

const WORKER_URL =
"https://pixellab45-v2.scostarobles.workers.dev/";
const R2_PUBLIC_URL =
"https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev";
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

const respuesta =
  await res.json();

  contenedor.innerHTML ="";

imagenes.forEach(img => {

  contenedor.innerHTML += `
    <div class="project-card">
      <img
        src="${img.url}"
        alt="${img.nombre}">
    </div>
  `;

});

}  catch (error) {

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
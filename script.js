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

contenedor.innerHTML =
  "❌ Error cargando galería";

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

const imagenes =
  await res.json();

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

console.error(error);

contenedor.innerHTML =
  "❌ Error cargando imágenes";

}

}



// ========================================
// IDEAS
// ========================================

async function generarIdeas() {

  const tema =
    document.getElementById("tema").value;

  const resultado =
    document.getElementById("resultadoIdeas");

  const loading =
    document.getElementById("loadingIdeas");

  const barra =
    document.getElementById("barraIdeas");

  const porcentaje =
    document.getElementById("porcentajeIdeas");

  const estado =
    document.getElementById("estadoIdeas");

  if (!tema.trim()) {

    resultado.innerHTML =
      "⚠️ Escribe un tema primero";

    return;
  }

  resultado.innerHTML = "";

  loading.style.display = "block";

  barra.style.width = "0%";

  porcentaje.innerText = "0%";

  estado.innerText =
    "🧠 Analizando tema...";

  let progreso = 0;

  const fakeProgress = setInterval(() => {

    if (progreso < 90) {

      progreso += Math.floor(Math.random() * 8) + 2;

      if (progreso > 90) {
        progreso = 90;
      }

      barra.style.width =
        progreso + "%";

      porcentaje.innerText =
        progreso + "%";

      if (progreso < 30) {

        estado.innerText =
          "💡 Generando ideas...";

      } else if (progreso < 60) {

        estado.innerText =
          "🎯 Organizando contenido...";

      } else {

        estado.innerText =
          "⚡ Finalizando respuesta...";

      }

    }

  }, 400);

  try {

    const res = await fetch(
      WORKER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "ideas",
          tema
        })
      }
    );

    const data =
      await res.json();

    clearInterval(fakeProgress);

    barra.style.width = "100%";

    porcentaje.innerText = "100%";

    estado.innerText =
      "✅ Ideas generadas";

    setTimeout(() => {

      loading.style.display = "none";

      resultado.innerHTML =
        `<div style="white-space:pre-wrap;">${data.ideas}</div>`;

    }, 500);

  } catch (error) {

    clearInterval(fakeProgress);

    loading.style.display = "none";

    resultado.innerHTML =
      `❌ ${error.message}`;

    console.error(error);

  }

}
// ========================================
// COPIAR IDEAS
// ========================================
async function copiarIdeas() {

  const texto =
    document.getElementById("resultadoIdeas").innerText;

  const mensaje =
    document.getElementById("mensajeIdeasCopiadas");

  if (!texto.trim()) {

    mensaje.innerText =
      "⚠️ Primero genera ideas";

    return;
  }

  navigator.clipboard.writeText(texto);

  mensaje.innerText =
    "⏳ Guardando ideas...";

  try {

    const ideas = texto
      .split("\n")
      .map(l => l.trim())
      .filter(l =>
        /^idea\s*\d+\s*:/i.test(l)
      )
      .map(l =>
        l.replace(
          /^idea\s*\d+\s*:\s*/i,
          ""
        ).trim()
      );

    let guardadas = 0;

    for (const idea of ideas) {

      const res = await fetch(
        WORKER_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tipo: "copiar-ideas",
            contenido: idea
          })
        }
      );

      const data =
        await res.json();

      if (data.success) {
        guardadas++;
      }

    }

    mensaje.innerText =
      `✅ ${guardadas} ideas guardadas`;

  } catch (error) {

    mensaje.innerText =
      `❌ ${error.message}`;

    console.error(error);

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
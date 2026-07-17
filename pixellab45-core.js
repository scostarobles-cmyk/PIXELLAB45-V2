// =====================================
// PIXELLAB45 CORE
// CONFIGURACIÓN GLOBAL
// =====================================

const WORKER_URL =
  "https://pixellab45-v2.scostarobles.workers.dev/";

const R2_BASE_URL =
  "https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev";

const R2_EBOOKS_URL =
  "https://pub-f8d04d55cd564959a5957c416b3c6de9.r2.dev";


// Configuración común para fetch

const FETCH_CONFIG = {

  method: "POST",

  headers: {
    "Content-Type": "application/json"
  }

};

/* ==========================================================
   PIXELLAB Monitor v1.2
   Monitor reutilizable con destino configurable
========================================================== */

function monitorPIXELLAB(
    modulo,
    nivel,
    operacion,
    mensaje,
    destino = "monitorPIXELLAB"
){

    const monitor =
        document.getElementById(destino);

    if(!monitor) return;


    const hora =
        new Date().toLocaleTimeString();


    const niveles = {

        info: "ℹ️",

        proceso: "🔄",

        ok: "✅",

        aviso: "⚠️",

        error: "❌"

    };


    const icono =
        niveles[nivel] || "•";


    const evento = `

<div class="monitor-evento monitor-${nivel}">

    <div class="monitor-header">

        <span>${hora}</span>

        <span class="monitor-modulo">
            ${modulo}
        </span>

    </div>

    <div class="monitor-operacion">
        ${icono} ${operacion}
    </div>

    <div class="monitor-mensaje">
        ${mensaje}
    </div>

</div>

`;


/* Monitor principal */

const monitorPrincipal =
    document.getElementById("monitorPIXELLAB");

if (monitorPrincipal) {

    monitorPrincipal.innerHTML += evento;

    monitorPrincipal.scrollTop =
        monitorPrincipal.scrollHeight;

}


/* Monitor superior */

const monitorBotonera =
    document.getElementById("monitorBotonera");

if (monitorBotonera) {

    monitorBotonera.innerHTML += evento;

    monitorBotonera.scrollTop =
        monitorBotonera.scrollHeight;

}
}

// =====================================
// PIXELLAB CORE
// UTILIDADES DE INTERFAZ
// =====================================

function habilitarBoton(id) {

    const boton =
        document.getElementById(id);

    if (!boton) return;

    boton.disabled = false;

}


function deshabilitarBoton(id) {

    const boton =
        document.getElementById(id);

    if (!boton) return;

    boton.disabled = true;

}


function botonVerde(id) {

    const boton =
        document.getElementById(id);

    if (!boton) return;

    boton.classList.remove(
        "blanco",
        "azul",
        "amarillo",
        "rojo"
    );

    boton.classList.add("verde");

}


function botonAmarillo(id) {

    const boton =
        document.getElementById(id);

    if (!boton) return;

    boton.classList.remove(
        "blanco",
        "azul",
        "verde",
        "rojo"
    );

    boton.classList.add("amarillo");

}


function botonAzul(id) {

    const boton =
        document.getElementById(id);

    if (!boton) return;

    boton.classList.remove(
        "blanco",
        "amarillo",
        "verde",
        "rojo"
    );

    boton.classList.add("azul");

}


function botonNormal(id) {

    const boton =
        document.getElementById(id);

    if (!boton) return;

    boton.classList.remove(
        "azul",
        "amarillo",
        "verde",
        "rojo"
    );

    boton.classList.add("blanco");

}



//=====================================================
// FUNCIÓN: cargarJSON()
// Descripción:
// Carga cualquier archivo JSON desde R2.
//=====================================================

async function cargarJSON(ruta) {


    const respuesta = await fetch(
        WORKER_URL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "cargar-json",
                ruta: ruta
            })
        }
    );


    const datos =
        await respuesta.json();


    if (!datos.ok) {

        monitorPIXELLAB(
            "Core",
            "error",
            "cargarJSON",
            "No se pudo cargar: " + ruta
        );

        return null;

    }


    return datos.json;

}
//=====================================
// ACTUALIZAR INDICADOR PIPELINE
//=====================================

function actualizarIndicador(id, estado = "verde") {

    const indicador =
        document.getElementById(id);

    if (!indicador) return;


    let texto =
        indicador.textContent;


    texto =
        texto.replace(/^⚪|^🟢|^🔵/, "");


    let circulo = "⚪";


    if (estado === "verde") {
        circulo = "🟢";
    }


    if (estado === "azul") {
        circulo = "🔵";
    }


    if (estado === "blanco") {
        circulo = "⚪";
    }


    indicador.textContent =
        circulo + texto;

}
//====================================================
// PIXELLAB45 CORE
// CONTROL DE VERSIÓN Y LIMPIEZA DE CACHÉ
//====================================================

const PIXELLAB45_VERSION = "__VERSION__";

(async function () {

  try {

    const versionAnterior =
      localStorage.getItem("PL45_VERSION");

    if (versionAnterior !== PIXELLAB45_VERSION) {

      // Guardar nueva versión
      localStorage.setItem(
        "PL45_VERSION",
        PIXELLAB45_VERSION
      );

      // Evitar recarga infinita
      if (!sessionStorage.getItem("PL45_CACHE_REFRESH")) {

        sessionStorage.setItem(
          "PL45_CACHE_REFRESH",
          "OK"
        );

        // Limpiar Cache Storage
        if ("caches" in window) {

          const nombres = await caches.keys();

          for (const nombre of nombres) {
            await caches.delete(nombre);
          }

        }

        // Recargar una sola vez
        location.reload();

      }

    } else {

      // Preparado para la próxima actualización
      sessionStorage.removeItem(
        "PL45_CACHE_REFRESH"
      );

    }

  } catch (err) {

    console.error(
      "PIXELLAB45 Core:",
      err
    );

  }

})();
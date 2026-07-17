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
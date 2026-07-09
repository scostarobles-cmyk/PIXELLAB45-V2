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
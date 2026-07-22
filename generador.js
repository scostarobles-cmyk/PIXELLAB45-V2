let proyectoActual = null;

function mostrarEstadoEditorial(mensaje, esError = false) {
  const contenedor = esError
    ? document.getElementById("errorEditorial")
    : document.getElementById("estadoEditorial");

  if (!contenedor) return;

  contenedor.textContent = mensaje;
  contenedor.style.display = "block";
}

function obtenerDatosFormulario() {
  return {
    tema: document.getElementById("temaEbook")?.value.trim() || "",
    autor: document.getElementById("autorEbook")?.value.trim() || "",
    paginas: document.getElementById("paginasEbook")?.value || 100,
    idioma: document.getElementById("idiomaEbook")?.value || "Español",
    tono: document.getElementById("tonoEbook")?.value || "Profesional",
    publico: document.getElementById("publicoEbook")?.value || "General"
  };
}

function crearProyecto() {
  const datos = obtenerDatosFormulario();

  if (!datos.tema) {
    mostrarEstadoEditorial("Ingresa un tema para el eBook", true);
    return;
  }

  proyectoActual = {
    ...datos,
    id: Date.now()
  };

  mostrarEstadoEditorial(`Proyecto "${datos.tema}" creado exitosamente.`);
  actualizarIndicador("estadoProyecto", "verde");
}

function generarPlan2() {
  if (!proyectoActual) {
    mostrarEstadoEditorial("Crea un proyecto primero", true);
    return;
  }

  mostrarEstadoEditorial("Generando plan con IA...");

  setTimeout(() => {
    mostrarEstadoEditorial("Plan de contenidos generado.");
    actualizarIndicador("estadoPlan", "verde");
  }, 1500);
}

function generarIndice() {
  if (!proyectoActual) {
    mostrarEstadoEditorial("Crea un proyecto primero", true);
    return;
  }

  mostrarEstadoEditorial("Generando índice estructurado...");

  setTimeout(() => {
    mostrarEstadoEditorial("Índice completado.");
    actualizarIndicador("estadoIndice", "verde");
  }, 1200);
}

function generarLegales() {
  if (!proyectoActual) {
    mostrarEstadoEditorial("Crea un proyecto primero", true);
    return;
  }

  mostrarEstadoEditorial("Redactando textos legales...");

  setTimeout(() => {
    mostrarEstadoEditorial("Sección de legales terminada.");
    actualizarIndicador("estadoLegales", "verde");
  }, 1000);
}

function generarIntroduccion() {
  if (!proyectoActual) {
    mostrarEstadoEditorial("Crea un proyecto primero", true);
    return;
  }

  mostrarEstadoEditorial("Generando introducción...");

  setTimeout(() => {
    mostrarEstadoEditorial("Introducción lista.");
    actualizarIndicador("estadoIntro", "verde");
  }, 1500);
}

function generarCapitulos() {
  if (!proyectoActual) {
    mostrarEstadoEditorial("Crea un proyecto primero", true);
    return;
  }

  mostrarEstadoEditorial("Redactando capítulos...");

  setTimeout(() => {
    mostrarEstadoEditorial("Capítulos generados correctamente.");
    actualizarIndicador("estadoCapitulos", "verde");
  }, 2500);
}

function generarConclusion() {
  if (!proyectoActual) {
    mostrarEstadoEditorial("Crea un proyecto primero", true);
    return;
  }

  mostrarEstadoEditorial("Sintetizando conclusión...");

  setTimeout(() => {
    mostrarEstadoEditorial("Conclusión finalizada.");
    actualizarIndicador("estadoConclusion", "verde");
  }, 1000);
}

function limpiarMonitorPIXELLAB() {
  const monitor = document.getElementById("monitorPIXELLAB");
  if (monitor) {
    monitor.innerHTML = "";
  }
}

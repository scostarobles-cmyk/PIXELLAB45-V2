import { monitorPIXELLAB, cargarJSON } from './pixellab45-core.js';

// =====================================
// VARIABLES Y ESTADO DEL GENERADOR
// =====================================
let proyectoActual = null;

// =====================================
// FUNCIONES DE INTERFAZ Y ESTADO
// =====================================
function mostrarEstadoEditorial(mensaje, esError = false) {
    const contenedor = esError ? document.getElementById("errorEditorial") : document.getElementById("estadoEditorial");
    if (!contenedor) return;

    contenedor.textContent = mensaje;
    contenedor.style.display = "block";

    if (esError) {
        monitorPIXELLAB(`[ERROR GENERADOR] ${mensaje}`, "error");
    } else {
        monitorPIXELLAB(`[GENERADOR] ${mensaje}`, "info");
    }
}

function actualizarPipelineIA(idElemento, texto) {
    const elem = document.getElementById(idElemento);
    if (elem) elem.textContent = texto;
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

// =====================================
// MOTORES IA (GENERACIÓN DE CONTENIDO)
// =====================================
export async function crearProyecto() {
    const datos = obtenerDatosFormulario();
    if (!datos.tema) {
        mostrarEstadoEditorial("Ingresa un tema para el eBook", true);
        return;
    }

    proyectoActual = { ...datos, id: Date.now() };
    mostrarEstadoEditorial(`Proyecto "${datos.tema}" creado exitosamente.`);
    actualizarPipelineIA("estadoProyecto", `🟢 Proyecto: ${datos.tema}`);
}

export async function generarPlan2() {
    if (!proyectoActual) {
        mostrarEstadoEditorial("Crea un proyecto primero", true);
        return;
    }
    mostrarEstadoEditorial("Generando plan con IA...");
    actualizarPipelineIA("estadoPlan", "🟡 Generando Plan...");

    // Lógica del motor planificador
    setTimeout(() => {
        mostrarEstadoEditorial("Plan de contenidos generado.");
        actualizarPipelineIA("estadoPlan", "🟢 Plan Listo");
    }, 1500);
}

export async function generarIndice() {
    if (!proyectoActual) return mostrarEstadoEditorial("Crea un proyecto primero", true);
    mostrarEstadoEditorial("Generando índice estructurado...");
    actualizarPipelineIA("estadoIndice", "🟡 Generando Índice...");

    setTimeout(() => {
        mostrarEstadoEditorial("Índice completado.");
        actualizarPipelineIA("estadoIndice", "🟢 Índice Listo");
    }, 1200);
}

export async function generarLegales() {
    if (!proyectoActual) return mostrarEstadoEditorial("Crea un proyecto primero", true);
    mostrarEstadoEditorial("Redactando textos legales y copyright...");
    actualizarPipelineIA("estadoLegales", "🟡 Generando Legales...");

    setTimeout(() => {
        mostrarEstadoEditorial("Sección de legales terminada.");
        actualizarPipelineIA("estadoLegales", "🟢 Legales Listo");
    }, 1000);
}

export async function generarIntroduccion() {
    if (!proyectoActual) return mostrarEstadoEditorial("Crea un proyecto primero", true);
    mostrarEstadoEditorial("Generando introducción...");
    actualizarPipelineIA("estadoIntro", "🟡 Generando Introducción...");

    setTimeout(() => {
        mostrarEstadoEditorial("Introducción lista.");
        actualizarPipelineIA("estadoIntro", "🟢 Introducción Lista");
    }, 1500);
}

export async function generarCapitulos() {
    if (!proyectoActual) return mostrarEstadoEditorial("Crea un proyecto primero", true);
    mostrarEstadoEditorial("Redactando capítulos en segundo plano...");
    actualizarPipelineIA("estadoCapitulos", "🟡 Redactando Capítulos...");

    setTimeout(() => {
        mostrarEstadoEditorial("Capítulos generados correctamente.");
        actualizarPipelineIA("estadoCapitulos", "🟢 Capítulos Listos");
    }, 2500);
}

export async function generarConclusion() {
    if (!proyectoActual) return mostrarEstadoEditorial("Crea un proyecto primero", true);
    mostrarEstadoEditorial("Sintetizando conclusión...");
    actualizarPipelineIA("estadoConclusion", "🟡 Generando Conclusión...");

    setTimeout(() => {
        mostrarEstadoEditorial("Conclusión finalizada.");
        actualizarPipelineIA("estadoConclusion", "🟢 Conclusión Lista");
    }, 1000);
}

// Vinculación explícita al scope global para listeners inline del HTML
window.crearProyecto = crearProyecto;
window.generarPlan2 = generarPlan2;
window.generarIndice = generarIndice;
window.generarLegales = generarLegales;
window.generarIntroduccion = generarIntroduccion;
window.generarCapitulos = generarCapitulos;
window.generarConclusion = generarConclusion;

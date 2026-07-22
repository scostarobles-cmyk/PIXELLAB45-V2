// =====================================
// MÓDULO GENERADOR (IA & DATOS)
// PIXELLAB45 eBook Studio
// =====================================

(function() {
    "use strict";

    // Objeto local para almacenar el estado sin contaminar el scope global
    window.PL45_Generador = {
        proyectoActual: null
    };

    function logGenerador(nivel, operacion, mensaje) {
        if (typeof window.monitorPIXELLAB === "function") {
            window.monitorPIXELLAB("GENERADOR", nivel, operacion, mensaje);
        } else {
            console.log(`[GENERADOR - ${nivel}] ${operacion}: ${mensaje}`);
        }
    }

    function mostrarEstadoEditorial(mensaje, esError) {
        var id = esError ? "errorEditorial" : "estadoEditorial";
        var contenedor = document.getElementById(id);
        if (contenedor) {
            contenedor.textContent = mensaje;
            contenedor.style.display = "block";
        }
        logGenerador(esError ? "error" : "info", "Estado", mensaje);
    }

    function obtenerDatosFormulario() {
        return {
            tema: (document.getElementById("temaEbook")?.value || "").trim(),
            autor: (document.getElementById("autorEbook")?.value || "").trim(),
            paginas: document.getElementById("paginasEbook")?.value || 100,
            idioma: document.getElementById("idiomaEbook")?.value || "Español",
            tono: document.getElementById("tonoEbook")?.value || "Profesional",
            publico: document.getElementById("publicoEbook")?.value || "General"
        };
    }

    // Funciones asociadas a los botones del Pipeline IA
    window.crearProyecto = function() {
        var datos = obtenerDatosFormulario();
        if (!datos.tema) {
            mostrarEstadoEditorial("Ingresa un tema para el eBook", true);
            return;
        }

        window.PL45_Generador.proyectoActual = Object.assign({}, datos, { id: Date.now() });
        mostrarEstadoEditorial("Proyecto \"" + datos.tema + "\" creado exitosamente.", false);
        
        if (typeof window.actualizarIndicador === "function") {
            window.actualizarIndicador("estadoProyecto", "verde");
        }
    };

    window.generarPlan2 = function() {
        if (!window.PL45_Generador.proyectoActual) {
            mostrarEstadoEditorial("Crea un proyecto primero", true);
            return;
        }
        mostrarEstadoEditorial("Generando plan con IA...", false);
        setTimeout(function() {
            mostrarEstadoEditorial("Plan de contenidos generado.", false);
            if (typeof window.actualizarIndicador === "function") {
                window.actualizarIndicador("estadoPlan", "verde");
            }
        }, 1200);
    };

    window.generarIndice = function() {
        if (!window.PL45_Generador.proyectoActual) return mostrarEstadoEditorial("Crea un proyecto primero", true);
        mostrarEstadoEditorial("Generando índice estructurado...", false);
        setTimeout(function() {
            mostrarEstadoEditorial("Índice completado.", false);
            if (typeof window.actualizarIndicador === "function") window.actualizarIndicador("estadoIndice", "verde");
        }, 1000);
    };

    window.generarLegales = function() {
        if (!window.PL45_Generador.proyectoActual) return mostrarEstadoEditorial("Crea un proyecto primero", true);
        mostrarEstadoEditorial("Redactando textos legales...", false);
        setTimeout(function() {
            mostrarEstadoEditorial("Sección de legales terminada.", false);
            if (typeof window.actualizarIndicador === "function") window.actualizarIndicador("estadoLegales", "verde");
        }, 800);
    };

    window.generarIntroduccion = function() {
        if (!window.PL45_Generador.proyectoActual) return mostrarEstadoEditorial("Crea un proyecto primero", true);
        mostrarEstadoEditorial("Generando introducción...", false);
        setTimeout(function() {
            mostrarEstadoEditorial("Introducción lista.", false);
            if (typeof window.actualizarIndicador === "function") window.actualizarIndicador("estadoIntro", "verde");
        }, 1200);
    };

    window.generarCapitulos = function() {
        if (!window.PL45_Generador.proyectoActual) return mostrarEstadoEditorial("Crea un proyecto primero", true);
        mostrarEstadoEditorial("Redactando capítulos en segundo plano...", false);
        setTimeout(function() {
            mostrarEstadoEditorial("Capítulos generados correctamente.", false);
            if (typeof window.actualizarIndicador === "function") window.actualizarIndicador("estadoCapitulos", "verde");
        }, 2000);
    };

    window.generarConclusion = function() {
        if (!window.PL45_Generador.proyectoActual) return mostrarEstadoEditorial("Crea un proyecto primero", true);
        mostrarEstadoEditorial("Sintetizando conclusión...", false);
        setTimeout(function() {
            mostrarEstadoEditorial("Conclusión finalizada.", false);
            if (typeof window.actualizarIndicador === "function") window.actualizarIndicador("estadoConclusion", "verde");
        }, 800);
    };

    window.limpiarMonitorPIXELLAB = function() {
        var monitor = document.getElementById("monitorPIXELLAB");
        if (monitor) monitor.innerHTML = "";
    };

})();

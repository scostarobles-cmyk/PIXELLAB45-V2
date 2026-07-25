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
monitorPIXELLAB(
    "CORE",
    "info",
    "Carga",
    "pixellab45-core.js ejecutándose"
);
//=====================================================
// INICIALIZACIÓN DEL GENERADOR
//=====================================================

window.addEventListener(
    "load",
    async () => {

        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Inicio",
            "Inicializando generador editorial"
        );
        
   //     await gestionarVersionCachePIXELLAB()?

        await verificarProyecto();

    }
)
// =========================
// MENÚ HAMBURGUESA
// =========================
function toggleMenu() {

    monitorPIXELLAB(
        "Core",
        "proceso",
        "Menú",
        "Botón hamburguesa presionado"
    );

    document
        .querySelector(".nav-links")
        .classList
        .toggle("active");

}
//=====================================================
// LIMPIAR MONITOR PIXELLAB
//=====================================================

function limpiarMonitorPIXELLAB(){

    const monitor =
        document.getElementById(
            "monitorPIXELLAB"
        );


    if(!monitor) {

        return;

    }


    monitor.innerHTML = "";

}
/* ==========================================================
   PIXELLAB Monitor v1.2
   Monitor reutilizable con destino configurable
========================================================== */

function monitorPIXELLAB(
    modulo,
    nivel,
    operacion,
    mensaje
){

    const monitor =
        document.getElementById("monitorPIXELLAB");

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


    monitor.innerHTML += evento;


    monitor.scrollTop =
        monitor.scrollHeight;

}

function actualizarMonitorBotonera(
    titulo,
    mensaje
){

    const monitor =
        document.getElementById("monitorBotonera");

    if(!monitor) return;


    monitor.innerHTML += `

<div class="monitor-evento">

    <div class="monitor-operacion">

        ${titulo}

    </div>


    <div class="monitor-mensaje">

        ${mensaje}

    </div>


</div>

`;

}
//=====================================================
// FUNCIÓN: verificarProyecto()
// Descripción:
// Solicita al Worker la búsqueda del proyecto activo
// en R2 y continúa según el estado del proyecto.
//=====================================================*/
async function verificarProyecto() {

//    limpiarMonitorPIXELLAB();

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Verificación",
        "Buscando proyecto en R2"
    );

    actualizarMonitorBotonera(
        "Verificación",
        "Buscando estado del proyecto..."
    );
  

    try {

        // ==========================
        // TODO EL CÓDIGO DE verificarProyecto()
        // Proyecto
        // Plan
        // Índice
        // Legales
        // Introducción
        // Capítulos
        // Conclusión
        // ==========================
        const respuesta = await fetch(WORKER_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                action: "verificar-proyecto"
            })

        });


        const datos = await respuesta.json();


        // ==============================
        // DATOS RECIBIDOS DEL WORKER
        // ==============================

        const proyectoProduccion =
            datos.proyectoProduccion;

        const ultimoProyectoFinalizado =
            datos.ultimoProyectoFinalizado;
// ------------------------------------
// NO HAY PROYECTO EN PRODUCCIÓN
// ------------------------------------

if (!proyectoProduccion) {

    actualizarIndicador(
        "estadoProyecto",
        "azul"
    );

    botonAzul(
        "btnProyecto"
    );

    habilitarBoton(
        "btnProyecto"
    );


    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Proyecto",
        "No hay proyecto en producción"
    );


    actualizarMonitorBotonera(
        "Nuevo proyecto",
        ultimoProyectoFinalizado
            ?
            `
            📚 Último proyecto listo:
            <br>
            ${ultimoProyectoFinalizado.titulo}
            <br><br>
            Estado:
            <br>
            ✅ Disponible para edición
            <br><br>
            👉 Genere un nuevo proyecto
            `
            :
            `
            No hay proyectos activos.
            <br><br>
            👉 Genere un nuevo proyecto
            `
    );


    return;

}
// ------------------------------------
// PROYECTO ACTIVO
// ------------------------------------

proyectoActual = proyectoProduccion;

projectIdActual = proyectoActual.projectId;


monitorPIXELLAB(
    "Editorial",
    "estado",
    "Proyecto activo",
    proyectoActual.titulo + " en producción"
);


actualizarMonitorBotonera(
    "Proyecto activo",
    `
    📚 ${proyectoActual.titulo}
    <br>
    Estado: En producción
    `
);


actualizarIndicador(
    "estadoProyecto",
    "verde"
);


botonVerde(
    "btnProyecto"
);


deshabilitarBoton(
    "btnProyecto"
);
monitorPIXELLAB(
    "Editorial",
    "debug",
    "Flujo",
    "Llegó antes de Plan"
);
// ------------------------------------
// PLAN
// ------------------------------------

if (
    proyectoActual.estructura.plan === "creado"
) {

    actualizarIndicador(
        "estadoPlan",
        "verde"
    );

    botonVerde(
        "btnPlan"
    );

    deshabilitarBoton(
        "btnPlan"
    );


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Plan",
        "Plan generado correctamente"
    );


    actualizarMonitorBotonera(
        "Plan completado",
        `
        📋 Plan generado correctamente
        <br><br>
        Proyecto:
        <br>
        ${proyectoActual.titulo}
        `
    );


} else {

    actualizarIndicador(
        "estadoPlan",
        "azul"
    );

    botonAzul(
        "btnPlan"
    );

    habilitarBoton(
        "btnPlan"
    );


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Plan",
        "Listo para generar plan del proyecto"
    );


    actualizarMonitorBotonera(
        "Siguiente paso",
        `
        📋 Generar plan del proyecto
        <br><br>
        Proyecto:
        <br>
        ${proyectoActual.titulo}
        `
    );

    return;
}
// ------------------------------------
// INDICE
// ------------------------------------

if (
    proyectoActual.estructura.indice === "creado"
) {

    actualizarIndicador(
        "estadoIndice",
        "verde"
    );

    botonVerde(
        "btnIndice"
    );

    deshabilitarBoton(
        "btnIndice"
    );


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Índice",
        "Índice generado correctamente"
    );


    actualizarMonitorBotonera(
        "Índice completo",
        `
        📑 Índice generado correctamente
        <br><br>
        Proyecto:
        <br>
        ${proyectoActual.titulo}
        `
    );


} else {

    actualizarIndicador(
        "estadoIndice",
        "azul"
    );

    botonAzul(
        "btnIndice"
    );

    habilitarBoton(
        "btnIndice"
    );


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Índice",
        "Listo para generar índice del proyecto"
    );


    actualizarMonitorBotonera(
        "Siguiente paso",
        `
        📑 Generar índice del proyecto
        <br><br>
        Proyecto:
        <br>
        ${proyectoActual.titulo}
        `
    );


    return;

}
// ------------------------------------
// LEGALES
// ------------------------------------

if (
    proyectoActual.estructura.legales === "creado"
) {

    actualizarIndicador(
        "estadoLegales",
        "verde"
    );

    botonVerde(
        "btnLegales"
    );

    deshabilitarBoton(
        "btnLegales"
    );


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Legales",
        "Legales generados correctamente"
    );


    actualizarMonitorBotonera(
        "Legales completados",
        `
        ⚖️ Legales generados correctamente
        <br><br>
        Proyecto:
        <br>
        ${proyectoActual.titulo}
        `
    );

} else {

    actualizarIndicador(
        "estadoLegales",
        "azul"
    );

    botonAzul(
        "btnLegales"
    );

    habilitarBoton(
        "btnLegales"
    );


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Legales",
        "Listo para generar legales"
    );


    actualizarMonitorBotonera(
        "Siguiente paso",
        `
        ⚖️ Generar legales del proyecto
        <br><br>
        Proyecto:
        <br>
        ${proyectoActual.titulo}
        `
    );

    return;

}
// ------------------------------------
// INTRODUCCIÓN
// ------------------------------------

if (
    proyectoActual.estructura.introduccion === "creado"
) {

    actualizarIndicador(
        "estadoIntro",
        "verde"
    );

    botonVerde(
        "btnIntroduccion"
    );

    deshabilitarBoton(
        "btnIntroduccion"
    );


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Introducción",
        "Introducción generada correctamente"
    );


    actualizarMonitorBotonera(
        "Introducción completada",
        `
        📝 Introducción generada correctamente
        <br><br>
        Proyecto:
        <br>
        ${proyectoActual.titulo}
        `
    );

} else {

    actualizarIndicador(
        "estadoIntro",
        "azul"
    );

    botonAzul(
        "btnIntroduccion"
    );

    habilitarBoton(
        "btnIntroduccion"
    );


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Introducción",
        "Listo para generar introducción"
    );


    actualizarMonitorBotonera(
        "Siguiente paso",
        `
        📝 Generar introducción del proyecto
        <br><br>
        Proyecto:
        <br>
        ${proyectoActual.titulo}
        `
    );

    return;

}
// ------------------------------------
// CAPÍTULOS - PRIMERA ETAPA
// ------------------------------------

if (
    proyectoActual.estructura.capitulos === "pendiente"
) {

    actualizarIndicador(
        "estadoCapitulos",
        "azul"
    );

    botonAzul(
        "btnCapitulos"
    );

    habilitarBoton(
        "btnCapitulos"
    );

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Capítulos",
        "Listo para generar capítulos"
    );

    actualizarMonitorBotonera(
        "Siguiente paso",
        `
        📖 Generar capítulos del proyecto
        <br><br>
        Proyecto:
        <br>
        ${proyectoActual.titulo}
        `
    );

    return;

}
//------------------------------------
// CARGAR PLAN ANTES DE CAPÍTULOS
//------------------------------------

const plan = await cargarJSON(
    `proyectos/${projectIdActual}/plan.json`
);


//------------------------------------
// CAPÍTULOS EN PRODUCCIÓN
//------------------------------------

if (
    proyectoActual.estructura.capitulos === "produccion"
) {

    actualizarIndicador(
        "estadoCapitulos",
        "amarillo"
    );

    botonAmarillo(
        "btnCapitulos"
    );

    habilitarBoton(
        "btnCapitulos"
    );


    if (
        !plan ||
        !plan.capitulos
    ) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Capítulos",
            "No se recibió el plan"
        );

        actualizarMonitorBotonera(
            "Error",
            `
            ❌ No se recibió el plan de capítulos
            `
        );

        return;

    }


    for (
        const capitulo of plan.capitulos
    ) {

        if (
            capitulo.estado !== "creado"
        ) {

            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Capítulos",
                "Capítulos en producción"
            );

            monitorPIXELLAB(
                "Editorial",
                "info",
                "Próximo capítulo",
                `${capitulo.numero} - ${capitulo.titulo}`
            );

            actualizarMonitorBotonera(
                "Capítulos en producción",
                `
                📖 Generando capítulos
                <br><br>
                Próximo capítulo:
                <br>
                ${capitulo.numero} - ${capitulo.titulo}
                `
            );

            if (
                typeof preguntarSiguienteCapitulo === "function"
                &&
                preguntarContinuarCapitulos
            ) {

                preguntarSiguienteCapitulo();

            }

            return;

        }

    }

}
//------------------------------------
// TODOS LOS CAPÍTULOS TERMINADOS
//------------------------------------

if (
    proyectoActual.estructura.capitulos === "creado"
) {

    actualizarIndicador(
        "estadoCapitulos",
        "verde"
    );

    botonVerde(
        "btnCapitulos"
    );

    deshabilitarBoton(
        "btnCapitulos"
    );

    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Capítulos",
        "Capítulos generados"
    );

    actualizarMonitorBotonera(
        "Capítulos completos",
        `
        📖 Todos los capítulos fueron generados correctamente
        <br><br>
        Proyecto:
        <br>
        ${proyectoActual.titulo}
        `
    );

}
// ------------------------------------
// CONCLUSIÓN
// ------------------------------------

if (
    proyectoActual.estructura.conclusion === "creado"
) {

monitorPIXELLAB(
        "Editorial",
        "info",
        "DEBUG Conclusión",
        "Entró al bloque de conclusión pendiente"
    );
    actualizarIndicador(
        "estadoConclusion",
        "verde"
    );

    botonVerde(
        "btnConclusion"
    );

    deshabilitarBoton(
        "btnConclusion"
    );

    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Conclusión",
        "Conclusión generada correctamente"
    );

    actualizarMonitorBotonera(
        "Proceso finalizado",
        `
        📘 Conclusión generada correctamente
        <br><br>
        Proyecto:
        <br>
        ${proyectoActual.titulo}
        <br><br>
        ✅ Ebook completo
        `
    );

} else {

    actualizarIndicador(
        "estadoConclusion",
        "azul"
    );

    botonAzul(
        "btnConclusion"
    );

    habilitarBoton(
        "btnConclusion"
    );

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Conclusión",
        "Listo para generar conclusión"
    );

    actualizarMonitorBotonera(
        "Siguiente paso",
        `
        📘 Generar conclusión del proyecto
        <br><br>
        Proyecto:
        <br>
        ${proyectoActual.titulo}
        `
    );

    return;

} 
    } // ← ESTA ES LA LLAVE QUE CIERRA EL TRY

    catch (error) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Verificación",
            error.message
        );

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

// =====================================================
// FUNCIÓN: guardarJSON()
// Descripción:
// Toma una ruta y un objeto JSON,
// y guarda el objeto en R2.
// =====================================================

async function guardarJSON(ruta, datos) {


    const respuesta = await fetch(
        WORKER_URL,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                action: "guardar-json",
                ruta: ruta,
                json: datos
            })
        }
    );


    const resultado =
        await respuesta.json();


    if (!resultado.ok) {


        monitorPIXELLAB(
            "Core",
            "error",
            "guardarJSON",
            "Error guardando: " + ruta
        );


        return false;

    }


    monitorPIXELLAB(
        "Core",
        "ok",
        "guardarJSON",
        "Guardado correctamente: " + ruta
    );


    return true;

}
//=====================================
// ACTUALIZAR INDICADOR PIPELINE
//=====================================

function actualizarIndicador(id, estado = "verde") {

    const indicador =
        document.getElementById(id);

    if (!indicador) return;


    // Guardar solo el nombre sin estado
    const nombres = {
        estadoProyecto: "Proyecto",
        estadoPlan: "Planificador",
        estadoIndice: "Índice",
        estadoLegales: "Legales",
        estadoIntro: "Introducción",
        estadoCapitulos: "Capítulos",
        estadoConclusion: "Conclusión"
    };


    let circulo = "⚪";


    if (estado === "verde") {
        circulo = "🟢";
    }

    if (estado === "azul") {
        circulo = "🔵";
    }

    if (estado === "amarillo") {
        circulo = "🟡";
    }

    if (estado === "rojo") {
        circulo = "🔴";
    }


    indicador.textContent =
        circulo + " " + (nombres[id] || id);

}

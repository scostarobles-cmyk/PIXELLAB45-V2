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
//=====================================
// VERIFICAR PROYECTO
//=====================================

async function verificarProyecto() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Verificación",
        "Buscando proyecto en R2"
    );


    try {


        const respuesta = await fetch(
            WORKER_URL,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    action:"verificar-proyecto"
                })
            }
        );


        const datos =
            await respuesta.json();



        const proyectoProduccion =
            datos.proyectoProduccion;



        //=====================================
        // NO EXISTE PROYECTO
        //=====================================

        if(!proyectoProduccion){


            proyectoActual = null;
            projectIdActual = null;


            restaurarInterfaz();


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
                "No hay proyecto activo"
            );


            return;

        }



        //=====================================
        // CARGAR PROYECTO
        //=====================================

        proyectoActual =
            proyectoProduccion;


        projectIdActual =
            proyectoActual.projectId;



        //=====================================
        // DETERMINAR ETAPA
        //=====================================


        let etapaActual = "proyecto";


if (
    proyectoActual.estructura.plan === "creado"
){
    etapaActual = "indice";
}


if (
    proyectoActual.estructura.indice === "creado"
){
    etapaActual = "legales";
}
if (
    proyectoActual.estructura.legales === "creado"
){
    etapaActual = "introduccion";
} 
if (
    proyectoActual.estructura.introduccion === "creado"
){
    etapaActual = "capitulos";
}


        //=====================================
        // SWITCH DE ETAPA
        //=====================================

        switch(etapaActual){


            case "proyecto":


                actualizarIndicador(
                    "estadoProyecto",
                    "verde"
                );


                botonVerde(
                    "btnProyecto"
                );


                botonAzul(
                    "btnPlan"
                );


                habilitarBoton(
                    "btnPlan"
                );


                break;



            case "plan":


                actualizarIndicador(
                    "estadoProyecto",
                    "verde"
                );


                botonVerde(
                    "btnProyecto"
                );



                actualizarIndicador(
                    "estadoPlan",
                    "verde"
                );


                botonVerde(
                    "btnPlan"
                );



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


                break;
case "indice":

    // Proyecto
    actualizarIndicador("estadoProyecto","verde");
    botonVerde("btnProyecto");
    deshabilitarBoton("btnProyecto");


    // Plan
    actualizarIndicador("estadoPlan","verde");
    botonVerde("btnPlan");
    deshabilitarBoton("btnPlan");


    // Índice
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

    }


    break;
case "legales":

    actualizarIndicador("estadoProyecto","verde");
    botonVerde("btnProyecto");


    actualizarIndicador("estadoPlan","verde");
    botonVerde("btnPlan");


    actualizarIndicador("estadoIndice","verde");
    botonVerde("btnIndice");


    actualizarIndicador("estadoLegales","azul");


    botonAzul(
        "btnLegales"
    );

    habilitarBoton(
        "btnLegales"
    );


    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Legales",
        "Listo para generar legales"
    );


    return;
    case "introduccion":
    // ==========================
// PIPELINE
// ==========================

actualizarIndicador(
    "estadoProyecto",
    "verde"
);

actualizarIndicador(
    "estadoPlan",
    "verde"
);

actualizarIndicador(
    "estadoIndice",
    "verde"
);

actualizarIndicador(
    "estadoLegales",
    "verde"
);

actualizarIndicador(
    "estadoIntro",
    "azul"
);

    // Proyecto
    actualizarIndicador("estadoProyecto","verde");
    botonVerde("btnProyecto");
    deshabilitarBoton("btnProyecto");


    // Plan
    actualizarIndicador("estadoPlan","verde");
    botonVerde("btnPlan");
    deshabilitarBoton("btnPlan");


    // Índice
    actualizarIndicador("estadoIndice","verde");
    botonVerde("btnIndice");
    deshabilitarBoton("btnIndice");


    // Legales
    botonVerde("btnLegales");
    deshabilitarBoton("btnLegales");


    // Introducción
    botonAzul("btnIntroduccion");
    habilitarBoton("btnIntroduccion");


    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Introducción",
        "Lista para generar introducción"
    );

    return;
    case "capitulos":

    actualizarIndicador("estadoProyecto","verde");
    botonVerde("btnProyecto");
    deshabilitarBoton("btnProyecto");


    actualizarIndicador("estadoPlan","verde");
    botonVerde("btnPlan");
    deshabilitarBoton("btnPlan");


    actualizarIndicador("estadoIndice","verde");
    botonVerde("btnIndice");
    deshabilitarBoton("btnIndice");


    actualizarIndicador("estadoLegales","verde");
    botonVerde("btnLegales");
    deshabilitarBoton("btnLegales");


    actualizarIndicador("estadoIntro","verde");
    botonVerde("btnIntroduccion");
    deshabilitarBoton("btnIntroduccion");


    actualizarIndicador("estadoCapitulos","azul");
    botonAzul("btnCapitulos");
    habilitarBoton("btnCapitulos");


    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Capítulos",
        "Listo para generar capítulos"
    );

    return;
    

            default:


                break;


        }



        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Verificación",
            "Estado actualizado correctamente"
        );


    }
    catch(error){


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

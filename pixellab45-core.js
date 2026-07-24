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
//=====================================================
// FUNCIÓN: verificarProyecto()
// Descripción:
// Solicita al Worker la búsqueda del proyecto activo
// en R2 y continúa según el estado del proyecto.
//=====================================================*/


async function verificarProyecto() {

    // Limpiar monitor antes de la prueba
    limpiarMonitorPIXELLAB();


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Verificación",
        "Prueba inicial de interfaz"
    );


    try {


        // ------------------------------------
        // BLOQUEAR TODOS LOS BOTONES
        // ------------------------------------

        const botonesBloqueados = [

            "btnPlan",
            "btnIndice",
            "btnLegales",
            "btnIntroduccion",
            "btnCapitulos",
            "btnConclusion"

        ];


        botonesBloqueados.forEach(id => {

            deshabilitarBoton(id);

        });



        // ------------------------------------
        // HABILITAR SOLO PROYECTO
        // ------------------------------------

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
            "Interfaz",
            "Proyecto habilitado. Resto de botones bloqueados."
        );


    } catch(error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Verificación",
            error.message
        );


    }

}


/* ==========================================================
   PIXELLAB Monitor v1.3
   Monitor global reutilizable
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
        error: "❌",
        debug: "🔎"

    };


    const icono =
        niveles[nivel] || "•";


    const evento = `

<div class="monitor-evento monitor-${nivel}">

    <div class="monitor-header">

        <span class="monitor-hora">
            ${hora}
        </span>

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
//====================================================
// PIXELLAB45 CORE
// GESTIÓN DE VERSIÓN Y CACHE EN R2
//====================================================

async function gestionarVersionCachePIXELLAB(){

    let versionActiva = PIXELLAB45_VERSION;


    //------------------------------------
    // CASO 1
    // GitHub entregó versión correcta
    //------------------------------------

    if(
        versionActiva &&
        versionActiva !== "__VERSION__"
    ){

        await guardarJSON(
            "cache/version.json",
            {
                version: Number(versionActiva),
                origen: "github",
                fecha: new Date().toISOString()
            }
        );


        monitorPIXELLAB(
            "CORE",
            "ok",
            "Versión",
            "Versión GitHub guardada: " + versionActiva
        );


        return String(versionActiva);

    }



    //------------------------------------
    // CASO 2 y 3
    // GitHub falló
    //------------------------------------

    monitorPIXELLAB(
        "CORE",
        "aviso",
        "Versión",
        "Versión GitHub no disponible"
    );



    let registro = null;


    try {

        registro =
            await cargarJSON(
                "cache/version.json"
            );

    } catch(e){

        registro = null;

    }



    let nuevaVersion;



    //------------------------------------
    // Existe registro anterior
    //------------------------------------

    if(
        registro &&
        registro.version
    ){

        nuevaVersion =
            Number(registro.version) + 1;


        monitorPIXELLAB(
            "CORE",
            "proceso",
            "Cache",
            "Incrementando versión de respaldo"
        );


    }


    //------------------------------------
    // Primer arranque sin registro
    //------------------------------------

    else {


        nuevaVersion =
            Math.floor(
                Math.random() * 900000
            ) + 100000;


        monitorPIXELLAB(
            "CORE",
            "proceso",
            "Cache",
            "Creando versión inicial de respaldo"
        );


    }



    //------------------------------------
    // Guardar nueva versión
    //------------------------------------

    await guardarJSON(
        "cache/version.json",
        {
            version: nuevaVersion,
            origen: "respaldo",
            fecha: new Date().toISOString()
        }
    );



    monitorPIXELLAB(
        "CORE",
        "ok",
        "Versión activa",
        String(nuevaVersion)
    );


    return String(nuevaVersion);

}

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
//====================================================
// PIXELLAB45 CORE
// GESTIÓN DE VERSIÓN Y CACHE
//====================================================


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

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Verificación",
        "Entró a verificarProyecto"
    );


    try {

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


        monitorPIXELLAB(
            "Editorial",
            "debug",
            "Respuesta Worker",
            JSON.stringify(datos)
        );


   //     limpiarMonitorPIXELLAB();


        const proyectoCreado =
            datos.proyectoCreado;


        const proyectoProduccion =
            datos.proyectoProduccion;



        //------------------------------------
        // PROYECTO CREADO
        //------------------------------------

        if (proyectoCreado) {


            monitorPIXELLAB(
                "Editorial",
                "estado",
                "Proyecto creado",
                "Proyecto finalizado disponible"
            );


            monitorPIXELLAB(
                "Editorial",
                "info",
                "Título",
                proyectoCreado.titulo
            );


            monitorPIXELLAB(
                "Editorial",
                "info",
                "ID",
                proyectoCreado.projectId
            );


            if (proyectoCreado.fecha) {


                monitorPIXELLAB(
                    "Editorial",
                    "info",
                    "Fecha",
                    proyectoCreado.fecha
                );


            }


            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Proyecto",
                "Abra este Ebook en el editor"
            );


            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Proyecto",
                "Puede generar un nuevo proyecto"
            );


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


        }



        //------------------------------------
        // PROYECTO PRODUCCIÓN
        //------------------------------------

        if (proyectoProduccion) {


            proyectoActual =
                proyectoProduccion;


            projectIdActual =
                proyectoActual.projectId;



            //------------------------------------
            // PROYECTO
            //------------------------------------

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
                "estado",
                "Proyecto",
                "Proyecto en producción cargado"
            );


            monitorPIXELLAB(
                "Editorial",
                "info",
                "ID",
                projectIdActual
            );


            monitorPIXELLAB(
                "Editorial",
                "info",
                "Título",
                proyectoActual.titulo
            );



            //------------------------------------
            // PLAN
            //------------------------------------

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
                    "estado",
                    "Plan",
                    "Plan generado"
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
                    "Falta generar el plan"
                );


                monitorPIXELLAB(
                    "Editorial",
                    "proceso",
                    "Siguiente paso",
                    "Generar plan"
                );


                return;

            }
            //------------------------------------
            // INDICE
            //------------------------------------

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
                    "estado",
                    "Índice",
                    "Índice generado"
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
                    "Falta generar el índice"
                );


                return;

            }



            //------------------------------------
            // LEGALES
            //------------------------------------

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
                    "estado",
                    "Legales",
                    "Legales generadas"
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
                    "Falta generar las legales"
                );


                monitorPIXELLAB(
                    "Editorial",
                    "proceso",
                    "Siguiente paso",
                    "Generar legales"
                );


                return;

            }




            //------------------------------------
            // INTRODUCCIÓN
            //------------------------------------

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
                    "estado",
                    "Introducción",
                    "Introducción generada"
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
                    "Falta generar introducción"
                );


                monitorPIXELLAB(
                    "Editorial",
                    "proceso",
                    "Siguiente paso",
                    "Generar introducción"
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
            // CAPÍTULOS
            //------------------------------------

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
                    "Falta generar capítulos"
                );


                return;

            }



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


            }




            //------------------------------------
            // CONCLUSIÓN
            //------------------------------------

            if (
                proyectoActual.estructura.conclusion === "creado"
            ) {


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
                    "estado",
                    "Conclusión",
                    "Conclusión generada"
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
                    "Falta generar la conclusión"
                );


                monitorPIXELLAB(
                    "Editorial",
                    "proceso",
                    "Siguiente paso",
                    "Generar conclusión"
                );


                return;

            }


        } // FIN PROYECTO PRODUCCIÓN





        //------------------------------------
        // NO EXISTE NINGÚN PROYECTO
        //------------------------------------

        if (
            !proyectoCreado &&
            !proyectoProduccion
        ) {


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
                "No existe ningún proyecto"
            );


            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Siguiente paso",
                "Crear un nuevo proyecto"
            );


        }



    } catch (error) {


        console.error(error);


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Verificar proyecto",
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



// =====================================
// ARRANQUE DEL MÓDULO EDITORIAL
// =====================================

async function iniciarCargaEditorial() {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Módulo Editorial iniciado"
    );
    
   //  await gestionarVersionCachePIXELLAB();

    await verificarProyecto();

    await cargarGaleriaEditorial();
    
    

}


window.addEventListener(
    "load",
    iniciarCargaEditorial
);

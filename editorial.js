
monitorPIXELLAB(
    "Editorial",
    "info",
    "Carga",
    "editorial.js ejecutándose"
);
// =====================================
// PIXELLAB EDITORIAL
// VARIABLES DEL EDITOR
// =====================================

let proyectoActual = null;

let projectIdActual = null;

let continuarCapitulosAutomatico = false;

let preguntarContinuarCapitulos = true;

monitorPIXELLAB(
    "Editorial",
    "info",
    "Carga script",
    "editorial.js comenzó a ejecutarse",
    "monitorBotonera"
);
// =====================================
// ARRANQUE DEL MÓDULO EDITORIAL
// =====================================

async function iniciarCargaEditorial() {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Módulo Editorial iniciado"
    );

  
    
    await verificarProyecto();
    
    await cargarGaleriaEditorial();

}


window.addEventListener(
    "load",
    iniciarCargaEditorial
);


// =====================================
// RESTO DE FUNCIONES EDITORIALES
// =====================================

// iniciarEditorial()
// verificarProyecto()
// cargarProyecto()
// generar...



/*
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


        limpiarMonitorPIXELLAB();


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


/*
=================================================
PIXELLAB45 EDITORIAL

Función:
seleccionarProyectoEditorial()

Descripción:
Abre el editor del eBook seleccionado desde
la biblioteca editorial.

Proceso:
- Guarda el proyecto activo.
- Oculta la biblioteca.
- Muestra el área de edición.
- Carga la portada en la primera página A4.

Estado:
Versión inicial del editor.

Archivo:
script.js

=================================================
*/

let proyectoEditorialActivo = null;

async function seleccionarProyectoEditorial(projectId) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Abriendo proyecto",
        projectId
    );

    const proyecto =
        bibliotecaEditorial.find(
            p => p.projectId === projectId
        );

    if (!proyecto) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Proyecto",
            "No encontrado"
        );

        return;

    }





    // ==========================
    // Abrir editor
    // ==========================

    proyectoEditorialActivo = projectId;

    const editor =
        document.getElementById(
            "editorTrabajo"
        );

    if (!editor) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Editor",
            "No existe editorTrabajo"
        );

        return;

    }

    editor.style.display = "block";

    document.querySelector(
        "#editorTrabajo h2"
    ).textContent =
        "✏️ " + proyecto.titulo;

    await cargarLibroCompleto(proyecto);

    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Editor abierto",
        proyecto.titulo
    );

}
async function generarConclusion() {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Conclusión",
        "Iniciando generación de conclusión"
    );


    try {


        const respuesta = await fetch(WORKER_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                action: "generar-conclusion"
            })

        });


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Conclusión",
            "Respuesta recibida del Worker"
        );


        const resultado =
            await respuesta.json();



        if (!resultado.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Conclusión",
                "Error generando conclusión: " +
                resultado.error
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Conclusión",
            "Conclusión creada correctamente"
        );



        if (
            typeof actualizarEstadoProyecto === "function"
        ) {

            actualizarEstadoProyecto(
                "conclusion",
                "creado"
            );


            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Estado proyecto",
                "Conclusión marcada como creada"
            );

        }



        if (
            typeof botonVerde === "function"
        ) {

            botonVerde(
                "btnConclusion"
            );

        }


        if (
            typeof actualizarIndicador === "function"
        ) {

            actualizarIndicador(
                "estadoConclusion",
                "verde"
            );

        }



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Verificación",
            "Actualizando estado del proyecto"
        );


        await verificarProyecto();



    } catch (error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Conclusión",
            "Error de conexión: " + error.message
        );


        console.error(error);

    }

}



//=====================================================
// FUNCIÓN: crearProyecto()
// Descripción:
// Crea un nuevo proyecto editorial y lo guarda en R2.
//=====================================================

async function crearProyecto() {


    botonVerde("btnProyecto");
    actualizarIndicador(
        "estadoProyecto",
        "verde"
    );


    botonAzul("btnPlan");
    actualizarIndicador(
        "estadoPlan",
        "azul"
    );

    habilitarBoton(
        "btnPlan"
    );


    const btn =
        document.getElementById(
            "btnProyecto"
        );


    const estado =
        document.getElementById(
            "estadoProyecto"
        );


    const tema =
        document.getElementById(
            "temaEbook"
        ).value.trim();


    const autor =
        document.getElementById(
            "autorEbook"
        ).value.trim();


    const paginas =
        parseInt(
            document.getElementById(
                "paginasEbook"
            ).value
        );


    const idioma =
        document.getElementById(
            "idiomaEbook"
        ).value;


    const tono =
        document.getElementById(
            "tonoEbook"
        ).value;


    const publico =
        document.getElementById(
            "publicoEbook"
        ).value;



    if (!tema) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Proyecto",
            "Debe ingresar el título del eBook"
        );

        return;

    }


    if (!autor) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Proyecto",
            "Debe ingresar el autor"
        );

        return;

    }



    btn.disabled = true;

    btn.innerHTML =
        "📁 Generando proyecto...";



    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Proyecto",
        "Creando proyecto..."
    );



    try {


        const projectId =
            "PROY-" + Date.now();



        const proyecto = {


            projectId,


            titulo: tema,

            autor,

            paginas,

            idioma,

            tono,

            publico,


            estado:
                "produccion",


            estructura: {

                indice:
                    "pendiente",

                plan:
                    "pendiente",

                legales:
                    "pendiente",

                introduccion:
                    "pendiente",

                capitulos:
                    "pendiente",

                conclusion:
                    "pendiente"

            },


            fecha:
                new Date().toISOString()

        };



        await guardarJSON(
            `proyectos/${projectId}/proyecto.json`,
            proyecto
        );



        proyectoActual =
            proyecto;


        projectIdActual =
            proyecto.projectId;



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Proyecto",
            "Proyecto creado correctamente: " +
            projectId
        );



        estado.innerHTML =
            "🟢 Proyecto creado";



        btn.classList.add(
            "completo"
        );


        btn.innerHTML =
            "✅ Proyecto creado";



        await verificarProyecto();



    } catch(err) {


        console.error(err);


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Proyecto",
            err.message
        );


        estado.innerHTML =
            "🔴 Error";


        btn.innerHTML =
            "❌ Error";


        btn.disabled = false;

    }

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
// GENERAR PLAN
//=====================================

async function generarPlan2() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Plan",
        "Iniciando generación de plan"
    );


    try {


        const respuesta = await fetch(
            WORKER_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    action: "generar-plan"
                })

            }
        );



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Plan",
            "Respuesta recibida del Worker"
        );



        const datos =
            await respuesta.json();



        if (!datos.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Plan",
                "Error generando plan"
            );


            monitorPIXELLAB(
                "Editorial",
                "info",
                "Respuesta Worker",
                JSON.stringify(datos)
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Plan",
            "Plan generado correctamente"
        );



        actualizarIndicador(
            "estadoPlan",
            "verde"
        );



        const btn =
            document.getElementById(
                "btnPlan"
            );


        if (btn) {

            btn.classList.add(
                "completo"
            );

            btn.innerHTML =
                "✅ Plan generado";

            btn.disabled = true;

        }



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Verificación",
            "Actualizando estado del proyecto"
        );


        await verificarProyecto();



    } catch (error) {


        console.error(error);


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Plan",
            "Error comunicando con el Worker: " +
            error.message
        );


    }

}
//=====================================
// GENERAR ÍNDICE
//=====================================

async function generarIndice() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Índice",
        "Iniciando generación de índice"
    );


    try {


        const response = await fetch(
            WORKER_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "generar-indice"
                })
            }
        );



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Índice",
            "Respuesta recibida del Worker"
        );



        const data =
            await response.json();



        if (data.ok) {


            monitorPIXELLAB(
                "Editorial",
                "ok",
                "Índice",
                "Índice generado correctamente"
            );



            const btn =
                document.getElementById(
                    "btnIndice"
                );



            if (btn) {

                btn.classList.add(
                    "completo"
                );

                btn.innerHTML =
                    "✅ Índice generado";

                btn.disabled = true;

            }



            await verificarProyecto();



        } else {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Índice",
                "Error generando índice"
            );


            monitorPIXELLAB(
                "Editorial",
                "debug",
                "Respuesta Worker",
                JSON.stringify(data)
            );


        }



    } catch (error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Índice",
            "Error de conexión: " +
            error.message
        );


    }

}
//=====================================
// RESTAURAR INTERFAZ
//=====================================

function restaurarInterfaz() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Restaurar",
        "Restaurando interfaz editorial"
    );



    //==========================
    // Limpiar variables globales
    //==========================

    proyectoActual = null;
    plan = null;



    //==========================
    // Restaurar indicadores
    //==========================

    actualizarIndicador(
        "estadoProyecto",
        "blanco"
    );

    actualizarIndicador(
        "estadoPlan",
        "blanco"
    );

    actualizarIndicador(
        "estadoIndice",
        "blanco"
    );

    actualizarIndicador(
        "estadoLegales",
        "blanco"
    );

    actualizarIndicador(
        "estadoIntro",
        "blanco"
    );

    actualizarIndicador(
        "estadoCapitulos",
        "blanco"
    );

    actualizarIndicador(
        "estadoConclusion",
        "blanco"
    );



    //==========================
    // Restaurar botones
    //==========================

    botonNormal("btnProyecto");
    botonNormal("btnPlan");
    botonNormal("btnIndice");
    botonNormal("btnLegales");
    botonNormal("btnIntroduccion");
    botonNormal("btnCapitulos");
    botonNormal("btnConclusion");



    //==========================
    // Habilitar / Deshabilitar
    //==========================

    habilitarBoton(
        "btnProyecto"
    );


    deshabilitarBoton("btnPlan");
    deshabilitarBoton("btnIndice");
    deshabilitarBoton("btnLegales");
    deshabilitarBoton("btnIntroduccion");
    deshabilitarBoton("btnCapitulos");
    deshabilitarBoton("btnConclusion");



    //==========================
    // Mensaje final
    //==========================

    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Restaurar",
        "Sistema listo para crear un nuevo Ebook"
    );

}
//=====================================
// GENERAR LEGALES
//=====================================

async function generarLegales() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Legales",
        "Iniciando generación de legales"
    );


    try {


        const respuesta = await fetch(
            WORKER_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "generar-legales"
                })
            }
        );



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Legales",
            "Respuesta recibida del Worker"
        );



        const resultado =
            await respuesta.json();



        if (!resultado.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Legales",
                "Error generando legales: " +
                resultado.error
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Legales",
            "Página de legales creada correctamente"
        );



        if (
            typeof actualizarEstadoProyecto === "function"
        ) {


            actualizarEstadoProyecto(
                "legales",
                "creado"
            );


            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Estado proyecto",
                "Legales marcado como creado"
            );

        }



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Verificación",
            "Actualizando estado del proyecto"
        );


        await verificarProyecto();



    } catch (error) {


        console.error(error);



        monitorPIXELLAB(
            "Editorial",
            "error",
            "Legales",
            "Error de conexión: " +
            error.message
        );


    }

}
//=====================================
// GENERAR INTRODUCCIÓN
//=====================================

async function generarIntroduccion() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Introducción",
        "Iniciando generación de introducción"
    );


    try {


        const respuesta = await fetch(
            WORKER_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "generar-introduccion"
                })
            }
        );



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Introducción",
            "Respuesta recibida del Worker"
        );



        const resultado =
            await respuesta.json();



        if (!resultado.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Introducción",
                "Error generando introducción: " +
                resultado.error
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Introducción",
            "Introducción creada correctamente"
        );



        if (
            typeof actualizarEstadoProyecto === "function"
        ) {


            actualizarEstadoProyecto(
                "introduccion",
                "creado"
            );


            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Estado proyecto",
                "Introducción marcada como creada"
            );

        }



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Verificación",
            "Actualizando estado del proyecto"
        );


        await verificarProyecto();



    } catch (error) {


        console.error(error);


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Introducción",
            "Error de conexión: " +
            error.message
        );


    }

}
//=====================================
// GENERAR CAPÍTULOS
//=====================================

async function generarCapitulos() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Capítulos",
        "Generando capítulo"
    );


    if (typeof botonAmarillo === "function") {

        botonAmarillo(
            "btnCapitulos"
        );

    }


    if (typeof actualizarIndicador === "function") {

        actualizarIndicador(
            "estadoCapitulos",
            "amarillo"
        );

    }



    try {


        const respuesta = await fetch(
            WORKER_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "generar-capitulo"
                })
            }
        );



        const resultado =
            await respuesta.json();



        if (!resultado.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Capítulos",
                "Error generando capítulo: " +
                resultado.error
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Capítulos",
            `Capítulo ${resultado.numero} generado correctamente`
        );



        //------------------------------------
        // CONTROL MANUAL / AUTOMÁTICO
        //------------------------------------

        if (preguntarContinuarCapitulos) {


            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Capítulos",
                "Esperando confirmación del usuario"
            );


            preguntarSiguienteCapitulo();



        } else {



            //------------------------------------
            // CARGAR PLAN TEMPORALMENTE
            //------------------------------------

            const plan = await cargarJSON(
                `proyectos/${projectIdActual}/plan.json`
            );



            if (!plan || !plan.capitulos) {


                monitorPIXELLAB(
                    "Editorial",
                    "error",
                    "Capítulos",
                    "No se pudo cargar el plan"
                );


                return;

            }



            const quedanPendientes =
                plan.capitulos.some(
                    capitulo =>
                        capitulo.estado !== "creado"
                );



            //------------------------------------
            // SI QUEDAN CAPÍTULOS, CONTINÚA
            //------------------------------------

            if (quedanPendientes) {


                monitorPIXELLAB(
                    "Editorial",
                    "proceso",
                    "Capítulos",
                    "Hay capítulos pendientes. Continuando..."
                );


                await generarCapitulos();



            } else {



                //------------------------------------
                // TODOS LOS CAPÍTULOS TERMINADOS
                //------------------------------------

                monitorPIXELLAB(
                    "Editorial",
                    "ok",
                    "Capítulos",
                    "Todos los capítulos fueron generados"
                );



                await verificarProyecto();


            }

        }



    } catch (error) {


        console.error(error);



        monitorPIXELLAB(
            "Editorial",
            "error",
            "Capítulos",
            "Error generando capítulo: " +
            error.message
        );


    }

}
function preguntarSiguienteCapitulo() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Capítulos",
        "Mostrando ventana de continuación"
    );


    // Evitar duplicar el modal
    if (document.getElementById("modalCapitulos")) {

        monitorPIXELLAB(
            "Editorial",
            "aviso",
            "Capítulos",
            "Modal ya existente"
        );

        return;
    }



    // Agregar estilos una sola vez
    if (!document.getElementById("estiloModalCapitulos")) {


        const style = document.createElement("style");

        style.id = "estiloModalCapitulos";


        style.textContent = `

#modalCapitulos{

    position:fixed;
    inset:0;
    background:rgba(0,0,0,.75);

    display:flex;
    justify-content:center;
    align-items:center;

    z-index:99999;

    backdrop-filter:blur(4px);

}

#modalCapitulos .ventana{

    width:420px;
    max-width:90%;

    background:#111827;

    border:2px solid #00d9ff;
    border-radius:16px;

    padding:25px;

    box-shadow:0 0 30px rgba(0,217,255,.45);

    color:#fff;

    font-family:Arial,sans-serif;

}

#modalCapitulos h2{

    margin:0 0 15px;

    color:#00d9ff;

    text-align:center;

}

#modalCapitulos p{

    text-align:center;
    line-height:1.5;

}

#modalCapitulos label{

    display:flex;
    align-items:center;
    gap:10px;

    margin:20px 0;

}

#modalCapitulos .botones{

    display:flex;
    justify-content:center;
    gap:15px;

    margin-top:20px;

}

#modalCapitulos button{

    padding:10px 20px;

    border:none;
    border-radius:8px;

    cursor:pointer;

    font-size:15px;
    font-weight:bold;

}

#btnContinuarCapitulo{

    background:#00d9ff;
    color:#000;

}

#btnPausarCapitulo{

    background:#444;
    color:#fff;

}

#modalCapitulos button:hover{

    transform:scale(1.05);

}

`;

        document.head.appendChild(style);

    }



    const overlay = document.createElement("div");

    overlay.id = "modalCapitulos";


    overlay.innerHTML = `

<div class="ventana">

<h2>📖 Capítulo generado</h2>

<p>
El capítulo se generó correctamente.<br><br>
¿Desea continuar con el siguiente capítulo?
</p>


<label>

<input
type="checkbox"
id="chkNoPreguntarCapitulos"
>

No volver a preguntar durante este Ebook

</label>


<div class="botones">


<button id="btnContinuarCapitulo">

▶ Continuar

</button>


<button id="btnPausarCapitulo">

⏸ Pausar

</button>


</div>

</div>

`;



    document.body.appendChild(overlay);



    //-------------------------------
    // CONTINUAR
    //-------------------------------

    document.getElementById(
        "btnContinuarCapitulo"
    ).onclick = async () => {


        const chk =
            document.getElementById(
                "chkNoPreguntarCapitulos"
            );


        if (chk.checked) {

            preguntarContinuarCapitulos = false;

            continuarCapitulosAutomatico = true;


            monitorPIXELLAB(
                "Editorial",
                "estado",
                "Capítulos",
                "Modo automático activado"
            );

        }


        overlay.remove();


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Capítulos",
            "Continuando generación"
        );


        await generarCapitulos();

    };



    //-------------------------------
    // PAUSAR
    //-------------------------------

    document.getElementById(
        "btnPausarCapitulo"
    ).onclick = () => {


        overlay.remove();


        monitorPIXELLAB(
            "Editorial",
            "aviso",
            "Capítulos",
            "Generación pausada por usuario"
        );


    };


}
/* ==========================================================
   PIXELLAB Monitor v1.0
========================================================== */

function limpiarMonitorPIXELLAB(){

    const monitor =
        document.getElementById("monitorPIXELLAB");

    if(!monitor) return;

    monitor.innerHTML="";

}



/*
=================================================
PIXELLAB45 FRONTEND

Función:
cargarBibliotecaEditorial()

Descripción:
- Solicita la biblioteca editorial al Worker.
- Envía action para entrar al case.
- Recibe proyectos.
- Genera tarjetas en la galería editorial.

Archivo:
script.js

=================================================
*/

async function cargarGaleriaEditorial() {

    try {


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Inicio",
            "Solicitando eBooks al Worker"
        );


        const respuesta =
            await fetch(
                WORKER_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        action: "listar-ebooks"
                    })
                }
            );


        const data =
            await respuesta.json();


        if (!data.ok) {

            throw new Error(
                data.error ||
                "Error listando eBooks"
            );

        }


        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Lista generada",
            "eBooks encontrados: " +
            data.ebooks.length
        );


        mostrarProyectosEditorial(
            data.ebooks
        );


        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Enviado a mostrar",
            "Datos enviados a tarjetas editoriales"
        );


    } catch(error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Carga galería editorial",
            error.message
        );


        console.error(error);

    }

}

/*
=================================================
PIXELLAB45 FRONTEND
Módulo: Biblioteca Editorial

Función:
cargarBibliotecaEditorial()

Descripción:
Carga la biblioteca desde el Worker
y actualiza la interfaz del usuario.

Archivo:
script.js

=================================================
*/
let bibliotecaEditorial = [];
async function mostrarProyectosEditorial(proyectos) {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Inicio",
        "Entró a mostrar proyectos editoriales"
    );


    const contenedor =
        document.getElementById(
            "bibliotecaEditorial"
        );


    if (!contenedor) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Contenedor no encontrado",
            "No existe bibliotecaEditorial"
        );

        return;

    }


    contenedor.innerHTML = "";


    if (!proyectos || proyectos.length === 0) {

        contenedor.innerHTML =
            "<p>No hay proyectos para editar</p>";

        return;

    }


    let cantidad = 0;
bibliotecaEditorial = [];

    for (const proyecto of proyectos) {
    	
    bibliotecaEditorial.push({

    projectId: proyecto.projectId,

    titulo: proyecto.titulo,

    autor: proyecto.autor,

    paginas: proyecto.paginas,

    portada:
        `${R2_EBOOKS_URL}/proyectos/${proyecto.projectId}/imagenes/portada.png`,

    estructura: proyecto.estructura

});


        cantidad++;


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Creando tarjeta",
            proyecto.titulo
        );


        const tarjeta =
            document.createElement(
                "article"
            );


        tarjeta.className =
            "editorial-card";


        tarjeta.innerHTML = `

        <div class="editorial-cover">

            <img class="portada-editorial">

        </div>


        <div class="editorial-info">

            <h3>
                ${proyecto.titulo}
            </h3>


            <p>
                Ebook • ${proyecto.autor}
            </p>


            <span>
                PIXELLAB Editorial
            </span>


            <button
            class="boton-accion"
            onclick="seleccionarProyectoEditorial('${proyecto.projectId}')">

                ✏️ Editar

            </button>

        </div>

        `;


        contenedor.appendChild(
            tarjeta
        );


        const imagen =
            tarjeta.querySelector(
                ".portada-editorial"
            );


        const rutaPortada =
            `proyectos/${proyecto.projectId}/imagenes/portada.png`;


        const urlPortada =
            `${R2_EBOOKS_URL}/${rutaPortada}`;


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Verificando portada",
            urlPortada
        );


        await new Promise((resolve) => {


            imagen.onload = () => {


                monitorPIXELLAB(
                    "Editorial",
                    "estado",
                    "Portada encontrada",
                    proyecto.titulo
                );


                resolve();

            };


            imagen.onerror = async () => {


                monitorPIXELLAB(
                    "Editorial",
                    "proceso",
                    "Generando portada",
                    proyecto.titulo
                );


                const nuevaPortada =
                    await generarPortadaProyecto(
                        proyecto
                    );


                if (nuevaPortada) {


                    imagen.src =
                        `${R2_EBOOKS_URL}/${nuevaPortada}`;


                    monitorPIXELLAB(
                        "Editorial",
                        "estado",
                        "Portada cargada",
                        nuevaPortada
                    );

                }


                resolve();

            };


            imagen.src = urlPortada;


        });


    }
monitorPIXELLAB(
    "Editorial",
    "ok",
    "Array Editorial",
    `${bibliotecaEditorial.length} eBooks cargados en memoria`
);

for (const libro of bibliotecaEditorial) {

    monitorPIXELLAB(
        "Editorial",
        "info",
        libro.projectId,
        `${libro.titulo} | ${libro.paginas} páginas`
    );

}

    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Biblioteca mostrada",
        "Cantidad de eBooks renderizados: " + cantidad
    );


}

async function generarPortadaProyecto(proyecto) {

    try {

        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Inicio",
            "Comenzando generación de portada para: " + proyecto.titulo
        );


        // 1. Crear prompt base
        const prompt = `
Genera un prompt visual para crear el ARTE FINAL.

No describas un libro físico.
No describas una hoja de papel.
No describas una portada impresa.
No describas un mockup.
No describas una fotografía.

Tema:
"${proyecto.titulo}"
`;


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Prompt creado",
            "Prompt base generado para portada"
        );


        // 2. Mejorar prompt con Visuales
        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Visuales",
            "Enviando prompt al generador de visuales"
        );


        const resVisual = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "visual",
                tema: prompt
            })
        });


        const dataVisual = await resVisual.json();


        if (!dataVisual.resultado) {
            throw new Error("Visuales no devolvió un prompt.");
        }


        const promptVisual = dataVisual.resultado;


        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Visual generado",
            "Prompt visual recibido correctamente"
        );


        // 3. Generar imagen
        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Generando imagen",
            "Enviando solicitud a Imagen 4"
        );


        const promptImagenFinal =
    promptVisual +
    `

​], composición vertical, diseño a sangrado completo, de borde a borde, ocupando todo el lienzo sin marcos ni bordes blancos --ar 3:4
`;

monitorPIXELLAB(
    "Editorial",
    "info",
    "Prompt portada",
    promptImagenFinal
);
const imagen = await puter.ai.txt2img(
    promptImagenFinal,
    {
        provider: "gemini",
        model: "google/imagen-4.0-fast",
         aspect_ratio: "3:4",
        negative_prompt: `
mockup,
book mockup,
sheet of paper,
page,
printed page,
white border,
white margin,
frame,
drop shadow,
page shadow,
background,
paper texture,
book cover on table,
floating book,
isolated object
`
    }
);


        // 4. Convertir a Base64
        const canvas = document.createElement("canvas");

        canvas.width = imagen.naturalWidth;
        canvas.height = imagen.naturalHeight;


        const ctx = canvas.getContext("2d");

        ctx.drawImage(imagen, 0, 0);


        const imagenBase64 = canvas
            .toDataURL("image/png")
            .split(",")[1];


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Conversión",
            "Imagen convertida a Base64"
        );


        // 5. Guardar en R2
        const ruta =
            `proyectos/${proyecto.projectId}/imagenes/portada.png`;


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Guardando",
            ruta
        );


        const guardar = await fetch(WORKER_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

    action: "guardar-imagen",

    tipo: "ebook",

    ruta: ruta,

    imagen: imagenBase64

})
        });


        const dataGuardar = await guardar.json();


        if (!dataGuardar.ok) {
            throw new Error(dataGuardar.error);
        }


        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Finalizado",
            "Portada guardada correctamente"
        );


        return ruta;


    } catch(error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Generación portada",
            error.message
        );


        console.error(error);


        return null;

    }

}
/*
=========================================================
PIXELLAB Editorial
ETAPA 1 · Carga completa del libro

Objetivo:
Reconstruir completamente el eBook en memoria
leyendo todos los archivos JSON del proyecto.

Flujo:

1. Portada
2. Legales
3. Índice
4. Introducción
5. Capítulos
6. Conclusión

Cada hoja tendrá su propia función de carga.

La única excepción son los capítulos, que se
recorrerán automáticamente leyendo plan.json.

En esta etapa:

✓ Carga contenido
✗ No aplica estilos
✗ No guarda cambios
✗ No realiza edición

=========================================================
*/
const SECCIONES_LIBRO = [
    "portada",
    "legales",
    "indice",
   "introduccion",
    "capitulos",
   "conclusion"
];
/* ==========================
   CARGA DEL LIBRO
========================== */

async function cargarLibroCompleto(proyecto) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Libro",
        "Comenzando carga completa"
    );

    for (const seccion of SECCIONES_LIBRO) {

        await cargarSeccion(
            proyecto,
            seccion
        );

    }

    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Libro",
        "Carga completa finalizada"
    );

}
async function cargarSeccion(
    proyecto,
    seccion
) {

    switch (seccion) {

        case "portada":
            await cargarPaginaPortada(proyecto);
            break;

        case "legales":
            await cargarPaginaLegales(proyecto);
            break;

        case "indice":
            await cargarPaginaIndice(proyecto);
            break;

        case "introduccion":
            await cargarPaginaIntroduccion(proyecto);
            break;

        case "capitulos":

            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Capitulos",
                "Pendiente"
            );

            await cargarPaginaCapitulo(
                proyecto
            );

            break;

        case "conclusion":
            await cargarPaginaConclusion(proyecto);
            break;

    }

}
// =====================================================
// PIXELLAB45 EDITORIAL
// FUNCIÓN: Cargar página de portada en editor A4
// UBICACIÓN: Editor de eBooks
// CREA: Hoja A4 (210x297mm) + imagen de portada
// ADAPTA: Vista móvil manteniendo proporción A4
// BUSCAR: PORTADA A4
// =====================================================

function cargarPaginaPortada(proyecto) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Portada",
        "Entró a cargarPaginaPortada"
    );


    const pagina = document.getElementById("paginaEditor");
    const canvas = document.querySelector(".editor-canvas");


    if (!pagina) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Portada",
            "No existe paginaEditor"
        );

        return;
    }


    pagina.innerHTML = "";


    const hoja = document.createElement("div");

    hoja.className = "pl45-hoja-portada";


    Object.assign(hoja.style, {

        width: "210mm",
        height: "297mm",
        position: "relative",
        overflow: "hidden",
        margin: "auto",
        background: "white",
        transformOrigin: "top center"

    });


    const img = document.createElement("img");


    img.src = proyecto.portada;
    img.alt = proyecto.titulo || "Portada";
    img.className = "portada-editor";


    Object.assign(img.style, {

        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "cover"

    });


    img.onload = () => {
    	monitorPIXELLAB(
    "Editorial",
    "info",
    "Medidas imagen",
    "Imagen real: " +
    img.naturalWidth +
    " x " +
    img.naturalHeight
);

        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Portada",
            "Imagen cargada correctamente"
        );


        const esMovil = window.innerWidth <= 768;


        if (canvas && esMovil) {


            const anchoHoja = hoja.offsetWidth;
            const anchoDisponible = canvas.clientWidth - 20;


            if (anchoHoja > 0 && anchoDisponible > 0) {


                const escala =
                    anchoDisponible / anchoHoja;


                hoja.style.transform =
                    `scale(${Math.min(1, escala)})`;


                hoja.style.marginBottom =
                    `-${hoja.offsetHeight * (1 - escala)}px`;


                monitorPIXELLAB(
                    "Editorial",
                    "info",
                    "Portada",
                    "Escala móvil aplicada: " + escala
                );

            }


        } else {


            hoja.style.transform = "scale(1)";


        }


    };


    img.onerror = () => {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Portada",
            "No se pudo cargar la imagen"
        );

    };


    hoja.appendChild(img);

    pagina.appendChild(hoja);


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Portada",
        "Hoja A4 agregada correctamente"
    );

}
/*
=========================================================
PIXELLAB Editorial
Hoja · Legales

Responsabilidad:

• Cargar legales.json
• Crear la página de legales
• Agregar la página al paginaEditor

No guarda cambios.
No aplica estilos.

=========================================================
*/

async function cargarPaginaLegales(proyecto) {
    monitorPIXELLAB("Editorial", "proceso", "Legales", "Entró a cargarPaginaLegales");

    try {
        const ruta = `proyectos/${proyecto.projectId}/legales.json`;
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "cargar-json", ruta: ruta })
        });

        const datos = await respuesta.json();
        if (!datos.ok || !datos.json) {
            throw new Error("No se pudo cargar el archivo legales.json");
        }

        const legales = datos.json;
        const contenedor = document.getElementById("paginaEditor");
        if (!contenedor) throw new Error("No existe paginaEditor");

        // Contenedor de la hoja
        const hoja = document.createElement("div");
        hoja.className = "pagina-editor pagina-legales";

        // Título
        const titulo = document.createElement("h1");
        titulo.className = "legal-titulo";
        titulo.textContent = "Aviso Legal";

        // Texto
        const texto = document.createElement("div");
        texto.className = "legal-texto";
        texto.textContent = legales.contenido;

        hoja.appendChild(titulo);
        hoja.appendChild(texto);
        contenedor.appendChild(hoja);

        monitorPIXELLAB("Editorial", "estado", "Legales", "Página cargada con éxito");

    } catch(error) {
        monitorPIXELLAB("Editorial", "error", "Legales", error.message);
    }
}

/* ==========================
   PÁGINA ÍNDICE
========================== */

async function cargarPaginaIndice(proyecto) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Índice",
        "Entró a cargarPaginaIndice"
    );

    try {

        const ruta =
            `proyectos/${proyecto.projectId}/indice.json`;

        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Índice",
            "Cargando: " + ruta
        );

        const respuesta =
            await fetch(WORKER_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    action: "cargar-json",

                    ruta: ruta

                })

            });

        const datos =
            await respuesta.json();

        if (!datos.ok) {

            throw new Error(
                "No se pudo cargar índice"
            );

        }

        const indice =
            datos.json;

        if (!indice) {

            throw new Error(
                "JSON índice vacío"
            );

        }

        const contenedor =
            document.getElementById(
                "paginaEditor"
            );

        if (!contenedor) {

            throw new Error(
                "No existe paginaEditor"
            );

        }

        // Crear hoja nueva

        const hoja =
            document.createElement(
                "div"
            );

        hoja.className =
            "pagina-editor";

        // Estilos de prueba visual

        hoja.style.background =
            "#ffffff";

        hoja.style.color =
            "#000000";

        hoja.style.padding =
            "40px";

        hoja.style.marginBottom =
            "20px";

        hoja.style.minHeight =
            "900px";

        // Crear título

        const titulo =
            document.createElement(
                "h1"
            );

        titulo.textContent =
            "Índice";

        titulo.style.color =
            "#000000";

        // Crear contenido

        const texto =
            document.createElement(
                "div"
            );

        texto.style.whiteSpace =
            "pre-line";

        texto.style.color =
            "#000000";

        if (
            indice.capitulos &&
            indice.capitulos.length > 0
        ) {

            for (const capitulo of indice.capitulos) {

                const linea =
                    document.createElement(
                        "p"
                    );

                linea.textContent =
                    `${capitulo.numero}. ${capitulo.titulo}`;

                linea.style.color =
                    "#000000";

                linea.style.fontSize =
                    "18px";

                linea.style.margin =
                    "0 0 12px 0";

                texto.appendChild(
                    linea
                );

            }

        }

        // Armar hoja

        hoja.appendChild(
            titulo);

        hoja.appendChild(
            texto
        );

        // Agregar debajo de lo existente

        contenedor.appendChild(
            hoja
        );

        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Índice",
            "Página cargada correctamente"
        );

    } catch(error) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Índice",
            error.message
        );

    }

}
async function cargarPaginaIntroduccion(proyecto) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Introducción",
        "Entró a cargarPaginaIntroduccion"
    );

    try {

        const ruta =
            `proyectos/${proyecto.projectId}/introduccion.json`;

        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Introducción",
            "Cargando: " + ruta
        );

        const respuesta =
            await fetch(WORKER_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    action: "cargar-json",

                    ruta: ruta

                })

            });

        const datos =
            await respuesta.json();

        if (!datos.ok) {

            throw new Error(
                "No se pudo cargar introducción"
            );

        }

        const introduccion =
            datos.json;

        if (!introduccion) {

            throw new Error(
                "JSON introducción vacío"
            );

        }

        const contenedor =
            document.getElementById(
                "paginaEditor"
            );

        if (!contenedor) {

            throw new Error(
                "No existe paginaEditor"
            );

        }

        // Crear hoja nueva

        const hoja =
            document.createElement(
                "div"
            );

        hoja.className =
            "pagina-editor";

        // Estilos de prueba visual

        hoja.style.background =
            "#ffffff";

        hoja.style.color =
            "#000000";

        hoja.style.padding =
            "40px";

        hoja.style.marginBottom =
            "20px";

        hoja.style.minHeight =
            "900px";

        // Crear título

        const titulo =
            document.createElement(
                "h1"
            );

        titulo.textContent =
            introduccion.titulo;

        titulo.style.color =
            "#000000";

        // Crear contenido

        const texto =
            document.createElement(
                "div"
            );

        texto.textContent =
            introduccion.contenido;

        texto.style.whiteSpace =
            "pre-line";

        texto.style.color =
            "#000000";

        texto.style.lineHeight =
            "1.6";

        texto.style.fontSize =
            "18px";

        // Armar hoja

        hoja.appendChild(
            titulo
        );

        hoja.appendChild(
            texto
        );

        // Agregar debajo de lo existente

        contenedor.appendChild(
            hoja
        );

        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Introducción",
            "Página cargada correctamente"
        );

    } catch(error) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Introducción",
            error.message
        );

    }

}

async function cargarPaginaCapitulo(
    proyecto,
    numeroCapitulo = null,
    paginasPlan = null
) {
    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Capítulo",
        "Entró a cargarPaginaCapitulo"
    );

    try {
        const contenedor = document.getElementById("paginaEditor");
        if (!contenedor) throw new Error("No existe paginaEditor");

        let listaCapitulos = [];

        /* ======================================================
           1. DETERMINAR CAPÍTULOS A CARGAR
        ====================================================== */
        if (numeroCapitulo !== null && numeroCapitulo !== undefined) {
            // Cargar solo un capítulo específico
            listaCapitulos = [{ numero: numeroCapitulo }];
        } else {
            // Si no hay numeroCapitulo, cargamos plan.json para obtener todos
            const rutaPlan = `proyectos/${proyecto.projectId}/plan.json`;

            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Capítulo",
                "Cargando plan general: " + rutaPlan
            );

            const resPlan = await fetch(WORKER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "cargar-json",
                    ruta: rutaPlan
                })
            });

            const datosPlan = await resPlan.json();

            if (!datosPlan.ok || !datosPlan.json || !datosPlan.json.capitulos) {
                throw new Error("No se pudo cargar plan.json o no contiene capítulos");
            }

            listaCapitulos = datosPlan.json.capitulos;
        }

        /* ======================================================
           2. RECORRER Y RENDERIZAR CADA CAPÍTULO
        ====================================================== */
        for (const itemCap of listaCapitulos) {
            const numCap = itemCap.numero;
            const archivo = `capitulo-${String(numCap).padStart(3, "0")}.json`;
            const ruta = `proyectos/${proyecto.projectId}/capitulos/${archivo}`;

            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Capítulo",
                "Cargando: " + ruta
            );

            const respuesta = await fetch(WORKER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "cargar-json",
                    ruta: ruta
                })
            });

            const datos = await respuesta.json();

            if (!datos.ok || !datos.json) {
                console.warn(`No se pudo cargar el capítulo ${numCap}`);
                continue;
            }

            const capitulo = datos.json;

            /* ======================================================
               CREAR HOJA CONTINUA PARA EL CAPÍTULO
            ====================================================== */
            const hoja = document.createElement("div");
            hoja.className = "pagina-editor";
            hoja.style.background = "#ffffff";
            hoja.style.color = "#000000";
            hoja.style.padding = "40px";
            hoja.style.marginBottom = "20px";
            hoja.style.minHeight = "900px";

            // TÍTULO
            if (capitulo.titulo) {
                const titulo = document.createElement("h1");
                titulo.textContent = capitulo.titulo;
                titulo.style.color = "#000000";
                hoja.appendChild(titulo);
            }

            // INTRODUCCIÓN
            if (capitulo.introduccion) {
                const introduccion = document.createElement("div");
                introduccion.textContent = capitulo.introduccion;
                introduccion.style.color = "#000000";
                introduccion.style.fontSize = "18px";
                introduccion.style.lineHeight = "1.6";
                introduccion.style.whiteSpace = "pre-line";
                introduccion.style.marginBottom = "30px";
                hoja.appendChild(introduccion);
            }

            // SECCIONES
            if (capitulo.secciones && capitulo.secciones.length > 0) {
                for (const seccion of capitulo.secciones) {
                    const bloqueSeccion = document.createElement("div");

                    const subtitulo = document.createElement("h2");
                    subtitulo.textContent = `${seccion.numero}. ${seccion.titulo}`;
                    subtitulo.style.color = "#000000";
                    subtitulo.style.marginTop = "30px";
                    bloqueSeccion.appendChild(subtitulo);

                    const contenido = document.createElement("div");
                    contenido.textContent = seccion.contenido;
                    contenido.style.color = "#000000";
                    contenido.style.fontSize = "18px";
                    contenido.style.lineHeight = "1.6";
                    contenido.style.whiteSpace = "pre-line";
                    bloqueSeccion.appendChild(contenido);

                    hoja.appendChild(bloqueSeccion);
                }
            }

            // EJEMPLOS
            if (capitulo.ejemplos && capitulo.ejemplos.length > 0) {
                const tituloEjemplos = document.createElement("h2");
                tituloEjemplos.textContent = "Ejemplos";
                tituloEjemplos.style.color = "#000000";
                tituloEjemplos.style.marginTop = "30px";
                hoja.appendChild(tituloEjemplos);

                for (const ejemplo of capitulo.ejemplos) {
                    const subtitulo = document.createElement("h3");
                    subtitulo.textContent = ejemplo.titulo;
                    subtitulo.style.color = "#000000";
                    hoja.appendChild(subtitulo);

                    const contenido = document.createElement("div");
                    contenido.textContent = ejemplo.contenido;
                    contenido.style.color = "#000000";
                    contenido.style.fontSize = "18px";
                    contenido.style.lineHeight = "1.6";
                    contenido.style.whiteSpace = "pre-line";
                    hoja.appendChild(contenido);
                }
            }

            // CONSEJOS
            if (capitulo.consejos && capitulo.consejos.length > 0) {
                const tituloConsejos = document.createElement("h2");
                tituloConsejos.textContent = "Consejos";
                tituloConsejos.style.color = "#000000";
                tituloConsejos.style.marginTop = "30px";
                hoja.appendChild(tituloConsejos);

                const lista = document.createElement("ul");
                lista.style.color = "#000000";
                lista.style.fontSize = "18px";
                lista.style.lineHeight = "1.6";

                for (const consejo of capitulo.consejos) {
                    const item = document.createElement("li");
                    item.textContent = consejo;
                    lista.appendChild(item);
                }
                hoja.appendChild(lista);
            }

            // ERRORES COMUNES
            if (capitulo.erroresComunes && capitulo.erroresComunes.length > 0) {
                const tituloErrores = document.createElement("h2");
                tituloErrores.textContent = "Errores comunes";
                tituloErrores.style.color = "#000000";
                tituloErrores.style.marginTop = "30px";
                hoja.appendChild(tituloErrores);

                const lista = document.createElement("ul");
                lista.style.color = "#000000";
                lista.style.fontSize = "18px";
                lista.style.lineHeight = "1.6";

                for (const errorComun of capitulo.erroresComunes) {
                    const item = document.createElement("li");
                    item.textContent = errorComun;
                    lista.appendChild(item);
                }
                hoja.appendChild(lista);
            }

            // RESUMEN
            if (capitulo.resumen) {
                const tituloResumen = document.createElement("h2");
                tituloResumen.textContent = "Resumen";
                tituloResumen.style.color = "#000000";
                tituloResumen.style.marginTop = "30px";
                hoja.appendChild(tituloResumen);

                const resumen = document.createElement("div");
                resumen.textContent = capitulo.resumen;
                resumen.style.color = "#000000";
                resumen.style.fontSize = "18px";
                resumen.style.lineHeight = "1.6";
                resumen.style.whiteSpace = "pre-line";
                hoja.appendChild(resumen);
            }

            // EJERCICIO
            if (capitulo.ejercicio) {
                const tituloEjercicio = document.createElement("h2");
                tituloEjercicio.textContent = "Ejercicio";
                tituloEjercicio.style.color = "#000000";
                tituloEjercicio.style.marginTop = "30px";
                hoja.appendChild(tituloEjercicio);

                if (capitulo.ejercicio.titulo) {
                    const nombreEjercicio = document.createElement("h3");
                    nombreEjercicio.textContent = capitulo.ejercicio.titulo;
                    nombreEjercicio.style.color = "#000000";
                    hoja.appendChild(nombreEjercicio);
                }

                if (capitulo.ejercicio.descripcion) {
                    const descripcion = document.createElement("div");
                    descripcion.textContent = capitulo.ejercicio.descripcion;
                    descripcion.style.color = "#000000";
                    descripcion.style.fontSize = "18px";
                    descripcion.style.lineHeight = "1.6";
                    descripcion.style.whiteSpace = "pre-line";
                    hoja.appendChild(descripcion);
                }
            }

            // FRASE FINAL
            if (capitulo.fraseFinal) {
                const fraseFinal = document.createElement("div");
                fraseFinal.textContent = capitulo.fraseFinal;
                fraseFinal.style.color = "#000000";
                fraseFinal.style.fontSize = "20px";
                fraseFinal.style.fontStyle = "italic";
                fraseFinal.style.fontWeight = "bold";
                fraseFinal.style.lineHeight = "1.6";
                fraseFinal.style.marginTop = "40px";
                fraseFinal.style.paddingTop = "20px";
                fraseFinal.style.borderTop = "2px solid #cccccc";
                hoja.appendChild(fraseFinal);
            }

            // Agregar la hoja al DOM
            contenedor.appendChild(hoja);
        }

        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Capítulo",
            "Carga de capítulos completada"
        );

    } catch (error) {
        monitorPIXELLAB(
            "Editorial",
            "error",
            "Capítulo",
            error.message
        );
    }
}


async function cargarPaginaConclusion(proyecto) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Conclusión",
        "Entró a cargarPaginaConclusion"
    );

    try {

        const ruta =
            `proyectos/${proyecto.projectId}/conclusion.json`;

        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Conclusión",
            "Cargando: " + ruta
        );

        const respuesta =
            await fetch(WORKER_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    action: "cargar-json",

                    ruta: ruta

                })

            });

        const datos =
            await respuesta.json();

        if (!datos.ok) {

            throw new Error(
                "No se pudo cargar conclusión"
            );

        }

        const conclusion =
            datos.json;

        if (!conclusion) {

            throw new Error(
                "JSON conclusión vacío"
            );

        }

        const contenedor =
            document.getElementById(
                "paginaEditor"
            );

        if (!contenedor) {

            throw new Error(
                "No existe paginaEditor"
            );

        }

        // Crear hoja nueva

        const hoja =
            document.createElement(
                "div"
            );

        hoja.className =
            "pagina-editor";

        // Estilos de prueba visual

        hoja.style.background =
            "#ffffff";

        hoja.style.color =
            "#000000";

        hoja.style.padding =
            "40px";

        hoja.style.marginBottom =
            "20px";

        hoja.style.minHeight =
            "900px";

        // Crear título

        const titulo =
            document.createElement(
                "h1"
            );

        titulo.textContent =
            conclusion.titulo;

        titulo.style.color =
            "#000000";

        // Crear contenido

        const texto =
            document.createElement(
                "div"
            );

        let contenido = "";

        contenido +=
            conclusion.agradecimiento + "\n\n";

        contenido +=
            conclusion.resumen + "\n\n";

        contenido +=
            "Aprendizajes clave:\n\n";

        conclusion.aprendizajesClave.forEach(

            item => {

                contenido +=
                    "• " + item + "\n";

            }

        );

        contenido +=
            "\n" +
            conclusion.proximosPasos +
            "\n\n";

        contenido +=
            conclusion.motivacionFinal +
            "\n\n";

        contenido +=
            conclusion.llamadoALaAccion +
            "\n\n";

        contenido +=
            conclusion.despedida;

        texto.textContent =
            contenido;

        texto.style.whiteSpace =
            "pre-line";

        texto.style.color =
            "#000000";

        texto.style.lineHeight =
            "1.6";

        texto.style.fontSize =
            "18px";

        // Armar hoja

        hoja.appendChild(
            titulo
        );

        hoja.appendChild(
            texto
        );

        // Agregar debajo de lo existente

        contenedor.appendChild(
            hoja
        );

        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Conclusión",
            "Página cargada correctamente"
        );

    } catch(error) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Conclusión",
            error.message
        );

    }

}

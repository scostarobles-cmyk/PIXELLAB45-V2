
monitorPIXELLAB(
    "Editorial",
    "info",
    "Carga",
    "editorial.js ejecut谩ndose"
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
    "editorial.js comenz贸 a ejecutarse",
    "monitorBotonera"
);
// =====================================
// ARRANQUE DEL M脫DULO EDITORIAL
// =====================================

async function iniciarCargaEditorial() {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "M贸dulo Editorial iniciado",
        ".................,.........................."
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
// FUNCI脫N: verificarProyecto()
// Descripci贸n:
// Solicita al Worker la b煤squeda del proyecto activo
// en R2 y contin煤a seg煤n el estado del proyecto.
//=====================================================*/


async function verificarProyecto() {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Verificaci贸n",
        "Entr贸 a verificarProyecto"
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

ocultarErrorEditorial();

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
                "T铆tulo",
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
mostrarEstadoEditorial(`

<h3>馃摎 脷ltimo eBook generado</h3>

<p><b>${proyectoCreado.titulo}</b></p>

<p>馃啍 ${proyectoCreado.projectId}</p>

<p>馃搮 ${proyectoCreado.fecha || ""}</p>

<hr>

<p>馃啎 Puede generar un nuevo proyecto.</p>

`);

        }



        //------------------------------------
        // PROYECTO PRODUCCI脫N
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
                "Proyecto en producci贸n cargado"
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
                "T铆tulo",
                proyectoActual.titulo
            );

mostrarEstadoEditorial(`

<h3>馃摎 Proyecto en producci贸n</h3>

<p><b>${proyectoActual.titulo}</b></p>

<p>馃啍 ${projectIdActual}</p>

<p>馃搮 ${proyectoActual.fecha || ""}</p>

<hr>

<p>鈿欙笍 Contin煤e desde la botonera.</p>

`);

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
                    "脥ndice",
                    "脥ndice generado"
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
                    "脥ndice",
                    "Falta generar el 铆ndice"
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
            // INTRODUCCI脫N
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
                    "Introducci贸n",
                    "Introducci贸n generada"
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
                    "Introducci贸n",
                    "Falta generar introducci贸n"
                );


                monitorPIXELLAB(
                    "Editorial",
                    "proceso",
                    "Siguiente paso",
                    "Generar introducci贸n"
                );


                return;

            }




            //------------------------------------
            // CARGAR PLAN ANTES DE CAP脥TULOS
            //------------------------------------

            const plan = await cargarJSON(
                `proyectos/${projectIdActual}/plan.json`
            );




            //------------------------------------
            // CAP脥TULOS
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
                    "Cap铆tulos",
                    "Falta generar cap铆tulos"
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
                        "Cap铆tulos",
                        "No se recibi贸 el plan"
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
                            "Cap铆tulos",
                            "Cap铆tulos en producci贸n"
                        );


                        monitorPIXELLAB(
                            "Editorial",
                            "info",
                            "Pr贸ximo cap铆tulo",
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
            // TODOS LOS CAP脥TULOS TERMINADOS
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
                    "Cap铆tulos",
                    "Cap铆tulos generados"
                );


            }




            //------------------------------------
            // CONCLUSI脫N
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
                    "Conclusi贸n",
                    "Conclusi贸n generada"
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
                    "Conclusi贸n",
                    "Falta generar la conclusi贸n"
                );


                monitorPIXELLAB(
                    "Editorial",
                    "proceso",
                    "Siguiente paso",
                    "Generar conclusi贸n"
                );


                return;

            }


        } // FIN PROYECTO PRODUCCI脫N





        //------------------------------------
        // NO EXISTE NING脷N PROYECTO
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
                "No existe ning煤n proyecto"
            );


            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Siguiente paso",
                "Crear un nuevo proyecto"
            );
mostrarEstadoEditorial(`

<h3>馃摎 Estado Editorial</h3>

<p>馃啎 No existe ning煤n proyecto.</p>

<hr>

<p>鉃★笍 Genere un nuevo proyecto para comenzar.</p>

`);

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
=========================================================
PIXELLAB Editorial
Hoja 路 Legales

Responsabilidad:

鈥� Cargar legales.json
鈥� Crear la p谩gina de legales
鈥� Agregar la p谩gina al paginaEditor

No guarda cambios.
No aplica estilos.

=========================================================
*/

async function cargarPaginaLegales(proyecto) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Legales",
        "Entr贸 a cargarPaginaLegales"
    );


    monitorPIXELLAB(
        "Editorial",
        "debug",
        "Legales proyecto",
        JSON.stringify(proyecto)
    );


    const respuesta = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        action: "cargar-json",
        ruta: rutaLegales
    })
});

const legales = await respuesta.json();

    monitorPIXELLAB(
        "Editorial",
        "debug",
        "Legales respuesta",
        JSON.stringify(legales)
    );


    if (!legales) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Legales",
            "No devolvi贸 JSON"
        );

        return;
    }


    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Legales",
        "JSON cargado correctamente"
    );

}

/*
=================================================
PIXELLAB45 EDITORIAL

Funci贸n:
seleccionarProyectoEditorial()

Descripci贸n:
Abre el editor del eBook seleccionado desde
la biblioteca editorial.

Proceso:
- Guarda el proyecto activo.
- Oculta la biblioteca.
- Muestra el 谩rea de edici贸n.
- Carga la portada en la primera p谩gina A4.

Estado:
Versi贸n inicial del editor.

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
        "鉁忥笍 " + proyecto.titulo;

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
        "Conclusi贸n",
        "Iniciando generaci贸n de conclusi贸n"
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
            "Conclusi贸n",
            "Respuesta recibida del Worker"
        );


        const resultado =
            await respuesta.json();



        if (!resultado.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Conclusi贸n",
                "Error generando conclusi贸n: " +
                resultado.error
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Conclusi贸n",
            "Conclusi贸n creada correctamente"
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
                "Conclusi贸n marcada como creada"
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
            "Verificaci贸n",
            "Actualizando estado del proyecto"
        );


        await verificarProyecto();



    } catch (error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Conclusi贸n",
            "Error de conexi贸n: " + error.message
        );


        console.error(error);

    }

}



//=====================================================
// FUNCI脫N: crearProyecto()
// Descripci贸n:
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
            "Debe ingresar el t铆tulo del eBook"
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
        "馃搧 Generando proyecto...";



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
            "馃煝 Proyecto creado";



        btn.classList.add(
            "completo"
        );


        btn.innerHTML =
            "鉁� Proyecto creado";



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
            "馃敶 Error";


        btn.innerHTML =
            "鉂� Error";


        btn.disabled = false;

    }

}
//=====================================================
// FUNCI脫N: cargarJSON()
// Descripci贸n:
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
// FUNCI脫N: guardarJSON()
// Descripci贸n:
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
        "Iniciando generaci贸n de plan"
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
                "鉁� Plan generado";

            btn.disabled = true;

        }



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Verificaci贸n",
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
// GENERAR 脥NDICE
//=====================================

async function generarIndice() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "脥ndice",
        "Iniciando generaci贸n de 铆ndice"
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
            "脥ndice",
            "Respuesta recibida del Worker"
        );



        const data =
            await response.json();



        if (data.ok) {


            monitorPIXELLAB(
                "Editorial",
                "ok",
                "脥ndice",
                "脥ndice generado correctamente"
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
                    "鉁� 脥ndice generado";

                btn.disabled = true;

            }



            await verificarProyecto();



        } else {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "脥ndice",
                "Error generando 铆ndice"
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
            "脥ndice",
            "Error de conexi贸n: " +
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
        "Iniciando generaci贸n de legales"
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
            "P谩gina de legales creada correctamente"
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
            "Verificaci贸n",
            "Actualizando estado del proyecto"
        );


        await verificarProyecto();



    } catch (error) {


        console.error(error);



        monitorPIXELLAB(
            "Editorial",
            "error",
            "Legales",
            "Error de conexi贸n: " +
            error.message
        );


    }

}
//=====================================
// GENERAR INTRODUCCI脫N
//=====================================

async function generarIntroduccion() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Introducci贸n",
        "Iniciando generaci贸n de introducci贸n"
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
            "Introducci贸n",
            "Respuesta recibida del Worker"
        );



        const resultado =
            await respuesta.json();



        if (!resultado.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Introducci贸n",
                "Error generando introducci贸n: " +
                resultado.error
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Introducci贸n",
            "Introducci贸n creada correctamente"
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
                "Introducci贸n marcada como creada"
            );

        }



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Verificaci贸n",
            "Actualizando estado del proyecto"
        );


        await verificarProyecto();



    } catch (error) {


        console.error(error);


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Introducci贸n",
            "Error de conexi贸n: " +
            error.message
        );


    }

}
//=====================================
// GENERAR CAP脥TULOS
//=====================================

async function generarCapitulos() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Cap铆tulos",
        "Generando cap铆tulo"
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
                "Cap铆tulos",
                "Error generando cap铆tulo: " +
                resultado.error
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Cap铆tulos",
            `Cap铆tulo ${resultado.numero} generado correctamente`
        );



        //------------------------------------
        // CONTROL MANUAL / AUTOM脕TICO
        //------------------------------------

        if (preguntarContinuarCapitulos) {


            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Cap铆tulos",
                "Esperando confirmaci贸n del usuario"
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
                    "Cap铆tulos",
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
            // SI QUEDAN CAP脥TULOS, CONTIN脷A
            //------------------------------------

            if (quedanPendientes) {


                monitorPIXELLAB(
                    "Editorial",
                    "proceso",
                    "Cap铆tulos",
                    "Hay cap铆tulos pendientes. Continuando..."
                );


                await generarCapitulos();



            } else {



                //------------------------------------
                // TODOS LOS CAP脥TULOS TERMINADOS
                //------------------------------------

                monitorPIXELLAB(
                    "Editorial",
                    "ok",
                    "Cap铆tulos",
                    "Todos los cap铆tulos fueron generados"
                );



                await verificarProyecto();


            }

        }



    } catch (error) {


        console.error(error);



        monitorPIXELLAB(
            "Editorial",
            "error",
            "Cap铆tulos",
            "Error generando cap铆tulo: " +
            error.message
        );


    }

}
function preguntarSiguienteCapitulo() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Cap铆tulos",
        "Mostrando ventana de continuaci贸n"
    );


    // Evitar duplicar el modal
    if (document.getElementById("modalCapitulos")) {

        monitorPIXELLAB(
            "Editorial",
            "aviso",
            "Cap铆tulos",
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

<h2>馃摉 Cap铆tulo generado</h2>

<p>
El cap铆tulo se gener贸 correctamente.<br><br>
驴Desea continuar con el siguiente cap铆tulo?
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

鈻� Continuar

</button>


<button id="btnPausarCapitulo">

鈴� Pausar

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
                "Cap铆tulos",
                "Modo autom谩tico activado"
            );

        }


        overlay.remove();


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Cap铆tulos",
            "Continuando generaci贸n"
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
            "Cap铆tulos",
            "Generaci贸n pausada por usuario"
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

Funci贸n:
cargarBibliotecaEditorial()

Descripci贸n:
- Solicita la biblioteca editorial al Worker.
- Env铆a action para entrar al case.
- Recibe proyectos.
- Genera tarjetas en la galer铆a editorial.

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
            "Carga galer铆a editorial",
            error.message
        );


        console.error(error);

    }

}

/*
=================================================
PIXELLAB45 FRONTEND
M贸dulo: Biblioteca Editorial

Funci贸n:
cargarBibliotecaEditorial()

Descripci贸n:
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
        "Entr贸 a mostrar proyectos editoriales"
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
                Ebook 鈥� ${proyecto.autor}
            </p>


            <span>
                PIXELLAB Editorial
            </span>


            <button
            class="boton-accion"
            onclick="seleccionarProyectoEditorial('${proyecto.projectId}')">

                鉁忥笍 Editar

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
        `${libro.titulo} | ${libro.paginas} p谩ginas`
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
            "Comenzando generaci贸n de portada para: " + proyecto.titulo
        );


        // 1. Crear prompt base
        const prompt =
            `Genera una portada profesional de eBook relacionada con el t铆tulo:
            "${proyecto.titulo}".
            Sin texto, sin logotipos, estilo editorial moderno.`;


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
            throw new Error("Visuales no devolvi贸 un prompt.");
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


        const imagen = await puter.ai.txt2img(
            promptVisual,
            {
                provider: "gemini",
                model: "google/imagen-4.0-fast"
            }
        );


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Imagen recibida",
            "Imagen generada correctamente"
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
            "Conversi贸n",
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
            "Generaci贸n portada",
            error.message
        );


        console.error(error);


        return null;

    }

}
/*
=========================================================
PIXELLAB Editorial
ETAPA 1 路 Carga completa del libro

Objetivo:
Reconstruir completamente el eBook en memoria
leyendo todos los archivos JSON del proyecto.

Flujo:

1. Portada
2. Legales
3. 脥ndice
4. Introducci贸n
5. Cap铆tulos
6. Conclusi贸n

Cada hoja tendr谩 su propia funci贸n de carga.

La 煤nica excepci贸n son los cap铆tulos, que se
recorrer谩n autom谩ticamente leyendo plan.json.

En esta etapa:

鉁� Carga contenido
鉁� No aplica estilos
鉁� No guarda cambios
鉁� No realiza edici贸n

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

        if (seccion === "capitulos") {

            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Cap铆tulos",
                "Pendiente"
            );

            continue;

        }

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

            await cargarPaginaPortada(
                proyecto
            );

            break;


        case "legales":

            await cargarPaginaLegales(
                proyecto
            );

            break;


        case "indice":

            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "脥ndice",
                "Pendiente"
            );

            break;


        case "introduccion":

            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Introducci贸n",
                "Pendiente"
            );

            break;


        case "conclusion":

            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Conclusi贸n",
                "Pendiente"
            );

            break;

    }

}

function cargarPaginaPortada(proyecto) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Portada",
        "Entr贸 a cargarPaginaPortada"
    );

    const pagina =
        document.getElementById("paginaEditor");

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

    const img =
        document.createElement("img");

    img.src = proyecto.portada;
    img.alt = proyecto.titulo;

    img.className = "portada-editor";

    img.onload = () => {

        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Portada",
            "Imagen cargada correctamente"
        );

    };

    img.onerror = () => {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Portada",
            "No se pudo cargar la imagen"
        );

    };

    pagina.appendChild(img);

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Portada",
        "Imagen agregada a paginaEditor"
    );

}
/*
=========================================================
PIXELLAB Editorial
ETAPA 1 — Carga de página de Legales

Objetivo:
Solicitar al Worker el archivo legales.json
correspondiente al proyecto que se está editando.

Flujo:

1. Construir la ruta usando el projectId.
2. Enviar la solicitud al Worker.
3. Recibir el objeto JSON.
4. Abrir el objeto JSON.
5. Extraer el texto.
6. Mostrar el contenido en la hoja de Legales.

En esta etapa:

✓ Solo carga el JSON.
✓ No aplica estilos.
✓ No guarda cambios.
✓ No modifica el contenido.

=========================================================
*/
async function cargarPaginaLegales(proyecto) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Legales",
        "Solicitando legales.json"
    );

    const ruta =
    "proyectos/" +
    proyecto.projectId +
    "/legales.json";

    try {

        const res = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "cargar-json",
                proyecto,
                ruta
            })
        });

        const legales = await res.json();
       
       

        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Legales",
            "JSON recibido correctamente"
        );

        const pagina =
            document.getElementById("paginaEditor");

        if (!pagina) {

            monitorPIXELLAB(
                "Editorial",
                "error",
                "Legales",
                "No existe paginaEditor"
            );

            return;

        }

        pagina.innerHTML = "";

        const hoja =
            document.createElement("div");

        hoja.className = "hoja-editor";

        hoja.innerHTML = `
            <h1>Legales</h1>
            <div class="contenido-editor">
                ${legales.contenido.replace(/\n/g, "<br><br>")}
            </div>
        `;

        pagina.appendChild(hoja);

        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Legales",
            "Página de legales cargada correctamente"
        );

    } catch (error) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Legales",
            error.message
        );

    }

}
//=====================================
// MOSTRAR ESTADO EDITORIAL
//=====================================

function mostrarEstadoEditorial(html) {

    const panel =
        document.getElementById("estadoEditorial");

    if (!panel) return;

    panel.innerHTML = html;

}



//=====================================
// MOSTRAR 脷LTIMO ERROR
//=====================================

function mostrarErrorEditorial(
    seccion,
    funcion,
    mensaje,
    stack = ""
) {

    const panel =
        document.getElementById("errorEditorial");

    if (!panel) return;


    panel.style.display = "block";


    panel.innerHTML = `

        <div class="tituloError">
            鈿狅笍 脷ltimo error detectado
        </div>

        <div class="detalleError">

            <b>Secci贸n:</b><br>
            ${seccion}<br><br>

            <b>Funci贸n:</b><br>
            ${funcion}<br><br>

            <b>Error:</b><br>
            ${mensaje}<br><br>

            ${
                stack
                ?
                `<b>Detalle:</b><br>${stack}`
                :
                ""
            }

            <br>

            <b>Hora:</b><br>
            ${new Date().toLocaleString()}

        </div>

    `;

}



//=====================================
// PANEL ESTADO EDITORIAL
//=====================================

function mostrarEstadoEditorial(html) {

    const panel =
        document.getElementById("estadoEditorial");

    if (!panel) return;

    panel.innerHTML = html;

}



//=====================================
// PANEL 脷LTIMO ERROR
//=====================================

function mostrarErrorEditorial(
    seccion,
    funcion,
    mensaje,
    detalle = ""
) {

    const panel =
        document.getElementById("errorEditorial");

    if (!panel) return;

    panel.style.display = "block";

    panel.innerHTML = `

        <h3>鈿狅笍 脷ltimo error detectado</h3>

        <p><b>Secci贸n:</b><br>${seccion}</p>

        <p><b>Funci贸n:</b><br>${funcion}</p>

        <p><b>Error:</b><br>${mensaje}</p>

        ${
            detalle
                ? `<p><b>Detalle:</b><br>${detalle}</p>`
                : ""
        }

        <p><b>Hora:</b><br>${new Date().toLocaleString()}</p>

    `;

}



//=====================================
// OCULTAR PANEL ERROR
//=====================================

function ocultarErrorEditorial() {

    const panel =
        document.getElementById("errorEditorial");

    if (!panel) return;

    panel.style.display = "none";
    panel.innerHTML = "";

}
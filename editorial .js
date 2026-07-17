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

/*async function iniciarCargaEditorial() {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Módulo Editorial iniciado"
    );

    await iniciarEditorial();
    
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

/*async function verificarProyecto() {

    monitorPIXELLAB(
    "Editorial",
    "proceso",
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
limpiarMonitor();

        const proyectoCreado = datos.proyectoCreado;
        const proyectoProduccion = datos.proyectoProduccion;


     //------------------------------------
// PROYECTO CREADO
//------------------------------------

if (proyectoCreado) {

    monitor("✅ Proyecto finalizado disponible.");
    monitor("📖 " + proyectoCreado.titulo);
    monitor("🆔 ID: " + proyectoCreado.projectId);

    if (proyectoCreado.fecha) {

        monitor("📅 Fecha: " + proyectoCreado.fecha);

    }

    monitor("➡️ Abra este Ebook en el editor.");
    monitor("🆕 O genere un proyecto nuevo.");
    actualizarIndicador("estadoProyecto", "azul");
botonAzul("btnProyecto");
habilitarBoton("btnProyecto");

}

        //------------------------------------
        // PROYECTO PRODUCCIÓN
        //------------------------------------

        if (proyectoProduccion) {

            proyectoActual = proyectoProduccion;
            projectIdActual = proyectoActual.projectId;


            //------------------------------------
            // PROYECTO
            //------------------------------------

            actualizarIndicador("estadoProyecto", "verde");
            botonVerde("btnProyecto");
            deshabilitarBoton("btnProyecto");

            monitor("⚙️ Proyecto en producción cargado.");
            monitor("🆔 ID: " + projectIdActual);
            monitor("📖 " + proyectoActual.titulo);


      //------------------------------------
// PLAN
//------------------------------------

if (proyectoActual.estructura.plan === "creado") {

    actualizarIndicador("estadoPlan", "verde");
    botonVerde("btnPlan");
    deshabilitarBoton("btnPlan");

    monitor("✅ Plan generado.");

} else {

    actualizarIndicador("estadoPlan", "azul");
    botonAzul("btnPlan");
    habilitarBoton("btnPlan");

    monitor("👉 Falta generar el plan.");
    monitor("➡️ Próximo paso: Generar plan.");

    return;

}


            //------------------------------------
            // INDICE
            //------------------------------------

            if (proyectoActual.estructura.indice === "creado") {

                actualizarIndicador("estadoIndice", "verde");
                botonVerde("btnIndice");
                deshabilitarBoton("btnIndice");

                monitor("✅ Índice generado.");

            } else {

                actualizarIndicador("estadoIndice", "azul");
                botonAzul("btnIndice");
                habilitarBoton("btnIndice");

                monitor("👉 Falta generar el índice.");
                return

            }
             //------------------------------------
// LEGALES
//------------------------------------

if (proyectoActual.estructura.legales === "creado") {

    actualizarIndicador("estadoLegales", "verde");
    botonVerde("btnLegales");
    deshabilitarBoton("btnLegales");

    monitor("✅ Legales generadas.");

} else {

    actualizarIndicador("estadoLegales", "azul");
    botonAzul("btnLegales");
    habilitarBoton("btnLegales");

    monitor("👉 Falta generar las legales.");
    monitor("➡️ Próximo paso: Generar legales.");

return

}
//------------------------------------
// INTRODUCCIÓN
//------------------------------------

if (proyectoActual.estructura.introduccion === "creado") {

    actualizarIndicador("estadoIntro", "verde");
    botonVerde("btnIntroduccion");
    deshabilitarBoton("btnIntroduccion");

    monitor("✅ Introducción generada.");

} else {

    actualizarIndicador("estadoIntro", "azul");
    botonAzul("btnIntroduccion");
    habilitarBoton("btnIntroduccion");

    monitor("👉 Falta generar la introducción.");
    monitor("➡️ Próximo paso: Generar introducción.");

  return

}
//------------------------------------
// CARGAR PLAN (antes de capítulos)
//------------------------------------

const plan = await cargarJSON(
    `proyectos/${projectIdActual}/plan.json`
);


//------------------------------------
// CAPÍTULOS
//------------------------------------

if (proyectoActual.estructura.capitulos === "pendiente") {

    actualizarIndicador("estadoCapitulos", "azul");
    botonAzul("btnCapitulos");
    habilitarBoton("btnCapitulos");

    monitor("👉 Falta generar los capítulos.");

 return

}


if (proyectoActual.estructura.capitulos === "produccion") {

    actualizarIndicador("estadoCapitulos", "amarillo");
    botonAmarillo("btnCapitulos");
    habilitarBoton("btnCapitulos");


    if (!plan || !plan.capitulos) {

        monitor("❌ No se recibió el plan.");

        return;

    }


    for (const capitulo of plan.capitulos) {

        if (capitulo.estado !== "creado") {

            monitor("🟡 Capítulos en producción.");
            monitor(
                `👉 Próximo capítulo pendiente: ${capitulo.numero} - ${capitulo.titulo}`
            );


            //------------------------------------
            // CONTINUAR FLUJO DE CAPÍTULOS
            //------------------------------------

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

if (proyectoActual.estructura.capitulos === "creado") {

    actualizarIndicador("estadoCapitulos", "verde");
    botonVerde("btnCapitulos");
    deshabilitarBoton("btnCapitulos");

    monitor("✅ Capítulos generados.");

}
//------------------------------------
// CONCLUSIÓN
//------------------------------------

if (proyectoActual.estructura.conclusion === "creado") {

    actualizarIndicador("estadoConclusion", "verde");
    botonVerde("btnConclusion");
    deshabilitarBoton("btnConclusion");

    monitor("✅ Conclusión generada.");

} else {

    actualizarIndicador("estadoConclusion", "azul");
    botonAzul("btnConclusion");
    habilitarBoton("btnConclusion");

    monitor("👉 Falta generar la conclusión.");
    monitor("➡️ Próximo paso: Generar conclusión.");

return
}
            

        } // FIN PROYECTO PRODUCCIÓN


        //------------------------------------
// NO EXISTE NINGÚN PROYECTO
//------------------------------------

if (!proyectoCreado && !proyectoProduccion) {

    actualizarIndicador("estadoProyecto", "azul");
    botonAzul("btnProyecto");
    habilitarBoton("btnProyecto");

    monitor("🆕 No existe ningún proyecto.");
    monitor("👉 Cree un proyecto para comenzar.");
    monitor("➡️ Próximo paso: Generar proyecto.");

}


    } catch (error) {

        console.error(error);

        monitor("❌ Error verificando proyecto.");
        monitor(error.message);

    }

}
*/
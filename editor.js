// ===============================
// EDITOR.JS CARGADO
// ===============================

monitorPIXELLAB(
    "Editorial",
    "ok",
    "Editor",
    "editor.js cargado correctamente",
    "monitorEditor"
);
// =====================================================
// INICIO EDITOR
// =====================================================

async function iniciarEditor(){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Editor",
        "Iniciando editor...",
        "monitorEditor"
    );


    await generarBibliotecaEditor();


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Editor",
        "Editor iniciado correctamente",
        "monitorEditor"
    );

}
let bibliotecaEditor = [];


async function generarBibliotecaEditor(){


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Biblioteca",
        "Generando biblioteca...",
        "monitorEditor"
    );


    try {


        const respuesta = await fetch(
            WORKER_URL,
            {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    action:"listar-Ebooks"
                })
            }
        );


        const datos = await respuesta.json();


        if(!datos.ok){

            monitorPIXELLAB(
                "Editorial",
                "error",
                "Biblioteca",
                "Error al listar ebooks",
                "monitorEditor"
            );

            return;

        }


        bibliotecaEditor = datos.ebooks;


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Biblioteca",
            "Biblioteca generada. Ebooks: " + bibliotecaEditor.length,
            "monitorEditor"
        );


        monitorPIXELLAB(
            "Editorial",
            "datos",
            "Biblioteca",
            JSON.stringify(
                bibliotecaEditor,
                null,
                2
            ),
            "monitorEditor"
        );


    } catch(error){


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Biblioteca",
            error.message,
            "monitorEditor"
        );


    }

}
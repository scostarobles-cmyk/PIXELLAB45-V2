monitorPIXELLAB(
    "Sistema",
    "proceso",
    "editor.js",
    "Iniciando carga...",
    "monitorEditor"
);

// ===============================
// VARIABLES GLOBALES EDITOR
// ===============================

let bibliotecaEditor = [];


// ===============================
// GENERAR BIBLIOTECA EDITOR
// ===============================

async function generarBibliotecaEditor(){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Biblioteca",
        "Generando biblioteca...",
        "monitorEditor"
    );


    try {


        const respuesta =
            await fetch(
                WORKER_URL,
                {
                    method: "POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({

                        action:"listar-Ebooks",

                        data:{}

                    })
                }
            );


        const resultado =
            await respuesta.json();



        if(
            !resultado.ok
        ){

            monitorPIXELLAB(
                "Editorial",
                "error",
                "Biblioteca",
                "Error al listar ebooks: " + resultado.error,
                "monitorEditor"
            );

            bibliotecaEditor = [];

            return;

        }



        bibliotecaEditor =
            resultado.ebooks || [];



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Biblioteca",
            "Biblioteca generada correctamente. Ebooks encontrados: " 
            + bibliotecaEditor.length,
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



        return bibliotecaEditor;



    } catch(error){


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Biblioteca",
            "Error generando biblioteca: " + error.message,
            "monitorEditor"
        );


        bibliotecaEditor = [];


        return [];

    }

}

// ===============================
// INICIO EDITOR
// ===============================

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

window.addEventListener(
    "load",
    iniciarEditor
);


monitorPIXELLAB(
    "Sistema",
    "ok",
    "editor.js",
    "Carga finalizada",
    "monitorEditor"
);


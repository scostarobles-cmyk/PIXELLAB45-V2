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



// =====================================================
// FUNCIÓN: generarEditorJSON()
// Descripción:
// Genera la estructura inicial del editor.json
// =====================================================

function generarEditorJSON(ebook) {


    const editorJSON = {


        projectId:
            ebook.projectId,


        portada: {


            titulo: {

                texto:
                    ebook.titulo || "",


                estilo: {

                    fuente: "Arial",

                    tamano: 38,

                    color: "#ffffff",

                    x: 40,

                    y: 80

                }

            },


            autor: {

                texto:
                    ebook.autor || "",


                estilo: {

                    fuente: "Arial",

                    tamano: 24,

                    color: "#ffffff",

                    x: 40,

                    y: 180

                }

            },


            logo: {

                activo: true,

                ruta: "",

                x: 40,

                y: 20,

                ancho: 120,

                alto: 120

            }


        },


        legales: {

            estado: "pendiente"

        },


        indice: {

            estado: "pendiente"

        },


        introduccion: {

            estado: "pendiente"

        },


        capitulos: {

            estado: "pendiente",

            lista: []

        },


        conclusion: {

            estado: "pendiente"

        },


        fechaCreacion:
            new Date().toISOString()


    };


    return editorJSON;

}
// =====================================================
// VERIFICAR EDITOR JSON
// =====================================================

async function verificarEditorJSON(){


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Editor JSON",
        "Verificando editor.json...",
        "monitorEditor"
    );


    for(
        const ebook of bibliotecaEditor
    ){


        const rutaEditor =

            `proyectos/${ebook.projectId}/editor.json`;



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Editor JSON",
            "Buscando: " + rutaEditor,
            "monitorEditor"
        );



        let editor =

            await cargarJSON(
                rutaEditor
            );



        if(editor){


            monitorPIXELLAB(
                "Editorial",
                "ok",
                "Editor JSON",
                "Existe editor.json: " + ebook.titulo,
                "monitorEditor"
            );


            monitorPIXELLAB(
                "Editorial",
                "datos",
                "Editor JSON",
                JSON.stringify(
                    editor,
                    null,
                    2
                ),
                "monitorEditor"
            );


            continue;

        }



        monitorPIXELLAB(
            "Editorial",
            "aviso",
            "Editor JSON",
            "No existe. Creando: " + ebook.titulo,
            "monitorEditor"
        );



        editor = generarEditorJSON(
            ebook
        );
        
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


    await verificarEditorJSON();


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


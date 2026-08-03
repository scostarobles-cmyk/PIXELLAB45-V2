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
    await verificarEditorJSON();
    monitorPIXELLAB(
    "Editorial",
    "proceso",
    "Tarjetas",
    "Llamando generarTarjetasEditor()",
    "monitorEditor"
);
          generarTarjetasEditor();

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
async function verificarEditorJSON(){


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Editor JSON",
        "Verificando editor.json...",
        "monitorEditor"
    );


    for(const ebook of bibliotecaEditor){


        const rutaEditor =
            `proyectos/${ebook.projectId}/editor.json`;


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Editor JSON",
            "Buscando: " + rutaEditor,
            "monitorEditor"
        );


        const editor =
            await cargarJSON(rutaEditor);



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


        }else{


            monitorPIXELLAB(
    "Editorial",
    "aviso",
    "Editor JSON",
    "No existe. Generando editor.json: " + ebook.titulo,
    "monitorEditor"
);


const nuevoEditor = generarEditorJSON(ebook);


await guardarJSON(
    rutaEditor,
    nuevoEditor
);


monitorPIXELLAB(
    "Editorial",
    "ok",
    "Editor JSON",
    "editor.json creado",
    "monitorEditor"
);


monitorPIXELLAB(
    "Editorial",
    "datos",
    "Editor JSON",
    JSON.stringify(
        nuevoEditor,
        null,
        2
    ),
    "monitorEditor"
);


        }


    }


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Editor JSON",
        "Verificación finalizada",
        "monitorEditor"
    );


}
function generarEditorJSON(ebook){


    return {

        projectId: ebook.projectId,

        portada: {

            titulo: {

                texto: ebook.titulo,

                estilo: {

                    fuente: "Arial",

                    tamano: 38,

                    color: "#ffffff",

                    x: 40,

                    y: 80

                }

            },


            autor: {

                texto: ebook.autor,

                estilo: {

                    fuente: "Arial",

                    tamano: 24,

                    color: "#ffffff",

                    x: 40,

                    y: 180

                }

            },


            logo: {

                url: "",

                x: 40,

                y: 240,

                ancho: 100,

                alto: 100

            }

        }

    };

}

function generarTarjetasEditor(){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Tarjetas",
        "Entró a generar tarjetas",
        "monitorEditor"
    );


    const contenedor = document.getElementById("bibliotecaEditor");


    if(!contenedor){

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Tarjetas",
            "No existe contenedor bibliotecaEditor",
            "monitorEditor"
        );

        return;
    }


    contenedor.innerHTML = "Tarjeta de prueba";


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Tarjetas",
        "Tarjeta generada correctamente",
        "monitorEditor"
    );

}
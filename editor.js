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

async function generarTarjetasEditor(){

    const contenedor =
        document.getElementById("bibliotecaEditorial");


    if (!contenedor) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Biblioteca",
            "No existe bibliotecaEditorial",
            "monitorEditor"
        );

        return;

    }


    contenedor.innerHTML = "";


    for (const libro of bibliotecaEditor) {


        const tarjeta =
            document.createElement("article");


        tarjeta.className =
            "editorial-card";


        monitorPIXELLAB(
            "Editorial",
            "info",
            "Tarjeta creada",
            libro.titulo,
            "monitorEditor"
        );


        tarjeta.innerHTML = `

        <div class="editorial-cover">

            <img class="portada-editorial">

        </div>


        <div class="editorial-info">

            <h3>
                ${libro.titulo}
            </h3>


            <p>
                Ebook • ${libro.autor}
            </p>


            <span>
                PIXELLAB Editorial
            </span>


            <button
            class="boton-accion"
            onclick="abrirEditorEditorial('${libro.projectId}')">

                📖 Abrir libro

            </button>


        </div>

        `;


        contenedor.appendChild(tarjeta);



        const imagen =
            tarjeta.querySelector(
                ".portada-editorial"
            );


        if (libro.tienePortada) {


            imagen.src =
            `${R2_EBOOKS_URL}/proyectos/${libro.projectId}/imagenes/portada.png`;


            monitorPIXELLAB(
                "Editorial",
                "ok",
                "Portada cargada",
                libro.titulo,
                "monitorEditor"
            );


        } else {


            monitorPIXELLAB(
                "Editorial",
                "info",
                "Sin portada",
                libro.titulo,
                "monitorEditor"
            );


        }


    }


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Biblioteca",
        `${bibliotecaEditor.length} tarjetas generadas`,
        "monitorEditor"
    );

}
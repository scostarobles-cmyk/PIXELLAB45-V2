

monitorPIXELLAB(
    "Editorial",
    "ok",
    "Editor",
    "editor.js cargado correctamente",
    "monitorEditor"
);

let biblioteca = [];

monitorPIXELLAB(
    "Editorial",
    "ok",
    "Variables",
    "Variable global biblioteca creada",
    "monitorEditor"
);


let libro = null;

monitorPIXELLAB(
    "Editorial",
    "ok",
    "Variables",
    "Variable global libro creada",
    "monitorEditor"
);

function iniciarEditor(){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Inicio",
        "Entró a iniciarEditor()",
        "monitorEditor"
    );

    cargarBiblioteca();
    

    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Inicio",
        "Salió de iniciarEditor()",
        "monitorEditor"
    );

}

window.addEventListener(
    "load",
    iniciarEditor
);
async function cargarBiblioteca(){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Biblioteca",
        "Entró a cargarBiblioteca()",
        "monitorEditor"
    );

    try{

        const respuesta =
            await fetch(
                WORKER_URL,
                {
                    method: "POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        action: "listar-Ebooks"
                    })
                }
            );

        const datos =
            await respuesta.json();


        monitorPIXELLAB(
            "Editorial",
            "info",
            "Biblioteca",
            "Respuesta recibida del Worker",
            "monitorEditor"
        );


        monitorPIXELLAB(
    "Editorial",
    "info",
    "Biblioteca",
    `
Cantidad: ${biblioteca.length}

Primer libro:
ID: ${biblioteca[0]?.projectId}
Título: ${biblioteca[0]?.titulo}
Autor: ${biblioteca[0]?.autor}
Portada: ${biblioteca[0]?.tienePortada}

Claves:
${Object.keys(biblioteca[0] || {}).join(", ")}
`,
    "monitorEditor"
);

biblioteca = datos.ebooks || [];


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Biblioteca",
            "Biblioteca cargada",
            "monitorEditor"
        );


        monitorPIXELLAB(
            "Editorial",
            "info",
            "Biblioteca",
            JSON.stringify(
                biblioteca,
                null,
                2
            ),
            "monitorEditor"
        );

    }
    catch(error){

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Biblioteca",
            error.message,
            "monitorEditor"
        );

    }


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Biblioteca",
        "Salió de cargarBiblioteca()",
        "monitorEditor"
    );
    generarTarjetasEditor();

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


    for (libro of biblioteca) {


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

            verificarEditorJSON(libro);
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
        `${biblioteca.length} tarjetas generadas`,
        "monitorEditor"
    );

}
function generarEditorJSON(ebook){


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "EditorJSON",
        "Iniciando generación editor.json",
        "monitorEditor"
    );


    try {


        monitorPIXELLAB(
            "Editorial",
            "datos",
            "EditorJSON",
            "Proyecto recibido: " + ebook.projectId,
            "monitorEditor"
        );


        monitorPIXELLAB(
            "Editorial",
            "datos",
            "EditorJSON",
            "Capítulos recibidos: " + (ebook.capitulos?.length || 0),
            "monitorEditor"
        );


        const editor = {


            projectId: ebook.projectId,


            portada: {

                estado: "pendiente",

                titulo: {

                    estado: "pendiente",

                    texto: ebook.titulo || "",

                    estilo: {

                        fuente: "Arial",

                        tamano: 38,

                        color: "#ffffff",

                        x: 40,

                        y: 80

                    }

                },


                autor: {

                    estado: "pendiente",

                    texto: ebook.autor || "",

                    estilo: {

                        fuente: "Arial",

                        tamano: 24,

                        color: "#ffffff",

                        x: 40,

                        y: 180

                    }

                },


                logo: {

                    estado: "pendiente",

                    url: "assets/img/logo.png",

                    x: 40,

                    y: 240,

                    ancho: 100,

                    alto: 100

                }

            },


            legales: {

                estado: "pendiente",

                contenido: ebook.legales || {}

            },


            indice: {

                estado: "pendiente",

                contenido: ebook.indice || {}

            },


            introduccion: {

                estado: "pendiente",

                contenido: ebook.introduccion || {}

            },


            capitulos: {

                estado: "pendiente",

                lista: ebook.capitulos || []

            },


            conclusion: {

                estado: "pendiente",

                contenido: ebook.conclusion || {}

            }


        };


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "EditorJSON",
            "Portada cargada",
            "monitorEditor"
        );


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "EditorJSON",
            "Legales cargado",
            "monitorEditor"
        );


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "EditorJSON",
            "Indice cargado",
            "monitorEditor"
        );


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "EditorJSON",
            "Introduccion cargada",
            "monitorEditor"
        );


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "EditorJSON",
            "Capítulos cargados: " + editor.capitulos.lista.length,
            "monitorEditor"
        );


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "EditorJSON",
            "Conclusion cargada",
            "monitorEditor"
        );


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "EditorJSON",
            "Editor JSON generado correctamente",
            "monitorEditor"
        );


        return editor;


    } catch(error){


        monitorPIXELLAB(
            "Editorial",
            "error",
            "EditorJSON",
            "Error generando editor.json: " + error.message,
            "monitorEditor"
        );


        return null;


    }


}
async function verificarEditorJSON(ebook){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "EditorJSON",
        "Verificando existencia de editor.json",
        "monitorEditor"
    );


    try {


        const ruta =
            `proyectos/${ebook.projectId}/editor.json`;


        const editorExistente =
            await cargarJSON(
                ruta
            );


        if(editorExistente){


            monitorPIXELLAB(
                "Editorial",
                "info",
                "EditorJSON",
                "Editor.json ya existe. Se mantiene.",
                "monitorEditor"
            );


            return;


        }



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "EditorJSON",
            "Editor.json no existe. Generando.",
            "monitorEditor"
        );



        generarEditorJSON(
            ebook
        );



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "EditorJSON",
            "Editor.json generado.",
            "monitorEditor"
        );


    }catch(error){


        monitorPIXELLAB(
            "Editorial",
            "error",
            "EditorJSON",
            "Error verificando editor.json: " + error.message,
            "monitorEditor"
        );


    }

}
async function abrirEditorEditorial(projectId){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "AbrirLibro",
        "Entró a abrirEditorEditorial()",
        "monitorEditor"
    );


    projectIdActual = projectId;


    monitorPIXELLAB(
        "Editorial",
        "datos",
        "AbrirLibro",
        "ProjectId: " + projectIdActual,
        "monitorEditor"
    );


    const plan =
        await cargarJSON(
            `proyectos/${projectIdActual}/plan.json`
        );


    if(!plan){

        monitorPIXELLAB(
            "Editorial",
            "error",
            "AbrirLibro",
            "No se pudo cargar plan.json",
            "monitorEditor"
        );

        return;

    }


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "AbrirLibro",
        "Plan cargado",
        "monitorEditor"
    );


    const totalHojas =
        calcularHojasLibro(plan);


    monitorPIXELLAB(
        "Editorial",
        "datos",
        "AbrirLibro",
        "Total hojas: " + totalHojas,
        "monitorEditor"
    );


    crearLienzoLibro(totalHojas);


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "AbrirLibro",
        "Lienzo creado",
        "monitorEditor"
    );


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "AbrirLibro",
        "Salió de abrirEditorEditorial()",
        "monitorEditor"
    );

}
function calcularHojasLibro(plan){

    let total = 0;

    // Portada
    total++;

    // Legales
    total++;

    // Índice
    total++;

    // Introducción
    total++;

    // Capítulos
    if(
        plan &&
        Array.isArray(plan.capitulos)
    ){

        for(const capitulo of plan.capitulos){

            total +=
                capitulo.paginas || 0;

        }

    }

    // Conclusión
    total++;

    monitorPIXELLAB(
        "Editorial",
        "datos",
        "Calcular hojas",
        "Total: " + total,
        "monitorEditor"
    );

    return total;

} 


/* ==========================
   CREAR LIENZO DEL LIBRO
========================== */

function crearLienzoLibro(totalHojas){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Lienzo",
        "Creando " + totalHojas + " hojas",
        "monitorEditor"
    );


    const canvas =
        document.querySelector(".editor-canvas");


    if(canvas){

        canvas.style.display =
            "block";

    }


    const contenedor =
        document.getElementById("paginaEditor");


    if(!contenedor){

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Lienzo",
            "No existe paginaEditor",
            "monitorEditor"
        );

        return;

    }


    contenedor.innerHTML = "";


    for(let i = 1; i <= totalHojas; i++){


        const hoja =
            document.createElement("div");


        hoja.id =
            "pagina-" + i;


        hoja.dataset.pagina =
            i;


        contenedor.appendChild(
            hoja
        );


        monitorPIXELLAB(
            "Editorial",
            "datos",
            "Lienzo",
            "Hoja creada: " + i,
            "monitorEditor"
        );

    }


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Lienzo",
        totalHojas + " hojas creadas",
        "monitorEditor"
    );


    asignarClasesPaginasEditorial();


    for(let i = 2; i <= totalHojas; i++){

        const pagina =
            document.getElementById(
                "pagina-" + i
            );


        if(pagina){

            pagina.style.display = "none";

        }

    }

}
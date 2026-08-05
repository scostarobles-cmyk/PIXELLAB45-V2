monitorPIXELLAB(
    "Editorial",
    "ok",
    "Editor",
    "editor.js cargado correctamente",
    "monitorEditor"
);
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

function abrirEditorEditorial(projectId){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "AbrirEditor",
        "Entró a abrir editor",
        "monitorEditor"
    );


    monitorPIXELLAB(
        "Editorial",
        "datos",
        "AbrirEditor",
        "Libro seleccionado: " + projectId,
        "monitorEditor"
    );


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "AbrirEditor",
        "Salió de abrir editor",
        "monitorEditor"
    );

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

        /* Tamaño base A4 */

        hoja.style.width =
            "210mm";

        hoja.style.height =
            "297mm";

        hoja.style.margin =
            "20px auto";

        hoja.style.background =
            "#ffffff";

        hoja.style.border =
            "1px solid #cccccc";

        hoja.style.position =
            "relative";

        hoja.style.overflow =
            "hidden";

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

cargarLibroCompleto(projectIdActual);

    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Lienzo",
        totalHojas + " hojas creadas",
        "monitorEditor"
    );

}
function asignarClasesPaginasEditorial() {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Clases",
        "Asignando clases a las páginas",
        "monitorEditor"
    );

    const paginaEditor =
        document.getElementById("paginaEditor");

    if (!paginaEditor) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Clases",
            "No existe paginaEditor",
            "monitorEditor"
        );

        return;

    }


    const paginas =
        paginaEditor.children;


    for (let i = 0; i < paginas.length; i++) {

        const pagina =
            paginas[i];


        pagina.classList.add(
            "pl45-hoja"
        );


        pagina.classList.remove(
            "pl45-hoja-portada",
            "pl45-hoja-legales",
            "pl45-hoja-indice",
            "pl45-hoja-introduccion",
            "pl45-hoja-capitulo",
            "pl45-hoja-conclusion"
        );


        if (i === 0) {

            pagina.classList.add(
                "pl45-hoja-portada"
            );

        }

        else if (i === 1) {

            pagina.classList.add(
                "pl45-hoja-legales"
            );

        }

        else if (i === 2) {

            pagina.classList.add(
                "pl45-hoja-indice"
            );

        }

        else if (i === 3) {

            pagina.classList.add(
                "pl45-hoja-introduccion"
            );

        }

        else if (i === paginas.length - 1) {

            pagina.classList.add(
                "pl45-hoja-conclusion"
            );

        }

        else {

            pagina.classList.add(
                "pl45-hoja-capitulo"
            );

        }

    }

    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Clases",
        paginas.length + " páginas clasificadas",
        "monitorEditor"
    );

}
const SECCIONES_LIBRO = [

    "portada",
    //"legales",
   // "indice",
  //  "introduccion",
 //   "capitulos",
   // "conclusion"

];
/* ==========================
   CARGA DEL LIBRO COMPLETO
========================== */

async function cargarLibroCompleto(proyecto) {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Libro",
        "Comenzando carga completa",
        "monitorEditor"
    );


    const editor = proyecto;


    if (!editor) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Editor",
            "No existe libro cargado en memoria",
            "monitorEditor"
        );

        return;

    }


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Editor",
        "editor.json cargado correctamente",
        "monitorEditor"
    );


    for (const seccion of SECCIONES_LIBRO) {

        monitorPIXELLAB(
            "Editorial",
            "info",
            "FOR",
            "Antes de cargar " + seccion,
            "monitorEditor"
        );


        await cargarSeccion(
            editor,
            seccion
        );


        monitorPIXELLAB(
            "Editorial",
            "info",
            "FOR",
            "Después de cargar " + seccion,
            "monitorEditor"
        );

    }


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "FOR",
        "FOR terminado",
        "monitorEditor"
    );


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Libro",
        "Carga completa finalizada",
        "monitorEditor"
    );

}
/* ==========================
   CARGA DE SECCIONES
========================== */

async function cargarSeccion(
    editor,
    seccion
) {

    switch (seccion) {

        case "portada":

            monitorPIXELLAB(
                "Editorial",
                "info",
                "Sección",
                "Entró a PORTADA",
                "monitorEditor"
            );
               await cargarPaginaPortada();

            monitorPIXELLAB(
                "Editorial",
                "ok",
                "Sección",
                "Salió de PORTADA",
                "monitorEditor"
            );

        break;


        case "legales":

            monitorPIXELLAB(
                "Editorial",
                "info",
                "Sección",
                "Entró a LEGALES",
                "monitorEditor"
            );

            monitorPIXELLAB(
                "Editorial",
                "ok",
                "Sección",
                "Salió de LEGALES",
                "monitorEditor"
            );

        break;


        case "indice":

            monitorPIXELLAB(
                "Editorial",
                "info",
                "Sección",
                "Entró a INDICE",
                "monitorEditor"
            );

            monitorPIXELLAB(
                "Editorial",
                "ok",
                "Sección",
                "Salió de INDICE",
                "monitorEditor"
            );

        break;


        case "introduccion":

            monitorPIXELLAB(
                "Editorial",
                "info",
                "Sección",
                "Entró a INTRODUCCION",
                "monitorEditor"
            );

            monitorPIXELLAB(
                "Editorial",
                "ok",
                "Sección",
                "Salió de INTRODUCCION",
                "monitorEditor"
            );

        break;


        case "capitulos":

            monitorPIXELLAB(
                "Editorial",
                "info",
                "Sección",
                "Entró a CAPITULOS",
                "monitorEditor"
            );

            monitorPIXELLAB(
                "Editorial",
                "ok",
                "Sección",
                "Salió de CAPITULOS",
                "monitorEditor"
            );

        break;


        case "conclusion":

            monitorPIXELLAB(
                "Editorial",
                "info",
                "Sección",
                "Entró a CONCLUSION",
                "monitorEditor"
            );

            monitorPIXELLAB(
                "Editorial",
                "ok",
                "Sección",
                "Salió de CONCLUSION",
                "monitorEditor"
            );

        break;

    }

}

/* ==========================
   CARGA PORTADA
========================== */

async function cargarPaginaPortada() {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Portada",
        "Cargando portada",
        "monitorEditor"
    );

    const hoja =
        document.getElementById("pagina-1");

    const canvas =
        document.querySelector(".editor-canvas");

    if (!hoja) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Portada",
            "No existe pagina-1",
            "monitorEditor"
        );

        return;

    }

    hoja.innerHTML = "";

    Object.assign(
        hoja.style,
        {
            width: "100%",
            maxWidth: "794px",
            aspectRatio: "210 / 297",
            margin: "0 auto 20px auto",
            background: "white",
            position: "relative",
            overflow: "hidden",
            transformOrigin: "top center"
        }
    );

    const imagen =
        document.createElement("img");

    imagen.src =
        `${R2_EBOOKS_URL}/proyectos/${projectIdActual}/imagenes/portada.png`;

    imagen.className =
        "portada-editor";

    Object.assign(
    imagen.style,
    {
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "fill",
        position: "absolute",
        top: "0",
        left: "0"
    }
);

    hoja.appendChild(imagen);

    if (canvas) {

        const ajustar = () => {

            if (window.innerWidth <= 768) {

                const escala =
                    (canvas.clientWidth - 20) /
                    hoja.offsetWidth;

                hoja.style.transform =
                    `scale(${Math.min(1, escala)})`;

            } else {

                hoja.style.transform =
                    "scale(1)";

            }

        };

        ajustar();

        window.addEventListener(
            "resize",
            ajustar
        );

    }

    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Portada",
        "Portada cargada",
        "monitorEditor"
    );

}
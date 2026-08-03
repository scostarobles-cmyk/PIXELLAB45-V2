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
async function generarPortadaProyecto(proyecto) {

    try {

        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Inicio",
            "Comenzando generación de portada para: " + proyecto.titulo,
            "monitorEditor"
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
            "Prompt base generado para portada",
                       "monitorEditor"
        );


        // 2. Mejorar prompt con Visuales
        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Visuales",
            "Enviando prompt al generador de visuales",
                       "monitorEditor"
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
            "Prompt visual recibido correctamente",
                       "monitorEditor"
        );


        // 3. Generar imagen
        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Generando imagen",
            "Enviando solicitud a Imagen 4",
                       "monitorEditor"
        );


        const promptImagenFinal =
    promptVisual +
    `

], composición vertical, diseño a sangrado completo, de borde a borde, ocupando todo el lienzo sin marcos ni bordes blancos --ar 3:4
`;

monitorPIXELLAB(
    "Editorial",
    "info",
    "Prompt portada",
    promptImagenFinal,
               "monitorEditor"
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
            "Imagen convertida a Base64",
                       "monitorEditor"
        );


        // 5. Guardar en R2
        const ruta =
            `proyectos/${proyecto.projectId}/imagenes/portada.png`;


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Guardando",
            ruta,
                       "monitorEditor"
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
            "Portada guardada correctamente",
                       "monitorEditor"
        );


        return ruta;


    } catch(error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Generación portada",
            error.message,
                       "monitorEditor"
        );


        console.error(error);


        return null;

    }

}
async function abrirEditorEditorial(projectId) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Editor",
        "Abriendo proyecto: " + projectId,
        "monitorEditor"
    );


    proyectoActual = projectId;


    const proyecto =
        await cargarJSON(
            `proyectos/${projectId}/proyecto.json`
        );


    if (!proyecto) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Editor",
            "No se pudo cargar proyecto.json",
            "monitorEditor"
        );

        return;

    }


    await cargarLibroCompleto(proyecto);

}

/*
=========================================================
PIXELLAB45 EDITORIAL

ETAPA 1 · Carga del libro

Prueba actual:
✓ Carga proyecto
✓ Limpia editor
✓ Carga portada

Pendiente:
- Legales
- Índice
- Introducción
- Capítulos
- Conclusión

=========================================================
*/


const SECCIONES_LIBRO = [

    "portada"

    /*
    "legales",
    "indice",
    "introduccion",
    "capitulos",
    "conclusion"
    */

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


    const contenedor =
        document.getElementById(
            "paginaEditor"
        );


    if (contenedor) {

        contenedor.innerHTML = "";

    }



    for (const seccion of SECCIONES_LIBRO) {


        await cargarSeccion(
            proyecto,
            seccion
        );


    }



    asignarClasesPaginasEditorial();


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Libro",
        "Portada cargada correctamente",
        "monitorEditor"
    );


    /*
    verificarPipelineEditor();


    actualizarEstadoPipelineEditorial(
        "editorProyecto",
        "completo",
        "Proyecto cargado"
    );


    inicializarEditor();
    */


}




async function cargarSeccion(
    proyecto,
    seccion
) {


    switch(seccion){


        case "portada":


            await cargarPaginaPortada(
                proyecto
            );


        break;



        /*
        case "legales":

            await cargarPaginaLegales(
                proyecto
            );

        break;



        case "indice":

            await cargarPaginaIndice(
                proyecto
            );

        break;



        case "introduccion":

            await cargarPaginaIntroduccion(
                proyecto
            );

        break;



        case "capitulos":

            await cargarPaginaCapitulos(
                proyecto
            );

        break;



        case "conclusion":

            await cargarPaginaConclusion(
                proyecto
            );

        break;
        */


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
        "Entra a cargarPaginaPortada",
        "monitorEditor"
    );


    const contenedor =
        document.getElementById(
            "paginaEditor"
        );


    const canvas =
        document.querySelector(
            ".editor-canvas"
        );


    if (!contenedor) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Portada",
            "No existe paginaEditor",
            "monitorEditor"
        );

        return;

    }


    const hoja =
        document.createElement(
            "div"
        );


    hoja.className =
        "pl45-hoja-portada";


    Object.assign(
        hoja.style,
        {

            width: "100%",
            maxWidth: "794px",
            aspectRatio: "210 / 297",

            margin:
                "0 auto 20px auto",

            background:
                "white",

            transformOrigin:
                "top center"

        }
    );


    const rutaPortada =
        `${R2_EBOOKS_URL}/proyectos/${proyecto.projectId}/imagenes/portada.png`;


    const img =
        document.createElement(
            "img"
        );


    img.src =
        rutaPortada;


    img.alt =
        proyecto.titulo ||
        "Portada";


    img.className =
        "portada-editor";


    Object.assign(
        img.style,
        {

            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover"

        }
    );


    img.onload = () => {

        const esMovil =
            window.innerWidth <= 768;


        if (
            canvas &&
            esMovil
        ) {

            const anchoHoja =
                hoja.offsetWidth;


            const anchoDisponible =
                canvas.clientWidth - 20;


            if (
                anchoHoja > 0 &&
                anchoDisponible > 0
            ) {

                const escala =
                    anchoDisponible /
                    anchoHoja;


                hoja.style.transform =
                    `scale(${Math.min(1, escala)})`;


        //        hoja.style.marginBottom =
    //                `-${hoja.offsetHeight * (1 - escala)}px`;

            }

        }
        else {

            hoja.style.transform =
                "scale(1)";

        }


        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Portada",
            "Imagen cargada correctamente",
            "monitorEditor"
        );

    };


    img.onerror = () => {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Portada",
            "No se pudo cargar la imagen",
            "monitorEditor"
        );

    };


    hoja.appendChild(
        img
    );


    contenedor.appendChild(
        hoja
    );


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Portada",
        "Hoja agregada al editor",
        "monitorEditor"
    );

}

function asignarClasesPaginasEditorial() {

    const paginaEditor =
        document.getElementById("paginaEditor");

    if (!paginaEditor) return;


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

}


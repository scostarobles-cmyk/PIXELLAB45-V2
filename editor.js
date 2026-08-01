
monitorPIXELLAB(
    "Editorial",
    "debug",
    "EditorJS",
    "editor.js cargado",
    "monitorEditor"
);
let project_id = null;

async function listarProyectosEditorial() {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Biblioteca",
        "Solicitando listado de eBooks",
        "monitorEditor"
    );

    try {

        const respuesta = await fetch(WORKER_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                action: "listar-Ebooks"

            })

        });

        const datos = await respuesta.json();


        if (!datos.ok) {

            monitorPIXELLAB(
                "Editorial",
                "error",
                "Biblioteca",
                datos.error,
                "monitorEditor"
            );

            return;

        }


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Biblioteca",
            `Se pudieron listar ${datos.ebooks.length} proyectos editoriales`,
            "monitorEditor"
        );


        cargarBibliotecaEditorial(datos.ebooks);

        mostrarTarjetasEditorial();

    }
    catch (error) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Biblioteca",
            error.message,
            "monitorEditor"
        );

    }

}
async function cargarBibliotecaEditorial(proyectos) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Biblioteca",
        "Generando array de proyectos",
        "monitorEditor"
    );

    bibliotecaEditorial = [];

    for (const proyecto of proyectos) {

        bibliotecaEditorial.push({

            projectId: proyecto.projectId,
            titulo: proyecto.titulo,
            autor: proyecto.autor,
            paginas: proyecto.paginas,
            estructura: proyecto.estructura,
            tienePortada: proyecto.tienePortada,

            portada:
                `${R2_EBOOKS_URL}/proyectos/${proyecto.projectId}/imagenes/portada.png`

        });

        monitorPIXELLAB(
            "Editorial",
            "info",
            proyecto.projectId,
            proyecto.titulo,
            "monitorEditor"
        );

    }

    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Array generado",
        `${bibliotecaEditorial.length} proyectos cargados`,
        "monitorEditor"
    );

}
function mostrarTarjetasEditorial() {

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


    for (const libro of bibliotecaEditorial) {


        const tarjeta =
            document.createElement("article");

monitorPIXELLAB(
    "Editorial",
    "info",
    "Tarjeta creada",
    libro.titulo,
    "monitorEditor"
);

        tarjeta.className =
            "editorial-card";


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

monitorPIXELLAB(
    "Editorial",
    "ok",
    "Tarjeta agregada",
    libro.titulo,
    "monitorEditor"
);

        const imagen =
            tarjeta.querySelector(
                ".portada-editorial"
            );


        const rutaPortada =
            `proyectos/${libro.projectId}/imagenes/portada.png`;


        const urlPortada =
            `${R2_EBOOKS_URL}/${rutaPortada}`;

monitorPIXELLAB(
    "Editorial",
    "info",
    "Estado portada",
    `${libro.projectId} | tienePortada: ${libro.tienePortada}`,
    "monitorEditor"
);




        if (libro.tienePortada) {


            imagen.src = urlPortada;


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
                "proceso",
                "Generando portada",
                libro.titulo,
                "monitorEditor"
            );


            generarPortadaProyecto(libro)
            .then((nuevaPortada)=>{


                if(nuevaPortada){

                    imagen.src =
                    `${R2_EBOOKS_URL}/${nuevaPortada}`;

                }


            });


        }


    }


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Tarjetas creadas",
        `${bibliotecaEditorial.length} tarjetas mostradas`,
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
 
 project_id = projectId;

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
/*
=========================================================
PIXELLAB Editorial
Hoja · Legales

Responsabilidad:

• Cargar legales.json
• Crear la página de legales
• Agregar la página al paginaEditor

No guarda cambios.
No aplica estilos.

=========================================================
*/

async function cargarPaginaLegales(proyecto) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Legales",
        "Entra a cargarPaginaLegales"
    );


    try {


        const ruta =
            `proyectos/${proyecto.projectId}/legales.json`;


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Legales",
            "Cargando: " + ruta,
            "monitorEditor"
        );


        const respuesta =
            await fetch(WORKER_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    action: "cargar-json",

                    ruta: ruta

                })

            });


        const datos =
            await respuesta.json();


        if (!datos.ok) {

            throw new Error(
                "No se pudo cargar legales"
            );

        }


        const legales =
            datos.json;


        if (!legales) {

            throw new Error(
                "JSON legales vacio"
            );

        }


        const contenedor =
            document.getElementById(
                "paginaEditor"
            );


        if (!contenedor) {

            throw new Error(
                "No existe paginaEditor"
            );

        }


     // Crear hoja A4

const hoja =
    document.createElement(
        "div"
    );


hoja.className = "pl45-hoja-portada";


Object.assign(hoja.style, {

    width: "100%",
    maxWidth: "794px",
    aspectRatio: "210 / 297",

    margin: "0 auto 20px auto",

    background: "#ffffff",
    color: "#000000",

    padding: "40px",

    boxSizing: "border-box",

    overflow: "hidden"

});
        // Crear título

        const titulo =
            document.createElement(
                "h1"
            );


        titulo.textContent =
            "Legales";


        // Crear contenido

        const texto =
            document.createElement(
                "div"
            );


        texto.textContent =
            legales.contenido;


        texto.style.whiteSpace =
            "pre-line";


        // Armar hoja

        hoja.appendChild(
            titulo
        );


        hoja.appendChild(
            texto
        );


        // Agregar debajo de lo existente

        contenedor.appendChild(
            hoja
        );


        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Legales",
            "Página cargada correctamente",
                        "monitorEditor"
        );


    } catch(error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Legales",
            error.message,
                        "monitorEditor"
        );


    }

}
/* ==========================
   PÁGINA ÍNDICE
========================== */

async function cargarPaginaIndice(proyecto) {

    monitorPIXELLAB(
        "Editor",
        "proceso",
        "Indice",
        "Entra a cargarPaginaIndice"
    );


    try {


        const ruta =
            `proyectos/${proyecto.projectId}/indice.json`;


        monitorPIXELLAB(
            "Editor",
            "proceso",
            "Indice",
            "Cargando: " + ruta
        );


        const respuesta =
            await fetch(WORKER_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    action: "cargar-json",

                    ruta: ruta

                })

            });


        const datos =
            await respuesta.json();


        if (!datos.ok) {

            throw new Error(
                "No se pudo cargar indice"
            );

        }


        const indice =
            datos.json;


        if (!indice) {

            throw new Error(
                "JSON indice vacio"
            );

        }


        const contenedor =
            document.getElementById(
                "paginaEditor"
            );


        if (!contenedor) {

            throw new Error(
                "No existe paginaEditor"
            );

        }


        // Crear hoja A4

        const hoja =
            document.createElement(
                "div"
            );


        hoja.className =
            "pl45-hoja-portada";


        Object.assign(hoja.style, {

            width: "100%",
            maxWidth: "794px",
            aspectRatio: "210 / 297",

            margin: "0 auto 20px auto",

            background: "#ffffff",
            color: "#000000",

            padding: "40px",

            boxSizing: "border-box",

            overflow: "hidden"

        });


        // Crear t�tulo

        const titulo =
            document.createElement(
                "h1"
            );


        titulo.textContent =
            "lndice";


        titulo.style.color =
            "#000000";


        // Crear contenido

        const texto =
            document.createElement(
                "div"
            );


        texto.style.whiteSpace =
            "pre-line";


        texto.style.color =
            "#000000";


        if (
            indice.capitulos &&
            indice.capitulos.length > 0
        ) {


            for (const capitulo of indice.capitulos) {


                const linea =
                    document.createElement(
                        "p"
                    );


                linea.textContent =
                    `${capitulo.numero}. ${capitulo.titulo}`;


                linea.style.color =
                    "#000000";


                linea.style.fontSize =
                    "18px";


                linea.style.margin =
                    "0 0 12px 0";


                texto.appendChild(
                    linea
                );


            }


        }


        hoja.appendChild(
            titulo
        );


        hoja.appendChild(
            texto
        );


        contenedor.appendChild(
            hoja
        );


        monitorPIXELLAB(
            "Editor",
            "estado",
            "Indice",
            "Pagina cargada correctamente"
        );


    } catch(error) {


        monitorPIXELLAB(
            "Editor",
            "error",
            "Indice",
            error.message
        );


    }

}

async function cargarPaginaIntroduccion(proyecto) {

    monitorPIXELLAB(
        "Editor",
        "proceso",
        "Introduccion",
        "Entro a cargarPaginaIntroduccion"
    );


    try {


        const ruta =
            `proyectos/${proyecto.projectId}/introduccion.json`;


        monitorPIXELLAB(
            "Editor",
            "proceso",
            "Introduccion",
            "Cargando: " + ruta
        );


        const respuesta =
            await fetch(WORKER_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    action: "cargar-json",

                    ruta: ruta

                })

            });


        const datos =
            await respuesta.json();


        if (!datos.ok) {

            throw new Error(
                "No se pudo cargar introduccion"
            );

        }


        const introduccion =
            datos.json;


        if (!introduccion) {

            throw new Error(
                "JSON introduccion vacio"
            );

        }


        const contenedor =
            document.getElementById(
                "paginaEditor"
            );


        if (!contenedor) {

            throw new Error(
                "No existe paginaEditor"
            );

        }


        // Crear hoja A4

        const hoja =
            document.createElement(
                "div"
            );


        hoja.className =
            "pl45-hoja-portada";


        Object.assign(hoja.style, {

            width: "100%",
            maxWidth: "794px",
            aspectRatio: "210 / 297",

            margin: "0 auto 20px auto",

            background: "#ffffff",
            color: "#000000",

            padding: "40px",

            boxSizing: "border-box",

            overflow: "hidden"

        });


        // Crear titulo

        const titulo =
            document.createElement(
                "h1"
            );


        titulo.textContent =
            introduccion.titulo;


        titulo.style.color =
            "#000000";


        // Crear contenido

        const texto =
            document.createElement(
                "div"
            );


        texto.textContent =
            introduccion.contenido;


        texto.style.whiteSpace =
            "pre-line";


        texto.style.color =
            "#000000";


        texto.style.lineHeight =
            "1.6";


        texto.style.fontSize =
            "18px";


        hoja.appendChild(
            titulo
        );


        hoja.appendChild(
            texto
        );


        contenedor.appendChild(
            hoja
        );


        monitorPIXELLAB(
            "Editor",
            "estado",
            "Introducción",
            "Pagina cargada correctamente"
        );


    } catch(error) {


        monitorPIXELLAB(
            "Editor",
            "error",
            "Introducción",
            error.message
        );


    }

}

// aquí va capítulos


async function cargarPaginaConclusion(proyecto) {

    monitorPIXELLAB(
        "Editor",
        "proceso",
        "Conclusi9n",
        "Entra a cargarPaginaConclusion",
        "monitorEditor"
    );

    try {

        const ruta =
            `proyectos/${proyecto.projectId}/conclusion.json`;

        monitorPIXELLAB(
            "Editor",
            "proceso",
            "Conclusión",
            "Cargando: " + ruta,
            "monitorEditor"
        );


        const respuesta =
            await fetch(WORKER_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    action: "cargar-json",

                    ruta: ruta

                })

            });


        const datos =
            await respuesta.json();


        if (!datos.ok) {

            throw new Error(
                "No se pudo cargar conclusión"
            );

        }


        const conclusion =
            datos.json;


        if (!conclusion) {

            throw new Error(
                "JSON conclusion vacio"
            );

        }


        const contenedor =
            document.getElementById(
                "paginaEditor"
            );


        if (!contenedor) {

            throw new Error(
                "No existe paginaEditor"
            );

        }


        const hoja =
            document.createElement(
                "div"
            );


        hoja.className =
    "pl45-hoja-portada";


        hoja.style.background =
            "#ffffff";

        hoja.style.color =
            "#000000";

        hoja.style.padding =
            "40px";

        hoja.style.marginBottom =
            "20px";

        hoja.style.minHeight =
            "900px";


        const titulo =
            document.createElement(
                "h1"
            );


        titulo.textContent =
            conclusion.titulo;


        titulo.style.color =
            "#000000";


        const texto =
            document.createElement(
                "div"
            );


        let contenido = "";


        contenido +=
            conclusion.agradecimiento + "\n\n";


        contenido +=
            conclusion.resumen + "\n\n";


        contenido +=
            "Aprendizajes clave:\n\n";


        if (conclusion.aprendizajesClave) {

    conclusion.aprendizajesClave.forEach(

        item => {

            contenido +=
                "\u2022 " + item + "\n";

        }

    );

}

            

       


        contenido +=
            "\n" +
            conclusion.proximosPasos +
            "\n\n";


        contenido +=
            conclusion.motivacionFinal +
            "\n\n";


        contenido +=
            conclusion.llamadoALaAccion +
            "\n\n";


        contenido +=
            conclusion.despedida;


        texto.textContent =
            contenido;


        texto.style.whiteSpace =
            "pre-line";


        texto.style.color =
            "#000000";


        texto.style.lineHeight =
            "1.6";


        texto.style.fontSize =
            "18px";


        hoja.appendChild(
            titulo
        );


        hoja.appendChild(
            texto
        );


        contenedor.appendChild(
            hoja
        );


        monitorPIXELLAB(
    "Editor",
    "estado",
    "Conclusión",
    "Página cargada correctamente",
    "monitorEditor"
);

    } catch(error) {


        monitorPIXELLAB(
    "Editor",
    "error",
    "Conclusión",
    error.message,
    "monitorEditor"
);


    }

}



/*
=========================================================
PIXELLAB Editorial
ETAPA 1 · Carga completa del libro

Objetivo:
Reconstruir completamente el eBook en memoria
leyendo todos los archivos JSON del proyecto.

Flujo:

1. Portada
2. Legales
3. Índice
4. Introducción
5. Capítulos
6. Conclusión

Cada hoja tendrá su propia función de carga.

La única excepción son los capítulos, que se
recorrerán automáticamente leyendo plan.json.

En esta etapa:

✓ Carga contenido
✗ No aplica estilos
✗ No guarda cambios
✗ No realiza edición

=========================================================
*/
const SECCIONES_LIBRO = [
  //     "prueba",
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
        "Comenzando carga completa",
        "monitorEditor"
    );


    for (const seccion of SECCIONES_LIBRO) {

        await cargarSeccion(
            proyecto,
            seccion
        );

    }

    asignarClasesPaginasEditorial();
    verificarPipelineEditor();
    
     actualizarEstadoPipelineEditorial(
    "editorProyecto",
    "completo",
    "Proyecto cargado"
);

}
async function cargarSeccion(
    proyecto,
    seccion
) {

    switch (seccion) {


        case "prueba":

            await cargarPaginaPrueba(proyecto);

            break;


        case "portada":

            await cargarPaginaPortada(proyecto);

            break;


        case "legales":

            await cargarPaginaLegales(proyecto);

            break;


        case "indice":

            await cargarPaginaIndice(proyecto);

            break;


        case "introduccion":

            await cargarPaginaIntroduccion(proyecto);

            break;


        case "capitulos":

            await cargarPaginaCapitulos(proyecto);

            break;


        case "conclusion":

            await cargarPaginaConclusion(proyecto);

            break;

    }

}
function verificarPipelineEditor(){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Pipeline",
        "Verificando estados del editor",
        "monitorEditor"
    );


    const secciones = [
    {
        id:"editorPortada",
        nombre:"Portada"
    },
    {
        id:"editorLegales",
        nombre:"Legales"
    },
    {
        id:"editorIndice",
        nombre:"Índice"
    },
    {
        id:"editorIntroduccion",
        nombre:"Introducción"
    },
    {
        id:"editorCapitulos",
        nombre:"Capítulos"
    },
    {
        id:"editorConclusion",
        nombre:"Conclusión"
    }
];


    secciones.forEach(
        seccion => {

            const elemento =
                document.getElementById(
                    seccion.id
                );


            if(!elemento){

                monitorPIXELLAB(
                    "Editorial",
                    "error",
                    "Pipeline",
                    "No existe: " + seccion.id,
                    "monitorEditor"
                );

                return;
            }


            elemento.innerHTML =
                "⚪ " + seccion.nombre;


        }
    );


    // Primera sección disponible

    const portada =
        document.getElementById(
            "editorPortada"
        );


    if(portada){

        portada.innerHTML =
            "🔵 Portada";


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Pipeline",
            "Portada disponible",
            "monitorEditor"
        );

    }

}
function actualizarEstadoPipelineEditorial(
    idElemento,
    estado,
    mensaje
){

    const elemento =
        document.getElementById(
            idElemento
        );


    monitorPIXELLAB(
        "Editorial",
        "prueba",
        "Pipeline",
        "Buscando: " + idElemento +
        " | Encontrado: " + !!elemento,
        "monitorEditor"
    );


    if(!elemento){

        return;

    }


    switch(estado){

        case "disponible":
    elemento.innerHTML =
        "\uD83D\uDD35 " + mensaje; // 
    break;

case "produccion":
    elemento.innerHTML =
        "\uD83D\uDFE1 " + mensaje; // 
    break;

case "completo":
    elemento.innerHTML =
        "\uD83D\uDFE2 " + mensaje; // 
    break;

    }


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Pipeline",
        "Actualizado: " + elemento.id,
        "monitorEditor"
    );

}
function editarPortada(){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Portada",
        "Entrando a edición de portada",
        "monitorEditor"
    );


    actualizarEstadoPipelineEditorial(
        "editorPortada",
        "produccion",
        "Portada"
    );


    actualizarEstadoPipelineEditorial(
        "editorTexto",
        "produccion",
        "Texto"
    );


    const hojas =
        document.querySelectorAll(
            "[class*='pl45-hoja-']"
        );


    hojas.forEach(
        hoja => {

            hoja.style.display = "none";

        }
    );


    const portada =
        document.querySelector(
            ".pl45-hoja-portada"
        );


  if(portada){

    portada.style.display = "block";


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Portada",
        "Mostrando únicamente portada",
        "monitorEditor"
    );
    await inicializarEditor();
    mostrarControlesPortada();

}

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
function mostrarControlesPortada(){

    const contenedor =
        document.getElementById(
            "editorControles"
        );


    if(!contenedor){

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Controles",
            "No existe editorControles",
            "monitorEditor"
        );

        return;

    }


    contenedor.style.display = "flex";


    contenedor.innerHTML = `
    <div id="editorHerramientasPortada">

        <button onclick="activarEdicionTituloPortada()">
            Título
        </button>

        <button onclick="activarEdicionFuentePortada()">
            Fuente
        </button>

        <button onclick="activarEdicionTamanoPortada()">
            Tamaño
        </button>

        <button onclick="activarEdicionColorPortada()">
            Color
        </button>

        <button onclick="activarEdicionPosicionPortada()">
            Posición
        </button>

    </div>

    <div id="editorPanelPortada">

    </div>
`;


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Controles",
        "Controles de portada mostrados",
        "monitorEditor"
    );

}
function activarEdicionTituloPortada(){

    const panel =
        document.getElementById(
            "editorPanelPortada"
        );

    if(!panel){
        return;
    }

    panel.innerHTML = `

        <div class="control-titulo">

            <label>Título</label>

            <input
                type="text"
                id="inputTituloPortada"
                class="control-input-portada"
                placeholder="Escriba el título">

        </div>

    `;

    const input =
        document.getElementById(
            "inputTituloPortada"
        );

    input.addEventListener(
        "input",
        () => {

            crearOActualizarElementoPortada(
                "pl45-titulo-portada",
                input.value
            );

        }
    );

}
function crearOActualizarElementoPortada(
    clase,
    texto
){

    const portada =
        document.querySelector(
            ".pl45-hoja-portada"
        );

    if(!portada){
        return;
    }

    let elemento =
        portada.querySelector(
            "." + clase
        );

    if(!elemento){

        elemento =
            document.createElement("div");

        elemento.className =
            clase;

        elemento.innerHTML =
            texto;

        portada.appendChild(
            elemento
        );

    }else{

        elemento.innerHTML =
            texto;

    }

}
function activarEdicionFuentePortada(){

    const panel =
        document.getElementById(
            "editorPanelPortada"
        );

    if(!panel){
        return;
    }

    panel.innerHTML = `

        <div class="control-titulo">

            <label>Fuente</label>

            <select id="selectorFuentePortada">

                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>

            </select>

        </div>

    `;

    const selector =
        document.getElementById(
            "selectorFuentePortada"
        );

    selector.addEventListener(
        "change",
        () => {

            const titulo =
                document.querySelector(
                    ".pl45-titulo-portada"
                );

            if(titulo){

                titulo.style.fontFamily =
                    selector.value;

            }

        }
    );

}
function activarEdicionTamanoPortada(){

    const panel =
        document.getElementById(
            "editorPanelPortada"
        );

    if(!panel){
        return;
    }


    panel.innerHTML = `

        <div class="control-titulo">

            <label>
                Tamaño
            </label>

            <input
                type="number"
                id="tamanioTituloPortada"
                value="38"
                min="10"
                max="120">

        </div>

    `;


    const input =
        document.getElementById(
            "tamanioTituloPortada"
        );


    input.addEventListener(
        "input",
        () => {

            const titulo =
                document.querySelector(
                    ".pl45-titulo-portada"
                );


            if(titulo){

                titulo.style.fontSize =
                    input.value + "px";

            }

        }
    );


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Portada",
        "Control tamaño activado",
        "monitorEditor"
    );

}

async function inicializarEditor(){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Editor",
        "Entrando a inicializarEditor()",
        "monitorEditor"
    );


    const rutaEditor =
        `proyectos/${project_id}/editor.json`;


    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Editor",
        "Buscando archivo: " + rutaEditor,
        "monitorEditor"
    );


    const editor =
        await cargarJSON(rutaEditor);


    if(editor){

        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Editor",
            "editor.json existe",
            "monitorEditor"
        );

    }else{

        monitorPIXELLAB(
            "Editorial",
            "aviso",
            "Editor",
            "editor.json no existe",
            "monitorEditor"
        );

    }

}

function activarEdicionColorPortada(){

    const panel =
        document.getElementById(
            "editorPanelPortada"
        );

    if(!panel){
        return;
    }


    panel.innerHTML = `

        <div class="control-titulo">

            <label>
                Color
            </label>

            <input
                type="color"
                id="colorTituloPortada"
                value="#ffffff">

        </div>

    `;


    const selector =
        document.getElementById(
            "colorTituloPortada"
        );


    selector.addEventListener(
        "input",
        () => {

            const titulo =
                document.querySelector(
                    ".pl45-titulo-portada"
                );


            if(titulo){

                titulo.style.color =
                    selector.value;

            }

        }
    );


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Portada",
        "Control color activado",
        "monitorEditor"
    );

}

//Aquí va x e y



/* ==========================
   CARGAR TODOS LOS CAPÍTULOS
========================== */

async function cargarPaginaCapitulos(proyecto) {

    monitorPIXELLAB(
        "Editor",
        "proceso",
        "Capitulos",
        "Entró a cargarPaginaCapitulos"
    );

    try {

        const ruta =
            `proyectos/${proyecto.projectId}/plan.json`;

        monitorPIXELLAB(
            "Editor",
            "proceso",
            "Capitulos",
            "Cargando: " + ruta
        );

        const respuesta =
            await fetch(WORKER_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    action: "cargar-json",

                    ruta: ruta

                })

            });

        const datos =
            await respuesta.json();

        if (!datos.ok) {

            throw new Error(
                "No se pudo cargar plan.json"
            );

        }

        const plan =
            datos.json;

        if (
            !plan ||
            !plan.capitulos ||
            plan.capitulos.length === 0
        ) {

            throw new Error(
                "Plan sin capítulos"
            );

        }

        monitorPIXELLAB(
            "Editor",
            "proceso",
            "Capitulos",
            "Capítulos encontrados: " +
            plan.capitulos.length
        );

        for (const capitulo of plan.capitulos) {

            monitorPIXELLAB(
                "Editor",
                "proceso",
                "Capitulos",
                "Generando capítulo " +
                capitulo.numero
            );

            await cargarPaginaCapitulo(

                proyecto,

                capitulo.numero,

                capitulo.paginas

            );

        }

        monitorPIXELLAB(
            "Editor",
            "estado",
            "Capitulos",
            "Todos los capítulos cargados"
        );

    } catch(error) {

        monitorPIXELLAB(
            "Editor",
            "error",
            "Capitulos",
            error.message
        );

    }

}

async function cargarPaginaCapitulo(
    proyecto,
    numeroCapitulo,
    paginasPlan
) {

    monitorPIXELLAB(
    "Editorial",
    "proceso",
    "Capítulo",
    "Entró a cargarPaginaCapitulo",
    "monitorEditor"
);

    try {

        /* ======================================================
           1. CARGAR JSON DEL CAPÍTULO
        ====================================================== */

    const archivo =
    `capitulo-${String(numeroCapitulo).padStart(3,"0")}.json`;

const ruta =
    `proyectos/${proyecto.projectId}/capitulos/${archivo}`;
    
monitorPIXELLAB(
    "Editorial",
    "proceso",
    "Capítulo",
    "Cargando: " + ruta,
    "monitorEditor"
);

const respuesta =
    await fetch(WORKER_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            action: "cargar-json",

            ruta: ruta

        })

    });

const datos =
    await respuesta.json();

if (!datos.ok) {

    throw new Error(
        "No se pudo cargar el capítulo"
    );

}

const capitulo =
    datos.json;

if (!capitulo) {

    throw new Error(
        "JSON capítulo vacío"
    );

}


        /* ======================================================
           2. OBTENER paginaEditor
        ====================================================== */

   const contenedor =
    document.getElementById(
        "paginaEditor"
    );

if (!contenedor) {

    throw new Error(
        "No existe paginaEditor"
    );

}


// ===============================
// CONFIGURACIÓN DE PÁGINA A4
// ===============================

const altoPagina =
    900;

const margenPagina =
    40;

let paginaActual =
    null;

let altoUsado =
    0;

let numeroPagina =
    1;


// ===============================
// CREAR NUEVA PÁGINA
// ===============================

function crearNuevaPagina() {

    const nuevaHoja =
        document.createElement("div");

    nuevaHoja.className =
        "pl45-hoja-portada";

    Object.assign(nuevaHoja.style, {

        width: "100%",
        maxWidth: "794px",
        aspectRatio: "210 / 297",

        margin: "0 auto 20px auto",

        background: "#ffffff",
        color: "#000000",

        padding: margenPagina + "px",

        boxSizing: "border-box",

        overflow: "hidden"

    });

    contenedor.appendChild(
        nuevaHoja
    );

    paginaActual =
        nuevaHoja;

    altoUsado =
        0;

    numeroPagina++;

}

// Crear primera página

crearNuevaPagina();
// ===============================
// AGREGAR CONTENIDO A LA PÁGINA
// ===============================

function agregarBloquePagina(elemento) {

    // Agrega el bloque
    paginaActual.appendChild(elemento);

    // Mide la altura ocupada
    const altoUsado = paginaActual.scrollHeight;

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Maquetación",
        "Alto usado: " + altoUsado,
        "monitorEditor"
    );

    // ¿Se pasó de la hoja?
    if (altoUsado > altoPagina) {

        // Sacar el bloque
        paginaActual.removeChild(elemento);

        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Maquetación",
            "Nueva página",
            "monitorEditor"
        );

        // Crear hoja nueva
        crearNuevaPagina();

        // Volver a agregar el bloque completo
        paginaActual.appendChild(elemento);

    }

}

        /* ======================================================
           4. TÍTULO DEL CAPÍTULO
        ====================================================== */

 const titulo =
    document.createElement(
        "h1"
    );

titulo.textContent =
    capitulo.titulo;

titulo.style.color =
    "#000000";

agregarBloquePagina(
    titulo
);


        /* ======================================================
           5. INTRODUCCIÓN
        ====================================================== */

const introduccion =
    document.createElement(
        "div"
    );

introduccion.textContent =
    capitulo.introduccion;

introduccion.style.color =
    "#000000";

introduccion.style.fontSize =
    "18px";

introduccion.style.lineHeight =
    "1.6";

introduccion.style.whiteSpace =
    "pre-line";

introduccion.style.marginBottom =
    "30px";

agregarBloquePagina(
    introduccion
);


        /* ======================================================
           6. SECCIONES
        ====================================================== */

  for (const seccion of capitulo.secciones) {

    const bloqueSeccion =
        document.createElement("div");

    const subtitulo =
        document.createElement("h2");

    subtitulo.textContent =
        `${seccion.numero}. ${seccion.titulo}`;

    subtitulo.style.color = "#000000";
    subtitulo.style.marginTop = "30px";

    bloqueSeccion.appendChild(
        subtitulo
    );

    const contenido =
        document.createElement("div");

    contenido.textContent =
        seccion.contenido;

    contenido.style.color = "#000000";
    contenido.style.fontSize = "18px";
    contenido.style.lineHeight = "1.6";
    contenido.style.whiteSpace = "pre-line";

    bloqueSeccion.appendChild(
        contenido
    );

    agregarBloquePagina(
        bloqueSeccion
    );

}


        /* ======================================================
           7. EJEMPLOS
        ====================================================== */

  if (
    capitulo.ejemplos &&
    capitulo.ejemplos.length > 0
) {

    const tituloEjemplos =
        document.createElement(
            "h2"
        );

    tituloEjemplos.textContent =
        "Ejemplos";

    tituloEjemplos.style.color =
        "#000000";

    tituloEjemplos.style.marginTop =
        "30px";

    agregarBloquePagina(
    tituloEjemplos
);


    for (const ejemplo of capitulo.ejemplos) {

        const subtitulo =
            document.createElement(
                "h3"
            );

        subtitulo.textContent =
            ejemplo.titulo;

        subtitulo.style.color =
            "#000000";

        agregarBloquePagina(
    subtitulo
);


        const contenido =
            document.createElement(
                "div"
            );

        contenido.textContent =
            ejemplo.contenido;

        contenido.style.color =
            "#000000";

        contenido.style.fontSize =
            "18px";

        contenido.style.lineHeight =
            "1.6";

        contenido.style.whiteSpace =
            "pre-line";

        agregarBloquePagina(
    contenido
);

    }

}


        /* ======================================================
           8. CONSEJOS
        ====================================================== */

if (
    capitulo.consejos &&
    capitulo.consejos.length > 0
) {

    const tituloConsejos =
        document.createElement(
            "h2"
        );

    tituloConsejos.textContent =
        "Consejos";

    tituloConsejos.style.color =
        "#000000";

    tituloConsejos.style.marginTop =
        "30px";

    agregarBloquePagina(
    tituloConsejos
);


    const lista =
        document.createElement(
            "ul"
        );

    lista.style.color =
        "#000000";

    lista.style.fontSize =
        "18px";

    lista.style.lineHeight =
        "1.6";


    for (const consejo of capitulo.consejos) {

        const item =
            document.createElement(
                "li"
            );

        item.textContent =
            consejo;

        lista.appendChild(
            item
        );

    }


        /* ======================================================
           9. ERRORES COMUNES
        ====================================================== */

 if (
    capitulo.erroresComunes &&
    capitulo.erroresComunes.length > 0
) {

    const tituloErrores =
        document.createElement(
            "h2"
        );

    tituloErrores.textContent =
        "Errores comunes";

    tituloErrores.style.color =
        "#000000";

    tituloErrores.style.marginTop =
        "30px";

    agregarBloquePagina(
    tituloErrores
);


    const lista =
        document.createElement(
            "ul"
        );

    lista.style.color =
        "#000000";

    lista.style.fontSize =
        "18px";

    lista.style.lineHeight =
        "1.6";


    for (const errorComun of capitulo.erroresComunes) {

        const item =
            document.createElement(
                "li"
            );

        item.textContent =
            errorComun;

        lista.appendChild(
            item
        );

    }


    agregarBloquePagina(
    lista
);


}


        /* ======================================================
           10. RESUMEN
        ====================================================== */

   if (capitulo.resumen) {

    const tituloResumen =
        document.createElement(
            "h2"
        );

    tituloResumen.textContent =
        "Resumen";

    tituloResumen.style.color =
        "#000000";

    tituloResumen.style.marginTop =
        "30px";

    agregarBloquePagina(
    tituloResumen
);


    const resumen =
        document.createElement(
            "div"
        );

    resumen.textContent =
        capitulo.resumen;

    resumen.style.color =
        "#000000";

    resumen.style.fontSize =
        "18px";

    resumen.style.lineHeight =
        "1.6";

    resumen.style.whiteSpace =
        "pre-line";

    agregarBloquePagina(
    resumen
);

}


        /* ======================================================
           11. EJERCICIO
        ====================================================== */

if (capitulo.ejercicio) {

    const tituloEjercicio =
        document.createElement(
            "h2"
        );

    tituloEjercicio.textContent =
        "Ejercicio";

    tituloEjercicio.style.color =
        "#000000";

    tituloEjercicio.style.marginTop =
        "30px";

    agregarBloquePagina(
    tituloEjercicio
);


    const nombreEjercicio =
        document.createElement(
            "h3"
        );

    nombreEjercicio.textContent =
        capitulo.ejercicio.titulo;

    nombreEjercicio.style.color =
        "#000000";

    agregarBloquePagina(
    nombreEjercicio
);


    const descripcion =
        document.createElement(
            "div"
        );

    descripcion.textContent =
        capitulo.ejercicio.descripcion;

    descripcion.style.color =
        "#000000";

    descripcion.style.fontSize =
        "18px";

    descripcion.style.lineHeight =
        "1.6";

    descripcion.style.whiteSpace =
        "pre-line";

    agregarBloquePagina(
    descripcion
);

}


/* ======================================================
   12. FRASE FINAL
====================================================== */

if (capitulo.fraseFinal) {

    const fraseFinal =
        document.createElement("div");

    fraseFinal.textContent =
        capitulo.fraseFinal;

    fraseFinal.style.color =
        "#000000";

    fraseFinal.style.fontSize =
        "20px";

    fraseFinal.style.fontStyle =
        "italic";

    fraseFinal.style.fontWeight =
        "bold";

    fraseFinal.style.lineHeight =
        "1.6";

    fraseFinal.style.marginTop =
        "40px";

    fraseFinal.style.paddingTop =
        "20px";

    fraseFinal.style.borderTop =
        "2px solid #cccccc";

    agregarBloquePagina(
        fraseFinal
    );

}


        /* ======================================================
           13. AGREGAR LA HOJA AL EDITOR
        ====================================================== */

   

monitorPIXELLAB(
    "Editorial",
    "estado",
    "Capítulo",
    "Página cargada correctamente",
    "monitorEditor"
);


       } 

    } catch(error) {

        monitorPIXELLAB(
    "Editorial",
    "error",
    "Capítulo",
    error.message,
    "monitorEditor"
);

    }

}


let modoPortadaActivo = false;


function abrirModoPortada() {

    modoPortadaActivo = true;


    const biblioteca =
        document.getElementById(
            "editorBiblioteca"
        );

    const monitor =
        document.getElementById(
            "monitorEditor"
        );

    const toolbar =
        document.querySelector(
            ".editor-toolbar-editor"
        );

    const pipeline =
        document.querySelector(
            ".pipeline-editor"
        );

    const paginaEditor =
        document.getElementById(
            "paginaEditor"
        );


    if (biblioteca) {

        biblioteca.style.display =
            "none";

    }


    


    if (toolbar) {

        toolbar.style.display =
            "flex";

    }


    if (pipeline) {

        pipeline.style.display =
            "flex";

    }


    // MOSTRAR SOLO PORTADA POR CLASE

    if (paginaEditor) {


        const hojas =
            paginaEditor.querySelectorAll(
                ".pl45-hoja"
            );


        hojas.forEach(
            hoja => {

                hoja.style.display =
                    "none";

            }
        );


        const portada =
            paginaEditor.querySelector(
                ".pl45-hoja-portada"
            );


        if (portada) {

            portada.style.display =
                "block";

        }

    }


    // PORTADA -> VOLVER

    const botonPortada =
        document.querySelector(
            ".editor-menu"
        );


    if (botonPortada) {

        botonPortada.innerHTML =
            `
            <span>⬅</span>
            <small>Volver</small>
            `;


        botonPortada.onclick =
            cerrarModoPortada;

    }


    mostrarBotoneraEdicionPortada(project_id);


    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Portada",
        "Modo portada activo",
        "monitorEditor"
    );

}


function cerrarModoPortada() {

    modoPortadaActivo = false;


    const biblioteca =
        document.getElementById(
            "editorBiblioteca"
        );

    const monitor =
        document.getElementById(
            "monitorEditor"
        );


    if (biblioteca) {

        biblioteca.style.display =
            "";

    }


    if (monitor) {

        monitor.style.display =
            "";

    }


    // RESTAURAR TODAS LAS HOJAS

    const paginaEditor =
        document.getElementById(
            "paginaEditor"
        );


    if (paginaEditor) {

        const hojas =
            paginaEditor.children;


        for (let i = 0; i < hojas.length; i++) {

            hojas[i].style.display =
                "block";

        }

    }


    // VOLVER A PORTADA CON ICONO

    const botonPortada =
        document.querySelector(
            ".editor-menu"
        );


    if (botonPortada) {

        botonPortada.innerHTML =
            `
            <span>📄</span>
            <small>Portada</small>
            `;


        botonPortada.onclick =
            abrirModoPortada;

    }


    const botoneraEdicion =
        document.getElementById(
            "botoneraEdicion"
        );


    if (botoneraEdicion) {

        botoneraEdicion.innerHTML = "";

        botoneraEdicion.style.display =
            "none";

    }


    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Portada",
        "Modo normal restaurado",
        "monitorEditor"
    );

}



function activarBotoneraEditor(){

    const botones =
    document.querySelectorAll(
        ".editor-menu, .btn-editor-portada"
    );
    botones.forEach(boton => {

        boton.disabled = false;

        boton.style.opacity = "1";

        boton.style.cursor = "pointer";

    });

    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Botonera",
        "Botones editor activados",
        "monitorEditor"
    );

}

function mostrarBotoneraEdicionPortada(project_Id) {

monitorPIXELLAB(
        "Editorial",
        "estado",
        "Botonera",
        "mostrando los botones de edición",
        "monitorEditor"
    );

    const botonera =
        document.getElementById("botoneraEdicion");
//   const proyectoSeleccionado = projectId;
    if (!botonera) return;


    botonera.innerHTML = "";


    const botones = [
        {
            icono: "➕",
            texto: "Título",
            accion: agregarTituloPortada
        },
        {
            icono: "✍️",
            texto: "Autor"
        },
        {
            icono: "🔷",
            texto: "Logo"
        },
        {
            icono: "🖼️",
            texto: "Imagen"
        },
     {
    icono: "💾",
    texto: "Guardar",
    accion: () => guardarEditorPortada(project_id)
}
    ];


    botones.forEach(item => {

        const boton =
            document.createElement("button");


        boton.className =
            "btn-editor-portada";


        boton.innerHTML =
            `
            <span>${item.icono}</span>
            <small>${item.texto}</small>
            `;


   if (item.accion) {

    boton.onclick =
        () => item.accion();

}


        botonera.appendChild(boton);

    });


    botonera.style.display =
        "flex";

}

function agregarTituloPortada() {

    const portada =
        document.querySelector(
            ".pl45-hoja-portada"
        );


    if (!portada) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Portada",
            "No se encontró la hoja de portada",
            "monitorEditor"
        );

        return;

    }


    let titulo =
        portada.querySelector(
            ".titulo-portada-editor"
        );


    if (!titulo) {

        titulo =
            document.createElement("div");


        titulo.className =
            "titulo-portada-editor";


        titulo.contentEditable =
            true;


        titulo.innerText =
            "Nuevo título";


        portada.appendChild(
            titulo
        );

    }


    titulo.focus();


    elementoTextoActivo = titulo;

monitorPIXELLAB(
    "Editorial",
    "estado",
    "Texto activo",
    "Elemento seleccionado: " + elementoTextoActivo.className,
    "monitorEditor"
);


inicializarEditorFuente();

inicializarPosicionTexto();

inicializarArrastreTexto();

mostrarBotoneraEstilosTexto();

}




async function guardarEditorPortada(project_id) {

    if (!project_id) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "guardarEditorPortada",
            "No hay proyecto activo",
            "monitorEditor"
        );

        return;

    }


    const titulo =
        document.querySelector(
            ".titulo-portada-editor"
        );


    const editorJSON = {

        portada: {

            titulo: {

                texto:
                    titulo
                        ? titulo.innerText
                        : "",


                estilo: {

                    x:
                        titulo
                            ? titulo.style.left
                            : "",

                    y:
                        titulo
                            ? titulo.style.top
                            : "",

                    fontSize:
                        titulo
                            ? titulo.style.fontSize
                            : "",

                    color:
                        titulo
                            ? titulo.style.color
                            : "",

                    fontFamily:
                        titulo
                            ? titulo.style.fontFamily
                            : "",

                    fontWeight:
                        titulo
                            ? titulo.style.fontWeight
                            : ""

                }

            }

        }

    };


    const ruta =
        `proyectos/${project_id}/editor.json`;


    const guardado =
        await guardarJSON(
            ruta,
            editorJSON
        );


    if (guardado) {

        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Editor portada",
            "Estado de portada guardado",
            "monitorEditor"
        );

    }

}
function mostrarBotoneraEstilosTexto() {

    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Estilos",
        "Entró a mostrarBotoneraEstilosTexto",
        "monitorEditor"
    );


    const botonera =
        document.getElementById(
            "botoneraEstilosTexto"
        );


    if (!botonera) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Estilos",
            "No existe botoneraEstilosTexto",
            "monitorEditor"
        );

        return;
    }


    botonera.style.display = "flex";


    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Estilos",
        "Botonera estilos visible",
        "monitorEditor"
    );

}

function inicializarEditorFuente(){

    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Fuente",
        "Entró a inicializarEditorFuente",
        "monitorEditor"
    );

    const selector =
        document.getElementById("editorFuente");

    if(!selector){

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Fuente",
            "No existe editorFuente",
            "monitorEditor"
        );

        return;
    }

    if(elementoTextoActivo){

        const fuenteActual =
            getComputedStyle(
                elementoTextoActivo
            ).fontFamily
            .split(",")[0]
            .replaceAll('"',"")
            .trim();

        selector.value =
            fuenteActual;

        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Fuente",
            "Fuente cargada: " + fuenteActual,
            "monitorEditor"
        );

    }else{

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Fuente",
            "No existe elementoTextoActivo",
            "monitorEditor"
        );

    }

    selector.onchange = null;

    selector.onchange = function(){

        if(!elementoTextoActivo){

            monitorPIXELLAB(
                "Editorial",
                "error",
                "Fuente",
                "No hay elemento activo",
                "monitorEditor"
            );

            return;
        }

        elementoTextoActivo.style.fontFamily =
            this.value;

        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Fuente",
            "Fuente aplicada: " + this.value,
            "monitorEditor"
        );

    };

}

function inicializarPosicionTexto(){

    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Posición",
        "Entró a inicializarPosicionTexto",
        "monitorEditor"
    );


    const inputX =
        document.getElementById(
            "editorTextoX"
        );

    const inputY =
        document.getElementById(
            "editorTextoY"
        );


    if(!inputX || !inputY){

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Posición",
            "No existen controles X/Y",
            "monitorEditor"
        );

        return;
    }


    if(elementoTextoActivo){

        const estilo =
            getComputedStyle(
                elementoTextoActivo
            );


        inputX.value =
            parseInt(
                estilo.left
            ) || 0;


        inputY.value =
            parseInt(
                estilo.top
            ) || 0;


        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Posición",
            "Cargada X:" +
            inputX.value +
            " Y:" +
            inputY.value,
            "monitorEditor"
        );

    }


    function aplicarPosicion(){

        if(!elementoTextoActivo)
            return;


        elementoTextoActivo.style.left =
            inputX.value + "px";


        elementoTextoActivo.style.top =
            inputY.value + "px";


        elementoTextoActivo.style.transform =
            "none";


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Posición",
            "Aplicada X:" +
            inputX.value +
            " Y:" +
            inputY.value,
            "monitorEditor"
        );

    }


    inputX.onchange =
        aplicarPosicion;


    inputY.onchange =
        aplicarPosicion;


}
function inicializarArrastreTexto(){

    if(!elementoTextoActivo){

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Movimiento",
            "No existe elementoTextoActivo",
            "monitorEditor"
        );

        return;
    }


    const texto =
        elementoTextoActivo;


    texto.style.cursor =
        "move";


    let moviendo = false;

    let inicioX = 0;
    let inicioY = 0;

    let posicionX = 0;
    let posicionY = 0;


    texto.onpointerdown = function(e){

        moviendo = true;


        texto.contentEditable = false;


        texto.setPointerCapture(
            e.pointerId
        );


        inicioX =
            e.clientX;

        inicioY =
            e.clientY;


        posicionX =
            parseInt(
                texto.style.left
            ) || texto.offsetLeft;


        posicionY =
            parseInt(
                texto.style.top
            ) || texto.offsetTop;


        texto.style.transform =
            "none";


        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Movimiento",
            "Arrastre iniciado",
            "monitorEditor"
        );

    };


    texto.onpointermove = function(e){

        if(!moviendo)
            return;


        const deltaX =
            e.clientX - inicioX;


        const deltaY =
            e.clientY - inicioY;


        const nuevaX =
            posicionX + deltaX;


        const nuevaY =
            posicionY + deltaY;


        texto.style.left =
            nuevaX + "px";


        texto.style.top =
            nuevaY + "px";


        const inputX =
            document.getElementById(
                "editorTextoX"
            );


        const inputY =
            document.getElementById(
                "editorTextoY"
            );


        if(inputX)
            inputX.value =
                Math.round(nuevaX);


        if(inputY)
            inputY.value =
                Math.round(nuevaY);

    };


    texto.onpointerup = function(e){

        moviendo = false;


        texto.releasePointerCapture(
            e.pointerId
        );


        texto.contentEditable = true;


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Movimiento",
            "Posición final X:" +
            texto.offsetLeft +
            " Y:" +
            texto.offsetTop,
            "monitorEditor"
        );

    };

}

async function cargarPaginaPrueba(proyecto) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Prueba",
        "Entró a cargarPaginaPrueba",
        "monitorEditor"
    );


    const pagina =
        document.getElementById("paginaEditor");


    if (!pagina) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Prueba",
            "No existe paginaEditor",
            "monitorEditor"
        );

        return;
    }


    pagina.innerHTML = "";


    const hoja =
        document.createElement("div");


    hoja.className = "hoja-editor";


    hoja.innerHTML = `

        <h1>
            PIXELLAB EDITOR
        </h1>

        <p>
            Hoja de prueba cargada desde cargarLibroCompleto()
        </p>

        <p>
            Proyecto:
            ${proyecto.projectId || ""}
        </p>

    `;


    pagina.appendChild(hoja);


    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Prueba",
        "Hoja de prueba agregada correctamente",
        "monitorEditor"
    );

}

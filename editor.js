monitorPIXELLAB(
    "Editorial",
    "debug",
    "EditorJS",
    "editor.js cargado",
    "monitorEditor"
);

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

                ✏️ Editar

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
   // "legales",
  //  "indice",
 //  "introduccion",
    //"capitulos",
  //  "conclusion"
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

    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Libro",
        "Carga completa finalizada",
                "monitorEditor"
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

            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Capitulos",
                "Pendiente",
                        "monitorEditor"
            );

            await cargarPaginaCapitulo(
                proyecto,
                1,
                8
            );

            break;

        case "conclusion":
            await cargarPaginaConclusion(proyecto);
            break;

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
        "Entró a cargarPaginaPortada",
        
    );        "monitorEditor"


    const pagina = document.getElementById("paginaEditor");
    const canvas = document.querySelector(".editor-canvas");


    if (!pagina) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Portada",
            "No existe paginaEditor",
                    "monitorEditor"
        );

        return;
    }


    pagina.innerHTML = "";


    const hoja = document.createElement("div");

    hoja.className = "pl45-hoja-portada";


    Object.assign(hoja.style, {

        width: "210mm",
        height: "297mm",
        position: "relative",
        overflow: "hidden",
        margin: "auto",
        background: "white",
        transformOrigin: "top center"

    });


    const img = document.createElement("img");
monitorPIXELLAB(
    "Editorial",
    "info",
    "Portada ruta",
    proyecto.portada,
    "monitorEditor"
);

    img.src = proyecto.portada;
    img.alt = proyecto.titulo || "Portada";
    img.className = "portada-editor";


    Object.assign(img.style, {

        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "cover"

    });


    img.onload = () => {
    	monitorPIXELLAB(
    "Editorial",
    "info",
    "Medidas imagen",
    "Imagen real: " +
    img.naturalWidth +
    " x " +
    img.naturalHeight,
            "monitorEditor"
);

        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Portada",
            "Imagen cargada correctamente",
                    "monitorEditor"
        );


        const esMovil = window.innerWidth <= 768;


        if (canvas && esMovil) {


            const anchoHoja = hoja.offsetWidth;
            const anchoDisponible = canvas.clientWidth - 20;


            if (anchoHoja > 0 && anchoDisponible > 0) {


                const escala =
                    anchoDisponible / anchoHoja;


                hoja.style.transform =
                    `scale(${Math.min(1, escala)})`;


                hoja.style.marginBottom =
                    `-${hoja.offsetHeight * (1 - escala)}px`;


                monitorPIXELLAB(
                    "Editorial",
                    "info",
                    "Portada",
                    "Escala móvil aplicada: " + escala,
                            "monitorEditor"
                );

            }


        } else {


            hoja.style.transform = "scale(1)";


        }


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


    hoja.appendChild(img);

    pagina.appendChild(hoja);


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Portada",
        "Hoja A4 agregada correctamente",
        "monitorEditor"
    );

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
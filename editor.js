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


/*async function abrirEditorEditorial(projectId) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Editar proyecto",
        `Abriendo proyecto: ${projectId}`,
        "monitorEditor"
    );
    monitorPIXELLAB(
    "Editorial",
    "info",
    "Prueba editor",
    "Entró a crear contenido en paginaEditor",
    "monitorEditor"
);

const editor = document.getElementById("paginaEditor");

monitorPIXELLAB(
    "Editorial",
    "info",
    "paginaEditor",
    editor ? "Encontrado" : "NO encontrado",
    "monitorEditor"
);

if (editor) {

    editor.innerHTML = `
        <div style="
            width:100%;
            height:400px;
            background:#05070d;
            border:2px solid #00d9ff;
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:20px;
        ">
            EDITOR ABIERTO<br>
            Proyecto: ${projectId}
        </div>
    `;

} else {

    monitorPIXELLAB(
        "Editorial",
        "error",
        "Editor",
        "No existe paginaEditor",
        "monitorEditor"
    );

}

} else {

    monitorPIXELLAB(
        "Editorial",
        "error",
        "Editor",
        "No existe editorEditorial",
        "monitorEditor"
    );

}


    await cargarLibroCompleto(projectId);

}*/
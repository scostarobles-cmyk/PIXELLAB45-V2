async function cargarGaleriaEditorial() {
	monitorPIXELLAB(
        "Editorial",
        "debug",
        "Galería",
        "Entró a la función",
        "monitorEditor"
    );
    

    try {


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Inicio",
            "Solicitando eBooks al Worker",
                    "monitorEditor"
            
        );


        const respuesta =
            await fetch(
                WORKER_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        action: "listar-ebooks"
                    })
                }
            );


        const data =
            await respuesta.json();


        if (!data.ok) {

            throw new Error(
                data.error ||
                "Error listando eBooks"
            );

        }


        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Lista generada",
            "eBooks encontrados: " +
            data.ebooks.length,
                    "monitorEditor"
        );


        mostrarProyectosEditorial(
            data.ebooks
        );


        monitorPIXELLAB(
            "Editorial",
            "estado",
            "Enviado a mostrar",
            "Datos enviados a tarjetas editoriales",
                    "monitorEditor"
        );


    } catch(error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Carga galería editorial",
            error.message,
                    "monitorEditor"
        );


        console.error(error);

    }

}
let bibliotecaEditorial = [];
async function mostrarProyectosEditorial(proyectos) {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Inicio",
        "Entró a mostrar proyectos editoriales",
        "monitorEditor"
    );


    const contenedor =
        document.getElementById(
            "bibliotecaEditorial"
        );


    if (!contenedor) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Contenedor no encontrado",
            "No existe bibliotecaEditorial",
                    "monitorEditor"
        );

        return;

    }


    contenedor.innerHTML = "";


    if (!proyectos || proyectos.length === 0) {

        contenedor.innerHTML =
            "<p>No hay proyectos para editar</p>";

        return;

    }


    let cantidad = 0;
bibliotecaEditorial = [];

    for (const proyecto of proyectos) {
    	
    bibliotecaEditorial.push({

    projectId: proyecto.projectId,

    titulo: proyecto.titulo,

    autor: proyecto.autor,

    paginas: proyecto.paginas,

    portada:
        `${R2_EBOOKS_URL}/proyectos/${proyecto.projectId}/imagenes/portada.png`,

    estructura: proyecto.estructura

});


        cantidad++;


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Creando tarjeta",
            proyecto.titulo,
                    "monitorEditor"
            
        );


        const tarjeta =
            document.createElement(
                "article"
            );


        tarjeta.className =
            "editorial-card";


        tarjeta.innerHTML = `

        <div class="editorial-cover">

            <img class="portada-editorial">

        </div>


        <div class="editorial-info">

            <h3>
                ${proyecto.titulo}
            </h3>


            <p>
                Ebook • ${proyecto.autor}
            </p>


            <span>
                PIXELLAB Editorial
            </span>


            <button
            class="boton-accion"
            onclick="seleccionarProyectoEditorial('${proyecto.projectId}')">

                ✏️ Editar

            </button>

        </div>

        `;


        contenedor.appendChild(
            tarjeta
        );


        const imagen =
            tarjeta.querySelector(
                ".portada-editorial"
            );


        const rutaPortada =
            `proyectos/${proyecto.projectId}/imagenes/portada.png`;


        const urlPortada =
            `${R2_EBOOKS_URL}/${rutaPortada}`;


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Verificando portada",
            urlPortada,
                    "monitorEditor"
        );


        await new Promise((resolve) => {


            imagen.onload = () => {


                monitorPIXELLAB(
                    "Editorial",
                    "estado",
                    "Portada encontrada",
                    proyecto.titulo,
                            "monitorEditor"
                );


                resolve();

            };


            imagen.onerror = async () => {


                monitorPIXELLAB(
                    "Editorial",
                    "proceso",
                    "Generando portada",
                    proyecto.titulo
                );


                const nuevaPortada =
                    await generarPortadaProyecto(
                        proyecto
                    );


                if (nuevaPortada) {


                    imagen.src =
                        `${R2_EBOOKS_URL}/${nuevaPortada}`;


                    monitorPIXELLAB(
                        "Editorial",
                        "estado",
                        "Portada cargada",
                        nuevaPortada,
                                "monitorEditor"
                    );

                }


                resolve();

            };


            imagen.src = urlPortada;


        });


    }
monitorPIXELLAB(
    "Editorial",
    "ok",
    "Array Editorial",
    `${bibliotecaEditorial.length} eBooks cargados en memoria`,
            "monitorEditor"
);

for (const libro of bibliotecaEditorial) {

    monitorPIXELLAB(
        "Editorial",
        "info",
        libro.projectId,
        `${libro.titulo} | ${libro.paginas} páginas`,
                "monitorEditor"
        
    );

}

    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Biblioteca mostrada",
        "Cantidad de eBooks renderizados: " + cantidad,
                "monitorEditor"
    );


}
}
//=====================================================
// PIXELLAB45 EDITORIAL
// FUNCIÓN: cargarBibliotecaEditorial()
// Descripción:
// Carga los eBooks disponibles para edición.
// Lee proyectos finalizados desde R2.
// Construye las tarjetas de biblioteca.
//=====================================================

/*async function cargarBibliotecaEditorial() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Biblioteca",
        "Iniciando carga de biblioteca editorial",
              "monitorEditor"
    );


    try {


        const respuesta =
            await fetch(
                WORKER_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        action: "listar-ebooks"
                    })
                }
            );



        const datos =
            await respuesta.json();



        if (!datos.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Biblioteca",
                "No se pudieron cargar los eBooks",
                      "monitorEditor"
                
            );


            return;

        }



        const contenedor =
            document.getElementById(
                "bibliotecaEditorial"
            );


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



        datos.ebooks.forEach(
            ebook => {


                const tarjeta =
                    document.createElement(
                        "article"
                    );

monitorPIXELLAB(
    "Editorial",
    "info",
    "Portada",
    "Ruta: " + ebook.portada,
    "monitorEditor"
);

                tarjeta.className =
                    "editorial-card";



                tarjeta.innerHTML = `

                <div class="editorial-cover">

                    <img 
                    src="${ebook.portada || ''}"
                    alt="${ebook.titulo}"
                    >

                </div>


                <div class="editorial-info">

                    <h3>
                    ${ebook.titulo}
                    </h3>

                    <p>
                    Ebook • Editorial
                    </p>

                    <span>
                    PIXELLAB Editorial
                    </span>


                    <button 
                    class="boton-accion"
                    onclick="abrirEditor('${ebook.projectId}')">

                    ✏️ Editar

                    </button>

                </div>

                `;



                contenedor.appendChild(
                    tarjeta
                );


            }
        );



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Biblioteca",
            "Biblioteca cargada correctamente: " +
            datos.ebooks.length +
            " eBooks",
                  "monitorEditor"
        );


    } catch(error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Biblioteca",
            error.message,
                  "monitorEditor"
        );


    }

}*/
async function cargarPaginaPortada(proyecto) {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Portada",
        "Cargando portada"
    );

    const pagina = document.getElementById("paginaEditor");

    if (!pagina) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Portada",
            "No existe paginaEditor"
        );

        return;

    }

    pagina.innerHTML = "";

    const hoja = document.createElement("div");
    hoja.className = "pl45-hoja-portada";

    const img = document.createElement("img");

    img.src = `${WORKER_URL}/proyectos/${proyecto.projectId}/portada.png`;

    img.alt = proyecto.titulo || "Portada";
    img.className = "portada-editor";

    hoja.appendChild(img);
    pagina.appendChild(hoja);

    monitorPIXELLAB(
        "Editorial",
        "estado",
        "Portada",
        "Portada cargada"
    );

}

async function generarPortadaProyecto(proyecto) {

    try {

        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Inicio",
            "Comenzando generación de portada para: " + proyecto.titulo
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
            "Prompt base generado para portada"
        );


        // 2. Mejorar prompt con Visuales
        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Visuales",
            "Enviando prompt al generador de visuales"
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
            "Prompt visual recibido correctamente"
        );


        // 3. Generar imagen
        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Generando imagen",
            "Enviando solicitud a Imagen 4"
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
    promptImagenFinal
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
            "Imagen convertida a Base64"
        );


        // 5. Guardar en R2
        const ruta =
            `proyectos/${proyecto.projectId}/imagenes/portada.png`;


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Guardando",
            ruta
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
            "Portada guardada correctamente"
        );


        return ruta;


    } catch(error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Generación portada",
            error.message
        );


        console.error(error);


        return null;

    }

}
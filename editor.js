
async function mostrarProyectosEditorial(proyectos) {

    const contenedor =
        document.getElementById(
            "bibliotecaEditorial"
        );

    contenedor.innerHTML = "";

    for (const proyecto of proyectos) {

        const tarjeta =
            document.createElement("article");

        tarjeta.className =
            "editorial-card";

        const imagen =
            document.createElement("img");

        const rutaPortada =
            `proyectos/${proyecto.projectId}/imagenes/portada.png`;

        const urlPortada =
            `${R2_EBOOKS_URL}/${rutaPortada}`;

        imagen.src = urlPortada;

        imagen.onerror = async () => {

            const nuevaPortada =
                await generarPortadaProyecto(
                    proyecto
                );

            if (nuevaPortada) {

                imagen.src =
                    `${R2_EBOOKS_URL}/${nuevaPortada}`;

            }

        };

        const info =
            document.createElement("div");

        info.className =
            "editorial-info";

        info.innerHTML = `
            <h3>${proyecto.titulo}</h3>
            <p>${proyecto.autor}</p>
            <button class="boton-accion">
                ✏️ Editar
            </button>
        `;

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(info);

        contenedor.appendChild(tarjeta);

    }

}
async function cargarGaleriaEditorial() {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Biblioteca",
        "Cargando proyectos",
        "monitorEditor"
    );

    try {

        const respuesta = await fetch(
            WORKER_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "listar-proyectos"
                })
            }
        );

        const datos = await respuesta.json();

        if (!datos.ok) {

            monitorPIXELLAB(
                "Editorial",
                "error",
                "Biblioteca",
                "No se pudieron obtener proyectos",
                      "monitorEditor"
            );

            return;

        }

        mostrarProyectosEditorial(
            datos.proyectos || []
        );

    } catch (error) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Biblioteca",
            error.message,
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

async function cargarBibliotecaEditorial() {


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

}
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
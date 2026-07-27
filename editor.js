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
        "Iniciando carga de biblioteca editorial"
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
                "No se pudieron cargar los eBooks"
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
                "No existe bibliotecaEditorial"
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
            " eBooks"
        );


    } catch(error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Biblioteca",
            error.message
        );


    }

}

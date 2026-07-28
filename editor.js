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

        const tarjeta = document.createElement("article");

        tarjeta.className = "editorial-card";

        tarjeta.innerHTML = `

        <div class="editorial-cover">

            <img
                class="portada-editorial"
                src="${R2_EBOOKS_URL}/proyectos/${libro.projectId}/portada.png">

        </div>

        <div class="editorial-info">

            <h3>${libro.titulo}</h3>

            <p>Ebook • ${libro.autor}</p>

            <span>PIXELLAB Editorial</span>

            <button
                class="boton-accion"
                onclick="seleccionarProyectoEditorial('${libro.projectId}')">

                ✏️ Editar

            </button>

        </div>

        `;

        contenedor.appendChild(tarjeta);

    }

    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Biblioteca",
        `${bibliotecaEditorial.length} tarjetas creadas`,
        "monitorEditor"
    );

}

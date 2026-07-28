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
        "Solicitando proyectos al Worker",
        "monitorEditor"
    );

    const respuesta = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "listar-ebooks"
        })
    });

    const datos = await respuesta.json();

    if (!datos.success) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Biblioteca",
            "No se pudieron obtener los proyectos",
            "monitorEditor"
        );

        return;

    }

    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Biblioteca",
        `${datos.proyectos.length} proyectos encontrados`,
        "monitorEditor"
    );

    cargarBibliotecaEditorial(datos.proyectos);

    mostrarTarjetasEditorial();

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



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
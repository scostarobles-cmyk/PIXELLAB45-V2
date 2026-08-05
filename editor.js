monitorPIXELLAB(
    "Editorial",
    "ok",
    "Editor",
    "editor.js cargado correctamente",
    "monitorEditor"
);
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
    generarTarjetasEditor();

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
    JSON.stringify(datos, null, 2),
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


    for (libro of biblioteca) {


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
        `${biblioteca.length} tarjetas generadas`,
        "monitorEditor"
    );

}
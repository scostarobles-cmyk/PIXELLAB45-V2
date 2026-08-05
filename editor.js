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


monitorPIXELLAB(
    "Editorial",
    "ok",
    "Editor",
    "Inicialización completa. Esperando siguiente paso...",
    "monitorEditor"
);
/*function iniciarEditor(){

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Inicio",
        "Entró a iniciarEditor()",
        "monitorEditor"
    );
         
  //       await cargarBiblioteca();

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
                        action: "listar-ebooks"
                    })
                }
            );

        const datos =
            await respuesta.json();


        if(
            !datos.ok
        ){

            monitorPIXELLAB(
                "Editorial",
                "error",
                "Biblioteca",
                "El Worker devolvió error",
                "monitorEditor"
            );

            return;

        }


        biblioteca =
            datos.biblioteca || datos.ebooks || {};


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Biblioteca",
            "Biblioteca cargada correctamente",
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


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Biblioteca",
            "Salió de cargarBiblioteca()",
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

}+/
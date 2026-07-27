monitorPIXELLAB(
    "Editorial",
    "debug",
    "EditorJS",
    "editor.js cargado",
    "monitorEditor"
);


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



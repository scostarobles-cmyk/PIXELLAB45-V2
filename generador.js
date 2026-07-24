/* ==========================================================
   PIXELLAB45
   GENERADOR EDITORIAL
   BLOQUE 1
   Variables globales y utilidades
========================================================== */

//=====================================================
// VARIABLES GLOBALES
//=====================================================

let proyectoActual = null;
let projectIdActual = null;
let plan = null;

// Control de generación de capítulos

let preguntarContinuarCapitulos = true;
let continuarCapitulosAutomatico = false;


//=====================================================
// MOSTRAR ESTADO EDITORIAL
//=====================================================

function mostrarEstadoEditorial(
    mensaje,
    esError = false
) {

    const contenedor = esError
        ? document.getElementById("errorEditorial")
        : document.getElementById("estadoEditorial");

    if (!contenedor) return;

    contenedor.textContent = mensaje;
    contenedor.style.display = "block";

}


//=====================================================
// OBTENER DATOS DEL FORMULARIO
//=====================================================

function obtenerDatosFormulario() {

    return {

        tema:
            document.getElementById("temaEbook")
            ?.value.trim() || "",

        autor:
            document.getElementById("autorEbook")
            ?.value.trim() || "",

        paginas:
            parseInt(
                document.getElementById("paginasEbook")
                ?.value
            ) || 100,

        idioma:
            document.getElementById("idiomaEbook")
            ?.value || "Español",

        tono:
            document.getElementById("tonoEbook")
            ?.value || "Profesional",

        publico:
            document.getElementById("publicoEbook")
            ?.value || "General"

    };

}




//=====================================================
// FUNCIÓN: crearProyecto()
// Descripción:
// Crea un nuevo proyecto editorial y lo guarda en R2.
//=====================================================

async function crearProyecto() {

    botonVerde("btnProyecto");
    actualizarIndicador(
        "estadoProyecto",
        "verde"
    );

    botonAzul("btnPlan");
    actualizarIndicador(
        "estadoPlan",
        "azul"
    );

    habilitarBoton("btnPlan");


    const btn =
        document.getElementById("btnProyecto");

    const estado =
        document.getElementById("estadoProyecto");


    const datos =
        obtenerDatosFormulario();


    if (!datos.tema) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Proyecto",
            "Debe ingresar el título del eBook"
        );

        return;

    }


    if (!datos.autor) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Proyecto",
            "Debe ingresar el autor"
        );

        return;

    }


    btn.disabled = true;
    btn.innerHTML = "📁 Generando proyecto...";


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Proyecto",
        "Creando proyecto..."
    );


    try {

        const projectId =
            "PROY-" + Date.now();


        const proyecto = {

            projectId,

            titulo: datos.tema,

            autor: datos.autor,

            paginas: datos.paginas,

            idioma: datos.idioma,

            tono: datos.tono,

            publico: datos.publico,

            estado: "produccion",

            estructura: {

                plan: "pendiente",

                indice: "pendiente",

                legales: "pendiente",

                introduccion: "pendiente",

                capitulos: "pendiente",

                conclusion: "pendiente"

            },

            fecha:
                new Date().toISOString()

        };


        const guardado =
            await guardarJSON(
                `proyectos/${projectId}/proyecto.json`,
                proyecto
            );


        if (!guardado) {

            throw new Error(
                "No se pudo guardar proyecto.json"
            );

        }


        proyectoActual = proyecto;
        projectIdActual = projectId;


        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Proyecto",
            "Proyecto creado correctamente: " +
            projectId
        );


        mostrarEstadoEditorial(
            `Proyecto "${datos.tema}" creado correctamente.`
        );


        estado.innerHTML =
            "🟢 Proyecto creado";


        btn.classList.add("completo");
        btn.innerHTML = "✅ Proyecto creado";


        await verificarProyecto();


    } catch (err) {

        console.error(err);


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Proyecto",
            err.message
        );


        mostrarEstadoEditorial(
            err.message,
            true
        );


        estado.innerHTML = "🔴 Error";


        btn.innerHTML = "❌ Error";


        btn.disabled = false;

    }

}

//=====================================
// GENERAR PLAN
//=====================================

async function generarPlan2() {

    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Plan",
        "Iniciando generación de plan"
    );


    if (!projectIdActual) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Plan",
            "No existe proyecto activo"
        );

        return;

    }


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
                        action: "generar-plan"
                    })

                }
            );



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Plan",
            "Respuesta recibida del Worker"
        );



        const datos =
            await respuesta.json();



        if (!datos.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Plan",
                "Error generando plan"
            );


            monitorPIXELLAB(
                "Editorial",
                "info",
                "Respuesta Worker",
                JSON.stringify(datos)
            );


            return;

        }



        plan =
            datos.plan || datos.json || null;



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Plan",
            "Plan generado correctamente"
        );



        actualizarIndicador(
            "estadoPlan",
            "verde"
        );



        const btn =
            document.getElementById(
                "btnPlan"
            );


        if (btn) {

            btn.classList.add(
                "completo"
            );


            btn.innerHTML =
                "✅ Plan generado";


            btn.disabled = true;

        }



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Verificación",
            "Actualizando estado del proyecto"
        );


        await verificarProyecto();



    } catch(error) {


        console.error(error);


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Plan",
            "Error comunicando con Worker: " +
            error.message
        );


    }

}

//=====================================
// GENERAR ÍNDICE
//=====================================

async function generarIndice() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Índice",
        "Iniciando generación de índice"
    );


    if (!projectIdActual) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Índice",
            "No existe proyecto activo"
        );


        return;

    }



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

                        action: "generar-indice"

                    })

                }
            );



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Índice",
            "Respuesta recibida del Worker"
        );



        const datos =
            await respuesta.json();



        if (!datos.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Índice",
                "Error generando índice"
            );


            monitorPIXELLAB(
                "Editorial",
                "info",
                "Respuesta Worker",
                JSON.stringify(datos)
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Índice",
            "Índice generado correctamente"
        );



        actualizarIndicador(
            "estadoIndice",
            "verde"
        );



        const btn =
            document.getElementById(
                "btnIndice"
            );


        if (btn) {


            btn.classList.add(
                "completo"
            );


            btn.innerHTML =
                "✅ Índice generado";


            btn.disabled = true;


        }



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Verificación",
            "Actualizando estado del proyecto"
        );



        await verificarProyecto();



    } catch(error) {


        console.error(error);


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Índice",
            "Error de conexión: " +
            error.message
        );


    }

}

//=====================================
// GENERAR LEGALES
//=====================================

async function generarLegales() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Legales",
        "Iniciando generación de legales"
    );


    if (!projectIdActual) {

        monitorPIXELLAB(
            "Editorial",
            "error",
            "Legales",
            "No existe proyecto activo"
        );

        return;

    }


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

                        action: "generar-legales"

                    })

                }
            );



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Legales",
            "Respuesta recibida del Worker"
        );



        const datos =
            await respuesta.json();



        if (!datos.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Legales",
                "Error generando legales: " +
                datos.error
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Legales",
            "Legales generado correctamente"
        );



        if (
            typeof actualizarIndicador === "function"
        ) {

            actualizarIndicador(
                "estadoLegales",
                "verde"
            );

        }



        const btn =
            document.getElementById(
                "btnLegales"
            );


        if (btn) {

            btn.classList.add(
                "completo"
            );


            btn.innerHTML =
                "✅ Legales generado";


            btn.disabled = true;

        }



        if (
            typeof verificarProyecto === "function"
        ) {

            await verificarProyecto();

        }



    } catch(error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Legales",
            "Error de conexión: " +
            error.message
        );


    }

}

//=====================================
// GENERAR INTRODUCCIÓN
//=====================================

async function generarIntroduccion() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Introducción",
        "Iniciando generación de introducción"
    );


    if (!projectIdActual) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Introducción",
            "No existe proyecto activo"
        );


        return;

    }



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

                        action: "generar-introduccion"

                    })

                }
            );



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Introducción",
            "Respuesta recibida del Worker"
        );



        const datos =
            await respuesta.json();



        if (!datos.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Introducción",
                "Error generando introducción: " +
                datos.error
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Introducción",
            "Introducción creada correctamente"
        );



        if (
            typeof actualizarIndicador === "function"
        ) {


            actualizarIndicador(
                "estadoIntro",
                "verde"
            );

        }



        const btn =
            document.getElementById(
                "btnIntroduccion"
            );


        if (btn) {


            btn.classList.add(
                "completo"
            );


            btn.innerHTML =
                "✅ Introducción generada";


            btn.disabled = true;


        }



        if (
            typeof verificarProyecto === "function"
        ) {


            await verificarProyecto();


        }



    } catch(error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Introducción",
            "Error de conexión: " +
            error.message
        );


    }

}

//=====================================
// GENERAR CAPÍTULOS
//=====================================

async function generarCapitulos() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Capítulos",
        "Iniciando generación de capítulo"
    );


    if (!projectIdActual) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Capítulos",
            "No existe proyecto activo"
        );


        return;

    }



    if (typeof botonAmarillo === "function") {

        botonAmarillo(
            "btnCapitulos"
        );

    }


    if (typeof actualizarIndicador === "function") {

        actualizarIndicador(
            "estadoCapitulos",
            "amarillo"
        );

    }



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

                        action: "generar-capitulo"

                    })

                }
            );



        const resultado =
            await respuesta.json();



        if (!resultado.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Capítulos",
                "Error generando capítulo: " +
                resultado.error
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Capítulos",
            `Capítulo ${resultado.numero} generado correctamente`
        );



        //=====================================
        // MODO MANUAL
        //=====================================

        if (preguntarContinuarCapitulos) {


            preguntarSiguienteCapitulo();


            return;

        }



        //=====================================
        // MODO AUTOMÁTICO
        //=====================================


        const planActual =
            await cargarJSON(
                `proyectos/${projectIdActual}/plan.json`
            );



        if (
            !planActual ||
            !planActual.capitulos
        ) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Capítulos",
                "No se pudo cargar plan.json"
            );


            return;

        }



        const pendientes =
            planActual.capitulos.some(
                capitulo =>
                    capitulo.estado !== "creado"
            );



        if (pendientes) {


            monitorPIXELLAB(
                "Editorial",
                "proceso",
                "Capítulos",
                "Continuando siguiente capítulo"
            );


            await generarCapitulos();


        } else {


            monitorPIXELLAB(
                "Editorial",
                "ok",
                "Capítulos",
                "Todos los capítulos generados"
            );


            if (
                typeof actualizarIndicador === "function"
            ) {

                actualizarIndicador(
                    "estadoCapitulos",
                    "verde"
                );

            }


            await verificarProyecto();


        }



    } catch(error) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Capítulos",
            error.message
        );


    }

}
function preguntarSiguienteCapitulo() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Capítulos",
        "Mostrando ventana de continuación"
    );


    // Evitar duplicar el modal
    if (document.getElementById("modalCapitulos")) {

        monitorPIXELLAB(
            "Editorial",
            "aviso",
            "Capítulos",
            "Modal ya existente"
        );

        return;
    }



    // Agregar estilos una sola vez
    if (!document.getElementById("estiloModalCapitulos")) {


        const style = document.createElement("style");

        style.id = "estiloModalCapitulos";


        style.textContent = `

#modalCapitulos{

    position:fixed;
    inset:0;
    background:rgba(0,0,0,.75);

    display:flex;
    justify-content:center;
    align-items:center;

    z-index:99999;

    backdrop-filter:blur(4px);

}

#modalCapitulos .ventana{

    width:420px;
    max-width:90%;

    background:#111827;

    border:2px solid #00d9ff;
    border-radius:16px;

    padding:25px;

    box-shadow:0 0 30px rgba(0,217,255,.45);

    color:#fff;

    font-family:Arial,sans-serif;

}

#modalCapitulos h2{

    margin:0 0 15px;

    color:#00d9ff;

    text-align:center;

}

#modalCapitulos p{

    text-align:center;
    line-height:1.5;

}

#modalCapitulos label{

    display:flex;
    align-items:center;
    gap:10px;

    margin:20px 0;

}

#modalCapitulos .botones{

    display:flex;
    justify-content:center;
    gap:15px;

    margin-top:20px;

}

#modalCapitulos button{

    padding:10px 20px;

    border:none;
    border-radius:8px;

    cursor:pointer;

    font-size:15px;
    font-weight:bold;

}

#btnContinuarCapitulo{

    background:#00d9ff;
    color:#000;

}

#btnPausarCapitulo{

    background:#444;
    color:#fff;

}

#modalCapitulos button:hover{

    transform:scale(1.05);

}

`;

        document.head.appendChild(style);

    }



    const overlay = document.createElement("div");

    overlay.id = "modalCapitulos";


    overlay.innerHTML = `

<div class="ventana">

<h2>📖 Capítulo generado</h2>

<p>
El capítulo se generó correctamente.<br><br>
¿Desea continuar con el siguiente capítulo?
</p>


<label>

<input
type="checkbox"
id="chkNoPreguntarCapitulos"
>

No volver a preguntar durante este Ebook

</label>


<div class="botones">


<button id="btnContinuarCapitulo">

▶ Continuar

</button>


<button id="btnPausarCapitulo">

⏸ Pausar

</button>


</div>

</div>

`;



    document.body.appendChild(overlay);



    //-------------------------------
    // CONTINUAR
    //-------------------------------

    document.getElementById(
        "btnContinuarCapitulo"
    ).onclick = async () => {


        const chk =
            document.getElementById(
                "chkNoPreguntarCapitulos"
            );


        if (chk.checked) {

            preguntarContinuarCapitulos = false;

            continuarCapitulosAutomatico = true;


            monitorPIXELLAB(
                "Editorial",
                "estado",
                "Capítulos",
                "Modo automático activado"
            );

        }


        overlay.remove();


        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Capítulos",
            "Continuando generación"
        );


        await generarCapitulos();

    };



    //-------------------------------
    // PAUSAR
    //-------------------------------

    document.getElementById(
        "btnPausarCapitulo"
    ).onclick = () => {


        overlay.remove();


        monitorPIXELLAB(
            "Editorial",
            "aviso",
            "Capítulos",
            "Generación pausada por usuario"
        );


    };


}

//=====================================
// GENERAR CONCLUSIÓN
//=====================================

async function generarConclusion() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Conclusión",
        "Iniciando generación de conclusión"
    );


    if (!projectIdActual) {


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Conclusión",
            "No existe proyecto activo"
        );


        return;

    }



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

                        action: "generar-conclusion"

                    })

                }
            );



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Conclusión",
            "Respuesta recibida del Worker"
        );



        const resultado =
            await respuesta.json();



        if (!resultado.ok) {


            monitorPIXELLAB(
                "Editorial",
                "error",
                "Conclusión",
                "Error generando conclusión: " +
                resultado.error
            );


            monitorPIXELLAB(
                "Editorial",
                "info",
                "Respuesta Worker",
                JSON.stringify(resultado)
            );


            return;

        }



        monitorPIXELLAB(
            "Editorial",
            "ok",
            "Conclusión",
            "Conclusión creada correctamente"
        );



        if (
            typeof actualizarEstadoProyecto === "function"
        ) {


            actualizarEstadoProyecto(
                "conclusion",
                "creado"
            );


        }



        if (
            typeof actualizarIndicador === "function"
        ) {


            actualizarIndicador(
                "estadoConclusion",
                "verde"
            );


        }



        const btn =
            document.getElementById(
                "btnConclusion"
            );


        if (btn) {


            btn.classList.add(
                "completo"
            );


            btn.innerHTML =
                "✅ Conclusión generada";


            btn.disabled = true;


        }



        monitorPIXELLAB(
            "Editorial",
            "proceso",
            "Verificación",
            "Actualizando estado final del proyecto"
        );



        await verificarProyecto();



    } catch(error) {


        console.error(error);


        monitorPIXELLAB(
            "Editorial",
            "error",
            "Conclusión",
            "Error de conexión: " +
            error.message
        );


    }

}

//=====================================
// RESTAURAR INTERFAZ
//=====================================

function restaurarInterfaz() {


    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Restaurar",
        "Restaurando interfaz editorial"
    );



    //==========================
    // Limpiar variables
    //==========================

    proyectoActual = null;
    projectIdActual = null;
    plan = null;



    //==========================
    // Restaurar indicadores
    //==========================

    const indicadores = [

        "estadoProyecto",
        "estadoPlan",
        "estadoIndice",
        "estadoLegales",
        "estadoIntro",
        "estadoCapitulos",
        "estadoConclusion"

    ];


    indicadores.forEach(
        id => {

            if (
                typeof actualizarIndicador === "function"
            ) {

                actualizarIndicador(
                    id,
                    "blanco"
                );

            }

        }
    );



    //==========================
    // Restaurar botones
    //==========================

    const botones = [

        "btnProyecto",
        "btnPlan",
        "btnIndice",
        "btnLegales",
        "btnIntroduccion",
        "btnCapitulos",
        "btnConclusion"

    ];


    botones.forEach(
        id => {

            if (
                typeof botonNormal === "function"
            ) {

                botonNormal(id);

            }

        }
    );



    //==========================
    // Estado botones
    //==========================


    if (
        typeof habilitarBoton === "function"
    ) {

        habilitarBoton(
            "btnProyecto"
        );

    }



    const bloquear = [

        "btnPlan",
        "btnIndice",
        "btnLegales",
        "btnIntroduccion",
        "btnCapitulos",
        "btnConclusion"

    ];
 

    bloquear.forEach(
        id => {

            if (
                typeof deshabilitarBoton === "function"
            ) {

                deshabilitarBoton(id);

            }

        }
    );



    monitorPIXELLAB(
        "Editorial",
        "ok",
        "Restaurar",
        "Sistema listo para crear nuevo eBook"
    );

}

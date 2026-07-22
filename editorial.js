monitorPIXELLAB(
    "Editorial",
    "info",
    "Carga",
    "editorial.js ejecutándose"
);

// =====================================
// PIXELLAB EDITORIAL - VARIABLES
// =====================================
let proyectoActual = null;
let projectIdActual = null;
let continuarCapitulosAutomatico = false;
let preguntarContinuarCapitulos = true;
let bibliotecaEditorial = [];
let proyectoEditorialActivo = null;

const SECCIONES_LIBRO = [
    "portada",
    "legales",
    "indice",
    "introduccion",
    "capitulos",
    "conclusion"
];

monitorPIXELLAB(
    "Editorial",
    "info",
    "Carga script",
    "editorial.js comenzó a ejecutarse",
    "monitorBotonera"
);

// =====================================
// ARRANQUE DEL MÓDULO EDITORIAL
// =====================================
async function iniciarCargaEditorial() {
    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Módulo Editorial iniciado"
    );

    await verificarProyecto();
    await cargarGaleriaEditorial();
}

window.addEventListener(
    "load",
    iniciarCargaEditorial
);
// =====================================
// VERIFICAR PROYECTO (CORREGIDO)
// =====================================
async function verificarProyecto() {
    monitorPIXELLAB(
        "Editorial",
        "proceso",
        "Verificación",
        "Entró a verificarProyecto"
    );

    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "verificar-proyecto"
            })
        });

        const datos = await respuesta.json();

        monitorPIXELLAB(
            "Editorial",
            "debug",
            "Respuesta Worker",
            JSON.stringify(datos)
        );

        limpiarMonitorPIXELLAB();

        const proyectoCreado = datos.proyectoCreado;
        const proyectoProduccion = datos.proyectoProduccion;

        if (proyectoCreado) {
            monitorPIXELLAB("Editorial", "estado", "Proyecto creado", "Proyecto finalizado disponible");
            monitorPIXELLAB("Editorial", "info", "Título", proyectoCreado.titulo);
            monitorPIXELLAB("Editorial", "info", "ID", proyectoCreado.projectId);

            if (proyectoCreado.fecha) {
                monitorPIXELLAB("Editorial", "info", "Fecha", proyectoCreado.fecha);
            }

            actualizarIndicador("estadoProyecto", "azul");
            botonAzul("btnProyecto");
            habilitarBoton("btnProyecto");
        }

        if (proyectoProduccion) {
            proyectoActual = proyectoProduccion;
            projectIdActual = proyectoActual.projectId;

            actualizarIndicador("estadoProyecto", "verde");
            botonVerde("btnProyecto");
            deshabilitarBoton("btnProyecto");

            // PLAN
            if (proyectoActual.estructura.plan === "creado") {
                actualizarIndicador("estadoPlan", "verde");
                botonVerde("btnPlan");
                deshabilitarBoton("btnPlan");
            } else {
                actualizarIndicador("estadoPlan", "azul");
                botonAzul("btnPlan");
                habilitarBoton("btnPlan");
            }

            // INDICE
            if (proyectoActual.estructura.indice === "creado") {
                actualizarIndicador("estadoIndice", "verde");
                botonVerde("btnIndice");
                deshabilitarBoton("btnIndice");
            } else {
                actualizarIndicador("estadoIndice", "azul");
                botonAzul("btnIndice");
                habilitarBoton("btnIndice");
            }

            // LEGALES
            if (proyectoActual.estructura.legales === "creado") {
                actualizarIndicador("estadoLegales", "verde");
                botonVerde("btnLegales");
                deshabilitarBoton("btnLegales");
            } else {
                actualizarIndicador("estadoLegales", "azul");
                botonAzul("btnLegales");
                habilitarBoton("btnLegales");
            }

            // INTRODUCCION
            if (proyectoActual.estructura.introduccion === "creado") {
                actualizarIndicador("estadoIntro", "verde");
                botonVerde("btnIntroduccion");
                deshabilitarBoton("btnIntroduccion");
            } else {
                actualizarIndicador("estadoIntro", "azul");
                botonAzul("btnIntroduccion");
                habilitarBoton("btnIntroduccion");
            }

            const plan = await cargarJSON(`proyectos/${projectIdActual}/plan.json`);

            // CAPITULOS
            if (proyectoActual.estructura.capitulos === "pendiente") {
                actualizarIndicador("estadoCapitulos", "azul");
                botonAzul("btnCapitulos");
                habilitarBoton("btnCapitulos");
            } else if (proyectoActual.estructura.capitulos === "produccion") {
                actualizarIndicador("estadoCapitulos", "amarillo");
                botonAmarillo("btnCapitulos");
                habilitarBoton("btnCapitulos");

                if (plan && plan.capitulos) {
                    for (const capitulo of plan.capitulos) {
                        if (capitulo.estado !== "creado") {
                            if (typeof preguntarSiguienteCapitulo === "function" && preguntarContinuarCapitulos) {
                                preguntarSiguienteCapitulo();
                            }
                            break;
                        }
                    }
                }
            } else if (proyectoActual.estructura.capitulos === "creado") {
                actualizarIndicador("estadoCapitulos", "verde");
                botonVerde("btnCapitulos");
                deshabilitarBoton("btnCapitulos");
            }

            // CONCLUSION
            if (proyectoActual.estructura.conclusion === "creado") {
                actualizarIndicador("estadoConclusion", "verde");
                botonVerde("btnConclusion");
                deshabilitarBoton("btnConclusion");
            } else {
                actualizarIndicador("estadoConclusion", "azul");
                botonAzul("btnConclusion");
                habilitarBoton("btnConclusion");
            }
        }

        if (!proyectoCreado && !proyectoProduccion) {
            actualizarIndicador("estadoProyecto", "azul");
            botonAzul("btnProyecto");
            habilitarBoton("btnProyecto");
        }

    } catch (error) {
        console.error(error);
        monitorPIXELLAB("Editorial", "error", "Verificar proyecto", error.message);
    }
}


// =====================================
// NAVEGACIÓN Y VISTAS EDITOR
// =====================================
function activarModoEditor() {
    const vistaPrincipal = document.getElementById("vista-principal");
    const vistaEditor = document.getElementById("vista-editor");

    if (vistaPrincipal) vistaPrincipal.style.display = "none";
    if (vistaEditor) vistaEditor.style.display = "block";
}

function cerrarEditor() {
    const vistaPrincipal = document.getElementById("vista-principal");
    const vistaEditor = document.getElementById("vista-editor");

    if (vistaPrincipal) vistaPrincipal.style.display = "block";
    if (vistaEditor) vistaEditor.style.display = "none";
}

async function seleccionarProyectoEditorial(projectId) {
    monitorPIXELLAB("Editorial", "proceso", "Abriendo proyecto", projectId);

    const proyecto = bibliotecaEditorial.find(p => p.projectId === projectId);

    if (!proyecto) {
        monitorPIXELLAB("Editorial", "error", "Proyecto", "No encontrado");
        return;
    }

    proyectoEditorialActivo = projectId;
    activarModoEditor();

    const tituloEditor = document.querySelector("#editorTrabajo h2");
    if (tituloEditor) {
        tituloEditor.textContent = "✏️ " + proyecto.titulo;
    }

    await cargarLibroCompleto(proyecto);
}

// =====================================
// GENERACIÓN DE CONTENIDO (MOTORES)
// =====================================
async function crearProyecto() {
    botonVerde("btnProyecto");
    actualizarIndicador("estadoProyecto", "verde");
    botonAzul("btnPlan");
    actualizarIndicador("estadoPlan", "azul");
    habilitarBoton("btnPlan");

    const btn = document.getElementById("btnProyecto");
    const estado = document.getElementById("estadoProyecto");
    const tema = document.getElementById("temaEbook").value.trim();
    const autor = document.getElementById("autorEbook").value.trim();
    const paginas = parseInt(document.getElementById("paginasEbook").value);
    const idioma = document.getElementById("idiomaEbook").value;
    const tono = document.getElementById("tonoEbook").value;
    const publico = document.getElementById("publicoEbook").value;

    if (!tema || !autor) {
        monitorPIXELLAB("Editorial", "error", "Proyecto", "Complete el título y autor");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = "📁 Generando proyecto...";

    try {
        const projectId = "PROY-" + Date.now();
        const proyecto = {
            projectId,
            titulo: tema,
            autor,
            paginas,
            idioma,
            tono,
            publico,
            estado: "produccion",
            estructura: {
                indice: "pendiente",
                plan: "pendiente",
                legales: "pendiente",
                introduccion: "pendiente",
                capitulos: "pendiente",
                conclusion: "pendiente"
            },
            fecha: new Date().toISOString()
        };

        await guardarJSON(`proyectos/${projectId}/proyecto.json`, proyecto);

        proyectoActual = proyecto;
        projectIdActual = proyecto.projectId;

        estado.innerHTML = "🟢 Proyecto creado";
        btn.classList.add("completo");
        btn.innerHTML = "✅ Proyecto creado";

        await verificarProyecto();

    } catch(err) {
        console.error(err);
        monitorPIXELLAB("Editorial", "error", "Proyecto", err.message);
        estado.innerHTML = "🔴 Error";
        btn.innerHTML = "❌ Error";
        btn.disabled = false;
    }
}

async function generarPlan2() {
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generar-plan" })
        });
        const datos = await respuesta.json();
        if (datos.ok) await verificarProyecto();
    } catch (error) {
        console.error(error);
    }
}

async function generarIndice() {
    try {
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generar-indice" })
        });
        const data = await response.json();
        if (data.ok) await verificarProyecto();
    } catch (error) {
        console.error(error);
    }
}

async function generarLegales() {
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generar-legales" })
        });
        const resultado = await respuesta.json();
        if (resultado.ok) await verificarProyecto();
    } catch (error) {
        console.error(error);
    }
}

async function generarIntroduccion() {
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generar-introduccion" })
        });
        const resultado = await respuesta.json();
        if (resultado.ok) await verificarProyecto();
    } catch (error) {
        console.error(error);
    }
}

async function generarCapitulos() {
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generar-capitulo" })
        });
        const resultado = await respuesta.json();
        if (!resultado.ok) return;

        if (preguntarContinuarCapitulos) {
            preguntarSiguienteCapitulo();
        } else {
            const plan = await cargarJSON(`proyectos/${projectIdActual}/plan.json`);
            if (plan && plan.capitulos && plan.capitulos.some(c => c.estado !== "creado")) {
                await generarCapitulos();
            } else {
                await verificarProyecto();
            }
        }
    } catch (error) {
        console.error(error);
    }
}

async function generarConclusion() {
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generar-conclusion" })
        });
        const resultado = await respuesta.json();
        if (resultado.ok) await verificarProyecto();
    } catch (error) {
        console.error(error);
    }
}

// =====================================
// UTILIDADES JSON & MONITOR
// =====================================
async function cargarJSON(ruta) {
    const respuesta = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cargar-json", ruta })
    });
    const datos = await respuesta.json();
    return datos.ok ? datos.json : null;
}

async function guardarJSON(ruta, datos) {
    const respuesta = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "guardar-json", ruta, json: datos })
    });
    const resultado = await respuesta.json();
    return resultado.ok;
}

function limpiarMonitorPIXELLAB() {
    const monitor = document.getElementById("monitorPIXELLAB");
    if (monitor) monitor.innerHTML = "";
}

// =====================================
// CARGA Y MAQUETACIÓN DE PÁGINAS A4
// =====================================
async function cargarGaleriaEditorial() {
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "listar-ebooks" })
        });
        const data = await respuesta.json();
        if (data.ok) mostrarProyectosEditorial(data.ebooks);
    } catch(error) {
        console.error(error);
    }
}

async function mostrarProyectosEditorial(proyectos) {
    const contenedor = document.getElementById("bibliotecaEditorial");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    if (!proyectos || proyectos.length === 0) {
        contenedor.innerHTML = "<p>No hay proyectos para editar</p>";
        return;
    }

    bibliotecaEditorial = [];

    for (const proyecto of proyectos) {
        bibliotecaEditorial.push({
            projectId: proyecto.projectId,
            titulo: proyecto.titulo,
            autor: proyecto.autor,
            paginas: proyecto.paginas,
            portada: `${R2_EBOOKS_URL}/proyectos/${proyecto.projectId}/imagenes/portada.png`,
            estructura: proyecto.estructura
        });

        const tarjeta = document.createElement("article");
        tarjeta.className = "editorial-card";
        tarjeta.innerHTML = `
            <div class="editorial-cover">
                <img class="portada-editorial">
            </div>
            <div class="editorial-info">
                <h3>${proyecto.titulo}</h3>
                <p>Ebook • ${proyecto.autor}</p>
                <span>PIXELLAB Editorial</span>
                <button class="boton-accion" onclick="seleccionarProyectoEditorial('${proyecto.projectId}')">✏️ Editar</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);

        const imagen = tarjeta.querySelector(".portada-editorial");
        const urlPortada = `${R2_EBOOKS_URL}/proyectos/${proyecto.projectId}/imagenes/portada.png`;

        imagen.onerror = async () => {
            const nuevaPortada = await generarPortadaProyecto(proyecto);
            if (nuevaPortada) imagen.src = `${R2_EBOOKS_URL}/${nuevaPortada}`;
        };
        imagen.src = urlPortada;
    }
}

async function cargarLibroCompleto(proyecto) {
    const editor = document.getElementById("paginaEditor");
    if (editor) editor.innerHTML = "";

    for (const seccion of SECCIONES_LIBRO) {
        await cargarSeccion(proyecto, seccion);
    }
}

async function cargarSeccion(proyecto, seccion) {
    switch (seccion) {
        case "portada":
            cargarPaginaPortada(proyecto);
            break;
        case "legales":
            await cargarPaginaLegales(proyecto);
            break;
        case "indice":
            await cargarPaginaIndice(proyecto);
            break;
        case "introduccion":
            await cargarPaginaIntroduccion(proyecto);
            break;
        case "capitulos":
            await cargarPaginaCapitulo(proyecto, 1, 8);
            break;
        case "conclusion":
            await cargarPaginaConclusion(proyecto);
            break;
    }
}

function cargarPaginaPortada(proyecto) {
    const pagina = document.getElementById("paginaEditor");
    if (!pagina) return;

    const hoja = document.createElement("div");
    hoja.className = "pl45-hoja-portada";
    Object.assign(hoja.style, {
        width: "210mm",
        height: "297mm",
        position: "relative",
        overflow: "hidden",
        margin: "0 auto 20px auto",
        background: "white"
    });

    const img = document.createElement("img");
    img.src = proyecto.portada;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    hoja.appendChild(img);
    pagina.appendChild(hoja);
}

async function cargarPaginaLegales(proyecto) {
    const legales = await cargarJSON(`proyectos/${proyecto.projectId}/legales.json`);
    if (!legales) return;

    const contenedor = document.getElementById("paginaEditor");
    const hoja = document.createElement("div");
    hoja.className = "pagina-editor";
    hoja.style.cssText = "background:#fff; color:#000; padding:40px; margin-bottom:20px; min-height:900px;";
    hoja.innerHTML = `<h1>Legales</h1><div style="white-space:pre-line;">${legales.contenido}</div>`;
    contenedor.appendChild(hoja);
}

async function cargarPaginaIndice(proyecto) {
    const indice = await cargarJSON(`proyectos/${proyecto.projectId}/indice.json`);
    if (!indice) return;

    const contenedor = document.getElementById("paginaEditor");
    const hoja = document.createElement("div");
    hoja.className = "pagina-editor";
    hoja.style.cssText = "background:#fff; color:#000; padding:40px; margin-bottom:20px; min-height:900px;";
    
    let html = `<h1>Índice</h1>`;
    if (indice.capitulos) {
        indice.capitulos.forEach(c => {
            html += `<p style="font-size:18px; margin-bottom:12px;">${c.numero}. ${c.titulo}</p>`;
        });
    }
    hoja.innerHTML = html;
    contenedor.appendChild(hoja);
}

async function cargarPaginaIntroduccion(proyecto) {
    const intro = await cargarJSON(`proyectos/${proyecto.projectId}/introduccion.json`);
    if (!intro) return;

    const contenedor = document.getElementById("paginaEditor");
    const hoja = document.createElement("div");
    hoja.className = "pagina-editor";
    hoja.style.cssText = "background:#fff; color:#000; padding:40px; margin-bottom:20px; min-height:900px;";
    hoja.innerHTML = `<h1>${intro.titulo}</h1><div style="white-space:pre-line; font-size:18px; line-height:1.6;">${intro.contenido}</div>`;
    contenedor.appendChild(hoja);
}

async function cargarPaginaCapitulo(proyecto, numeroCapitulo) {
    const archivo = `capitulo-${String(numeroCapitulo).padStart(3,"0")}.json`;
    const capitulo = await cargarJSON(`proyectos/${proyecto.projectId}/capitulos/${archivo}`);
    if (!capitulo) return;

    const contenedor = document.getElementById("paginaEditor");
    let paginaActual = null;
    const altoPagina = 900;

    function crearNuevaPagina() {
        const nuevaHoja = document.createElement("div");
        nuevaHoja.className = "pagina-editor";
        nuevaHoja.style.cssText = "background:#fff; color:#000; padding:40px; margin-bottom:20px; min-height:900px;";
        contenedor.appendChild(nuevaHoja);
        paginaActual = nuevaHoja;
    }

    function agregarBloque(elemento) {
        if (!paginaActual) crearNuevaPagina();
        paginaActual.appendChild(elemento);
        if (paginaActual.scrollHeight > altoPagina) {
            paginaActual.removeChild(elemento);
            crearNuevaPagina();
            paginaActual.appendChild(elemento);
        }
    }

    const titulo = document.createElement("h1");
    titulo.textContent = capitulo.titulo;
    agregarBloque(titulo);

    if (capitulo.introduccion) {
        const intro = document.createElement("div");
        intro.style.cssText = "font-size:18px; line-height:1.6; white-space:pre-line; margin-bottom:30px;";
        intro.textContent = capitulo.introduccion;
        agregarBloque(intro);
    }

    if (capitulo.secciones) {
        for (const sec of capitulo.secciones) {
            const secDiv = document.createElement("div");
            secDiv.innerHTML = `<h2 style="margin-top:30px;">${sec.numero}. ${sec.titulo}</h2><div style="font-size:18px; line-height:1.6; white-space:pre-line;">${sec.contenido}</div>`;
            agregarBloque(secDiv);
        }
    }

    if (capitulo.consejos && capitulo.consejos.length > 0) {
        const divConsejos = document.createElement("div");
        let listHTML = `<h2 style="margin-top:30px;">Consejos</h2><ul style="font-size:18px; line-height:1.6;">`;
        capitulo.consejos.forEach(c => listHTML += `<li>${c}</li>`);
        listHTML += `</ul>`;
        divConsejos.innerHTML = listHTML;
        agregarBloque(divConsejos);
    }
}

async function cargarPaginaConclusion(proyecto) {
    const conclusion = await cargarJSON(`proyectos/${proyecto.projectId}/conclusion.json`);
    if (!conclusion) return;

    const contenedor = document.getElementById("paginaEditor");
    const hoja = document.createElement("div");
    hoja.className = "pagina-editor";
    hoja.style.cssText = "background:#fff; color:#000; padding:40px; margin-bottom:20px; min-height:900px;";

    let texto = `${conclusion.agradecimiento}\n\n${conclusion.resumen}\n\nAprendizajes clave:\n\n`;
    if (conclusion.aprendizajesClave) {
        conclusion.aprendizajesClave.forEach(item => texto += `• ${item}\n`);
    }
    texto += `\n${conclusion.proximosPasos}\n\n${conclusion.motivacionFinal}`;

    hoja.innerHTML = `<h1>${conclusion.titulo}</h1><div style="white-space:pre-line; font-size:18px; line-height:1.6;">${texto}</div>`;
    contenedor.appendChild(hoja);
}

function preguntarSiguienteCapitulo() {
    if (document.getElementById("modalCapitulos")) return;

    const overlay = document.createElement("div");
    overlay.id = "modalCapitulos";
    overlay.style.cssText = "position:fixed; inset:0; background:rgba(0,0,0,.75); display:flex; justify-content:center; align-items:center; z-index:99999;";
    overlay.innerHTML = `
        <div style="background:#111827; padding:25px; border-radius:16px; border:2px solid #00d9ff; color:#fff; max-width:90%; width:400px; text-align:center;">
            <h2 style="color:#00d9ff;">📖 Capítulo generado</h2>
            <p>¿Desea continuar con el siguiente capítulo?</p>
            <button id="btnContinuarCapitulo" style="background:#00d9ff; color:#000; padding:10px 20px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; margin-right:10px;">▶ Continuar</button>
            <button id="btnPausarCapitulo" style="background:#444; color:#fff; padding:10px 20px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">⏸ Pausar</button>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("btnContinuarCapitulo").onclick = async () => {
        overlay.remove();
        await generarCapitulos();
    };

    document.getElementById("btnPausarCapitulo").onclick = () => overlay.remove();
}


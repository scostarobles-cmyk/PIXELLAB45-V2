/* ==========================================================
   PIXELLAB Monitor & Auxiliares UI (Fallback de Seguridad)
========================================================== */

function monitorPIXELLAB(modulo, tipo, operacion, mensaje) {
    console.log(`[${modulo}][${tipo.toUpperCase()}] ${operacion}:`, mensaje || "");
    const monitor = document.getElementById("monitorPIXELLAB");
    if (!monitor) return;

    const elem = document.createElement("div");
    elem.className = `monitor-evento monitor-${tipo}`;
    elem.innerHTML = `
        <div class="monitor-header">
            <span class="monitor-modulo">${modulo}</span>
            <span>${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="monitor-operacion">${operacion}</div>
        <div class="monitor-mensaje">${mensaje || ""}</div>
    `;
    monitor.appendChild(elem);
    monitor.scrollTop = monitor.scrollHeight;
}

function limpiarMonitorPIXELLAB() {
    const monitor = document.getElementById("monitorPIXELLAB");
    if (monitor) monitor.innerHTML = "";
}

// Funciones de estado visual para los botones
function actualizarIndicador(id, estado) {
    const el = document.getElementById(id);
    if (!el) return;
    const simbolos = { verde: "🟢", azul: "🔵", amarillo: "🟡", blanco: "⚪", rojo: "🔴" };
    const textoLimpio = el.textContent.replace(/^[🟢🔵🟡⚪🔴]\s*/, "");
    el.textContent = `${simbolos[estado] || "⚪"} ${textoLimpio}`;
}

function botonVerde(id) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.className = "boton-accion verde";
    }
}

function botonAzul(id) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.className = "boton-accion azul";
    }
}

function botonAmarillo(id) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.className = "boton-accion amarillo";
    }
}

function botonNormal(id) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.className = "boton-accion";
    }
}

function habilitarBoton(id) {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = false;
}

function deshabilitarBoton(id) {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = true;
}

// =====================================
// VARIABLES GLOBALES
// =====================================
let proyectoActual = null;
let projectIdActual = null;
let continuarCapitulosAutomatico = false;
let preguntarContinuarCapitulos = true;
let bibliotecaEditorial = [];
let proyectoEditorialActivo = null;

const WORKER_URL = typeof WORKER_URL !== 'undefined' ? WORKER_URL : ''; 
const R2_EBOOKS_URL = typeof R2_EBOOKS_URL !== 'undefined' ? R2_EBOOKS_URL : '';

// =====================================
// ARRANQUE SEGURO
// =====================================
async function iniciarCargaEditorial() {
    monitorPIXELLAB("Editorial", "proceso", "Módulo Editorial iniciado");
    await verificarProyecto();
    await cargarGaleriaEditorial();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarCargaEditorial);
} else {
    iniciarCargaEditorial();
}

/* =====================================================
   VERIFICACIÓN Y CREACIÓN DE PROYECTOS
===================================================== */

async function verificarProyecto() {
    monitorPIXELLAB("Editorial", "proceso", "Verificación", "Entró a verificarProyecto");

    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "verificar-proyecto" })
        });

        const datos = await respuesta.json();
        monitorPIXELLAB("Editorial", "info", "Respuesta Worker", JSON.stringify(datos));

        limpiarMonitorPIXELLAB();

        const proyectoCreado = datos.proyectoCreado;
        const proyectoProduccion = datos.proyectoProduccion;

        if (proyectoCreado) {
            monitorPIXELLAB("Editorial", "info", "Proyecto Creado", proyectoCreado.titulo);
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

            // Plan
            if (proyectoActual.estructura.plan === "creado") {
                actualizarIndicador("estadoPlan", "verde");
                botonVerde("btnPlan");
                deshabilitarBoton("btnPlan");
            } else {
                actualizarIndicador("estadoPlan", "azul");
                botonAzul("btnPlan");
                habilitarBoton("btnPlan");
                return;
            }

            // Indice
            if (proyectoActual.estructura.indice === "creado") {
                actualizarIndicador("estadoIndice", "verde");
                botonVerde("btnIndice");
                deshabilitarBoton("btnIndice");
            } else {
                actualizarIndicador("estadoIndice", "azul");
                botonAzul("btnIndice");
                habilitarBoton("btnIndice");
                return;
            }

            // Legales
            if (proyectoActual.estructura.legales === "creado") {
                actualizarIndicador("estadoLegales", "verde");
                botonVerde("btnLegales");
                deshabilitarBoton("btnLegales");
            } else {
                actualizarIndicador("estadoLegales", "azul");
                botonAzul("btnLegales");
                habilitarBoton("btnLegales");
                return;
            }

            // Introduccion
            if (proyectoActual.estructura.introduccion === "creado") {
                actualizarIndicador("estadoIntro", "verde");
                botonVerde("btnIntroduccion");
                deshabilitarBoton("btnIntroduccion");
            } else {
                actualizarIndicador("estadoIntro", "azul");
                botonAzul("btnIntroduccion");
                habilitarBoton("btnIntroduccion");
                return;
            }

            // Capitulos
            const plan = await cargarJSON(`proyectos/${projectIdActual}/plan.json`);

            if (proyectoActual.estructura.capitulos === "pendiente") {
                actualizarIndicador("estadoCapitulos", "azul");
                botonAzul("btnCapitulos");
                habilitarBoton("btnCapitulos");
                return;
            }

            if (proyectoActual.estructura.capitulos === "produccion") {
                actualizarIndicador("estadoCapitulos", "amarillo");
                botonAmarillo("btnCapitulos");
                habilitarBoton("btnCapitulos");

                if (plan && plan.capitulos) {
                    for (const capitulo of plan.capitulos) {
                        if (capitulo.estado !== "creado") {
                            if (typeof preguntarSiguienteCapitulo === "function" && preguntarContinuarCapitulos) {
                                preguntarSiguienteCapitulo();
                            }
                            return;
                        }
                    }
                }
            }

            if (proyectoActual.estructura.capitulos === "creado") {
                actualizarIndicador("estadoCapitulos", "verde");
                botonVerde("btnCapitulos");
                deshabilitarBoton("btnCapitulos");
            }

            // Conclusion
            if (proyectoActual.estructura.conclusion === "creado") {
                actualizarIndicador("estadoConclusion", "verde");
                botonVerde("btnConclusion");
                deshabilitarBoton("btnConclusion");
            } else {
                actualizarIndicador("estadoConclusion", "azul");
                botonAzul("btnConclusion");
                habilitarBoton("btnConclusion");
                return;
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
        monitorPIXELLAB("Editorial", "error", "Proyecto", "Debe completar Título y Autor");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = "📁 Generando proyecto...";
    monitorPIXELLAB("Editorial", "proceso", "Proyecto", "Creando proyecto...");

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

        monitorPIXELLAB("Editorial", "ok", "Proyecto", "Proyecto creado correctamente: " + projectId);
        if (estado) estado.innerHTML = "🟢 Proyecto creado";
        btn.classList.add("completo");
        btn.innerHTML = "✅ Proyecto creado";

        await verificarProyecto();

    } catch (err) {
        console.error(err);
        monitorPIXELLAB("Editorial", "error", "Proyecto", err.message);
        if (estado) estado.innerHTML = "🔴 Error";
        btn.innerHTML = "❌ Error";
        btn.disabled = false;
    }
}

async function cargarJSON(ruta) {
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "cargar-json", ruta: ruta })
        });
        const datos = await respuesta.json();
        return datos.ok ? datos.json : null;
    } catch (e) {
        return null;
    }
}

async function guardarJSON(ruta, datos) {
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "guardar-json", ruta: ruta, json: datos })
        });
        const resultado = await respuesta.json();
        return resultado.ok;
    } catch (e) {
        return false;
    }
}

/* =====================================================
   GENERACIÓN DE ETAPAS (PLAN, INDICE, LEGALES, ETC)
===================================================== */

async function generarPlan2() {
    monitorPIXELLAB("Editorial", "proceso", "Plan", "Iniciando generación de plan");
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generar-plan" })
        });
        const datos = await respuesta.json();
        if (datos.ok) {
            monitorPIXELLAB("Editorial", "ok", "Plan", "Plan generado correctamente");
            actualizarIndicador("estadoPlan", "verde");
            const btn = document.getElementById("btnPlan");
            if (btn) {
                btn.classList.add("completo");
                btn.innerHTML = "✅ Plan generado";
                btn.disabled = true;
            }
            await verificarProyecto();
        }
    } catch (error) {
        monitorPIXELLAB("Editorial", "error", "Plan", error.message);
    }
}

async function generarIndice() {
    monitorPIXELLAB("Editorial", "proceso", "Índice", "Iniciando generación de índice");
    try {
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generar-indice" })
        });
        const data = await response.json();
        if (data.ok) {
            monitorPIXELLAB("Editorial", "ok", "Índice", "Índice generado correctamente");
            const btn = document.getElementById("btnIndice");
            if (btn) {
                btn.classList.add("completo");
                btn.innerHTML = "✅ Índice generado";
                btn.disabled = true;
            }
            await verificarProyecto();
        }
    } catch (error) {
        monitorPIXELLAB("Editorial", "error", "Índice", error.message);
    }
}

async function generarLegales() {
    monitorPIXELLAB("Editorial", "proceso", "Legales", "Iniciando generación de legales");
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generar-legales" })
        });
        const resultado = await respuesta.json();
        if (resultado.ok) {
            monitorPIXELLAB("Editorial", "ok", "Legales", "Página de legales creada correctamente");
            await verificarProyecto();
        }
    } catch (error) {
        monitorPIXELLAB("Editorial", "error", "Legales", error.message);
    }
}

async function generarIntroduccion() {
    monitorPIXELLAB("Editorial", "proceso", "Introducción", "Iniciando generación");
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generar-introduccion" })
        });
        const resultado = await respuesta.json();
        if (resultado.ok) {
            monitorPIXELLAB("Editorial", "ok", "Introducción", "Creada correctamente");
            await verificarProyecto();
        }
    } catch (error) {
        monitorPIXELLAB("Editorial", "error", "Introducción", error.message);
    }
}

async function generarCapitulos() {
    monitorPIXELLAB("Editorial", "proceso", "Capítulos", "Generando capítulo");
    botonAmarillo("btnCapitulos");
    actualizarIndicador("estadoCapitulos", "amarillo");

    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generar-capitulo" })
        });
        const resultado = await respuesta.json();
        if (resultado.ok) {
            monitorPIXELLAB("Editorial", "ok", "Capítulos", `Capítulo ${resultado.numero} generado`);
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
        }
    } catch (error) {
        monitorPIXELLAB("Editorial", "error", "Capítulos", error.message);
    }
}

async function generarConclusion() {
    monitorPIXELLAB("Editorial", "proceso", "Conclusión", "Iniciando generación");
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "generar-conclusion" })
        });
        const resultado = await respuesta.json();
        if (resultado.ok) {
            monitorPIXELLAB("Editorial", "ok", "Conclusión", "Conclusión creada correctamente");
            botonVerde("btnConclusion");
            actualizarIndicador("estadoConclusion", "verde");
            await verificarProyecto();
        }
    } catch (error) {
        monitorPIXELLAB("Editorial", "error", "Conclusión", error.message);
    }
}

function preguntarSiguienteCapitulo() {
    if (document.getElementById("modalCapitulos")) return;

    if (!document.getElementById("estiloModalCapitulos")) {
        const style = document.createElement("style");
        style.id = "estiloModalCapitulos";
        style.textContent = `
        #modalCapitulos{ position:fixed; inset:0; background:rgba(0,0,0,.75); display:flex; justify-content:center; align-items:center; z-index:99999; backdrop-filter:blur(4px); }
        #modalCapitulos .ventana{ width:420px; max-width:90%; background:#111827; border:2px solid #00d9ff; border-radius:16px; padding:25px; box-shadow:0 0 30px rgba(0,217,255,.45); color:#fff; font-family:Arial,sans-serif; }
        #modalCapitulos h2{ margin:0 0 15px; color:#00d9ff; text-align:center; }
        #modalCapitulos p{ text-align:center; line-height:1.5; }
        #modalCapitulos label{ display:flex; align-items:center; gap:10px; margin:20px 0; }
        #modalCapitulos .botones{ display:flex; justify-content:center; gap:15px; margin-top:20px; }
        #modalCapitulos button{ padding:10px 20px; border:none; border-radius:8px; cursor:pointer; font-size:15px; font-weight:bold; }
        #btnContinuarCapitulo{ background:#00d9ff; color:#000; }
        #btnPausarCapitulo{ background:#444; color:#fff; }
        `;
        document.head.appendChild(style);
    }

    const overlay = document.createElement("div");
    overlay.id = "modalCapitulos";
    overlay.innerHTML = `
    <div class="ventana">
        <h2>📖 Capítulo generado</h2>
        <p>El capítulo se generó correctamente.<br><br>¿Desea continuar con el siguiente capítulo?</p>
        <label><input type="checkbox" id="chkNoPreguntarCapitulos"> No volver a preguntar durante este Ebook</label>
        <div class="botones">
            <button id="btnContinuarCapitulo">▶ Continuar</button>
            <button id="btnPausarCapitulo">⏸ Pausar</button>
        </div>
    </div>`;

    document.body.appendChild(overlay);

    document.getElementById("btnContinuarCapitulo").onclick = async () => {
        const chk = document.getElementById("chkNoPreguntarCapitulos");
        if (chk && chk.checked) {
            preguntarContinuarCapitulos = false;
            continuarCapitulosAutomatico = true;
        }
        overlay.remove();
        await generarCapitulos();
    };

    document.getElementById("btnPausarCapitulo").onclick = () => {
        overlay.remove();
    };
}

/* =====================================================
   BIBLIOTECA EDITORIAL Y MAQUETACIÓN
===================================================== */

async function cargarGaleriaEditorial() {
    try {
        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "listar-ebooks" })
        });
        const data = await respuesta.json();
        if (data.ok) mostrarProyectosEditorial(data.ebooks);
    } catch (error) {
        monitorPIXELLAB("Editorial", "
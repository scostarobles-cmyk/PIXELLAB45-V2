import { monitorPIXELLAB } from './pixellab45-core.js';

// =====================================
// ESTADO Y CONFIGURACIÓN DEL EDITOR
// =====================================
const SECCIONES_LIBRO = ['portada', 'legales', 'indice', 'introduccion', 'capitulos', 'conclusion'];

// =====================================
// INICIALIZACIÓN
// =====================================
window.addEventListener("load", () => {
    iniciarCargaEditorial();
});

function iniciarCargaEditorial() {
    monitorPIXELLAB("[EDITOR] Módulo de edición y maquetación A4 inicializado.", "info");
    configurarBotonesToolbar();
}

function configurarBotonesToolbar() {
    const botones = document.querySelectorAll('.editor-toolbar-editor .editor-menu');
    botones.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const accion = e.target.textContent.trim();
            if (accion.includes("Portada")) {
                generarPortadaProyecto();
            } else {
                monitorPIXELLAB(`[EDITOR] Navegando a sección: ${accion}`, "info");
            }
        });
    });
}

// =====================================
// MAQUETACIÓN VISUAL Y LIENZO A4
// =====================================
export function crearPaginaA4() {
    const pagina = document.createElement("div");
    pagina.className = "pagina-a4";
    pagina.style.width = "210mm";
    pagina.style.minHeight = "297mm";
    pagina.style.background = "#fff";
    pagina.style.margin = "10px auto";
    pagina.style.padding = "20mm";
    pagina.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
    return pagina;
}

export function cargarPaginaCapitulo(bloques) {
    const lienzo = document.getElementById("paginaEditor");
    if (!lienzo) return;

    lienzo.innerHTML = "";
    let paginaActual = crearPaginaA4();
    lienzo.appendChild(paginaActual);

    bloques.forEach(bloqueData => {
        const bloqueEl = renderizarBloque(bloqueData);
        paginaActual.appendChild(bloqueEl);

        // Control de desbordamiento en la hoja A4
        if (paginaActual.scrollHeight > 900) {
            paginaActual.removeChild(bloqueEl);
            paginaActual = crearPaginaA4();
            paginaActual.appendChild(bloqueEl);
            lienzo.appendChild(paginaActual);
        }
    });
}

function renderizarBloque(data) {
    const div = document.createElement("div");
    div.className = `bloque-editor bloque-${data.tipo}`;
    div.innerHTML = data.contenido;
    return div;
}

// =====================================
// GENERADOR Y MAQUETADOR DE PORTADA
// =====================================
export async function generarPortadaProyecto() {
    monitorPIXELLAB("[EDITOR] Maquetando lienzo de portada...", "info");

    const lienzo = document.getElementById("paginaEditor");
    if (!lienzo) return;

    lienzo.innerHTML = "";
    const paginaPortada = crearPaginaA4();
    paginaPortada.classList.add("portada-container");

    try {
        const tema = document.getElementById("temaEbook")?.value || "Título del Libro";
        const autor = document.getElementById("autorEbook")?.value || "Nombre Autor";

        // Renderizado del lienzo visual de la portada
        paginaPortada.innerHTML = `
            <div style="text-align:center; margin-top:200px;">
                <h1 style="font-size:2.5rem; color:#111;">${tema}</h1>
                <hr style="width:50%; margin:20px auto; border:1px solid #333;">
                <p style="font-size:1.2rem; color:#555;">${autor}</p>
            </div>
        `;

        lienzo.appendChild(paginaPortada);

        // Si se usa Puter para la imagen de portada
        if (typeof puter !== "undefined" && puter.ai) {
            monitorPIXELLAB("[EDITOR] Solicitando ilustración de portada a Puter AI...", "info");
            const imgResult = await puter.ai.txt2img(`Book cover design for: ${tema}`);
            
            const imgContainer = document.createElement("div");
            imgContainer.style.marginTop = "30px";
            imgContainer.style.textAlign = "center";
            imgContainer.appendChild(imgResult);
            paginaPortada.appendChild(imgContainer);
        }

        monitorPIXELLAB("[EDITOR] Portada generada y maquetada con éxito.", "exito");
    } catch (err) {
        monitorPIXELLAB(`[EDITOR ERROR] No se pudo maquetar la portada: ${err.message}`, "error");
    }
}

// Vinculación explícita
window.generarPortadaProyecto = generarPortadaProyecto;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof monitorPIXELLAB === "function") {
    monitorPIXELLAB("EDITOR", "info", "Carga", "Módulo Editor de trabajo cargado correctamente.");
  }
  configurarToolbar();
});

function configurarToolbar() {
  const botones = document.querySelectorAll('.editor-toolbar-editor .editor-menu');
  botones.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const accion = e.target.textContent.trim();
      if (accion.includes("Portada")) {
        generarPortadaProyecto();
      } else {
        if (typeof monitorPIXELLAB === "function") {
          monitorPIXELLAB("EDITOR", "info", "Navegación", `Sección seleccionada: ${accion}`);
        }
      }
    });
  });
}

function crearPaginaA4() {
  const pagina = document.createElement("div");
  pagina.className = "pagina-a4";
  pagina.style.width = "210mm";
  pagina.style.minHeight = "297mm";
  pagina.style.background = "#fff";
  pagina.style.margin = "10px auto";
  pagina.style.padding = "20mm";
  pagina.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
  pagina.style.color = "#000";
  return pagina;
}

function cargarPaginaCapitulo(bloques) {
  const lienzo = document.getElementById("paginaEditor");
  if (!lienzo || !Array.isArray(bloques)) return;

  lienzo.innerHTML = "";
  let paginaActual = crearPaginaA4();
  lienzo.appendChild(paginaActual);

  bloques.forEach(bloqueData => {
    const div = document.createElement("div");
    div.className = `bloque-editor bloque-${bloqueData.tipo || "texto"}`;
    div.innerHTML = bloqueData.contenido || "";
    
    paginaActual.appendChild(div);

    if (paginaActual.scrollHeight > 900) {
      paginaActual.removeChild(div);
      paginaActual = crearPaginaA4();
      paginaActual.appendChild(div);
      lienzo.appendChild(paginaActual);
    }
  });
}

async function generarPortadaProyecto() {
  if (typeof monitorPIXELLAB === "function") {
    monitorPIXELLAB("EDITOR", "proceso", "Portada", "Diseñando maquetación de portada...");
  }

  const lienzo = document.getElementById("paginaEditor");
  if (!lienzo) return;

  lienzo.innerHTML = "";
  const paginaPortada = crearPaginaA4();

  try {
    const tema = document.getElementById("temaEbook")?.value.trim() || "Título del eBook";
    const autor = document.getElementById("autorEbook")?.value.trim() || "Autor del Libro";

    paginaPortada.innerHTML = `
      <div style="text-align:center; padding-top:100px;">
        <h1 style="font-size:2.5rem; color:#111; margin-bottom:15px;">${tema}</h1>
        <div style="width:60px; height:3px; background:#007bff; margin:20px auto;"></div>
        <p style="font-size:1.3rem; color:#555;">${autor}</p>
      </div>
    `;

    lienzo.appendChild(paginaPortada);

    if (typeof puter !== "undefined" && puter.ai) {
      if (typeof monitorPIXELLAB === "function") {
        monitorPIXELLAB("EDITOR", "proceso", "IA Visual", "Solicitando imagen de portada a Puter AI...");
      }
      const imgResult = await puter.ai.txt2img(`Book cover design for: ${tema}`);
      
      const container = document.createElement("div");
      container.style.marginTop = "30px";
      container.style.textAlign = "center";
      container.appendChild(imgResult);
      paginaPortada.appendChild(container);
    }

    if (typeof monitorPIXELLAB === "function") {
      monitorPIXELLAB("EDITOR", "ok", "Portada", "Portada maquetada con éxito.");
    }
  } catch (err) {
    if (typeof monitorPIXELLAB === "function") {
      monitorPIXELLAB("EDITOR", "error", "Portada", `Error maquetando portada: ${err.message}`);
    }
  }
}

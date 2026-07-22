// =====================================
// MÓDULO EDITOR (DISEÑO & LIENZO A4)
// PIXELLAB45 eBook Studio
// =====================================

(function() {
    "use strict";

    function logEditor(nivel, operacion, mensaje) {
        if (typeof window.monitorPIXELLAB === "function") {
            window.monitorPIXELLAB("EDITOR", nivel, operacion, mensaje);
        } else {
            console.log(`[EDITOR - ${nivel}] ${operacion}: ${mensaje}`);
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        logEditor("info", "Carga", "Módulo Editor de trabajo cargado correctamente.");
        configurarToolbar();
    });

    function configurarToolbar() {
        var botones = document.querySelectorAll('.editor-toolbar-editor .editor-menu');
        botones.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                var accion = e.target.textContent.trim();
                if (accion.indexOf("Portada") !== -1) {
                    window.generarPortadaProyecto();
                } else {
                    logEditor("info", "Navegación", "Sección seleccionada: " + accion);
                }
            });
        });
    }

    window.crearPaginaA4 = function() {
        var pagina = document.createElement("div");
        pagina.className = "pagina-a4";
        pagina.style.width = "210mm";
        pagina.style.minHeight = "297mm";
        pagina.style.background = "#fff";
        pagina.style.margin = "10px auto";
        pagina.style.padding = "20mm";
        pagina.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
        pagina.style.color = "#000";
        return pagina;
    };

    window.cargarPaginaCapitulo = function(bloques) {
        var lienzo = document.getElementById("paginaEditor");
        if (!lienzo || !Array.isArray(bloques)) return;

        lienzo.innerHTML = "";
        var paginaActual = window.crearPaginaA4();
        lienzo.appendChild(paginaActual);

        bloques.forEach(function(bloqueData) {
            var div = document.createElement("div");
            div.className = "bloque-editor bloque-" + (bloqueData.tipo || "texto");
            div.innerHTML = bloqueData.contenido || "";
            
            paginaActual.appendChild(div);

            if (paginaActual.scrollHeight > 900) {
                paginaActual.removeChild(div);
                paginaActual = window.crearPaginaA4();
                paginaActual.appendChild(div);
                lienzo.appendChild(paginaActual);
            }
        });
    };

    window.generarPortadaProyecto = async function() {
        logEditor("proceso", "Portada", "Diseñando maquetación de portada...");

        var lienzo = document.getElementById("paginaEditor");
        if (!lienzo) return;

        lienzo.innerHTML = "";
        var paginaPortada = window.crearPaginaA4();

        try {
            var tema = (document.getElementById("temaEbook")?.value || "Título del eBook").trim();
            var autor = (document.getElementById("autorEbook")?.value || "Autor del Libro").trim();

            paginaPortada.innerHTML = 
                '<div style="text-align:center; padding-top:100px;">' +
                    '<h1 style="font-size:2.5rem; color:#111; margin-bottom:15px;">' + tema + '</h1>' +
                    '<div style="width:60px; height:3px; background:#007bff; margin:20px auto;"></div>' +
                    '<p style="font-size:1.3rem; color:#555;">' + autor + '</p>' +
                '</div>';

            lienzo.appendChild(paginaPortada);

            if (typeof window.puter !== "undefined" && window.puter.ai) {
                logEditor("proceso", "IA Visual", "Solicitando imagen de portada a Puter AI...");
                var imgResult = await window.puter.ai.txt2img("Book cover design for: " + tema);
                
                var container = document.createElement("div");
                container.style.marginTop = "30px";
                container.style.textAlign = "center";
                container.appendChild(imgResult);
                paginaPortada.appendChild(container);
            }

            logEditor("ok", "Portada", "Portada maquetada con éxito.");
        } catch (err) {
            logEditor("error", "Portada", "Error maquetando portada: " + err.message);
        }
    };

})();

console.log("SCRIPT CARGADO OK");

const WORKER_URL = "https://pixellab45-v2.scostarobles.workers.dev/";
const R2_PUBLIC_URL = "https://pub-e46137551fb4e40868180dc485c5fd4r.r2.dev/";

// 1. CARGA INICIAL: Muestra todas las imágenes al abrir la página
async function cargarGaleriaCompleta() {
    const contenedor = document.getElementById("galeriaCompleta");
    if (!contenedor) return;

    contenedor.innerHTML = "<p>Cargando galería completa...</p>";

    try {
        const res = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo: "listar-imagenes" })
        });

        const data = await res.json();
        alert(json.stringidy(data));

        if (data.success && data.images.length > 0) {
            renderizarImagenes(contenedor, data.images);
        } else {
            contenedor.innerHTML = "<p>No se encontraron imágenes en el laboratorio.</p>";
        }
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = "<p>Error al conectar con el servidor.</p>";
    }
}

// 2. BOTONERA: Filtra las imágenes dinámicamente al presionar un botón
async function cargarCategoria(categoria) {
    const contenedor = document.getElementById("galeriaCompleta") || document.querySelector(".gallery-grid");
    if (!contenedor) return;

    contenedor.innerHTML = `<p>Cargando sección: ${categoria.toUpperCase()}...</p>`;

    try {
        const res = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                tipo: "filtrar-categoria", 
                categoria: categoria 
            })
        });

        const data = await res.json();

        if (data.success && data.images.length > 0) {
            renderizarImagenes(contenedor, data.images);
        } else {
            contenedor.innerHTML = `<p>No hay imágenes disponibles para la categoría: ${categoria}.</p>`;
        }
    } catch (error) {
        console.error("Error al filtrar:", error);
        contenedor.innerHTML = "<p>Error al cargar la categoría.</p>";
    }
}

// Función auxiliar para pintar las imágenes en el HTML
function renderizarImagenes(contenedor, listaImagenes) {
    contenedor.innerHTML = ""; 
    
    listaImagenes.forEach(img => {
        const card = document.createElement("div");
        card.className = "project-card";

        card.innerHTML = `
            <img src="${img.url}" alt="${img.nombre}" class="gallery-img">
            <h3>${img.nombre.split('.')[0]}</h3>
        `;
        contenedor.appendChild(card);
    });
}

// Ejecutar la carga completa de inicio si el contenedor existe en pantalla
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("galeriaCompleta")) {
        cargarGaleriaCompleta();
    }
});

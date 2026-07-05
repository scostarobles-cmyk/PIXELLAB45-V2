//Variable global worker 
const WORKER_URL =
  "https://pixellab45-v2.scostarobles.workers.dev/";
//Función global 
const FETCH_CONFIG = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};
window.ebookActual = null;
let ebookActual = "";
let estructuraEbook = null;
let ebookDiseno = null;
//Galería completa 
async function cargarGaleriaCompleta() {

  const contenedor =
    document.getElementById("galeriaCompleta");

  contenedor.innerHTML =
    "⏳ Cargando galería..."; 

  try {

    const res = await fetch(WORKER_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    action: "listar-imagenes"
  })
});
    const data = await res.json();

    contenedor.innerHTML = "";

    data.images.forEach(img => {

      contenedor.innerHTML += `
        <div class="project-card">
          <img
            src="${img.url}"
            alt="${img.nombre}">
        </div>
      `;

    });

  } catch (error) {

    console.error(error);

    contenedor.innerHTML =
      "❌ Error cargando galería";
  }
}

//Galería por categoría 
async function cargarCategoria(categoria) {


  const contenedor =
    document.getElementById("galeriaCategoria");

  contenedor.innerHTML =
    "⏳ Cargando categoría...";

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "listar-categoria",
        categoria: categoria
      })
    });

    const data = await res.json();
  

    contenedor.innerHTML = "";

    data.archivos.forEach(img => {

      contenedor.innerHTML += `
        <div class="project-card">
          <img
            src="${img.url}"
            alt="${img.nombre}">
        </div>
      `;

    });

} catch (error) {

  console.error(error);

  contenedor.innerHTML =
    "❌ Error cargando categoría";

}

}
//Generar ideas
async function generarIdeas() {

  const loading =
    document.getElementById("loadingIdeas");

  const barra =
    document.getElementById("barraIdeas");

  const estado =
    document.getElementById("estadoIdeas");

  loading.style.display = "block";
  barra.style.width = "10%";
  estado.innerText = "🧠 Generando ideas...";

  let progreso = 10;

  const fakeProgress = setInterval(() => {

    if (progreso < 90) {

      progreso += Math.random() * 10;

      barra.style.width = progreso + "%";

      if (progreso < 30)
        estado.innerText = "🧠 Analizando tema...";

      else if (progreso < 60)
        estado.innerText = "💡 Generando ideas...";

      else
        estado.innerText = "⚡ Finalizando...";

    }

  }, 400);

  const tema =
    document.getElementById("tema").value;

  if (!tema.trim()) {

    document.getElementById("resultadoIdeas").innerText =
      "⚠️ Escribe un tema primero";

    return;

  }

  try {

    document.getElementById("resultadoIdeas").innerText =
      "🧠 Generando ideas...";

    const res = await fetch(WORKER_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    action: "ideas",
    tema: tema
  })
});

const data = await res.json();

   clearInterval(fakeProgress);

    barra.style.width = "100%";

    estado.innerText = "✅ Listo";

    setTimeout(() => {

      loading.style.display = "none";

      document.getElementById("resultadoIdeas").innerText =
        data.ideas;

    }, 300);

  } catch (error) {

    clearInterval(fakeProgress);

    estado.innerText = "❌ Error";

    loading.style.display = "none";

    document.getElementById("resultadoIdeas").innerText =
      error.message;

  }

}
  //Guardar ideas 
  async function guardarIdeas() {

  const texto =
    document.getElementById("resultadoIdeas").innerText;

  if (!texto.trim()) {
    alert("No hay ideas para guardar");
    return;
  }

  try {
  
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "guardar-ideas",
        contenido: texto
      })
    });

    const data = await res.json();

document.getElementById(
  "mensajeIdeasCopiadas"
).innerText =
  data.mensaje || "✅ Ideas guardadas";

setTimeout(() => {

  document.getElementById(
    "mensajeIdeasCopiadas"
  ).innerText = "";

}, 3000);
    

  } catch (error) {

  console.error(error);

  document.getElementById(
    "mensajeIdeasCopiadas"
  ).innerText =
    "❌ Error al guardar";

  setTimeout(() => {

    document.getElementById(
      "mensajeIdeasCopiadas"
    ).innerText = "";

  }, 3000);

}

}
//Generador de prompts 
async function generarPrompt() {
	const loading = document.getElementById("loadingPrompt");
const barra = document.getElementById("barraPrompt");
const estado = document.getElementById("estadoPrompt");

loading.style.display = "block";
barra.style.width = "10%";
estado.innerText = "✍️ Generando prompt...";

let progreso = 10;

const fakeProgress = setInterval(() => {

  if (progreso < 90) {

    progreso += Math.random() * 10;

    barra.style.width = progreso + "%";

    if (progreso < 30)
      estado.innerText = "🧠 Analizando tema...";

    else if (progreso < 60)
      estado.innerText = "✍️ Creando prompts...";

    else
      estado.innerText = "⚡ Finalizando...";

  }

}, 400);

  const tema =
    document.getElementById("temaPrompt").value;

  const tipo =
    document.getElementById("tipoContenido").value;

  if (!tema.trim()) {

    document.getElementById("resultadoPrompt").innerText =
      "⚠️ Escribe un tema primero";

    return;
  }

  try {

    document.getElementById("resultadoPrompt").innerText =
      "✍️ Generando prompt...";

    const res = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "prompt",
          tema,
          formato: tipo
        })
      }
    );

    const data = await res.json();
    clearInterval(fakeProgress);

barra.style.width = "100%";

estado.innerText = "✅ Listo";

setTimeout(() => {

  loading.style.display = "none";

  document.getElementById("resultadoPrompt").innerText =
    data.resultado;

}, 300);

    

  } catch (error) {

clearInterval(fakeProgress);

estado.innerText = "❌ Error";

loading.style.display = "none";

document.getElementById("resultadoPrompt").innerText =
  error.message;

  }

}

//Guardar Prompt 
async function guardarPrompts() {

  const texto =
    document.getElementById("resultadoPrompt").innerText;

  if (!texto.trim()) {

    document.getElementById("mensajeCopiado").innerText =
      "⚠️ No hay prompts para guardar";

    return;

  }

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "guardar-prompts",
        contenido: texto
      })
    });

    const data = await res.json();

    document.getElementById("mensajeCopiado").innerText =
      data.mensaje;

  } catch (error) {

    document.getElementById("mensajeCopiado").innerText =
      "❌ Error al guardar";

  }

}

//Generar Visuales
async function generarVisuales() {

  const tema =
    document.getElementById("temaVisual").value;

  if (!tema.trim()) {

    document.getElementById("resultadoVisual").innerText =
      "⚠️ Escribe un tema primero";

    return;

  }

  const loading =
    document.getElementById("loadingVisual");

  const barra =
    document.getElementById("barraVisual");

  const estado =
    document.getElementById("estadoVisual");

  loading.style.display = "block";
  barra.style.width = "10%";
  estado.innerText = "🎨 Generando prompts visuales...";

  let progreso = 10;

  const fakeProgress = setInterval(() => {

    if (progreso < 90) {

      progreso += Math.random() * 10;

      barra.style.width = progreso + "%";

      if (progreso < 30)
        estado.innerText = "🧠 Analizando escena...";

      else if (progreso < 60)
        estado.innerText = "🎬 Creando visual prompts...";

      else
        estado.innerText = "⚡ Finalizando...";

    }

  }, 400);

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "visual",
        tema
      })
    });

    const data = await res.json();

    clearInterval(fakeProgress);

    barra.style.width = "100%";
    estado.innerText = "✅ Listo";

    setTimeout(() => {

      loading.style.display = "none";

      document.getElementById("resultadoVisual").innerText =
        data.resultado;

    }, 300);

  } catch (error) {

    clearInterval(fakeProgress);

    estado.innerText = "❌ Error";

    loading.style.display = "none";

    document.getElementById("resultadoVisual").innerText =
      error.message;

  }

}
//Guardar Visuales 
async function guardarVisuales() {

  const texto =
    document.getElementById("resultadoVisual").innerText;

  if (!texto.trim()) {

    document.getElementById("mensajeVisual").innerText =
      "⚠️ No hay visuales para guardar";

    return;

  }

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "guardar-visuales",
        contenido: texto
      })
    });

    const data = await res.json();

    document.getElementById("mensajeVisual").innerText =
      data.mensaje;

  } catch (error) {

    document.getElementById("mensajeVisual").innerText =
      "❌ Error al guardar";

  }

}
//Generar guión 
async function generarGuion() {

  const tema =
    document.getElementById("temaGuion").value;

  const duracion =
    document.getElementById("duracionGuion").value;

  const formato =
    document.getElementById("formatoGuion").value;

  const loading =
    document.getElementById("loadingGuion");

  const barra =
    document.getElementById("barraGuion");

  const estado =
    document.getElementById("estadoGuion");

  const resultado =
    document.getElementById("resultadoGuion");

  if (!tema.trim()) {

    resultado.innerText =
      "⚠️ Escribe un tema primero";

    return;

  }

  loading.style.display = "block";
  barra.style.width = "10%";
  estado.innerText = "🎬 Analizando idea...";

  let progreso = 10;

  const fakeProgress = setInterval(() => {

    if (progreso < 90) {

      progreso += Math.random() * 10;

      barra.style.width = progreso + "%";

      if (progreso < 30)
        estado.innerText = "🧠 Analizando tema...";

      else if (progreso < 60)
        estado.innerText = "✍️ Escribiendo guion...";

      else
        estado.innerText = "⚡ Finalizando...";

    }

  }, 400);

  try {
    console.log(tema);
    console.log(duracion);
    console.log(formato);
    const res = await fetch(
      WORKER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "script",
          tema,
          duracion,
          formato
        })
      }
    );

    const data = await res.json();

    clearInterval(fakeProgress);

    barra.style.width = "100%";
    estado.innerText = "✅ Listo";

    setTimeout(() => {

      loading.style.display = "none";

      resultado.innerText =
        data.resultado;

    }, 300);

  } catch (error) {

    clearInterval(fakeProgress);

    estado.innerText = "❌ Error";

    loading.style.display = "none";

    resultado.innerText =
      error.message;

  }

}

async function guardarGuion() {

  const contenido =
    document.getElementById("resultadoGuion").innerText;

  if (!contenido.trim()) {
    alert("No hay ningún guion para guardar.");
    return;
  }

  const res = await fetch(
    WORKER_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "guardar-guion",
        contenido
      })
    }
  );

  const data = await res.json();

  document.getElementById("mensajeGuionCopiado").innerText =
    data.mensaje;

  setTimeout(() => {
    document.getElementById("mensajeGuionCopiado").innerText = "";
  }, 2000);

}
//Copiar guión 
async function copiarGuion() {

  const contenido =
    document.getElementById("resultadoGuion").innerText;

  if (!contenido.trim()) {
    alert("No hay ningún guion para copiar.");
    return;
  }

  try {

    await navigator.clipboard.writeText(contenido);

    document.getElementById("mensajeGuionCopiado").innerText =
      "✅ Guion copiado";

    setTimeout(() => {
      document.getElementById("mensajeGuionCopiado").innerText = "";
    }, 2000);

  } catch (error) {

    document.getElementById("mensajeGuionCopiado").innerText =
      "❌ Error al copiar";

  }

}
//Generar Storyboard 
async function generarStoryboard() {

  const guion =
    document.getElementById("textoStoryboard").value;

  const escenas =
    document.getElementById("cantidadEscenas").value;

  const estilo =
    document.getElementById("estiloStoryboard").value;

  if (!guion.trim()) {
    document.getElementById("resultadoStoryboard").innerText =
      "⚠️ Primero pega un guion";
    return;
  }

  const loading = document.getElementById("loadingStoryboard");
  const barra = document.getElementById("barraStoryboard");
  const estado = document.getElementById("estadoStoryboard");

  loading.style.display = "block";
  barra.style.width = "10%";
  estado.innerText = "🎬 Generando storyboard...";

  let progreso = 10;

  const fakeProgress = setInterval(() => {
    if (progreso < 90) {
      progreso += Math.random() * 10;
      barra.style.width = progreso + "%";

      if (progreso < 30)
        estado.innerText = "🧠 Analizando guion...";
      else if (progreso < 60)
        estado.innerText = "🎥 Creando escenas...";
      else
        estado.innerText = "⚡ Finalizando storyboard...";
    }
  }, 400);

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "storyboard",
        guion,
        escenas,
        estilo
      })
    });

    const data = await res.json();

    clearInterval(fakeProgress);

    barra.style.width = "100%";
    estado.innerText = "✅ Listo";

    setTimeout(() => {

      loading.style.display = "none";

      document.getElementById("resultadoStoryboard").innerText =
        data.resultado;

    }, 300);

  } catch (error) {

    clearInterval(fakeProgress);
    estado.innerText = "❌ Error";
    loading.style.display = "none";

    document.getElementById("resultadoStoryboard").innerText =
      error.message;
  }
}
//guardar storyboard 
async function guardarStoryboard() {

  const resultado =
    document.getElementById("resultadoStoryboard");

  const storyboard = resultado.innerText;

  if (!storyboard.trim()) {
    resultado.innerHTML =
      "⚠️ Primero genera un storyboard.";
    return;
  }

  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "guardar-storyboard",
      contenido: storyboard
    })
  });

  const data = await res.json();

  resultado.innerHTML +=
    `<br><br>${data.mensaje || data.error}`;

}
//Copiar storyboard 
async function copiarStoryboard() {

  const storyboard =
    document.getElementById("resultadoStoryboard").innerText;

  const resultado =
    document.getElementById("resultadoStoryboard");

  if (!storyboard.trim()) {
    resultado.innerHTML = "⚠️ Primero genera un storyboard.";
    return;
  }

  await navigator.clipboard.writeText(storyboard);

  resultado.innerHTML += "<br><br>✅ Storyboard copiado";

}
//generar imagen 
async function generarImagen() {

  const prompt = document.getElementById("promptImagen").value;
  

const categoria =
  document.getElementById("categoriaImagen").value;

const resultado =
  document.getElementById("resultadoImagen");

  if (!prompt.trim()) {
    document.getElementById("resultadoImagen").innerHTML =
      "⚠️ Escribe un prompt";
    return;
  }

  const loading = document.getElementById("loadingImagen");
  const barra = document.getElementById("barraImagen");
  const estado = document.getElementById("estadoImagen");

  loading.style.display = "block";
  barra.style.width = "10%";
  estado.innerText = "🧠 Mejorando prompt...";

  let progreso = 10;

  const fakeProgress = setInterval(() => {

    if (progreso < 90) {

      progreso += Math.random() * 10;

      barra.style.width = progreso + "%";

      if (progreso < 30)
        estado.innerText = "🧠 Mejorando prompt...";
      else if (progreso < 60)
        estado.innerText = "🎨 Generando imagen...";
      else
        estado.innerText = "⚡ Finalizando...";

    }

  }, 400);

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "imagen",
        prompt
      })
    });

    const contentType = res.headers.get("content-type");

    if (contentType &&
        contentType.includes("application/json")) {

      const err = await res.json();

      throw new Error(err.error);

    }

    const blob = await res.blob();
    const base64 = await new Promise((resolve) => {

  const reader = new FileReader();

  reader.onloadend = () => {
    resolve(reader.result.split(",")[1]);
  };

  reader.readAsDataURL(blob);

});

    clearInterval(fakeProgress);

    barra.style.width = "100%";
    estado.innerText = "✅ Imagen lista";

    const url = URL.createObjectURL(blob);

    setTimeout(() => {

      loading.style.display = "none";

      document.getElementById("resultadoImagen").innerHTML =
        `<img src="${url}" style="width:100%;border-radius:12px;">`;

    }, 300);
    const guardar = await fetch(WORKER_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    action: "guardar-imagen",
    categoria,
    imagen: base64
  })
});
console.log("Base64 length:", base64.length);
const respuesta = await guardar.json();

if (!guardar.ok) {
  console.error("Error al guardar:", respuesta);
}

  } catch (error) {

    clearInterval(fakeProgress);

    loading.style.display = "none";

    document.getElementById("resultadoImagen").innerHTML =
      "❌ Error: " + error.message;

  }

}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: generarPlan()
// RESPONSABILIDAD:
// Iniciar la generación del Plan.
// =====================================================

async function generarPlan() {

  const payload = {
    action: "planificar-ebook",
    data: {
      tema: document.getElementById("temaEbook").value,
      paginas: document.getElementById("paginasEbook").value,
      idioma: document.getElementById("idiomaEbook").value,
      tono: document.getElementById("tonoEbook").value,
      publico: document.getElementById("publicoEbook").value,
      autor: document.getElementById("autorEbook").value
    }
  };

  document.getElementById("estadoPlan").innerText = "🔵 Ejecutando...";
  logMonitor("📋 Generando plan...");

  const res = await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = await res.json();

  if (!result.ok) {
    document.getElementById("estadoPlan").innerText = "🔴 Error";
    logMonitor("❌ Error en planificador");
    return;
  }

  document.getElementById("estadoPlan").innerText = "🟢 Finalizado";

  logMonitor("✔ Plan generado");
  logMonitor("📦 ID: " + result.data.id);

  // opcional: guardar ID en frontend
  window.currentEbookId = result.data.id;
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: generarIndice()
// RESPONSABILIDAD:
// Generar el índice del ebook usando el plan guardado en R2.
// =====================================================

async function generarIndice(ebookId) {

  const proyecto = await cargarProyectoR2(ebookId);

  if (!proyecto) {
    document.getElementById("estadoIndice").innerText = "🔴 Error";
    logMonitor("❌ No se pudo cargar el proyecto");
    return;
  }

  document.getElementById("estadoIndice").innerText = "🔵 Ejecutando...";
  logMonitor("📑 Generando índice...");

  const res = await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "indice",
      data: {
        id: ebookId,
        proyecto: proyecto
      }
    })
  });

  const result = await res.json();

  if (!result.ok) {
    document.getElementById("estadoIndice").innerText = "🔴 Error";
    logMonitor("❌ Error generando índice");
    return;
  }

  document.getElementById("estadoIndice").innerText = "🟢 Finalizado";

  logMonitor("✔ Índice generado");
  logMonitor("📑 Índice agregado al proyecto");
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: generarLegales()
// RESPONSABILIDAD:
// Generar la sección legal del ebook y actualizar el proyecto en R2.
// =====================================================

async function generarLegales(ebookId) {

  const proyecto = await cargarProyectoR2(ebookId);

  if (!proyecto) {
    document.getElementById("estadoLegales").innerText = "🔴 Error";
    logMonitor("❌ No se pudo cargar el proyecto");
    return;
  }

  document.getElementById("estadoLegales").innerText = "🔵 Ejecutando...";
  logMonitor("⚖️ Generando legales...");

  const res = await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "legales",
      data: {
        id: ebookId,
        proyecto: proyecto
      }
    })
  });

  const result = await res.json();

  if (!result.ok) {
    document.getElementById("estadoLegales").innerText = "🔴 Error";
    logMonitor("❌ Error generando legales");
    return;
  }

  document.getElementById("estadoLegales").innerText = "🟢 Finalizado";

  logMonitor("✔ Legales generados");
  logMonitor("⚖️ Sección legal agregada al proyecto");
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: generarIntroduccion()
// RESPONSABILIDAD:
// Generar la introducción del ebook y actualizar el proyecto en R2.
// =====================================================

async function generarIntroduccion(ebookId) {

  const proyecto = await cargarProyectoR2(ebookId);

  if (!proyecto) {
    document.getElementById("estadoIntro").innerText = "🔴 Error";
    logMonitor("❌ No se pudo cargar el proyecto");
    return;
  }

  document.getElementById("estadoIntro").innerText = "🔵 Ejecutando...";
  logMonitor("📝 Generando introducción...");

  const res = await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "introduccion",
      data: {
        id: ebookId,
        proyecto: proyecto
      }
    })
  });

  const result = await res.json();

  if (!result.ok) {
    document.getElementById("estadoIntro").innerText = "🔴 Error";
    logMonitor("❌ Error generando introducción");
    return;
  }

  document.getElementById("estadoIntro").innerText = "🟢 Finalizado";

  logMonitor("✔ Introducción generada");
  logMonitor("📝 Introducción agregada al proyecto");
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: generarCapitulos()
// RESPONSABILIDAD:
// Generar los capítulos del ebook y actualizar el proyecto en R2.
// =====================================================

async function generarCapitulos(ebookId) {

  const proyecto = await cargarProyectoR2(ebookId);

  if (!proyecto) {
    document.getElementById("estadoCapitulos").innerText = "🔴 Error";
    logMonitor("❌ No se pudo cargar el proyecto");
    return;
  }

  document.getElementById("estadoCapitulos").innerText = "🔵 Ejecutando...";
  logMonitor("📖 Generando capítulos...");

  const res = await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "capitulos",
      data: {
        id: ebookId,
        proyecto: proyecto
      }
    })
  });

  const result = await res.json();

  if (!result.ok) {
    document.getElementById("estadoCapitulos").innerText = "🔴 Error";
    logMonitor("❌ Error generando capítulos");
    return;
  }

  document.getElementById("estadoCapitulos").innerText = "🟢 Finalizado";

  logMonitor("✔ Capítulos generados");
  logMonitor("📖 Contenido agregado al proyecto");
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: generarConclusion()
// RESPONSABILIDAD:
// Generar la conclusión del ebook y actualizar el proyecto en R2.
// =====================================================

async function generarConclusion(ebookId) {

  const proyecto = await cargarProyectoR2(ebookId);

  if (!proyecto) {
    document.getElementById("estadoConclusion").innerText = "🔴 Error";
    logMonitor("❌ No se pudo cargar el proyecto");
    return;
  }

  document.getElementById("estadoConclusion").innerText = "🔵 Ejecutando...";
  logMonitor("🏁 Generando conclusión...");

  const res = await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "conclusion",
      data: {
        id: ebookId,
        proyecto: proyecto
      }
    })
  });

  const result = await res.json();

  if (!result.ok) {
    document.getElementById("estadoConclusion").innerText = "🔴 Error";
    logMonitor("❌ Error generando conclusión");
    return;
  }

  document.getElementById("estadoConclusion").innerText = "🟢 Finalizado";

  logMonitor("✔ Conclusión generada");
  logMonitor("🏁 Conclusión agregada al proyecto");
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: ensamblarEbook()
// RESPONSABILIDAD:
// Unificar todas las secciones del proyecto y dejarlo listo para exportación.
// =====================================================

async function ensamblarEbook(ebookId) {

  const proyecto = await cargarProyectoR2(ebookId);

  if (!proyecto) {
    document.getElementById("estadoEnsamblador").innerText = "🔴 Error";
    logMonitor("❌ No se pudo cargar el proyecto");
    return;
  }

  document.getElementById("estadoEnsamblador").innerText = "🔵 Ejecutando...";
  logMonitor("📦 Ensamblando ebook...");

  const res = await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "ensamblar",
      data: {
        id: ebookId,
        proyecto: proyecto
      }
    })
  });

  const result = await res.json();

  if (!result.ok) {
    document.getElementById("estadoEnsamblador").innerText = "🔴 Error";
    logMonitor("❌ Error ensamblando ebook");
    return;
  }

  document.getElementById("estadoEnsamblador").innerText = "🟢 Finalizado";

  logMonitor("✔ Ebook ensamblado");
  logMonitor("📦 Proyecto listo para exportación");
}

// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: generarEbookCompleto()
// RESPONSABILIDAD:
// Ejecutar todo el pipeline del ebook en secuencia.
// =====================================================

async function generarEbookCompleto() {

  const ebookId = window.currentEbookId;

  if (!ebookId) {
    logMonitor("❌ No hay ebookId activo");
    return;
  }

  logMonitor("🚀 Iniciando pipeline completo del ebook...");

  await generarIndice(ebookId);
  await generarLegales(ebookId);
  await generarIntroduccion(ebookId);
  await generarCapitulos(ebookId);
  await generarConclusion(ebookId);
  await ensamblarEbook(ebookId);

  logMonitor("🎉 Pipeline completo finalizado");
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: iniciarPipelineManual()
// RESPONSABILIDAD:
// Permitir ejecutar el flujo completo desde botón UI.
// =====================================================

async function iniciarPipelineManual() {

  if (!window.currentEbookId) {
    logMonitor("❌ No hay ebook activo");
    return;
  }

  document.getElementById("estadoPipeline").innerText = "🔵 Ejecutando pipeline...";
  logMonitor("🚀 Ejecutando pipeline manual...");

  try {

    await generarIndice(window.currentEbookId);
    await generarLegales(window.currentEbookId);
    await generarIntroduccion(window.currentEbookId);
    await generarCapitulos(window.currentEbookId);
    await generarConclusion(window.currentEbookId);
    await ensamblarEbook(window.currentEbookId);

    document.getElementById("estadoPipeline").innerText = "🟢 Finalizado";
    logMonitor("🎉 Pipeline completado con éxito");

  } catch (err) {

    document.getElementById("estadoPipeline").innerText = "🔴 Error";
    logMonitor("❌ Error en pipeline: " + err.message);
  }
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: guardarEbookLocal()
// RESPONSABILIDAD:
// Guardar copia del ebook en el navegador como backup.
// =====================================================

function guardarEbookLocal(ebookId, proyecto) {

  try {

    const key = `ebook_${ebookId}`;

    localStorage.setItem(key, JSON.stringify(proyecto));

    logMonitor("💾 Backup local guardado: " + ebookId);

    return true;

  } catch (err) {

    logMonitor("❌ Error guardando backup local: " + err.message);

    return false;
  }
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: cargarEbookLocal()
// RESPONSABILIDAD:
// Cargar backup del ebook desde localStorage.
// =====================================================

function cargarEbookLocal(ebookId) {

  try {

    const key = `ebook_${ebookId}`;

    const data = localStorage.getItem(key);

    if (!data) {
      logMonitor("⚠️ No existe backup local: " + ebookId);
      return null;
    }

    const proyecto = JSON.parse(data);

    logMonitor("📂 Backup local cargado: " + ebookId);

    return proyecto;

  } catch (err) {

    logMonitor("❌ Error cargando backup local: " + err.message);

    return null;
  }
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: cargarEbookLocal()
// RESPONSABILIDAD:
// Cargar backup del ebook desde localStorage.
// =====================================================

function cargarEbookLocal(ebookId) {

  try {

    const key = `ebook_${ebookId}`;

    const data = localStorage.getItem(key);

    if (!data) {
      logMonitor("⚠️ No existe backup local: " + ebookId);
      return null;
    }

    const proyecto = JSON.parse(data);

    logMonitor("📂 Backup local cargado: " + ebookId);

    return proyecto;

  } catch (err) {

    logMonitor("❌ Error cargando backup local: " + err.message);

    return null;
  }
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: bindEbookStudioUI()
// RESPONSABILIDAD:
// Conectar botones del UI con el pipeline del ebook.
// =====================================================

function bindEbookStudioUI() {

  const planBtn = document.querySelector("#btnPlan");
  const fullBtn = document.querySelector("#btnPipeline");
  const syncBtn = document.querySelector("#btnSync");

  if (planBtn) {
    planBtn.onclick = generarPlan;
  }

  if (fullBtn) {
    fullBtn.onclick = iniciarPipelineManual;
  }

  if (syncBtn) {
    syncBtn.onclick = () => {
      if (!window.currentEbookId) {
        logMonitor("❌ No hay ebook activo");
        return;
      }
      sincronizarEbookLocalConR2(window.currentEbookId);
    };
  }

  logMonitor("🔌 UI del Ebook Studio conectada");
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: initEbookStudio()
// RESPONSABILIDAD:
// Inicializar estado global del Ebook Studio.
// =====================================================

function initEbookStudio() {

  window.currentEbookId = null;

  logMonitor("📚 Ebook Studio inicializado");

  bindEbookStudioUI();

  document.getElementById("estadoPlan").innerText = "⚪ Planificador";
  document.getElementById("estadoIndice").innerText = "⚪ Índice";
  document.getElementById("estadoLegales").innerText = "⚪ Legales";
  document.getElementById("estadoIntro").innerText = "⚪ Introducción";
  document.getElementById("estadoCapitulos").innerText = "⚪ Capítulos";
  document.getElementById("estadoConclusion").innerText = "⚪ Conclusión";
  document.getElementById("estadoEnsamblador").innerText = "⚪ Ensamblador";
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: setEstadoPipeline()
// RESPONSABILIDAD:
// Actualizar visualmente el estado del pipeline.
// =====================================================

function setEstadoPipeline(paso, estado) {

  const map = {
    plan: "estadoPlan",
    indice: "estadoIndice",
    legales: "estadoLegales",
    introduccion: "estadoIntro",
    capitulos: "estadoCapitulos",
    conclusion: "estadoConclusion",
    ensamblador: "estadoEnsamblador"
  };

  const el = document.getElementById(map[paso]);

  if (!el) return;

  el.innerText = estado;
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: logMonitor()
// RESPONSABILIDAD:
// Registrar eventos en el AI Engine Monitor.
// =====================================================

function logMonitor(text) {

  const box = document.getElementById("monitorIA");

  if (!box) return;

  const time = new Date().toLocaleTimeString();

  box.innerHTML += `[${time}] ${text}<br>`;

  box.scrollTop = box.scrollHeight;
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: bootEbookStudio()
// RESPONSABILIDAD:
// Arranque automático del sistema al cargar la página.
// =====================================================

window.addEventListener("DOMContentLoaded", () => {

  initEbookStudio();

  logMonitor("🚀 Sistema listo");

});
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: safeFetch()
// RESPONSABILIDAD:
// Wrapper seguro para requests al backend con manejo de errores.
// =====================================================

async function safeFetch(payload) {

  try {

    const res = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!data.ok) {
      logMonitor("❌ Error backend: " + (data.error || "desconocido"));
      return null;
    }

    return data;

  } catch (err) {

    logMonitor("❌ Error de red: " + err.message);
    return null;
  }
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: refactorEjemploPlan()
// RESPONSABILIDAD:
// Versión optimizada del llamado al plan usando safeFetch.
// =====================================================

async function generarPlan() {

  const payload = {
    action: "planificar-ebook",
    data: {
      tema: document.getElementById("temaEbook").value,
      paginas: document.getElementById("paginasEbook").value,
      idioma: document.getElementById("idiomaEbook").value,
      tono: document.getElementById("tonoEbook").value,
      publico: document.getElementById("publicoEbook").value,
      autor: document.getElementById("autorEbook").value
    }
  };

  setEstadoPipeline("plan", "🔵 Ejecutando...");
  logMonitor("📋 Generando plan...");

  const result = await safeFetch(payload);

  if (!result) {
    setEstadoPipeline("plan", "🔴 Error");
    return;
  }

  setEstadoPipeline("plan", "🟢 Finalizado");

  logMonitor("✔ Plan generado");
  logMonitor("📦 ID: " + result.data.id);

  window.currentEbookId = result.data.id;
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: runStep()
// RESPONSABILIDAD:
// Ejecutar un paso individual del pipeline de forma genérica.
// =====================================================

async function runStep(step, ebookId) {

  if (!ebookId) {
    logMonitor("❌ No hay ebookId");
    return null;
  }

  setEstadoPipeline(step, "🔵 Ejecutando...");
  logMonitor(`⚙️ Ejecutando ${step}...`);

  const proyecto = await cargarEbookLocal(ebookId) 
                  || await cargarProyectoR2(ebookId);

  const result = await safeFetch({
    action: step,
    data: {
      id: ebookId,
      proyecto: proyecto
    }
  });

  if (!result) {
    setEstadoPipeline(step, "🔴 Error");
    return null;
  }

  setEstadoPipeline(step, "🟢 Finalizado");

  logMonitor(`✔ ${step} completado`);

  return result;
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: ejecutarPipelineEbook()
// RESPONSABILIDAD:
// Ejecutar todo el flujo del ebook usando runStep().
// =====================================================

async function ejecutarPipelineEbook() {

  const ebookId = window.currentEbookId;

  if (!ebookId) {
    logMonitor("❌ No hay ebook activo");
    return;
  }

  logMonitor("🚀 Iniciando pipeline completo...");

  await runStep("indice", ebookId);
  await runStep("legales", ebookId);
  await runStep("introduccion", ebookId);
  await runStep("capitulos", ebookId);
  await runStep("conclusion", ebookId);
  await runStep("ensamblador", ebookId);

  logMonitor("🎉 Pipeline finalizado");
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: autoSavePipelineState()
// RESPONSABILIDAD:
// Guardar automáticamente el estado del proyecto en localStorage.
// =====================================================

function autoSavePipelineState(ebookId, proyecto) {

  try {

    if (!ebookId || !proyecto) {
      return;
    }

    const key = `ebook_${ebookId}_autosave`;

    localStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      proyecto: proyecto
    }));

    logMonitor("💾 Auto-save actualizado");

  } catch (err) {

    logMonitor("❌ Error en auto-save: " + err.message);
  }
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: startAutoSave()
// RESPONSABILIDAD:
// Activar guardado automático periódico del proyecto en memoria local.
// =====================================================

function startAutoSave(intervalMs = 30000) {

  if (!window.currentEbookId) {
    logMonitor("⚠️ Auto-save no iniciado: sin ebook activo");
    return;
  }

  logMonitor("⏱️ Auto-save activado");

  setInterval(async () => {

    try {

      const ebookId = window.currentEbookId;

      if (!ebookId) return;

      const proyecto = await cargarProyectoR2(ebookId);

      if (!proyecto) return;

      autoSavePipelineState(ebookId, proyecto);

    } catch (err) {

      logMonitor("❌ Error auto-save loop: " + err.message);
    }

  }, intervalMs);
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: getPipelineStatus()
// RESPONSABILIDAD:
// Obtener el estado actual del pipeline del ebook desde R2 o local.
// =====================================================

async function getPipelineStatus(ebookId) {

  if (!ebookId) return null;

  const proyecto = await cargarProyectoR2(ebookId);

  if (!proyecto) {
    logMonitor("⚠️ No se pudo obtener estado del proyecto");
    return null;
  }

  const estado = proyecto.estado || {};

  logMonitor("📊 Estado del pipeline consultado");

  return estado;
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: refreshPipelineUI()
// RESPONSABILIDAD:
// Refrescar la UI del pipeline según el estado del proyecto.
// =====================================================

async function refreshPipelineUI() {

  const ebookId = window.currentEbookId;

  if (!ebookId) {
    logMonitor("⚠️ No hay ebook activo");
    return;
  }

  const estado = await getPipelineStatus(ebookId);

  if (!estado) {
    return;
  }

  setEstadoPipeline("plan", estado.plan ? "🟢 OK" : "⚪ Pendiente");
  setEstadoPipeline("indice", estado.indice ? "🟢 OK" : "⚪ Pendiente");
  setEstadoPipeline("legales", estado.legales ? "🟢 OK" : "⚪ Pendiente");
  setEstadoPipeline("introduccion", estado.introduccion ? "🟢 OK" : "⚪ Pendiente");
  setEstadoPipeline("capitulos", estado.capitulos ? "🟢 OK" : "⚪ Pendiente");
  setEstadoPipeline("conclusion", estado.conclusion ? "🟢 OK" : "⚪ Pendiente");
  setEstadoPipeline("ensamblador", estado.ensamblador ? "🟢 OK" : "⚪ Pendiente");

  logMonitor("🔄 UI del pipeline actualizada");
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: healthCheckSystem()
// RESPONSABILIDAD:
// Verificar estado general del sistema (frontend + backend + R2).
// =====================================================

async function healthCheckSystem() {

  const ebookId = window.currentEbookId;

  logMonitor("🧪 Ejecutando health check...");

  if (!ebookId) {
    logMonitor("⚠️ Sin ebook activo");
  }

  try {

    const res = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "health",
        data: {
          id: ebookId
        }
      })
    });

    const result = await res.json();

    if (!result.ok) {
      logMonitor("❌ Backend no saludable");
      return false;
    }

    const local = cargarEbookLocal(ebookId);

    logMonitor("📦 R2 OK");
    logMonitor(local ? "💾 Local OK" : "⚠️ Sin backup local");

    logMonitor("🟢 Sistema estable");

    return true;

  } catch (err) {

    logMonitor("❌ Health check falló: " + err.message);
    return false;
  }
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: resetPipeline()
// RESPONSABILIDAD:
// Reiniciar el estado del pipeline sin borrar el proyecto.
// =====================================================

function resetPipeline() {

  const pasos = [
    "plan",
    "indice",
    "legales",
    "introduccion",
    "capitulos",
    "conclusion",
    "ensamblador"
  ];

  pasos.forEach(paso => {
    setEstadoPipeline(paso, "⚪ Pendiente");
  });

  logMonitor("🔄 Pipeline reiniciado (sin borrar datos)");
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: exportarEbookJSON()
// RESPONSABILIDAD:
// Exportar el proyecto completo como archivo JSON descargable.
// =====================================================

function exportarEbookJSON() {

  const ebookId = window.currentEbookId;

  if (!ebookId) {
    logMonitor("❌ No hay ebook activo");
    return;
  }

  const local = cargarEbookLocal(ebookId);

  if (!local) {
    logMonitor("❌ No hay datos locales para exportar");
    return;
  }

  const blob = new Blob(
    [JSON.stringify(local, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `ebook_${ebookId}.json`;
  a.click();

  URL.revokeObjectURL(url);

  logMonitor("📤 Ebook exportado");
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: importarEbookJSON()
// RESPONSABILIDAD:
// Importar un ebook desde un archivo JSON al sistema.
// =====================================================

function importarEbookJSON(event) {

  const file = event.target.files[0];

  if (!file) {
    logMonitor("❌ No se seleccionó archivo");
    return;
  }

  const reader = new FileReader();

  reader.onload = async (e) => {

    try {

      const data = JSON.parse(e.target.result);

      if (!data || !data.id) {
        logMonitor("❌ Archivo inválido");
        return;
      }

      const ebookId = data.id;

      localStorage.setItem(`ebook_${ebookId}`, JSON.stringify(data));

      window.currentEbookId = ebookId;

      logMonitor("📥 Ebook importado: " + ebookId);

      await refreshPipelineUI();

    } catch (err) {

      logMonitor("❌ Error importando ebook: " + err.message);
    }
  };

  reader.readAsText(file);
}


// MENÚ MÓVIL
function toggleMenu() {


  const menu =
    document.querySelector(".nav-links");

  menu.classList.toggle("active");

}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: createNewEbookSession()
// RESPONSABILIDAD:
// Crear una nueva sesión limpia de ebook en el sistema.
// =====================================================

function createNewEbookSession() {

  const id = crypto.randomUUID();

  window.currentEbookId = id;

  const emptyProject = {
    id,
    createdAt: Date.now(),
    plan: null,
    indice: null,
    legales: null,
    introduccion: null,
    capitulos: null,
    conclusion: null,
    ensamblador: null,
    estado: {}
  };

  localStorage.setItem(`ebook_${id}`, JSON.stringify(emptyProject));

  logMonitor("🆕 Nueva sesión creada: " + id);

  resetPipeline();
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: attachQuickActions()
// RESPONSABILIDAD:
// Conectar acciones rápidas del editor (botones globales).
// =====================================================

function attachQuickActions() {

  const newBtn = document.querySelector("#btnNewEbook");
  const exportBtn = document.querySelector("#btnExport");
  const importInput = document.querySelector("#importEbookFile");
  const refreshBtn = document.querySelector("#btnRefreshUI");

  if (newBtn) {
    newBtn.onclick = createNewEbookSession;
  }

  if (exportBtn) {
    exportBtn.onclick = exportarEbookJSON;
  }

  if (importInput) {
    importInput.onchange = importarEbookJSON;
  }

  if (refreshBtn) {
    refreshBtn.onclick = refreshPipelineUI;
  }

  logMonitor("⚡ Acciones rápidas conectadas"
);

}

// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: bootSystem()
// RESPONSABILIDAD:
// Inicialización completa del sistema Ebook Studio.
// =====================================================

window.addEventListener("DOMContentLoaded", () => {

  initEbookStudio();

  attachQuickActions();

  startAutoSave(30000);

  logMonitor("🚀 Ebook Studio completamente inicializado");
});
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: emergencyRecovery()
// RESPONSABILIDAD:
// Recuperar el último estado disponible del sistema (localStorage o R2).
// =====================================================

async function emergencyRecovery() {

  logMonitor("🛟 Iniciando recuperación de emergencia...");

  try {

    const localKeys = Object.keys(localStorage).filter(k => k.startsWith("ebook_"));

    if (localKeys.length === 0) {
      logMonitor("⚠️ No hay backups locales");
      return;
    }

    const lastKey = localKeys.sort().pop();
    const localData = JSON.parse(localStorage.getItem(lastKey));

    if (!localData || !localData.id) {
      logMonitor("❌ Backup local inválido");
      return;
    }

    window.currentEbookId = localData.id;

    logMonitor("📂 Recuperado desde local: " + localData.id);

    await refreshPipelineUI();

  } catch (err) {

    logMonitor("❌ Error en recuperación: " + err.message);
  }
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: validateSystemIntegrity()
// RESPONSABILIDAD:
// Validar coherencia entre UI, localStorage y R2.
// =====================================================

async function validateSystemIntegrity() {

  const ebookId = window.currentEbookId;

  if (!ebookId) {
    logMonitor("⚠️ Sin ebook activo");
    return false;
  }

  try {

    const local = cargarEbookLocal(ebookId);
    const remote = await cargarProyectoR2(ebookId);

    const localOk = !!local;
    const remoteOk = !!remote;

    logMonitor("🔍 Validando integridad del sistema...");

    if (!localOk && !remoteOk) {
      logMonitor("❌ No existe proyecto en ningún lado");
      return false;
    }

    if (localOk && !remoteOk) {
      logMonitor("⚠️ Solo existe localStorage");
    }

    if (!localOk && remoteOk) {
      logMonitor("⚠️ Solo existe R2");
    }

    if (localOk && remoteOk) {
      logMonitor("🟢 Sistema consistente");
    }

    return true;

  } catch (err) {

    logMonitor("❌ Error validando sistema: " + err.message);
    return false;
  }
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: destroySession()
// RESPONSABILIDAD:
// Cerrar sesión del ebook activo sin eliminar datos en R2.
// =====================================================

function destroySession() {

  const ebookId = window.currentEbookId;

  if (!ebookId) {
    logMonitor("⚠️ No hay sesión activa");
    return;
  }

  window.currentEbookId = null;

  logMonitor("🔒 Sesión cerrada: " + ebookId);

  resetPipeline();
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: debounce()
// RESPONSABILIDAD:
// Evitar ejecuciones repetidas rápidas de funciones críticas.
// =====================================================

function debounce(fn, delay = 500) {

  let timer;

  return (...args) => {

    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: throttle()
// RESPONSABILIDAD:
// Limitar la frecuencia de ejecución de funciones críticas.
// =====================================================

function throttle(fn, limit = 1000) {

  let lastCall = 0;

  return (...args) => {

    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: delay()
// RESPONSABILIDAD:
// Pausar ejecución de funciones asincrónicas (sleep).
// =====================================================

function delay(ms) {

  return new Promise(resolve => setTimeout(resolve, ms));
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: retryRequest()
// RESPONSABILIDAD:
// Reintentar requests fallidos al backend con backoff simple.
// =====================================================

async function retryRequest(payload, retries = 3, delayMs = 800) {

  for (let i = 0; i < retries; i++) {

    try {

      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data && data.ok) return data;

      throw new Error("Respuesta no válida");

    } catch (err) {

      logMonitor(`⚠️ Intento ${i + 1} falló`);

      if (i < retries - 1) {
        await delay(delayMs * (i + 1));
      } else {
        logMonitor("❌ Todos los intentos fallaron");
        return null;
      }
    }
  }
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: normalizeProject()
// RESPONSABILIDAD:
// Asegurar que la estructura del proyecto siempre sea consistente.
// =====================================================

function normalizeProject(project) {

  if (!project) return null;

  return {
    id: project.id || crypto.randomUUID(),
    createdAt: project.createdAt || Date.now(),
    plan: project.plan || null,
    indice: project.indice || null,
    legales: project.legales || null,
    introduccion: project.introduccion || null,
    capitulos: project.capitulos || null,
    conclusion: project.conclusion || null,
    ensamblador: project.ensamblador || null,
    estado: project.estado || {}
  };
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: mergeProjectUpdate()
// RESPONSABILIDAD:
// Fusionar nuevas secciones al proyecto sin sobrescribir datos existentes.
// =====================================================

function mergeProjectUpdate(existingProject, newData) {

  const base = normalizeProject(existingProject);
  const update = normalizeProject(newData);

  return {
    ...base,
    ...update,
    estado: {
      ...base.estado,
      ...update.estado
    }
  };
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: updateProjectState()
// RESPONSABILIDAD:
// Actualizar el estado del pipeline en el proyecto y persistir en R2.
// =====================================================

async function updateProjectState(ebookId, step, value = true) {

  try {

    const proyecto = await cargarProyectoR2(ebookId);

    if (!proyecto) {
      logMonitor("❌ No se pudo cargar proyecto para actualizar estado");
      return false;
    }

    if (!proyecto.estado) {
      proyecto.estado = {};
    }

    proyecto.estado[step] = value;

    await env.EBOOKS.put(
      `ebooks/${ebookId}.json`,
      JSON.stringify(proyecto)
    );

    logMonitor(`📌 Estado actualizado: ${step} = ${value}`);

    return true;

  } catch (err) {

    logMonitor("❌ Error actualizando estado: " + err.message);
    return false;
  }
}
// =====================================================
// PIXELLAB45 EBOOK V3
// FUNCIÓN: markStepDone()
// RESPONSABILIDAD:
// Marcar un paso como completado y refrescar UI automáticamente.
// =====================================================

async function markStepDone(ebookId, step) {

  const ok = await updateProjectState(ebookId, step, true);

  if (!ok) {
    setEstadoPipeline(step, "🔴 Error");
    return false;
  }

  setEstadoPipeline(step, "🟢 OK");

  logMonitor(`✅ Paso completado: ${step}`);

  await refreshPipelineUI();

  return true;
}
// =====================================================
// TEST PIXELLAB45 (MOBILE)
// FUNCIÓN: testPlan()
// RESPONSABILIDAD:
// Probar planificar-ebook y mostrar resultado en pantalla.
// =====================================================

async function testPlan() {

  const output = document.getElementById("monitorIA");

  const payload = {
    action: "planificar-ebook",
    data: {
      tema: "IA aplicada a productividad",
      paginas: 10,
      idioma: "es",
      tono: "profesional",
      publico: "tecnología",
      autor: "PIXELLAB45"
    }
  };

  output.innerHTML += "🧪 Enviando plan...<br>";

  try {

    const res = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    output.innerHTML += "📥 Respuesta recibida<br>";

    if (result.ok) {

      output.innerHTML += "🟢 PLAN OK<br>";
      output.innerHTML += "🆔 ID: " + result.data.id + "<br>";

    } else {

      output.innerHTML += "🔴 ERROR EN PLAN<br>";
      output.innerHTML += JSON.stringify(result) + "<br>";
    }

  } catch (err) {

    output.innerHTML += "❌ ERROR RED: " + err.message + "<br>";
  }
}

// INICIO
window.onload = () => {

  cargarGaleriaCompleta();

};
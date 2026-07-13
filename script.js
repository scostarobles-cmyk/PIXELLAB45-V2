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
let proyectoActual = null;
let projectIdActual = null; 
let continuarCapitulosAutomatico = false;
let preguntarContinuarCapitulos = true;

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
 alert("medio del código");
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

async function generarImagenPuter() {

  const prompt = document.getElementById("promptImagen").value.trim();
  const categoria = document.getElementById("categoriaImagen").value;
  const resultado = document.getElementById("resultadoImagen");

  if (!prompt) {
    resultado.innerHTML = "⚠️ Escribe un prompt.";
    return;
  }

  try {

    resultado.innerHTML = "🧠 Creando prompt visual...";

    // 1. Generar prompt visual con Worker
    const resVisual = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "visual",
        tema: prompt
      })
    });

    const dataVisual = await resVisual.json();

    if (!dataVisual.resultado) {
      throw new Error("No se pudo generar el prompt visual.");
    }

    const promptVisual = dataVisual.resultado;


    resultado.innerHTML = "🎨 Generando imagen...";


    // 2. Generar imagen con Puter + Gemini Imagen
    const imagen = await puter.ai.txt2img(
      promptVisual,
      {
        provider: "gemini",
        model: "google/imagen-4.0-fast"
      }
    );


    // 3. Mostrar imagen
    resultado.innerHTML = "";
    resultado.appendChild(imagen);


    // 4. Convertir imagen a Base64 limpio
    const canvas = document.createElement("canvas");

    canvas.width = imagen.naturalWidth;
    canvas.height = imagen.naturalHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(imagen, 0, 0);

    const imagenBase64 = canvas
      .toDataURL("image/png")
      .split(",")[1];


    // 5. Guardar en R2
    const guardar = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "guardar-imagen",
        categoria,
        imagen: imagenBase64
      })
    });


    const dataGuardar = await guardar.json();

    if (dataGuardar.ok) {

      console.log(
        "✅ Imagen guardada:",
        dataGuardar.nombre
      );

    } else {

      console.error(
        "❌ Error guardando:",
        dataGuardar.error
      );

    }


  } catch (error) {

    console.error(error);

    resultado.innerHTML =
      "❌ Error generando imagen: " + error.message;

  }

}
//=====================================================
// FUNCIÓN: crearProyecto()
// Descripción:
// Lee los datos del formulario del eBook, crea el
// proyecto con un ID único, establece el estado inicial
// "produccion" y lo guarda como proyecto.json en R2.
//=====================================================

async function crearProyecto() {

  const btn = document.getElementById("btnProyecto");
  const estado = document.getElementById("estadoProyecto");
  const monitor = document.getElementById("monitorIA");

  const tema = document.getElementById("temaEbook").value.trim();
  const autor = document.getElementById("autorEbook").value.trim();
  const paginas = parseInt(document.getElementById("paginasEbook").value);
  const idioma = document.getElementById("idiomaEbook").value;
  const tono = document.getElementById("tonoEbook").value;
  const publico = document.getElementById("publicoEbook").value;

  if (!tema) {
    monitor.innerHTML += "❌ Debes ingresar el título del eBook.<br>";
    return;
  }

  if (!autor) {
    monitor.innerHTML += "❌ Debes ingresar el autor.<br>";
    return;
  }

  btn.disabled = true;
  btn.style.background = "#009dff";
  btn.innerHTML = "📁 Generando proyecto...";

  estado.innerHTML = "🔵 Creando proyecto...";

  monitor.innerHTML += "📁 Creando proyecto...<br><br>";

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

    await guardarJSON(
      `proyectos/${projectId}/proyecto.json`,
      proyecto
    );

    proyectoActual = proyecto;
projectIdActual = proyecto.projectId;

    monitor.innerHTML += "✅ Proyecto creado correctamente.<br>";
    monitor.innerHTML += "<pre>" + JSON.stringify(proyecto, null, 2) + "</pre>";

    estado.innerHTML = "🟢 Proyecto creado";

btn.classList.add("completo");
btn.innerHTML = "✅ Proyecto creado";
await verificarProyecto();

  }
  catch (err) {

    console.error(err);

    monitor.innerHTML += `❌ ${err.message}<br>`;

    estado.innerHTML = "🔴 Error";

    btn.style.background = "#d32f2f";
    btn.innerHTML = "❌ Error";

  }

  btn.disabled = false;

}
// =====================================================
// FUNCIÓN: guardarJSON()
// Descripción:
// Toma una ruta y un objeto JSON, y guarda el objeto en R2 en esa ruta específica.
// Parámetros:
//   ruta -> Ruta completa donde se guardará el JSON.
//   datos -> Objeto JSON a guardar.
// Retorno:
//   Devuelve un booleano (true) si se guardó correctamente.
// =====================================================

async function guardarJSON(ruta, datos) {

  await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "guardar-json",
      ruta: ruta,
      json: datos
    })
  });

  return true;
}
//=====================================================
// FUNCIÓN: cargarJSON()
// Descripción:
// Carga cualquier archivo JSON desde R2.
//=====================================================

async function cargarJSON(ruta) {

    const respuesta = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "cargar-json",
            ruta: ruta
        })
    });

    const datos = await respuesta.json();

    if (!datos.ok) return null;

    return datos.json;

}
//=====================================
// ACTUALIZAR INDICADOR PIPELINE
//=====================================

function actualizarIndicador(id, estado = "verde") {

    const indicador = document.getElementById(id);

    if (!indicador) return;


    let texto = indicador.textContent;


    // Quitar círculo actual
    texto = texto.replace(/^⚪|^🟢|^🔵/, "");


    let circulo = "⚪";


    if (estado === "verde") {
        circulo = "🟢";
    }


    if (estado === "azul") {
        circulo = "🔵";
    }


    if (estado === "blanco") {
        circulo = "⚪";
    }


    indicador.textContent = circulo + texto;

}
//=====================================================
// FUNCIÓN: verificarProyecto()
// Descripción:
// Solicita al Worker la búsqueda del proyecto activo
// en R2 y continúa según el estado del proyecto.
//=====================================================

async function verificarProyecto() {

    monitor("🔍 Verificando proyecto...");

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
monitor("📦 proyectoCreado:");
monitor(JSON.stringify(datos.proyectoCreado));

monitor("📦 proyectoProduccion:");
monitor(JSON.stringify(datos.proyectoProduccion));
        //------------------------------------
        // VARIABLES LOCALES
        //------------------------------------

        const proyectoCreado = datos.proyectoCreado;
        const proyectoProduccion = datos.proyectoProduccion;

        //------------------------------------
        // PROYECTO CREADO
        //------------------------------------

        if (proyectoCreado) {

            monitor("✅ Proyecto creado exitosamente.");
            monitor("🆔 ID: " + proyectoCreado.projectId);
            monitor("📖 " + proyectoCreado.titulo);
            monitor("👉 Genere un nuevo proyecto para continuar.");

        }

        //------------------------------------
        // PROYECTO EN PRODUCCIÓN
        //------------------------------------

        if (proyectoProduccion) {

            proyectoActual = proyectoProduccion;
            projectIdActual = proyectoActual.projectId;

        }

        //------------------------------------
        // SIN PROYECTOS
        //------------------------------------

        if (!proyectoCreado && !proyectoProduccion) {

            monitor("🆕 No existe ningún proyecto.");
            monitor("👉 Cree un proyecto para comenzar.");

        }

    } catch (error) {

        console.error(error);

        monitor("❌ Error verificando proyecto.");
        monitor(error.message);

    }

}

window.addEventListener("load", async () => {

    await verificarProyecto();

});

//=====================================================
// FUNCIÓN: monitor()
// Descripción:
// Escribe un mensaje en el monitor.
//=====================================================

function monitor(texto, limpiar = false) {

    const monitor = document.getElementById("monitorIA");
    const monitorBotonera = document.getElementById("monitorBotonera");

    if (limpiar) {

        monitor.innerHTML = "";
        monitorBotonera.innerHTML = "";

    }

    monitor.innerHTML += texto + "<br>";
    monitorBotonera.innerHTML += texto + "<br>";

}

//=====================================
// GENERAR PLAN
//=====================================

async function generarPlan2() {

    monitor("📋 Generando plan...");

    try {

        const respuesta = await fetch(WORKER_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                action: "generar-plan"

            })

        });


        const datos = await respuesta.json();


        if (!datos.ok) {

    monitor("❌ Error generando plan.");
    monitor(JSON.stringify(datos));

    return;

}

        monitor("✅ Plan generado correctamente.");


        // Actualizar indicador del pipeline

        actualizarIndicador(
            "estadoPlan",
            "verde"
        );
const btn = document.getElementById("btnPlan");

btn.classList.add("completo");
btn.innerHTML = "✅ Plan generado";
btn.disabled = true;
await verificarProyecto();
    } catch (error) {

        console.error(error);

        monitor("❌ Error comunicando con el Worker.");
        monitor(error.message);

    }

}

async function generarIndice() {

    monitor("📚 Generando índice...");

    try {

        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "generar-indice"
            })
        });

        const data = await response.json();

        if (data.ok) {
            monitor(JSON.stringify(data, null, 2));
            monitor("✅ Índice generado correctamente.");
            const btn = document.getElementById("btnIndice");

btn.classList.add("completo");
btn.innerHTML = "✅ Índice generado";
btn.disabled = true;

            await verificarProyecto();

        } else {

            monitor("❌ Error generando índice.");
           /* monitor(data.error);
            monitor(data.stack);*/
            monitor(JSON.stringify(data));
        }

    } catch (error) {

        monitor("❌ Error de conexión.");
        monitor(error.message);

    }

}





//=====================================
// BOTONES
//=====================================

function habilitarBoton(id) {

    const boton = document.getElementById(id);

    if (!boton) return;

    boton.disabled = false;

}

function deshabilitarBoton(id) {

    const boton = document.getElementById(id);

    if (!boton) return;

    boton.disabled = true;

}

function botonVerde(id) {

    const boton = document.getElementById(id);

    if (!boton) return;

    boton.classList.remove("amarillo", "azul");
    boton.classList.add("verde");

}

function botonAmarillo(id) {

    const boton = document.getElementById(id);

    if (!boton) return;

    boton.classList.remove("verde", "azul");
    boton.classList.add("amarillo");

}

function botonAzul(id) {

    const boton = document.getElementById(id);

    if (!boton) return;

    boton.classList.remove("verde", "amarillo");
    boton.classList.add("azul");

}

function botonNormal(id) {

    const boton = document.getElementById(id);

    if (!boton) return;

    boton.classList.remove("verde", "amarillo", "azul");

    boton.style.background = "";
    boton.style.color = "";

}
//=====================================
// RESTAURAR INTERFAZ
//=====================================

function restaurarInterfaz() {

    //==========================
    // Limpiar variables globales
    //==========================

    proyectoActual = null;
    plan = null;

    // Si tenés otras variables globales
    // también se limpian aquí.


    //==========================
    // Restaurar indicadores
    //==========================

    actualizarIndicador("estadoProyecto", "blanco");
    actualizarIndicador("estadoPlan", "blanco");
    actualizarIndicador("estadoIndice", "blanco");
    actualizarIndicador("estadoLegales", "blanco");
    actualizarIndicador("estadoIntro", "blanco");
    actualizarIndicador("estadoCapitulos", "blanco");
    actualizarIndicador("estadoConclusion", "blanco");


    //==========================
    // Restaurar botones
    //==========================

    botonNormal("btnProyecto");
    botonNormal("btnPlan");
    botonNormal("btnIndice");
    botonNormal("btnLegales");
    botonNormal("btnIntroduccion");
    botonNormal("btnCapitulos");
    botonNormal("btnConclusion");


    //==========================
    // Habilitar / Deshabilitar
    //==========================

    habilitarBoton("btnProyecto");

    deshabilitarBoton("btnPlan");
    deshabilitarBoton("btnIndice");
    deshabilitarBoton("btnLegales");
    deshabilitarBoton("btnIntroduccion");
    deshabilitarBoton("btnCapitulos");
    deshabilitarBoton("btnConclusion");



    //==========================
    // Mensaje final
    //==========================
    // Limpiar el monitor
document.getElementById("monitor").innerHTML = "";

// Mostrar el nuevo mensaje
monitor("🎉 Sistema listo para crear un nuevo Ebook.");

}

async function generarLegales() {

    monitor("📄 Generando legales...");

    try {

        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "generar-legales"
            })
        });


        const resultado = await respuesta.json();


        if (!resultado.ok) {

            monitor(
                "❌ Error generando legales: " + resultado.error
            );

            return;
        }


        monitor("✅ Página de legales creada correctamente.");

        // Actualizar interfaz si existe indicador
        if (typeof actualizarEstadoProyecto === "function") {
            actualizarEstadoProyecto("legales", "creado");
        }

await verificarProyecto();
    } catch (error) {

        console.error(error);

        monitor(
            "❌ Error de conexión al generar legales."
        );

    }

}
async function generarIntroduccion() {

    monitor("📖 Generando introducción...");

    try {

        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "generar-introduccion"
            })
        });


        const resultado = await respuesta.json();


        if (!resultado.ok) {

            monitor(
                "❌ Error generando introducción: " + resultado.error
            );

            return;
        }


        monitor("✅ Introducción creada correctamente.");


        if (typeof actualizarEstadoProyecto === "function") {
            actualizarEstadoProyecto(
                "introduccion",
                "creado"
            );
        }

await verificarProyecto();
    } catch (error) {

        console.error(error);

        monitor(
            "❌ Error de conexión al generar introducción."
        );

    }

}

//=====================================
// GENERAR CAPÍTULOS
//=====================================

async function generarCapitulos() {

    monitor("📖 Generando capítulo...");

    try {

        const respuesta = await fetch(
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

            monitor(
                "❌ Error generando capítulo: " +
                resultado.error
            );

            return;

        }


        monitor(
            `✅ Capítulo ${resultado.numero} generado correctamente.`
        );


        //------------------------------------
        // CONTROL MANUAL / AUTOMÁTICO
        //------------------------------------

        if (preguntarContinuarCapitulos) {

            preguntarSiguienteCapitulo();


        } else {


            //------------------------------------
            // CARGAR PLAN TEMPORALMENTE
            //------------------------------------

            const plan = await cargarJSON(
                `proyectos/${projectIdActual}/plan.json`
            );


            if (!plan || !plan.capitulos) {

                monitor("❌ No se pudo cargar el plan.");

                return;

            }


            const quedanPendientes =
                plan.capitulos.some(
                    capitulo => capitulo.estado !== "creado"
                );


            //------------------------------------
            // SI QUEDAN CAPÍTULOS, CONTINÚA
            //------------------------------------

            if (quedanPendientes) {

                await generarCapitulos();

            } else {


                //------------------------------------
                // TODOS LOS CAPÍTULOS TERMINADOS
                //------------------------------------

                monitor(
                    "✅ Todos los capítulos fueron generados."
                );


                await verificarProyecto();

            }

        }


    } catch (error) {

        console.error(error);


        monitor(
            "❌ Error generando capítulo."
        );


        monitor(error.message);

    }

}
function preguntarSiguienteCapitulo() {

    // Evitar duplicar el modal
    if (document.getElementById("modalCapitulos")) {
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

document.getElementById("btnContinuarCapitulo").onclick = async () => {

    const chk = document.getElementById("chkNoPreguntarCapitulos");

    if (chk.checked) {

    preguntarContinuarCapitulos = false;
    continuarCapitulosAutomatico = true;

}

    overlay.remove();

    // Continúa con el flujo normal
    await generarCapitulos();

};


//-------------------------------
// PAUSAR
//-------------------------------

document.getElementById("btnPausarCapitulo").onclick = () => {

    overlay.remove();

    monitor("⏸ Generación de capítulos pausada.");

};

}

async function generarConclusion() {

    monitor("📖 Generando conclusión...");

    try {

        const respuesta = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "generar-conclusion"
            })
        });

        const resultado = await respuesta.json();

        if (!resultado.ok) {

            monitor(
                "❌ Error generando conclusión: " + resultado.error
            );

            return;

        }

        monitor("✅ Conclusión creada correctamente.");

        if (typeof actualizarEstadoProyecto === "function") {

            actualizarEstadoProyecto(
                "conclusion",
                "creado"
            );

        }
        await verificarProyecto();

    } catch (error) {

        console.error(error);

        monitor(
            "❌ Error de conexión al generar conclusión."
        );

    }

}



// MENÚ MÓVIL
function toggleMenu() {


  const menu =
    document.querySelector(".nav-links");

  menu.classList.toggle("active");

}


// INICIO
window.onload = () => {

  cargarGaleriaCompleta();

};

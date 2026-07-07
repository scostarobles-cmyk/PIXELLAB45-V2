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
        action: "generar-plan",
        tema: document.getElementById("temaEbook").value,
        paginas: Number(document.getElementById("paginasEbook").value),
        idioma: document.getElementById("idiomaEbook").value,
        tono: document.getElementById("tonoEbook").value,
        publico: document.getElementById("publicoEbook").value,
        autor: document.getElementById("autorEbook").value
    };

    try {

        const res = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const plan = await res.json();

        document.getElementById("monitorIA").innerHTML =
            "<pre>" + JSON.stringify(plan, null, 2) + "</pre>";

    } catch (err) {

        document.getElementById("monitorIA").innerHTML =
            "<b>Error:</b> " + err.message;

    }

}
async function generarImagenPixasso(){

  const prompt =
    document.getElementById("promptImagen").value;
alert(prompt);

  const respuesta = await fetch(
    WORKER_URL,
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        action:"imagen_pixasso",
        prompt:prompt
      })
    }
  );


  const data = await respuesta.json();
  alert("contenido de data");
alert(JSON.stringify(data));

  if(data.imagen){

    document.getElementById("loadingImagen").src =
      data.imagen;

  } else {
  	alert("else");

    console.log(data);
    alert(data);

  }

}

// INICIO
window.onload = () => {

  cargarGaleriaCompleta();

};
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
window.generarPlan = generarPlan;
console.log("SCRIPT CARGADO OK");
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
        tipo: "listar-imagenes"
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
        tipo: "listar-categoria",
        categoria: categoria
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

    contenedor.innerHTML =
      "❌ Error cargando categoría";

    console.error(error);

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
        tipo: "ideas",
        tema
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
        tipo: "guardar-ideas",
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
          tipo: "prompt",
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
        tipo: "guardar-prompts",
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
        tipo: "visual",
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
        tipo: "guardar-visuales",
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

    const res = await fetch(
      WORKER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "script",
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
        tipo: "guardar-guion",
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
        tipo: "storyboard",
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
      tipo: "guardar-storyboard",
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
        tipo: "imagen",
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
    tipo: "guardar-imagen",
    categoria,
    imagen: base64
  })
});

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

async function generarEbook() {

  const tema = document.getElementById("temaEbook").value;
  const paginas = document.getElementById("paginasEbook").value;

  const resultado = document.getElementById("resultadoEbook");
  const loading = document.getElementById("loadingEbook");
  const barra = document.getElementById("barraEbook");
  const estado = document.getElementById("estadoEbook");

  if (!tema.trim()) {
    resultado.innerText = "⚠️ Escribe un tema para el ebook";
    return;
  }

  loading.style.display = "block";
  resultado.innerHTML = "";

  // 🔥 ANIMACIÓN VIVA (NO BLOQUEA NADA)
  const frames = [
    "📚 Analizando tema",
    "🧠 Generando estructura",
    "📑 Construyendo índice",
    "✍️ Escribiendo contenido",
    "📄 Armando capítulos",
    "🧩 Ensamblando ebook",
    "💾 Preparando salida"
  ];

  let i = 0;
  let progreso = 5;

  const anim = setInterval(() => {

    estado.innerText = frames[i % frames.length];

    progreso += Math.random() * 3;
    if (progreso > 90) progreso = 90;

    barra.style.width = progreso + "%";

    // 🔥 efecto visual extra (evita sensación de congelado)
    const dot = document.createElement("span");
    dot.innerText = " .";
    resultado.appendChild(dot);

    setTimeout(() => dot.remove(), 800);

    i++;

  }, 1200);

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tipo: "ebook",
        tema,
        paginas
      })
    });

    const data = await res.json();

    clearInterval(anim);

    barra.style.width = "100%";
    estado.innerText = "✅ Listo";

    resultado.innerHTML = data.resultado;

  } catch (error) {

    clearInterval(anim);

    estado.innerText = "❌ Error";

    resultado.innerText = error.message;
  }
}
async function listarEbooks() {

  const select =
    document.getElementById("ebookSeleccion");

  select.innerHTML =
    '<option>Cargando...</option>';

  try {

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tipo: "listar-ebooks"
      })
    });

    const data = await res.json();

    select.innerHTML =
      '<option value="">📖 Seleccionar Ebook...</option>';

    data.ebooks.forEach(ebook => {

      select.innerHTML += `
        <option value="${ebook.ruta}">
          ${ebook.nombre}
        </option>
      `;

    });

  } catch (error) {

    select.innerHTML =
      '<option>Error cargando ebooks</option>';

    console.error(error);

  }

}
//desplegable del ebook
document.addEventListener("DOMContentLoaded", () => {
    listarEbooks();
});

async function cargarEbook() {

  const archivo =
    document.getElementById("ebookSeleccion").value;

  if (!archivo) {
    alert("Seleccioná un ebook.");
    return;
  }

  try {

    const res = await fetch(WORKER_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        tipo: "cargar-ebook",
        archivo

      })

    });

    const data = await res.json();

    if (!data.ok) {

      alert(data.error);
      return;

    }

    ebookActual = data.contenido;

    document.getElementById("mensajeEditor").innerHTML =
      "✅ Ebook cargado correctamente.";

  } catch (err) {

    document.getElementById("mensajeEditor").innerHTML =
      "❌ Error cargando el ebook.";

  }
  }

// =====================================
// DISEÑAR EBOOK
// =====================================

async function disenarEbook() {

  if (!ebookActual) {
    alert("Primero cargá un ebook.");
    return;
  }
  
  const resultado = analizarEbook(ebookActual);
  
  if (!resultado.ok) {
    alert(resultado.error);
    return;
  }

  // ← VA EXACTAMENTE AQUÍ
  const ebookDiseno = resultado.ebook;

  // Construir HTML
  let html = construirHTMLLibro(ebookDiseno);
console.log(html);

html = construirPortada(html, ebookDiseno);
console.log(html);

html = construirLegales(html, ebookDiseno);
console.log(html);

html = construirIndice(html, ebookDiseno);
console.log(html);

html = construirIntroduccion(html, ebookDiseno);
console.log(html);

html = construirCapitulos(html, ebookDiseno);
console.log(html);

html = construirConclusion(html, ebookDiseno);
console.log(html);


  document.getElementById("resultadoEditor").innerHTML = html;

  ebookDiseno.html = html;

}
// =====================================
// ANALIZAR EBOOK
// =====================================

function analizarEbook(contenido) {

const ebookDiseno = {
    metadata: {},
    portada: {},
    legales: "",
    indice: [],
    introduccion: "",
    capitulos: [],
    conclusion: ""
  };

  // ==========================
  // METADATOS
  // ==========================

  const iniMeta = contenido.indexOf("METADATOS:");
  const finMeta = contenido.indexOf("====================================");

  if (iniMeta !== -1 && finMeta !== -1) {

    try {

      const bloque = contenido
        .substring(iniMeta + "METADATOS:".length, finMeta)
        .trim();

      ebookDiseno.metadata = JSON.parse(bloque);

    } catch (e) {

      return {
        ok: false,
        error: "Error leyendo metadatos"
      };

    }

  }

  // ==========================
  // PORTADA
  // ==========================

  ebookDiseno.portada = {
    titulo: ebookDiseno.metadata.titulo || "",
    subtitulo: ebookDiseno.metadata.subtitulo || "",
    descripcion: ebookDiseno.metadata.descripcion || ""
  };

  // ==========================
  // AVISO LEGAL
  // ==========================

  const legal = contenido.match(
  /AVISO LEGAL\s*([\s\S]*?)================================/
);

if (legal) {
  ebookDiseno.legales = legal[1].trim();
}

  // ==========================
  // ÍNDICE
  // ==========================

  const indice = contenido.match(
  /ÍNDICE\\s*([\s\S]*?)================================/
);


  if (indice) {

    ebookDiseno.indice = indice[1]
      .split("\n")
      .map(x => x.trim())
      .filter(x => x);

  }


  // ==========================
  // INTRODUCCIÓN
  // ==========================

  const intro = contenido.match(
    /INTRODUCCIÓN\s*([\s\S]*?)====================================/
  );

  if (intro)
    ebookDiseno.introduccion = intro[1].trim();

  // ==========================
  // CAPÍTULOS
  // ==========================

  const regex =
    /CAPÍTULO\s+(\d+):(.*?)([\s\S]*?)(?=CAPÍTULO\s+\d+:|CONCLUSIÓN|$)/g;

  let m;

  while ((m = regex.exec(contenido)) !== null) {

    ebookDiseno.capitulos.push({

      numero: parseInt(m[1]),

      titulo: m[2].trim(),

      contenido: m[3].trim()

    });

  }

  // ==========================
  // CONCLUSIÓN
  // ==========================

  const conclusion = contenido.match(
    /CONCLUSIÓN\s*([\s\S]*)$/
  );

  if (conclusion)
    ebookDiseno.conclusion = conclusion[1].trim();

  return {

    ok: true,

    ebook: ebookDiseno

  };

} 

// =====================================
// BLOQUE 1
// CONSTRUCTOR HTML DEL EBOOK
// =====================================

function construirHTMLLibro(ebook) {

  return `

<div class="ebook">

  <section id="portada" class="pagina"></section>

  <section id="legales" class="pagina"></section>

  <section id="indice" class="pagina"></section>

  <section id="introduccion" class="pagina"></section>

  <section id="capitulos" class="pagina"></section>

  <section id="conclusion" class="pagina"></section>

</div>

`;

}
function construirPortada(html, ebook) {
  return html.replace(
    '<section id="portada" class="pagina"></section>',
    `
    <section id="portada" class="pagina">
      <h1>${ebook.portada.titulo}</h1>
      <h2>${ebook.portada.subtitulo}</h2>
      <p>${ebook.portada.descripcion}</p>
    </section>
    `
  );
}

function construirLegales(html, ebook) {

  const legales = `
PÁGINA LEGAL
© 2026 Sergio Costa – PIXELLAB45
Todos los derechos reservados.
Ninguna parte de esta publicación puede ser reproducida, almacenada o transmitida por ningún medio, ya sea electrónico, mecánico, fotocopia, grabación o cualquier otro sistema, sin autorización previa y por escrito del autor, excepto para uso personal y educativo.
Este ebook tiene fines exclusivamente educativos e informativos. Las estrategias, herramientas y ejemplos presentados están basados en información disponible al momento de su publicación.
El autor no garantiza resultados económicos, financieros o profesionales específicos derivados de la aplicación de los conocimientos aquí compartidos.
Las marcas, nombres comerciales y servicios mencionados pertenecen a sus respectivos propietarios.
Primera edición – 2026
Autor: Sergio Costa 
Marca: PIXELLAB45
`;

  return html.replace(
    '<section id="legales" class="pagina"></section>',
    `
    <section id="legales" class="pagina">
      <h2>Aviso Legal</h2>
      <p style="white-space: pre-line;">
     ${legales}
      </p>
    </section>
    `
  );
}

function construirIndice(html, ebook) {
  const items = ebook.indice
    .map(item => `<li>${item}</li>`)
    .join("");
  
  // Reemplazar solo hasta antes de la línea de separación
  return html.replace(
    /<section id="indice" class="pagina"><\/section>/,
    `<section id="indice" class="pagina">
      <h2>Índice</h2>
      <ul>
        ${items}
      </ul>
    </section>`
  );
}

function construirIntroduccion(html, ebook) {
  return html.replace(
    '<section id="introduccion" class="pagina"></section>',
    `
    <section id="introduccion" class="pagina">
      <h2>Introducción</h2>
      <p class="texto-libro">
        ${ebook.introduccion}
      </p>
    </section>
    `
  );
}

function construirCapitulos(html, ebook) {

  let contenido = "";

  ebook.capitulos.forEach(cap => {

    contenido += `

<section class="pagina capitulo">

    <h1>Capítulo ${cap.numero}</h1>

    <h2>${cap.titulo}</h2>

    <div class="imagen-capitulo">

        <!-- Imagen IA -->

    </div>

    <div class="contenido-capitulo">

        <p>${cap.contenido}</p>

    </div>

</section>

`;

  });

  return html.replace(
    '<section id="capitulos" class="pagina"></section>',
    contenido
);

}
function construirConclusion(html, ebook) {
  return html.replace(
    '<section id="conclusion" class="pagina"></section>',
    `
    <section id="conclusion" class="pagina">
      <h2>Conclusión</h2>
      <p class="texto-libro">
        ${ebook.conclusion}
      </p>
    </section>
    `
  );
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
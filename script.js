// ========================================
// PIXELLAB45
// CONFIGURACIÓN GENERAL
// ========================================

console.log("SCRIPT CARGADO OK");

const WORKER_URL =
  "https://pixellab45-v2.scostarobles.workers.dev/";

  
  // ========================================
// UTILIDADES
// ========================================

function copiarTexto(texto, elementoMensaje, mensaje) {

  navigator.clipboard.writeText(texto);

  document.getElementById(elementoMensaje).innerText =
    mensaje;

  setTimeout(() => {

    document.getElementById(elementoMensaje).innerText =
      "";

  }, 3000);

}

// ========================================
// GALERÍA
// ========================================

// Cargar galería completa
async function cargarGaleriaCompleta() {
  const contenedor = document.getElementById("galeriaCompleta");
  contenedor.innerHTML = "⏳ Cargando galería completa...";

  try {
    const res = await fetch(
      WORKER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "listar-imagenes"
        })
      }
    );

    const imagenes = await res.json();
    contenedor.innerHTML = "";

    imagenes.forEach((img) => {
      contenedor.innerHTML += `
        <div class="project-card">
          <img src="${img.url}" alt="${img.nombre}">
        </div>
      `;
    });
  } catch (error) {
    contenedor.innerHTML = "❌ Error cargando galería";
  }
}

// Cargar categoría específica
async function cargarCategoria(categoria) {
  const contenedor = document.getElementById("galeriaDinamica");
  contenedor.innerHTML = "⏳ Cargando imágenes...";

  try {
    const res = await fetch(
      WORKER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "listar-imagenes"
        })
      }
    );

    const imagenes = await res.json();
    const filtradas = imagenes.filter((img) =>
      img.nombre.startsWith(categoria + "/")
    );

    contenedor.innerHTML = "";
    filtradas.forEach((img) => {
      contenedor.innerHTML += `
        <div class="project-card">
          <img src="${img.url}" alt="${img.nombre}">
          <p>${img.nombre}</p>
        </div>
      `;
    });
  } catch (error) {
    contenedor.innerHTML = "❌ Error cargando imágenes";
  }
}

// ========================================
// IDEAS
// ========================================

async function generarIdeas() {

  const tema = document.getElementById("tema").value;

  const loading = document.getElementById("loadingIdeas");
  const barra = document.getElementById("barraIdeas");
  const estado = document.getElementById("estadoIdeas");

  loading.style.display = "block";
  barra.style.width = "10%";
  estado.innerText = "🧠 Analizando tema...";

  let progreso = 10;

  const fakeProgress = setInterval(() => {

    if (progreso < 90) {

      progreso += Math.random() * 10;

      barra.style.width =
        progreso + "%";

      if (progreso < 30)
        estado.innerText = "💡 Generando ideas...";

      else if (progreso < 60)
        estado.innerText = "🎯 Estructurando contenido...";

      else
        estado.innerText = "⚡ Finalizando respuesta...";

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
          tipo: "ideas",
          tema
        })
      }
    );

    const data =
      await res.json();

    clearInterval(fakeProgress);

    barra.style.width = "100%";

    estado.innerText =
      "✅ Listo";

    setTimeout(() => {

      loading.style.display =
        "none";

      document.getElementById("resultadoIdeas").innerHTML =
        `<div style="white-space: pre-wrap;">${data.ideas}</div>`;

    }, 300);

  } catch (error) {

    clearInterval(fakeProgress);

    estado.innerText =
      "❌ Error";

    console.log(error);

  }

}

async function copiarIdeas() {

  const texto =
    document.getElementById("resultadoIdeas").innerText || "";

  const mensaje =
    document.getElementById("mensajeIdeasCopiadas");

  if (!texto.trim()) {
    mensaje.innerText = "⚠️ Primero genera ideas";
    return;
  }

  mensaje.innerText = "⏳ Procesando ideas...";

  try {

    // =========================
    // 1. SOLO LÍNEAS IDEA N:
    // =========================
    const ideas = texto
      .split("\n")
      .map(l => l.trim())
      .filter(l => /^idea\s*\d+\s*:/i.test(l))
      .map(l =>
        l.replace(/^idea\s*\d+\s*:\s*/i, "").trim()
      )
      .filter(l => l.length > 0);

    // =========================
    // 2. LIMITAR (SIN INVENTAR)
    // =========================
    const limited = ideas.slice(0, 10); // seguro para tu sistema actual

    // =========================
    // 3. GUARDADO EN R2
    // =========================
    let guardadas = 0;

    for (const idea of limited) {

      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "copiar-ideas",
          contenido: idea
        })
      });

      const data = await res.json();

      if (data.success) guardadas++;
    }

    mensaje.innerText =
      `✅ ${guardadas} ideas guardadas`;

  } catch (error) {
    mensaje.innerText =
      `❌ ${error.message}`;
  }
}
// ========================================
// PROMPTS
// ========================================

async function generarPrompt() {
  const tema = document.getElementById("temaPrompt").value;
  const tipo = document.getElementById("tipoContenido").value;

  if (!tema.trim()) {
    document.getElementById("resultadoPrompt").innerText = "⚠️ Escribe un tema primero";
    return;
  }

  const loading = document.getElementById("loadingPrompt");
  const resultado = document.getElementById("resultadoPrompt");

  try {
    if (loading) {
      loading.style.display = "block";
    }

    resultado.innerText = "✍️ Generando prompt...";

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tipo: "prompt",
        tema: tema,
        formato: tipo
      })
    });

    resultado.innerText = "⚡ Formateando respuesta...";

    const data = await res.json();

    if (loading) {
      loading.style.display = "none";
    }

    resultado.innerHTML = `<div style="white-space: pre-wrap">${data.resultado}</div>`;

  } catch (error) {
      if (loading) {
        loading.style.display = "none";
      }
      resultado.innerText = "❌ " + error.message;
      console.error(error);
    }
}
  

async function copiarPrompts() {

  const texto =
    document.getElementById("resultadoPrompt").innerText;

  const mensaje =
    document.getElementById("mensajeCopiado");

  if (!texto.trim()) {
    mensaje.innerText = "⚠️ Primero genera prompts";
    return;
  }

  // COPIAR AL PORTAPAPELES
  copiarTexto(
    texto,
    "mensajeCopiado",
    "✅ Prompts copiados correctamente"
  );

  try {

    const prompts = texto
      .split("\n")
      .map(l => l.trim())
      .filter(l => /^prompt\s*\d+\s*:/i.test(l))
      .map(l =>
        l.replace(/^prompt\s*\d+\s*:\s*/i, "").trim()
      )
      .filter(l => l.length > 0);

    let guardados = 0;

    for (const prompt of prompts) {

      const res = await fetch(
        WORKER_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tipo: "copiar-prompts",
            contenido: prompt
          })
        }
      );

      const data = await res.json();

      if (data.success) {
        guardados++;
        document.getElementById("feedbackPrompt").innerText += `\nGuardando prompt: ${prompt}`;
      }
    }

    mensaje.innerText =
      `✅ ${guardados} prompts guardados`;

  } catch (error) {

    mensaje.innerText =
      `❌ ${error.message}`;

  }
}
// ========================================
// GUIONES
// ========================================

async function generarGuion() {

  const tema =
    document.getElementById("temaGuion").value;

  const resultado =
    document.getElementById("resultadoGuion");

  if (!tema.trim()) {

    resultado.innerText =
      "⚠️ Escribe un tema primero";

    return;
  }

  try {

    resultado.innerText =
      "🎬 Generando guion...";

    const res = await fetch(
      WORKER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tema,
          tipo: "script"
        })
      }
    );

    const data =
      await res.json();

    resultado.innerText =
      data.resultado;

  } catch (error) {

    resultado.innerText =
      "❌ " + error.message;

  }

}

function copiarGuion() {

  const texto =
    document.getElementById("resultadoGuion").innerText;

  copiarTexto(
    texto,
    "mensajeGuionCopiado",
    "✅ Guion copiado correctamente"
  );

}

// ========================================
// STORYBOARD
// ========================================

async function generarStoryboard() {

  const guion =
    document.getElementById("textoStoryboard").value;

  const escenas =
    document.getElementById("cantidadEscenas").value;

  const estilo =
    document.getElementById("estiloStoryboard").value;

  const resultado =
    document.getElementById("resultadoStoryboard");

  const mensaje =
    document.getElementById("mensajeStoryboard");

  resultado.innerHTML = "";
  mensaje.innerText = "";

  if (!guion.trim()) {

    mensaje.innerText =
      "⚠️ Primero pega un guion";

    return;
  }

  mensaje.innerText =
    "⏳ Generando storyboard IA...";

  try {

    const res = await fetch(
      WORKER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "storyboard",
          guion,
          escenas,
          estilo
        })
      }
    );

    const texto =
      await res.text();

    resultado.innerHTML =
      `<pre style="white-space:pre-wrap">${texto}</pre>`;

    mensaje.innerText =
      "Respuesta recibida";

    return;

  } catch (error) {

    mensaje.innerText =
      "❌ " + error.message;

  }

}

function copiarStoryboard() {

  const texto =
    document.getElementById("resultadoStoryboard").innerText;

  if (texto.trim() === "") {

    document.getElementById("mensajeStoryboard").innerText =
      "⚠️ Primero genera un storyboard";

    return;
  }

  copiarTexto(
    texto,
    "mensajeStoryboard",
    "✅ Storyboard copiado correctamente"
  );

}

// ========================================
// VISUALES
// ========================================

async function generarVisuales() {

  const tema =
    document.getElementById("temaVisual").value;

  if (!tema.trim()) {

    document.getElementById("resultadoVisual").innerHTML =
      "⚠️ Escribe un tema primero";

    return;
  }

  try {

    document.getElementById("resultadoVisual").innerHTML =
      "🎨 Generando prompts visuales...";

    const res = await fetch(
      WORKER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tema,
          tipo: "visuales"
        })
      }
    );

    const data =
      await res.json();

    document.getElementById("resultadoVisual").innerHTML =
      `<div style="white-space: pre-wrap;">${data.resultado}</div>`;

  } catch (error) {

    document.getElementById("resultadoVisual").innerHTML =
      `❌ ${error.message}`;

  }

}

async function copiarVisuales() {

  const texto =
    document.getElementById("resultadoVisual").innerText;

  const mensaje =
    document.getElementById("mensajeVisual");

  if (!texto.trim()) {

    mensaje.innerText =
      "⚠️ Primero genera visuales";

    return;
  }

  copiarTexto(
    texto,
    "mensajeVisual",
    "✅ Visuales copiados correctamente"
  );

  try {

    const visuales = texto
      .split("\n")
      .map(l => l.trim())
      .filter(l => /^prompt\s*\d+\s*:/i.test(l))
      .map(l =>
        l.replace(/^prompt\s*\d+\s*:\s*/i, "").trim()
      )
      .filter(l => l.length > 0);

    let guardados = 0;

    for (const visual of visuales) {

      const res = await fetch(
        WORKER_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tipo: "copiar-visuales",
            contenido: visual
          })
        }
      );

      const data = await res.json();

      if (data.success) {
        guardados++;
      }

    }

    mensaje.innerText =
      `✅ ${guardados} visuales guardados en R2`;

  } catch (error) {

    mensaje.innerText =
      `❌ ${error.message}`;

    console.error(error);

  }

}

// ========================================
// IMÁGENES IA
// ========================================

async function generarImagen() {

  const prompt =
    document.getElementById("promptImagen").value;

  const categoria =
    document.getElementById("categoriaImagen").value;

  const resultado =
    document.getElementById("resultadoImagen");

  try {

    resultado.innerHTML =
      "🎨 Generando imagen...";

    const respuesta = await fetch(
      WORKER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: "imagen",
          tema: prompt,
          categoria
        })
      }
    );

    const blob =
      await respuesta.blob();

    const url =
      URL.createObjectURL(blob);

    resultado.innerHTML = `
      <img
        src="${url}"
        style="width:100%;max-width:600px;border-radius:12px;">
      <p>💾 Guardando imagen...</p>
    `;

    const reader =
      new FileReader();

    reader.onloadend = async () => {

      try {

        const guardar = await fetch(
          WORKER_URL,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              tipo: "guardar-imagen",
              imagenBase64: reader.result,
              categoria
            })
          }
        );

        const data =
          await guardar.json();

        if (data.success) {

          resultado.innerHTML += `
            <p>✅ Guardada: ${data.nombre}</p>
          `;

        } else {

          resultado.innerHTML += `
            <p>❌ ${data.error || JSON.stringify(data)}</p>
          `;

        }

      } catch (error) {

        resultado.innerHTML += `
          <p>❌ ${error.message}</p>
        `;

      }

    };

    reader.readAsDataURL(blob);

  } catch (error) {

    resultado.innerHTML =
      `❌ ${error.message}`;

  }

}

// ========================================
// MENÚ Y NAVEGACIÓN
// ========================================

function toggleMenu() {

  document
    .querySelector(".nav-links")
    .classList
    .toggle("active");

}

document
  .querySelectorAll(".nav-links a")
  .forEach(link => {

    link.addEventListener("click", () => {

      document
        .querySelector(".nav-links")
        .classList
        .remove("active");

    });

  });
  
  // ========================================
// INICIALIZACIÓN
// ========================================

window.addEventListener("load", () => {

  if (document.getElementById("galeriaCompleta")) {

    cargarGaleriaCompleta();

  }

});
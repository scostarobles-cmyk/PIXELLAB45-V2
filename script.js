console.log("SCRIPT CARGADO OK");

let imagenesGuardadas =
  JSON.parse(localStorage.getItem("galeriaPixellab")) || [];

/* =========================
   PROMPTS
========================= */

function generarPrompt() {
  const tema = document.getElementById("temaPrompt").value;
  const tipo = document.getElementById("tipoContenido").value;

  if (!tema.trim()) {
    document.getElementById("resultadoPrompt").innerText =
      "⚠️ Escribe un tema primero";
    return;
  }

  let prompt = "";

  if (tipo === "TikTok") {
    prompt = `🚀 TIKTOK: ${tema}`;
  } else if (tipo === "YouTube") {
    prompt = `🚀 YOUTUBE: ${tema}`;
  } else {
    prompt = `${tema} para ${tipo}`;
  }

  document.getElementById("resultadoPrompt").innerText = prompt;
}

function copiarPrompt() {
  copiarTexto("resultadoPrompt", "mensajeCopiado", "Prompt copiado");
}

/* =========================
   GUIONES
========================= */

function generarGuion() {
  const tema = document.getElementById("temaGuion").value;
  const duracion = document.getElementById("duracionGuion").value;

  if (!tema.trim()) {
    document.getElementById("resultadoGuion").innerText =
      "⚠️ Escribe un tema primero";
    return;
  }

  const guion = `
🎬 GUION PIXELLAB45

Tema: ${tema}
Duración: ${duracion}

🔥 Hook
💡 Desarrollo
🚀 Cierre
`;

  document.getElementById("resultadoGuion").innerText = guion;
}

function copiarGuion() {
  copiarTexto("resultadoGuion", "mensajeGuionCopiado", "Guion copiado");
}

/* =========================
   IDEAS
========================= */

function generarIdeas() {
  const tema = document.getElementById("temaIdea").value;

  if (!tema.trim()) {
    document.getElementById("resultadoIdeas").innerText =
      "⚠️ Escribe un tema primero";
    return;
  }

  const ideas = `
🚀 IDEAS PIXELLAB45

🔥 Viral: ${tema}
💰 Dinero: ${tema}
⚠️ Error: ${tema}
`;

  document.getElementById("resultadoIdeas").innerText = ideas;
}

function copiarIdeas() {
  copiarTexto("resultadoIdeas", "mensajeIdeasCopiadas", "Ideas copiadas");
}

/* =========================
   IMAGENES
========================= */

async function generarImagen() {
  const prompt = document.getElementById("promptImagen").value;
  const resultado = document.getElementById("resultadoImagen");

  if (!prompt.trim()) {
    resultado.innerHTML = "⚠️ Escribe un prompt primero";
    return;
  }

  try {
    resultado.innerHTML = "🎨 Generando imagen...";

    const url =
      "https://pixellab45-v2.scostarobles.workers.dev/?prompt=" +
      encodeURIComponent(prompt);

    const img = document.createElement("img");

    img.src = url;
    img.style.width = "100%";
    img.style.maxWidth = "600px";
    img.style.borderRadius = "12px";
    img.style.marginTop = "10px";

    img.onload = () => {
      guardarImagen(url);
    };

    img.onerror = () => {
      resultado.innerHTML = "❌ Error generando imagen";
    };

    resultado.innerHTML = "";
    resultado.appendChild(img);

  } catch (e) {
    resultado.innerHTML = "❌ Error de conexión";
  }
}

/* =========================
   GALERIA
========================= */

function guardarImagen(url) {
  imagenesGuardadas.unshift(url);

  localStorage.setItem("galeriaPixellab", JSON.stringify(imagenesGuardadas));

  renderGaleria();
}

function renderGaleria() {
  const contenedor = document.getElementById("galeriaImagenes");

  if (!contenedor) return;

  contenedor.innerHTML = "";

  imagenesGuardadas.forEach((url) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <img src="${url}" style="width:100%;border-radius:10px;">
      <button onclick="descargarImagen('${url}')">⬇</button>
    `;

    contenedor.appendChild(div);
  });
}

function descargarImagen(url) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "pixellab45.jpg";
  a.click();
}

/* =========================
   UTILIDAD COPIAR
========================= */

function copiarTexto(id, msgId, msg) {
  const texto = document.getElementById(id).innerText;

  if (!texto.trim()) return;

  navigator.clipboard.writeText(texto);

  document.getElementById(msgId).innerText = "✅ " + msg;

  setTimeout(() => {
    document.getElementById(msgId).innerText = "";
  }, 3000);
}

/* =========================
   INIT
========================= */

renderGaleria();

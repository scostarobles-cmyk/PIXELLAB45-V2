console.log("SCRIPT CARGADO OK");

let imagenesGuardadas = JSON.parse(localStorage.getItem("galeriaPixellab")) || [];

/* =========================
   PROMPTS
========================= */

function generarPrompt() {
  const tema = document.getElementById("temaPrompt").value;
  const tipo = document.getElementById("tipoContenido").value;

  if (tema.trim() === "") {
    document.getElementById("resultadoPrompt").innerText =
      "⚠️ Escribe un tema primero";
    return;
  }

  let prompt = "";

  if (tipo === "TikTok") {
    prompt = `
🚀 PROMPT PIXELLAB45 - TIKTOK VIRAL

Crea un video viral sobre:
"${tema}"

Incluye hook, problema, solución, ejemplo y CTA.
`;
  }

  else if (tipo === "YouTube") {
    prompt = `
🚀 PROMPT PIXELLAB45 - YOUTUBE

Guion educativo sobre "${tema}".
Incluye intro, explicación, casos prácticos y CTA.
`;
  }

  else {
    prompt = `Contenido sobre "${tema}" para ${tipo}`;
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

  if (tema.trim() === "") {
    document.getElementById("resultadoGuion").innerText =
      "⚠️ Escribe un tema primero";
    return;
  }

  const guion = `
🎬 GUION PIXELLAB45

Tema: ${tema}
Duración: ${duracion}

🔥 Hook impactante
💡 Desarrollo claro
📱 Ejemplo
🚀 Cierre fuerte
📢 CTA
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

  if (tema.trim() === "") {
    document.getElementById("resultadoIdeas").innerText =
      "⚠️ Escribe un tema primero";
    return;
  }

  const ideas = `
🚀 IDEAS PIXELLAB45

🔥 Viral: Nadie te cuenta esto sobre ${tema}
🤯 Impacto: Probé ${tema} y esto pasó
💰 Dinero: Cómo ganar dinero con ${tema}
⚠️ Error: Errores comunes con ${tema}
🎓 Educación: Aprende ${tema} fácil
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

    const respuesta = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      }
    );

    const datos = await respuesta.json();

    if (!datos.ok) {
      let msg = "❌ Error al generar imagen";

      if (datos.error?.includes("credit")) {
        msg = "⚠️ Sin créditos disponibles";
      }

      resultado.innerHTML = msg;
      return;
    }

    let imagen = datos.data.output;
    if (Array.isArray(imagen)) imagen = imagen[0];

    resultado.innerHTML = `
      <img src="${imagen}" style="width:100%;max-width:600px;border-radius:12px;">
    `;

    guardarImagen(imagen);

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
    div.className = "gallery-item";

    div.innerHTML = `
      <img src="${url}" />
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

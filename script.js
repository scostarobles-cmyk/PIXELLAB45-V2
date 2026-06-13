console.log("SCRIPT CARGADO OK");

/* =========================
   PROMPT GENERADOR
========================= */
function generarPrompt() {

  const tema = document.getElementById("temaPrompt").value;
  const tipo = document.getElementById("tipoContenido").value;

  if (!tema || tema.trim() === "") {
    document.getElementById("resultadoPrompt").innerText =
      "⚠️ Escribe un tema primero";
    return;
  }

  const prompt = `
Crea contenido para ${tipo}

sobre:

${tema}

Incluye:

✅ Título atractivo
✅ Introducción
✅ Desarrollo
✅ Llamado a la acción
`;

  document.getElementById("resultadoPrompt").innerText = prompt;
}

/* =========================
   COPIAR PROMPT
========================= */
function copiarPrompt() {

  const texto = document.getElementById("resultadoPrompt").innerText;

  if (!texto || texto.trim() === "") return;

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeCopiado").innerText =
    "✅ Prompt copiado correctamente";

  setTimeout(() => {
    document.getElementById("mensajeCopiado").innerText = "";
  }, 3000);
}

/* =========================
   GUION
========================= */
function generarGuion() {

  const tema = document.getElementById("temaGuion").value;
  const duracion = document.getElementById("duracionGuion").value;

  if (!tema || tema.trim() === "") {
    document.getElementById("resultadoGuion").innerText =
      "⚠️ Escribe un tema para el guion";
    return;
  }

  const guion = `
🎬 GUION PIXELLAB45

Tema:
${tema}

Duración:
${duracion}

━━━━━━━━━━━━━━

🎙️ INTRO

¿Sabías que ${tema}
está cambiando el mundo?

━━━━━━━━━━━━━━

🎙️ DESARROLLO

Explica beneficios, ejemplos y casos de uso.

━━━━━━━━━━━━━━

🎙️ CTA

Sígueme para más contenido sobre IA y tecnología.
`;

  document.getElementById("resultadoGuion").innerText = guion;
}

/* =========================
   STORYBOARD
========================= */
function generarStoryboard() {

  const guion = document.getElementById("textoStoryboard").value;

  if (!guion || guion.trim() === "") {
    document.getElementById("mensajeStoryboard").innerText =
      "⚠️ Primero pega un guion";
    return;
  }

  const lineas = guion
    .split("\n")
    .filter(l => l.trim() !== "");

  let storyboard = "🎬 STORYBOARD PIXELLAB45\n\n";

  lineas.forEach((linea, i) => {

    storyboard += `ESCENA ${i + 1}\n`;
    storyboard += `⏱️ Duración: 4 segundos\n\n`;
    storyboard += `🎙️ Narración:\n${linea}\n\n`;
    storyboard += `🎥 Visual:\nEscena futurista relacionada con el tema.\n\n`;
    storyboard += `──────────────────\n\n`;
  });

  document.getElementById("resultadoStoryboard").innerText = storyboard;
}

/* =========================
   IDEAS
========================= */
function generarIdeas() {

  const tema = document.getElementById("temaIdea").value;

  if (!tema || tema.trim() === "") {
    document.getElementById("resultadoIdeas").innerText =
      "⚠️ Escribe un tema";
    return;
  }

  const ideas = `
💡 IDEAS PIXELLAB45

1. Cómo usar ${tema}
2. Errores comunes en ${tema}
3. Herramientas de ${tema}
4. Tendencias de ${tema}
5. Tutorial rápido de ${tema}
`;

  document.getElementById("resultadoIdeas").innerText = ideas;
}

/* =========================
   VISUALES
========================= */
function generarVisuales() {

  const tema = document.getElementById("temaVisual").value;

  if (!tema || tema.trim() === "") {
    document.getElementById("resultadoVisual").innerText =
      "⚠️ Escribe un tema";
    return;
  }

  const resultado = `
🖼️ PROMPTS VISUALES PIXELLAB45

IMAGEN PRINCIPAL:
${tema}, futuristic, cyberpunk, neon lights, cinematic, ultra detailed

THUMBNAIL:
${tema}, high contrast, youtube thumbnail, tech style

TIKTOK:
${tema}, vertical composition, modern, social media style

VIDEO:
${tema}, cinematic motion, futuristic environment, dynamic lighting
`;

  document.getElementById("resultadoVisual").innerText = resultado;
}

/* =========================
   IMAGEN (CORREGIDO Y ROBUSTO)
========================= */
async function generarImagen() {

  const prompt = document.getElementById("promptImagen").value;
  const resultado = document.getElementById("resultadoImagen");

  if (!prompt || prompt.trim() === "") {
    resultado.innerHTML = "⚠️ Escribe un prompt para generar la imagen";
    return;
  }

  try {

    resultado.innerHTML = "🎨 Generando imagen...";

    const respuesta = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      }
    );

    if (!respuesta.ok) {
      resultado.innerHTML =
        "❌ Error HTTP: " + respuesta.status;
      return;
    }

    let datos;

    try {
      datos = await respuesta.json();
    } catch (e) {
      resultado.innerHTML =
        "❌ El servidor no devolvió JSON válido";
      return;
    }

    if (datos && datos.output) {

      resultado.innerHTML = `
        <img src="${datos.output}"
          style="width:100%;max-width:600px;border-radius:12px;margin-top:10px;">
      `;

    } else {
      resultado.innerHTML =
        "❌ No se pudo generar la imagen (sin output)";
    }

  } catch (error) {

    resultado.innerHTML =
      "❌ Error de conexión: " + error.message;
  }
}

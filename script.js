console.log("SCRIPT CARGADO OK");

/* =========================
   PROMPT
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
      "⚠️ Escribe un tema";
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

¿Sabías que ${tema} está cambiando el mundo?

━━━━━━━━━━━━━━

🎙️ DESARROLLO

Explica beneficios, casos de uso y ejemplos.

━━━━━━━━━━━━━━

🎙️ CTA

Sígueme para más contenido sobre IA y tecnología.
`;

  document.getElementById("resultadoGuion").innerText = guion;
}

/* =========================
   STORYBOARD (RESTO ORIGINAL)
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
    .filter(linea => linea.trim() !== "");

  let storyboard = "🎬 STORYBOARD PIXELLAB45\n\n";

  lineas.forEach((linea, index) => {

    storyboard += `ESCENA ${index + 1}\n`;
    storyboard += `⏱️ Duración: 4 segundos\n\n`;
    storyboard += `🎙️ Narración:\n${linea}\n\n`;
    storyboard += `🎥 Visual:\nEscena futurista relacionada con el tema.\n\n`;
    storyboard += `──────────────────\n\n`;
  });

  document.getElementById("resultadoStoryboard").innerText = storyboard;
}

/* =========================
   IDEAS (ESTABLE + VARIADAS)
========================= */
function generarIdeas(){

  const tema = document.getElementById("temaIdea").value;

  if (!tema || tema.trim() === "") {
    document.getElementById("resultadoIdeas").innerText =
      "⚠️ Escribe un tema";
    return;
  }

  const ideas = [
    `Cómo usar ${tema}`,
    `Errores comunes en ${tema}`,
    `Herramientas gratuitas de ${tema}`,
    `Tendencias futuras de ${tema}`,
    `Tutorial rápido sobre ${tema}`,
    `Cómo ganar dinero con ${tema}`,
    `Trucos avanzados de ${tema}`,
    `Ideas virales usando ${tema}`,
    `Guía completa de ${tema}`,
    `Casos reales de ${tema}`
  ];

  let salida = "💡 IDEAS PIXELLAB45\n\n";

  for (let i = 0; i < ideas.length; i++) {
    salida += `${i + 1}. ${ideas[i]}\n`;
  }

  document.getElementById("resultadoIdeas").innerText = salida;
}

/* =========================
   VISUALES
========================= */
function generarVisuales(){

  const tema = document.getElementById("temaVisual").value;

  if (!tema || tema.trim() === "") {
    document.getElementById("resultadoVisual").innerText =
      "⚠️ Escribe un tema";
    return;
  }

  const resultado = `
🖼️ PROMPTS VISUALES PIXELLAB45

━━━━━━━━━━━━━━

🎨 IMAGEN PRINCIPAL
${tema}, futuristic, cyberpunk, neon lights, cinematic

━━━━━━━━━━━━━━

📺 THUMBNAIL
${tema}, youtube thumbnail, high contrast, tech style

━━━━━━━━━━━━━━

📱 TIKTOK
${tema}, vertical format, modern, social media style

━━━━━━━━━━━━━━

🎥 VIDEO IA
${tema}, cinematic motion, futuristic environment
`;

  document.getElementById("resultadoVisual").innerText = resultado;
}

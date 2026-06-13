console.log("SCRIPT CARGADO OK");

/* =========================
   UTILIDAD RANDOM GLOBAL
========================= */
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* =========================
   PROMPT GENERADOR
========================= */
function generarPrompt() {

  const tema = document.getElementById("temaPrompt").value;
  const tipo = document.getElementById("tipoContenido").value;

  if (tema.trim() === "") {
    document.getElementById("resultadoPrompt").innerText =
      "⚠️ Escribe un tema primero";
    return;
  }

  const estilos = [
    "cinematográfico",
    "viral estilo TikTok",
    "tech futurista",
    "documental IA",
    "storytelling emocional",
    "educativo dinámico"
  ];

  const estructura = [
    "con gancho fuerte",
    "con narrativa envolvente",
    "con enfoque práctico",
    "con enfoque viral",
    "con tono experto"
  ];

  const estilo = random(estilos);
  const forma = random(estructura);

  const prompt = `
🚀 CREA CONTENIDO ${tipo.toUpperCase()}

🎯 Tema: ${tema}

🎬 Estilo: ${estilo}
📌 Enfoque: ${forma}

INCLUYE:

🔥 TÍTULO VIRAL
🧠 IDEA PRINCIPAL ORIGINAL
📖 DESARROLLO CLARO Y DINÁMICO
🎯 LLAMADO A LA ACCIÓN FUERTE
🎥 SUGERENCIA VISUAL CINEMATOGRÁFICA
`;

  document.getElementById("resultadoPrompt").innerText = prompt;
}

/* =========================
   COPIAR PROMPT
========================= */
function copiarPrompt() {

  const texto = document.getElementById("resultadoPrompt").innerText;

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeCopiado").innerText =
    "✅ Prompt copiado correctamente";

  setTimeout(() => {
    document.getElementById("mensajeCopiado").innerText = "";
  }, 3000);
}

/* =========================
   GUIÓN MEJORADO
========================= */
function generarGuion() {

  const tema = document.getElementById("temaGuion").value;
  const duracion = document.getElementById("duracionGuion").value;

  if (tema.trim() === "") return;

  const hooks = [
    `¿Sabías que ${tema} está cambiando todo?`,
    `Nadie te explica esto sobre ${tema}`,
    `Esto que descubres de ${tema} es increíble`,
    `Lo que pasa con ${tema} te va a sorprender`
  ];

  const desarrollo = [
    "Explícate con ejemplos simples y casos reales",
    "Muestra beneficios prácticos y aplicaciones",
    "Cuenta una historia basada en experiencia",
    "Explica el impacto futuro de este tema"
  ];

  const cta = [
    "Sígueme para más contenido de IA",
    "Guarda este video para después",
    "Comparte esto si te sirvió",
    "Comenta qué opinas sobre esto"
  ];

  const guion = `
🎬 GUION PIXELLAB45

Tema: ${tema}
Duración: ${duracion}

━━━━━━━━━━━━━━

🎙️ HOOK

${random(hooks)}

━━━━━━━━━━━━━━

📖 DESARROLLO

${random(desarrollo)}

━━━━━━━━━━━━━━

🎯 CTA

${random(cta)}
`;

  document.getElementById("resultadoGuion").innerText = guion;
}

/* =========================
   COPIAR GUION
========================= */
function copiarGuion() {

  const texto = document.getElementById("resultadoGuion").innerText;

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeGuionCopiado").innerText =
    "✅ Guion copiado correctamente";

  setTimeout(() => {
    document.getElementById("mensajeGuionCopiado").innerText = "";
  }, 3000);
}

/* =========================
   STORYBOARD MEJORADO
========================= */
function generarStoryboard() {

  const guion = document.getElementById("textoStoryboard").value;

  if (guion.trim() === "") {
    document.getElementById("mensajeStoryboard").innerText =
      "⚠️ Primero pega un guion";
    return;
  }

  const estilosVisuales = [
    "escena futurista con neón azul",
    "ambiente cyberpunk cinematográfico",
    "laboratorio tecnológico avanzado",
    "ciudad digital hiperrealista"
  ];

  const lineas = guion.split("\n").filter(l => l.trim() !== "");

  let storyboard = "🎬 STORYBOARD PIXELLAB45\n\n";

  lineas.forEach((linea, index) => {

    storyboard += `ESCENA ${index + 1}\n`;
    storyboard += `⏱️ Duración: ${random([3,4,5,6])} segundos\n\n`;
    storyboard += `🎙️ Narración:\n${linea}\n\n`;
    storyboard += `🎥 Visual:\n${random(estilosVisuales)}\n\n`;
    storyboard += `──────────────────\n\n`;
  });

  document.getElementById("resultadoStoryboard").innerText = storyboard;
}

/* =========================
   COPIAR STORYBOARD
========================= */
function copiarStoryboard() {

  const texto = document.getElementById("resultadoStoryboard").innerText;

  if (texto.trim() === "") return;

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeStoryboard").innerText =
    "✅ Storyboard copiado correctamente";

  setTimeout(() => {
    document.getElementById("mensajeStoryboard").innerText = "";
  }, 3000);
}

/* =========================
   IDEAS MEJORADAS
========================= */
function generarIdeas() {

  const tema = document.getElementById("temaIdea").value;

  if (tema.trim() === "") return;

  const viral = [
    `Nadie te cuenta esto sobre ${tema}`,
    `La verdad oculta de ${tema}`,
    `Probé ${tema} y esto ocurrió`,
    `Todos hablan de ${tema}, pero nadie entiende esto`
  ];

  const dinero = [
    `Cómo ganar dinero con ${tema}`,
    `Ideas para monetizar ${tema}`,
    `Cómo convertir ${tema} en ingresos`,
    `Negocios digitales con ${tema}`
  ];

  const futuro = [
    `El futuro de ${tema}`,
    `Cómo evolucionará ${tema}`,
    `Lo que viene después en ${tema}`,
    `Tendencias de ${tema}`
  ];

  const shorts = [
    `3 cosas que debes saber de ${tema}`,
    `Resumen rápido de ${tema}`,
    `Todo en 60 segundos sobre ${tema}`,
    `Lo esencial de ${tema}`
  ];

  const ideas = `
🚀 IDEAS PIXELLAB45

🔥 VIRAL:
${random(viral)}

💰 MONETIZACIÓN:
${random(dinero)}

🔮 FUTURO:
${random(futuro)}

🎬 SHORTS:
${random(shorts)}
`;

  document.getElementById("resultadoIdeas").innerText = ideas;
}

/* =========================
   COPIAR IDEAS
========================= */
function copiarIdeas() {

  const texto = document.getElementById("resultadoIdeas").innerText;

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeIdeasCopiadas").innerText =
    "✅ Ideas copiadas correctamente";

  setTimeout(() => {
    document.getElementById("mensajeIdeasCopiadas").innerText = "";
  }, 3000);
}

/* =========================
   VISUALES (MEJORADOS)
========================= */
function generarVisuales() {

  const tema = document.getElementById("temaVisual").value;

  const estilos = [
    "cyberpunk ultra realista",
    "cinematic tech lighting",
    "futuristic neon blue environment",
    "AI generated sci-fi world"
  ];

  const resultado = `
🖼️ PROMPTS VISUALES PIXELLAB45

🎨 IMAGEN PRINCIPAL:
${tema}, ${random(estilos)}, 8k ultra detailed

📺 MINIATURA:
${tema}, high contrast, youtube thumbnail style

📱 TIKTOK:
${tema}, vertical composition, viral style

🎥 VIDEO IA:
${tema}, cinematic motion, futuristic camera
`;

  document.getElementById("resultadoVisual").innerText = resultado;
}

/* =========================
   COPIAR VISUALES
========================= */
function copiarVisuales() {

  const texto = document.getElementById("resultadoVisual").innerText;

  if (texto.trim() === "") return;

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeVisual").innerText =
    "✅ Prompts copiados correctamente";

  setTimeout(() => {
    document.getElementById("mensajeVisual").innerText = "";
  }, 3000);
}

/* =========================
   GENERAR IMAGEN (SIN CAMBIOS FUNCIONALES)
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
      resultado.innerHTML = `❌ ${datos.error || "Error desconocido"}`;
      return;
    }

    let imagen = datos.data.output;

    if (Array.isArray(imagen)) imagen = imagen[0];

    resultado.innerHTML = `
      <img src="${imagen}" style="width:100%;max-width:600px;border-radius:12px;margin-top:10px;">
    `;

  } catch (error) {
    resultado.innerHTML = `❌ ${error.message}`;
  }
      }

console.log("SCRIPT CARGADO OK");

/* =========================
   UTILIDADES SEGURAS
========================= */

function random(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr){
  return [...arr].sort(() => Math.random() - 0.5);
}

/* =========================
   PROMPT GENERADORk
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
    "viral TikTok",
    "tech futurista",
    "educativo"
  ];

  const enfoques = [
    "storytelling",
    "educativo",
    "viral",
    "explicativo"
  ];

  const bloques = [
    "título atractivo",
    "idea principal clara",
    "desarrollo del contenido",
    "llamado a la acción",
    "sugerencia visual"
  ];

  let prompt = `
🚀 CONTENIDO ${tipo.toUpperCase()}

🎯 Tema: ${tema}

🎬 Estilo: ${random(estilos)}
📌 Enfoque: ${random(enfoques)}

INSTRUCCIONES:

${shuffle(bloques).map(b => `✔ ${b}`).join("\n")}
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
   GUION GENERADOR
========================= */

function generarGuion(){

  const tema = document.getElementById("temaGuion").value;
  const duracion = document.getElementById("duracionGuion").value;

  if(tema.trim() === "") return;

  const hooks = [
    `¿Sabías que ${tema} está cambiando todo?`,
    `Nadie te explica esto sobre ${tema}`,
    `Esto sobre ${tema} es sorprendente`,
    `Lo que nadie te cuenta de ${tema}`
  ];

  const desarrollo = [
    "explica con ejemplos simples",
    "narra un caso real",
    "muestra impacto práctico",
    "explicación clara paso a paso"
  ];

  const cta = [
    "sígueme para más contenido",
    "guarda este video",
    "comenta tu opinión",
    "comparte esto"
  ];

  let guion = `
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

function copiarGuion(){

  const texto = document.getElementById("resultadoGuion").innerText;

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeGuionCopiado").innerText =
    "✅ Guion copiado correctamente";

  setTimeout(() => {
    document.getElementById("mensajeGuionCopiado").innerText = "";
  }, 3000);
}

/* =========================
   STORYBOARD GENERADOR
========================= */

function generarStoryboard() {

  const guion = document.getElementById("textoStoryboard").value;

  if (guion.trim() === "") {
    document.getElementById("mensajeStoryboard").innerText =
      "⚠️ Primero pega un guion";
    return;
  }

  const visuales = [
    "escena futurista cyberpunk",
    "ciudad tecnológica avanzada",
    "laboratorio de inteligencia artificial",
    "interfaz digital moderna"
  ];

  const lineas = guion.split("\n").filter(l => l.trim() !== "");

  let storyboard = "🎬 STORYBOARD PIXELLAB45\n\n";

  lineas.forEach((linea, i) => {

    storyboard += `ESCENA ${i + 1}\n`;
    storyboard += `⏱️ ${random([3,4,5,6])} segundos\n`;
    storyboard += `🎙️ ${linea}\n`;
    storyboard += `🎥 ${random(visuales)}\n`;
    storyboard += `━━━━━━━━━━━━━━\n\n`;
  });

  document.getElementById("resultadoStoryboard").innerText = storyboard;
}

/* =========================
   COPIAR STORYBOARD
========================= */

function copiarStoryboard() {

  const texto = document.getElementById("resultadoStoryboard").innerText;

  if (texto.trim() === "") {
    document.getElementById("mensajeStoryboard").innerText =
      "⚠️ Primero genera un storyboard";
    return;
  }

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeStoryboard").innerText =
    "✅ Storyboard copiado correctamente";

  setTimeout(() => {
    document.getElementById("mensajeStoryboard").innerText = "";
  }, 3000);
}

/* =========================
   IDEAS GENERADOR
========================= */

function generarIdeas(){

  const tema = document.getElementById("temaIdea").value;

  if(tema.trim() === ""){
    document.getElementById("resultadoIdeas").innerText =
      "⚠️ Escribe un tema primero";
    return;
  }

  const bloques = {
    viral: [
      `Nadie te cuenta esto sobre ${tema}`,
      `La verdad oculta de ${tema}`,
      `Probé ${tema} y esto pasó`,
      `Todos hablan de ${tema} pero nadie lo entiende`
    ],
    dinero: [
      `Cómo ganar dinero con ${tema}`,
      `Ideas simples para monetizar ${tema}`,
      `Convertir ${tema} en ingresos reales`
    ],
    educativo: [
      `Guía rápida de ${tema}`,
      `Aprende ${tema} desde cero`,
      `Todo lo básico de ${tema}`
    ],
    futuro: [
      `El futuro de ${tema}`,
      `Cómo evolucionará ${tema}`,
      `Tendencias de ${tema}`
    ]
  };

  const keys = Object.keys(bloques);

  const a = random(keys);
  const b = random(keys);
  const c = random(keys);

  let ideas = `
🚀 IDEAS PIXELLAB45

━━━━━━━━━━━━━━

🔥 ${a.toUpperCase()}
${random(bloques[a])}

━━━━━━━━━━━━━━

💰 ${b.toUpperCase()}
${random(bloques[b])}

━━━━━━━━━━━━━━

🔮 ${c.toUpperCase()}
${random(bloques[c])}
`;

  document.getElementById("resultadoIdeas").innerText = ideas;
}

/* =========================
   COPIAR IDEAS
========================= */

function copiarIdeas(){

  const texto = document.getElementById("resultadoIdeas").innerText;

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeIdeasCopiadas").innerText =
    "✅ Ideas copiadas correctamente";

  setTimeout(() => {
    document.getElementById("mensajeIdeasCopiadas").innerText = "";
  }, 3000);
}

/* =========================
   VISUALES
========================= */

function generarVisuales(){

  const tema = document.getElementById("temaVisual").value;

  const estilos = [
    "cyberpunk ultra realista",
    "cinematic tech lighting",
    "futuristic neon environment",
    "AI sci-fi world"
  ];

  let resultado = `
🖼️ PROMPTS VISUALES PIXELLAB45

🎨 IMAGEN:
${tema}, ${random(estilos)}, 8k ultra detailed

📺 MINIATURA:
${tema}, youtube thumbnail, high contrast

📱 TIKTOK:
${tema}, vertical viral style

🎥 VIDEO:
${tema}, cinematic motion, futuristic
`;

  document.getElementById("resultadoVisual").innerText = resultado;
}

/* =========================
   COPIAR VISUALES
========================= */

function copiarVisuales(){

  const texto = document.getElementById("resultadoVisual").innerText;

  if(texto.trim() === "") return;

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeVisual").innerText =
    "✅ Prompts copiados correctamente";

  setTimeout(() => {
    document.getElementById("mensajeVisual").innerText = "";
  }, 3000);
}

/* =========================
   GENERAR IMAGEN (SIN CAMBIOS)
========================= */
async function generarImagen() {

  const prompt =
    document.getElementById(
      "promptImagen"
    ).value;

  try {

    if (!prompt) {
      alert("Escribe un prompt");
      return;
    }

    const res =
      await fetch(
        "https://pixellab45-v2.scostarobles.workers.dev/generate",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            prompt
          })
        }
      );

    const result =
      await res.json();

    if (!result.ok) {
      throw new Error(
        "Error generando imagen"
      );
    }

    document.getElementById(
      "resultadoImagen"
    ).innerHTML = `
      <img
        src="${result.imageUrl}"
        style="
          width:100%;
          border-radius:15px;
          margin-top:15px;
        "
      >
    `;

  } catch (err) {

    console.error(err);

    alert(err.message);
  }
}
 

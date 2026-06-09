function generarVisuales(){

  const tema =
    document.getElementById("temaVisual").value;

  let resultado = `
🖼️ PROMPTS VISUALES PIXELLAB45

━━━━━━━━━━━━━━━━━━

🎨 IMAGEN PRINCIPAL

${tema},
futuristic technology,
cyberpunk style,
blue neon lights,
ultra realistic,
cinematic lighting,
8k detail.

━━━━━━━━━━━━━━━━━━

📺 MINIATURA YOUTUBE

Professional YouTube thumbnail,
${tema},
technology background,
blue neon glow,
high contrast.

━━━━━━━━━━━━━━━━━━

📱 PORTADA TIKTOK

${tema},
vertical composition,
social media style,
modern futuristic design.

━━━━━━━━━━━━━━━━━━

🎥 VIDEO IA

${tema},
cinematic camera movement,
futuristic environment,
dynamic motion,
blue neon lighting,
technology atmosphere.
`;

  document.getElementById(
    "resultadoVisual"
  ).innerText = resultado;
}

function copiarVisuales(){

  const texto =
    document.getElementById("resultadoVisual").innerText;

  if(texto.trim() === ""){

    document.getElementById("mensajeVisual").innerText =
      "⚠️ Primero genera prompts";

    return;
  }

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeVisual").innerText =
    "✅ Prompts copiados correctamente";

  setTimeout(() => {
    document.getElementById("mensajeVisual").innerText = "";
  }, 3000);
}

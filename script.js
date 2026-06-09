function generarPrompt(){

  const tema =
    document.getElementById("temaPrompt").value;

  const tipo =
    document.getElementById("tipoContenido").value;

  const resultado = `

🎯 TEMA:
${tema}

📱 TIPO:
${tipo}

🔥 GANCHO:

"Si todavía no conoces ${tema},
esto te va a sorprender..."

📝 GUION:

Explica qué es ${tema},
cómo funciona y por qué puede ayudar
a las personas.

📢 CTA:

"Sígueme para más contenido sobre IA
y tecnología."

🎨 PROMPT IMAGEN:

Futuristic technology scene about ${tema},
blue neon lights,
cinematic lighting,
ultra detailed,
cyberpunk style.

🎬 PROMPT VIDEO:

Cinematic camera movement,
futuristic laboratory,
holographic interfaces,
technology inspired by ${tema},
blue neon atmosphere.

`;

  document.getElementById(
    "resultadoPrompt"
  ).innerText = resultado;
}

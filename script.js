function generarPrompt(){

  const tema =
    document.getElementById("temaPrompt").value;

  const tipo =
    document.getElementById("tipoContenido").value;

  let resultado = "";

  if(tipo === "TikTok"){

    resultado = `
🎯 TEMA:
${tema}

🔥 GANCHO:
"Si todavía no conoces ${tema}, estás perdiendo una oportunidad enorme."

🎬 GUION:
Explica rápidamente qué es ${tema},
por qué está de moda y cómo puede ayudar.

📢 CTA:
"Sígueme para más contenido de IA."

🎨 PROMPT IMAGEN:
Futuristic ${tema}, neon blue lights,
ultra realistic, cinematic.

🎥 PROMPT VIDEO:
Fast paced social media video about ${tema},
dynamic camera movement, cyberpunk style.
`;

  }

  else if(tipo === "YouTube"){

    resultado = `
🎯 TEMA:
${tema}

📺 TÍTULO:
Todo lo que debes saber sobre ${tema}

📝 DESCRIPCIÓN:
Aprende cómo funciona ${tema},
sus ventajas y aplicaciones reales.

🎬 GUION:
Introducción
Conceptos básicos
Ejemplos prácticos
Conclusión

📢 CTA:
Suscríbete para más contenido tecnológico.

🎨 PROMPT MINIATURA:
Professional YouTube thumbnail,
${tema}, futuristic technology,
blue neon glow.
`;

  }

  else if(tipo === "Instagram"){

    resultado = `
📸 POST INSTAGRAM

Tema:
${tema}

✍️ TEXTO:

¿Conoces ${tema}?

Aquí tienes una explicación rápida
para entender por qué cada vez más
personas hablan de ello.

🔥 HASHTAGS:

#IA
#Tecnologia
#Innovacion
#PIXELLAB45
#InteligenciaArtificial

🎨 PROMPT IMAGEN:
Instagram tech artwork,
${tema},
cyberpunk aesthetics.
`;

  }

  else if(tipo === "Blog"){

    resultado = `
📰 ARTÍCULO BLOG

Título:
Guía completa sobre ${tema}

Introducción

¿Qué es ${tema}?

Ventajas

Aplicaciones

Conclusión

SEO Keywords:
${tema}
tecnología
inteligencia artificial

🎨 Imagen destacada:
Professional blog cover about ${tema},
modern technology theme.
`;

  }

  else if(tipo === "Ebook"){

    resultado = `
📚 EBOOK

Título:
Domina ${tema}

ÍNDICE

Capítulo 1:
Introducción

Capítulo 2:
Conceptos fundamentales

Capítulo 3:
Herramientas recomendadas

Capítulo 4:
Casos prácticos

Capítulo 5:
Estrategias avanzadas

Conclusión

🎨 PORTADA:

Premium ebook cover about ${tema},
futuristic technology,
blue neon lights,
professional publishing design.
`;

  }

  document.getElementById(
    "resultadoPrompt"
  ).innerText = resultado;
}cinematic lighting,
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

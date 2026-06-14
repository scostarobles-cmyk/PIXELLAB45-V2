console.log("🔥 PIXELLAB45 SCRIPT OK");
*//generae prompt 
function generarPrompt() {

  const tema = document.getElementById("temaPrompt").value;
  const tipo = document.getElementById("tipoContenido").value;

  if (tema.trim() === "") {
    document.getElementById("resultadoPrompt").innerText =
      "⚠️ Escribe un tema primero";
    return;
  }

  let prompt = "";

  switch (tipo) {

    case "TikTok":
      prompt = `Actúa como creador viral TikTok.

Tema: ${tema}

Hook 3s + desarrollo + CTA`;
      break;

    case "YouTube":
      prompt = `Creador YouTube profesional.

Tema: ${tema}

Título + intro + desarrollo + CTA`;
      break;

    case "Instagram":
      prompt = `Experto Instagram.

Tema: ${tema}

Reel + descripción + hashtags`;
      break;

    case "Blog":
      prompt = `Redactor SEO.

Tema: ${tema}

Título + H2 + desarrollo + conclusión`;
      break;

    case "Ebook":
      prompt = `Escritor profesional.

Tema: ${tema}

Índice + capítulos + conclusión`;
      break;
  }

  document.getElementById("resultadoPrompt").innerText = prompt;
}*// copiar prompt 
function copiarPrompt() {

  const texto = document.getElementById("resultadoPrompt").innerText;

  navigator.clipboard.writeText(texto);

  document.getElementById("mensajeCopiado").innerText =
    "✅ Prompt copiado";

  setTimeout(() => {
    document.getElementById("mensajeCopiado").innerText = "";
  }, 3000);
}


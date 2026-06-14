 //generar inagen 
async function generarIdeas() {

  const resultado = document.getElementById("resultadoIdeas");

  try {

    resultado.innerText = "Conectando...";

    const respuesta = await fetch(
      "https://pixellab45-v2.scostarobles.workers.dev/text",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: "Genera 10 ideas virales sobre IA"
        })
      }
    );

    const texto = await respuesta.text();

    console.log("STATUS:", respuesta.status);
    console.log("RESPUESTA RAW:", texto);

    resultado.innerText = texto;

  } catch (error) {
    console.error(error);
    resultado.innerText = "❌ " + error.message;
  }
}

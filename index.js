//inico 
const result = await env.AI.run(
  "llama-3.2-3b-instruct",
  {
    prompt: `
Genera 6 ideas virales sobre: ${tema}
Estilo TikTok, corto, creativo, fácil de grabar
`
  }
);

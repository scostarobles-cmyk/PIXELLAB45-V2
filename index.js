export default {
  async fetch(request, env) {

    const { tema } = await request.json();

    const result = await env.AI.run(
      "@cf/meta/llama-3.2-3b-instruct",
      {
        messages: [
          {
            role: "system",
            content: "Eres un generador de ideas virales para redes sociales"
          },
          {
            role: "user",
            content: "Genera 6 ideas virales sobre: " + tema
          }
        ]
      }
    );

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  }
};

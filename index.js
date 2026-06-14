export default {
  async fetch(request, env) {

    const messages = [
      {
        role: "system",
        content: "Eres un asistente que genera ideas virales para redes sociales."
      },
      {
        role: "user",
        content: "Genera 6 ideas virales sobre: inteligencia artificial"
      }
    ];

    const result = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages
      }
    );

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

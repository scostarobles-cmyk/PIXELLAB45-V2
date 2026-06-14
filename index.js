//inico 
export default {
  async fetch(request, env) {
    const result = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        prompt: "Genera 3 ideas virales sobre IA en redes sociales"
      }
    );

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  }
};

export default {
  async fetch(request, env) {

    return new Response(JSON.stringify({
      tieneAI: !!env.AI,
      tipoAI: typeof env.AI
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });

  }
};

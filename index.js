export default {
  async fetch(request, env) {
    return Response.json({
      aiExiste: !!env.AI,
      tipo: typeof env.AI
    });
  }
}

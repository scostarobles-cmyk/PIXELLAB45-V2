export default {
  async fetch(request, env) {
    try {

      return Response.json({
        tieneAI: !!env.AI,
        bindings: Object.keys(env)
      });

    } catch (error) {

      return Response.json({
        error: error.message,
        stack: error.stack
      });

    }
  }
}

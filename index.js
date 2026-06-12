export default {
  async fetch(request) {

    return new Response("WORKER FUNCIONA", {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });

  }
};

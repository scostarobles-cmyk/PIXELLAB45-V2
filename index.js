export default {
  async fetch(request, env) {

    const response = await fetch(
      "https://api.replicate.com/v1/account",
      {
        headers: {
          "Authorization": `Token ${env.REPLICATE_API_TOKEN}`
        }
      }
    );

    const data = await response.json();

    return Response.json(data);
  }
};

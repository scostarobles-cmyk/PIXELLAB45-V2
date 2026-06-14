//inico 
export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {

    const url = new URL(request.url);

    if (url.pathname === "/api/ideas" && request.method === "POST") {

      const { tema } = await request.json();

      const messages = [
        {
          role: "system",
          content: `
Eres un creador experto en contenido viral para TikTok, Reels y YouTube Shorts.
Genera ideas cortas, virales y fáciles de grabar.
          `
        },
        {
          role: "user",
          content: `Genera 6 ideas virales sobre: ${tema}`
        }
      ];

      const stream = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fp8",
        {
          messages,
          stream: false
        }
      );

      // El modelo devuelve texto en stream o string según config
      const text = stream.response || stream;

      const ideas = text
        .split("\n")
        .map(i => i.replace(/^[-•]\s*/, "").trim())
        .filter(Boolean);

      return new Response(JSON.stringify({ ideas }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    return new Response("PIXELLAB45 AI listo");
  }
} satisfies ExportedHandler<Env>;

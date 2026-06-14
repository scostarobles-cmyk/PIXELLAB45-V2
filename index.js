export interface Env {
  AI: Ai;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {

    const url = new URL(request.url);

    if (url.pathname === "/api/ideas" && request.method === "POST") {

      try {
        const { tema } = await request.json();

        const result = await env.AI.run(
          "llama-3.2-3b-instruct",
          {
            messages: [
              {
                role: "system",
                content: "Eres un generador de ideas virales para redes sociales."
              },
              {
                role: "user",
                content: `Genera 6 ideas virales sobre: ${tema}`
              }
            ]
          }
        );

        const text = result.response || "";

        const ideas = text
          .split("\n")
          .map((i: string) => i.replace(/^[-•]\s*/, "").trim())
          .filter(Boolean);

        return new Response(JSON.stringify({ ideas }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({
          error: err.message
        }), { status: 500 });
      }
    }

    return new Response("PIXELLAB45 AI OK");
  }
} satisfies ExportedHandler<Env>;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

serve(async (req: Request) => {
  try {
    const { messages } = await req.json() as { messages: ChatMessage[] };
    
    const lastUserMessage = messages.filter((m: ChatMessage) => m.role === "user").pop();

    if (!lastUserMessage) {
      return new Response("No user message found", { status: 400 });
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    
    // Calling OpenAI API directly
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are ΛΛLIYΛH, a helpful clinical assistant for massage therapists and physical therapists. You provide evidence-based guidance using Oxford terminology and Travell trigger point patterns." },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

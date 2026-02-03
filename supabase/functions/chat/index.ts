import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

serve(async (req) => {
  try {
    const { messages } = await req.json() as { messages: ChatMessage[] };
    
    // Fix: Proper typing for filter
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
        model: "gpt-4", // or your preferred model
        messages: [
          { role: "system", content: "You are a helpful assistant for c-bot." },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

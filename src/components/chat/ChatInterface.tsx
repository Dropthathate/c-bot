import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  mode?: "chat" | "soap";
  placeholder?: string;
  onTechniqueReference?: (techniqueNumber: number) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const ChatInterface = ({ 
  mode = "chat", 
  placeholder = "Describe your symptoms or ask about a technique...",
  onTechniqueReference 
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    // Get the current session token for authenticated requests
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the chat feature.",
        variant: "destructive",
      });
      throw new Error("Not authenticated");
    }

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ messages: userMessages, mode }),
    });

    if (resp.status === 401) {
      toast({
        title: "Session Expired",
        description: "Please sign in again to continue.",
        variant: "destructive",
      });
      throw new Error("Unauthorized");
    }

    if (resp.status === 429) {
      toast({
        title: "Rate Limited",
        description: "Too many requests. Please wait a moment and try again.",
        variant: "destructive",
      });
      throw new Error("Rate limited");
    }

    if (resp.status === 402) {
      toast({
        title: "Credits Needed",
        description: "Please add credits to continue using the AI features.",
        variant: "destructive",
      });
      throw new Error("Payment required");
    }

    if (!resp.ok || !resp.body) {
      throw new Error("Failed to start stream");
    }

    return resp;
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const resp = await streamChat(newMessages);
      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // Add empty assistant message
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Check for technique references
      if (onTechniqueReference) {
        const techniqueMatches = assistantContent.match(/Technique #?(\d+)/gi);
        if (techniqueMatches) {
          techniqueMatches.forEach(match => {
            const num = parseInt(match.replace(/\D/g, ""));
            if (num > 0) onTechniqueReference(num);
          });
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      if (!(error instanceof Error && (error.message === "Rate limited" || error.message === "Payment required"))) {
        toast({
          title: "Error",
          description: "Failed to get a response. Please try again.",
          variant: "destructive",
        });
      }
      // Remove the empty assistant message on error
      setMessages(prev => prev.filter((_, i) => i !== prev.length - 1 || prev[i].role !== "assistant"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              SomaSync AI Assistant
            </h3>
            <p className="text-muted-foreground max-w-md">
              {mode === "soap" 
                ? "Dictate your clinical observations and I'll format them into insurance-ready SOAP notes."
                : "Describe your symptoms, ask about techniques, or explore trigger point patterns. I'm here to help with evidence-based guidance."}
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-soma-orange" />
              <span>Always consult a healthcare provider for diagnosis</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.content || (isLoading && idx === messages.length - 1 ? "..." : "")}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="min-h-[60px] max-h-[120px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
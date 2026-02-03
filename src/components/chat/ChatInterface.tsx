import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Loader2, AlertTriangle, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// --- TYPES & INTERFACES ---
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

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

// --- 1. THE SOUND ENGINE ---
const playFeedbackTone = (type: 'pop' | 'ding'): void => {
  const Win = window as unknown as IWindow;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  const ctx = new AudioContextClass();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'pop') {
    osc.frequency.value = 600; 
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } else {
    osc.frequency.value = 1000; 
    osc.type = 'triangle';
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }
};

const ChatInterface = ({ 
  mode = "chat", 
  placeholder = "Describe your symptoms or ask about a technique...",
  onTechniqueReference 
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef(input); // Prevents stale closures
  const { toast } = useToast();

  // Keep ref in sync with state
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- 2. VOICE LOGIC ---
  useEffect(() => {
    const Win = window as unknown as IWindow;
    const SpeechRecognition = Win.SpeechRecognition || Win.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence; 
        const isFinal = result.isFinal;

        if (isFinal) {
            if (confidence < 0.75) {
                window.speechSynthesis.speak(new SpeechSynthesisUtterance("I didn't catch that."));
                return; 
            }

            const lower = transcript.toLowerCase().trim();

            if (lower.includes("send message") || lower.includes("send chat")) {
                playFeedbackTone('ding');
                // Trigger submit directly using current ref value
                handleFinalSubmit(inputRef.current);
                return;
            }

            if (lower.includes("clear input")) {
                playFeedbackTone('ding');
                setInput("");
                return;
            }

            setInput(prev => prev + (prev.length > 0 ? " " : "") + transcript);
            playFeedbackTone('pop');
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech Error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []); // Only run once on mount

  const toggleRecording = () => {
    if (!recognitionRef.current) {
        toast({ title: "Not Supported", description: "Browser does not support speech recognition.", variant: "destructive" });
        return;
    }
    if (isRecording) {
        stopRecording();
    } else {
        recognitionRef.current.start();
        setIsRecording(true);
        playFeedbackTone('ding');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
    }
  };

  const streamChat = async (userMessages: Message[]) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("Not authenticated");

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ messages: userMessages, mode }),
    });

    if (!resp.ok || !resp.body) throw new Error("Stream error");
    return resp;
  };

  // Helper to handle both voice and click submission
  const handleFinalSubmit = async (textToSubmit: string) => {
    if (!textToSubmit.trim() || isLoading) return;
    if (isRecording) stopRecording();

    const userMsg: Message = { role: "user", content: textToSubmit.trim() };
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

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });
        let lines = textBuffer.split("\n");
        textBuffer = lines.pop() || "";

        for (let line of lines) {
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
          } catch (e) { continue; }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">SomaSync AI</h3>
            <p className="text-muted-foreground max-w-md">Ready for dictation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] rounded-2xl px-4 py-3", msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? "Listening..." : placeholder}
            className={cn("min-h-[60px]", isRecording && "border-red-500")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleFinalSubmit(input);
              }
            }}
          />
          <Button onClick={toggleRecording} variant={isRecording ? "destructive" : "secondary"} size="icon" className="h-[60px] w-[60px]">
             {isRecording ? <MicOff /> : <Mic />}
          </Button>
          <Button onClick={() => handleFinalSubmit(input)} disabled={!input.trim() || isLoading} size="icon" className="h-[60px] w-[60px]">
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

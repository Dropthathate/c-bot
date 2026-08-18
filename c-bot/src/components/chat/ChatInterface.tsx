import React, { useState, useRef, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, MicOff } from "lucide-react";

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult[];
  [index: number]: SpeechRecognitionResult[];
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface WindowWithSpeech extends Window {
  webkitAudioContext: typeof AudioContext;
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null;
  start: () => void;
  stop: () => void;
}
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
interface ChatInterfaceProps {
  mode?: 'chat' | 'soap';
  placeholder?: string;
  soapNoteId?: string;
  onSoapGenerated?: (soap: {
    subjective: string; objective: string; assessment: string; plan: string;
  }) => void;
}

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@300;400;500;600;700&display=swap');
  .chat-root {
    --bg: #080808;
    --ink: #f0ede8;
    --muted: rgba(240,237,232,0.45);
    --dim: rgba(240,237,232,0.18);
    --grn: #00e89a;
    --blue: #3b9eff;
    --blue2: #1a7ee0;
    --blue-glow: rgba(59,158,255,0.25);
    --grn-glow: rgba(0,232,154,0.2);
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 760px;
    margin: 0 auto;
    padding: 24px 20px;
    font-family: 'Manrope', sans-serif;
    background: var(--bg);
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
  }
  .chat-root *, .chat-root *::before, .chat-root *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* empty state */
  .chat-empty {
    text-align: center;
    padding: 64px 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .chat-empty-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(0,232,154,0.12), rgba(59,158,255,0.08));
    border: 1px solid rgba(0,232,154,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 8px;
  }
  .chat-empty-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.2rem;
    letter-spacing: -0.03em;
    color: var(--ink);
  }
  .chat-empty-sub {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.7;
    max-width: 360px;
  }

  /* messages */
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 12px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.08) transparent;
  }
  .chat-msg {
    padding: 14px 18px;
    border-radius: 16px;
    max-width: 82%;
    font-size: 0.9rem;
    line-height: 1.7;
  }
  .chat-msg.user {
    background: linear-gradient(135deg, var(--blue), var(--blue2));
    color: #fff;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 20px var(--blue-glow);
  }
  .chat-msg.assistant {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    color: var(--ink);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    position: relative;
  }
  .chat-msg.assistant::before {
    content: 'AALIYAH';
    display: block;
    font-family: 'Syne', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--grn);
    margin-bottom: 6px;
  }

  /* loading */
  .chat-loading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 16px;
    border-bottom-left-radius: 4px;
    max-width: 200px;
    align-self: flex-start;
  }
  .chat-loading-dots {
    display: flex;
    gap: 4px;
  }
  .chat-loading-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--grn);
    animation: chatDot 1.2s ease-in-out infinite;
  }
  .chat-loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .chat-loading-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes chatDot {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }
  .chat-loading-label {
    font-size: 0.75rem;
    color: var(--muted);
  }

  /* input area */
  .chat-input-area {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    padding-top: 16px;
    border-top: 1px solid var(--border);
    margin-top: 8px;
  }
  .chat-input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 18px;
    font-size: 0.9rem;
    font-family: 'Manrope', sans-serif;
    color: var(--ink);
    outline: none;
    resize: none;
    line-height: 1.5;
    transition: border-color 0.2s, background 0.2s;
    min-height: 52px;
    max-height: 140px;
  }
  .chat-input:focus {
    border-color: rgba(59,158,255,0.4);
    background: rgba(255,255,255,0.07);
  }
  .chat-input::placeholder {
    color: var(--dim);
  }
  .chat-input:disabled {
    opacity: 0.5;
  }

  /* buttons */
  .chat-btn-mic {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    border: 1px solid var(--border2);
    background: rgba(255,255,255,0.06);
    color: var(--ink);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .chat-btn-mic:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(59,158,255,0.3);
  }
  .chat-btn-mic.listening {
    background: rgba(0,232,154,0.1);
    border-color: rgba(0,232,154,0.4);
    color: var(--grn);
    box-shadow: 0 0 20px var(--grn-glow);
    animation: micPulse 1.5s ease-in-out infinite;
  }
  @keyframes micPulse {
    0%, 100% { box-shadow: 0 0 12px var(--grn-glow); }
    50% { box-shadow: 0 0 28px rgba(0,232,154,0.35); }
  }
  .chat-btn-send {
    height: 52px;
    padding: 0 22px;
    border-radius: 14px;
    border: none;
    background: var(--blue);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .chat-btn-send:hover:not(:disabled) {
    background: var(--blue2);
    box-shadow: 0 0 24px var(--blue-glow);
    transform: translateY(-1px);
  }
  .chat-btn-send:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
  }
`

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  mode = 'chat',
  placeholder = "Message AALIYAH...",
  soapNoteId,
  onSoapGenerated
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const Win = window as unknown as WindowWithSpeech;
    const SpeechRecognitionClass = Win.SpeechRecognition || Win.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const len = event.results.length;
      if (len > 0) {
        const last = event.results[len - 1];
        if (last && last[0]) setInput(prev => prev + ' ' + last[0].transcript);
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      toast({ title: "Microphone Error", description: "Could not access microphone.", variant: "destructive" });
    };
    recognitionRef.current = recognition;
    return () => { recognitionRef.current?.stop(); };
  }, [toast]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({ title: "Not Supported", description: "Speech recognition not supported in this browser.", variant: "destructive" });
      return;
    }
    if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
    else {
      try { recognitionRef.current.start(); setIsListening(true); }
      catch { toast({ title: "Error", description: "Could not start voice input.", variant: "destructive" }); }
    }
  };

  const generateSOAPNote = async (userInput: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-soap', {
        body: { rawNotes: userInput, conversationHistory: messages }
      });
      if (error) throw error;
      const soapData = data.soap;
      if (soapNoteId) {
        const { error: updateError } = await supabase.from('soap_notes').update({
          subjective: soapData.subjective, objective: soapData.objective,
          assessment: soapData.assessment, plan: soapData.plan,
        }).eq('id', soapNoteId);
        if (updateError) throw updateError;
        if (onSoapGenerated) onSoapGenerated(soapData);
        toast({ title: "SOAP Note Generated", description: "Your note has been saved." });
      }
      return data.response;
    } catch (error: any) {
      toast({ title: "Generation Failed", description: error.message || "Could not generate SOAP note.", variant: "destructive" });
      return "I encountered an error generating the SOAP note. Please try again.";
    }
  };

  const sendChatMessage = async (userInput: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: [...messages, { role: 'user', content: userInput }] }
      });
      if (error) throw error;
      return data.response;
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not send message.", variant: "destructive" });
      return "I encountered an error. Please try again.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const response = mode === 'soap'
        ? await generateSOAPNote(userMessage.content)
        : await sendChatMessage(userMessage.content);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (e) {}
    finally { setIsLoading(false); }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      <style>{S}</style>
      <div className="chat-root">

        {messages.length === 0 && !isLoading ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">🎧</div>
            <div className="chat-empty-title">
              {mode === 'soap' ? 'Start Dictating Your Session' : 'AALIYAH is ready'}
            </div>
            <div className="chat-empty-sub">
              {mode === 'soap'
                ? 'Speak naturally about your session findings. AALIYAH will convert them into a professional SOAP note.'
                : 'Ask anything — clinical guidance, documentation help, or treatment protocol questions.'}
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>{m.content}</div>
            ))}
            {isLoading && (
              <div className="chat-loading">
                <div className="chat-loading-dots">
                  <div className="chat-loading-dot" />
                  <div className="chat-loading-dot" />
                  <div className="chat-loading-dot" />
                </div>
                <span className="chat-loading-label">
                  {mode === 'soap' ? 'Generating SOAP note...' : 'Thinking...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="chat-input-area">
          <button
            type="button"
            onClick={toggleListening}
            className={`chat-btn-mic ${isListening ? 'listening' : ''}`}
            title={isListening ? 'Stop recording' : 'Start voice input'}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            placeholder={isListening ? 'Listening...' : placeholder}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="chat-btn-send"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Send →'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;

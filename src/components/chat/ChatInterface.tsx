import React, { useState, useRef, useEffect } from 'react';

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
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

interface ChatInterfaceProps {
  mode?: 'chat' | 'soap';
  placeholder?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  mode = 'chat', 
  placeholder = "Message ΛΛLIYΛH..." 
}) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const Win = window as unknown as WindowWithSpeech;
    const SpeechRecognitionClass = Win.SpeechRecognition || Win.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const resultsLength = event.results.length;
        if (resultsLength > 0) {
          const lastResult = event.results[resultsLength - 1];
          if (lastResult && lastResult[0]) {
            const transcript = lastResult[0].transcript;
            setInput(transcript);
          }
        }
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Logic to call your Supabase Edge Function
    // const { data } = await supabase.functions.invoke('chat', { body: { messages: newMessages } });
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-4 rounded-2xl max-w-[80%] ${
            m.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted text-foreground'
          }`}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-4 bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={placeholder}
        />
        <button 
          type="button"
          onClick={handleSend}
          className="bg-primary text-primary-foreground px-6 py-4 rounded-full font-bold hover:opacity-90 transition-opacity"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;

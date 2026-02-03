import React, { useState, useRef, useEffect } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface WindowWithSpeech extends Window {
  webkitAudioContext: typeof AudioContext;
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const Win = window as unknown as WindowWithSpeech;
    const SpeechRecognition = Win.SpeechRecognition || Win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setInput(transcript);
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
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-4 rounded-2xl max-w-[80%] ${
            m.role === 'user' ? 'bg-black text-white ml-auto' : 'bg-gray-100 text-black'
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
          className="flex-1 p-4 bg-gray-100 rounded-full focus:outline-none"
          placeholder="Message c-bot..."
        />
        <button 
          type="button"
          onClick={handleSend}
          className="bg-black text-white px-6 py-4 rounded-full font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;

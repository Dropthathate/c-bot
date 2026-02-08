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
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  mode = 'chat', 
  placeholder = "Message ΛΛLIYΛH...",
  soapNoteId,
  onSoapGenerated
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const Win = window as unknown as WindowWithSpeech;
    const SpeechRecognitionClass = Win.SpeechRecognition || Win.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const resultsLength = event.results.length;
        if (resultsLength > 0) {
          const lastResult = event.results[resultsLength - 1];
          if (lastResult && lastResult[0]) {
            const transcript = lastResult[0].transcript;
            setInput(prev => prev + ' ' + transcript);
          }
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
        toast({
          title: "Microphone Error",
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive",
        });
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Error",
          description: "Could not start voice input.",
          variant: "destructive",
        });
      }
    }
  };

  const generateSOAPNote = async (userInput: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-soap', {
        body: { 
          rawNotes: userInput,
          conversationHistory: messages 
        }
      });

      if (error) throw error;

      const soapData = data.soap;
      
      // Save to database
      if (soapNoteId) {
        const { error: updateError } = await supabase
          .from('soap_notes')
          .update({
            subjective: soapData.subjective,
            objective: soapData.objective,
            assessment: soapData.assessment,
            plan: soapData.plan,
          })
          .eq('id', soapNoteId);

        if (updateError) throw updateError;

        // Notify parent component
        if (onSoapGenerated) {
          onSoapGenerated(soapData);
        }

        toast({
          title: "SOAP Note Generated",
          description: "Your note has been saved successfully.",
        });
      }

      return data.response;
    } catch (error: any) {
      console.error('SOAP generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate SOAP note. Please try again.",
        variant: "destructive",
      });
      return "I apologize, but I encountered an error generating the SOAP note. Please try again.";
    }
  };

  const sendChatMessage = async (userInput: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          messages: [...messages, { role: 'user', content: userInput }]
        }
      });

      if (error) throw error;
      return data.response;
    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error.message || "Could not send message. Please try again.",
        variant: "destructive",
      });
      return "I apologize, but I encountered an error. Please try again.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let assistantResponse: string;

      if (mode === 'soap') {
        assistantResponse = await generateSOAPNote(userMessage.content);
      } else {
        assistantResponse = await sendChatMessage(userMessage.content);
      }

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: assistantResponse 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in handleSend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 && mode === 'soap' && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg font-medium mb-2">Start Dictating Your Session Notes</p>
            <p className="text-sm">
              Speak naturally about your session and I'll convert it into a professional SOAP note.
            </p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-2xl max-w-[80%] ${
              m.role === 'user' 
                ? 'bg-primary text-primary-foreground ml-auto' 
                : 'bg-muted text-foreground'
            }`}
          >
            {m.content}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground p-4 bg-muted rounded-2xl max-w-[80%]">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{mode === 'soap' ? 'Generating SOAP note...' : 'Thinking...'}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-4 rounded-full transition-colors ${
            isListening 
              ? 'bg-destructive text-destructive-foreground animate-pulse' 
              : 'bg-muted text-foreground hover:bg-accent'
          }`}
          title={isListening ? "Stop recording" : "Start voice input"}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1 p-4 bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          placeholder={placeholder}
        />
        
        <button 
          type="button"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-primary text-primary-foreground px-6 py-4 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
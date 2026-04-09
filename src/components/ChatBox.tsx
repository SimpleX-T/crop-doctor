import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatBox({ messages, onSendMessage, isLoading }: ChatBoxProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-t-3xl shadow-2xl overflow-hidden border-x border-t border-farm-accent/10">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 min-h-[400px] max-h-[600px] bg-farm-earth/30"
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
            <Bot size={48} className="text-farm-green mb-4" />
            <h3 className="text-xl font-serif mb-2">Welcome to CropDoctor</h3>
            <p className="text-sm max-w-xs">
              Upload a photo above or tell me what's happening with your crops. I'm here to help!
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0
                  ${msg.role === 'user' ? 'bg-farm-accent text-white' : 'bg-farm-green text-white'}
                `}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`
                  p-4 rounded-2xl shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-farm-accent text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-farm-accent/5'}
                `}>
                  <div className="markdown-body text-sm leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 items-center bg-white p-4 rounded-2xl rounded-tl-none border border-farm-accent/5 shadow-sm">
              <Loader2 className="animate-spin text-farm-green" size={20} />
              <span className="text-sm text-slate-500 font-medium">CropDoctor is thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t border-farm-accent/10 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your crop problem..."
          className="flex-1 bg-farm-earth/50 border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-farm-green transition-all outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`
            p-3 rounded-full transition-all
            ${input.trim() && !isLoading 
              ? 'bg-farm-green text-white shadow-md hover:scale-105 active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
          `}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

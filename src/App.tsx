import { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import ChatBox from './components/ChatBox';
import LanguageSelector from './components/LanguageSelector';
import { diagnosePlant } from './services/gemini';
import { motion } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I am **CropDoctor 🌿**. I'm here to help you protect your harvest. \n\nYou can upload a photo of your plant or just tell me what's wrong. How are your crops doing today?" 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [language, setLanguage] = useState('en');

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const diagnosis = await diagnosePlant(text, false, language);
      setMessages(prev => [...prev, { role: 'assistant', content: diagnosis }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageDiagnosis = async (file: File) => {
    setIsLoading(true);
    
    // Add a placeholder message for the user
    setMessages(prev => [...prev, { role: 'user', content: "I've uploaded a photo for diagnosis." }]);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const diagnosis = await diagnosePlant({
          mimeType: file.type,
          data: base64Data
        }, true, language);
        
        setMessages(prev => [...prev, { role: 'assistant', content: diagnosis }]);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const onImageSelect = (file: File | null) => {
    setSelectedImage(file);
    if (file) {
      handleImageDiagnosis(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-farm-earth">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Info & Upload */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-farm-accent/5"
            >
              <h2 className="text-2xl text-farm-green mb-3">How can I help?</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                I am your AI agricultural advisor. Upload a photo of your plant or describe the problem to get an instant diagnosis and treatment plan.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-farm-earth px-3 py-1 rounded-full text-xs font-medium text-farm-accent">🌿 Disease Diagnosis</span>
                <span className="bg-farm-earth px-3 py-1 rounded-full text-xs font-medium text-farm-accent">🐛 Pest Control</span>
                <span className="bg-farm-earth px-3 py-1 rounded-full text-xs font-medium text-farm-accent">🧪 Soil Health</span>
              </div>
            </motion.div>

            <LanguageSelector selectedLanguage={language} onLanguageChange={setLanguage} />

            <ImageUpload onImageSelect={onImageSelect} />
            
            <div className="hidden lg:block bg-farm-green/5 p-6 rounded-3xl border border-farm-green/10">
              <h3 className="text-farm-green font-semibold mb-2 flex items-center gap-2">
                💡 Farming Tip
              </h3>
              <p className="text-xs text-farm-green/80 italic">
                "Healthy soil is the foundation of a healthy crop. Always rotate your crops to prevent pests from building up in the ground."
              </p>
            </div>
          </div>

          {/* Right Column: Chat */}
          <div className="lg:col-span-7 h-full">
            <ChatBox 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 text-xs font-sans">
        <p>© 2026 CropDoctor 🌿 • Helping farmers grow better, together.</p>
      </footer>
    </div>
  );
}


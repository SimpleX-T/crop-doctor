import { Globe } from 'lucide-react';

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pcm', name: 'Pidgin', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

export default function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-farm-accent/5">
      <div className="flex items-center gap-2 mb-3 text-farm-green font-medium">
        <Globe size={18} />
        <span className="text-sm">Select Language</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-medium transition-all
              ${selectedLanguage === lang.code 
                ? 'bg-farm-green text-white shadow-md scale-105' 
                : 'bg-farm-earth text-farm-accent hover:bg-farm-green/10'}
            `}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-slate-400 italic">
        * CropDoctor will respond in your chosen language.
      </p>
    </div>
  );
}

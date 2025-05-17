
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

interface Language {
  id: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { id: "en", name: "English", nativeName: "English" },
  { id: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { id: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { id: "te", name: "Telugu", nativeName: "తెలుగు" },
  { id: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { id: "ml", name: "Malayalam", nativeName: "മലയാളം" },
];

export default function LanguageSelector() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language.id);
    
    // In a real app, you would store this in localStorage/context
    localStorage.setItem("quickfix-language", language.id);
    
    toast.success(`Language set to ${language.name}`);
    navigate("/role-selection");
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Select your language</h1>
      
      <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
        {languages.map((language) => (
          <Card
            key={language.id}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedLanguage === language.id
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
            onClick={() => handleLanguageSelect(language)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{language.name}</p>
                <p className="text-neutral-300 text-sm">{language.nativeName}</p>
              </div>
              {selectedLanguage === language.id && (
                <div className="w-3 h-3 rounded-full bg-primary" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

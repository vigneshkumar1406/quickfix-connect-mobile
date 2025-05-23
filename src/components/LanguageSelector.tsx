
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.code);
    changeLanguage(language.code);
    
    toast.success(`${t('selectLanguage')}: ${language.name}`);
    navigate("/role-selection");
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">{t('selectLanguage')}</h1>
      
      <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
        {availableLanguages.map((language) => (
          <Card
            key={language.code}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedLanguage === language.code
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
              {selectedLanguage === language.code && (
                <div className="w-3 h-3 rounded-full bg-primary" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

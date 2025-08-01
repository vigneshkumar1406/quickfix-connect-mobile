
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Bell, Shield, CreditCard, Globe, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export default function CustomerSettings() {
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
    toast.success("Language updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsapp-updates">WhatsApp Updates</Label>
                <Switch 
                  id="whatsapp-updates" 
                  checked={whatsappUpdates}
                  onCheckedChange={setWhatsappUpdates}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Preferences
            </h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name} ({lang.nativeName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment & Billing
            </h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/customer/payment-methods')}
              >
                Payment Methods
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/customer/billing-history')}
              >
                Billing History
              </Button>
            </div>
          </Card>

          <Button onClick={handleSaveSettings} className="w-full">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

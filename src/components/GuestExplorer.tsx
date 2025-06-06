
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Wrench, Home, Star, Users, Phone, Wallet, Clock, 
  Refrigerator, WashingMachine, Coins, Gift, ArrowRight
} from "lucide-react";
import BackButton from "./BackButton";

export default function GuestExplorer() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const demoServices = [
    { icon: <Home className="w-6 h-6" />, name: "Home Cleaning" },
    { icon: <Wrench className="w-6 h-6" />, name: "Plumbing" },
    { icon: <Wrench className="w-6 h-6" />, name: "Electrical" },
    { icon: <Refrigerator className="w-6 h-6" />, name: "Appliance Repair" },
    { icon: <WashingMachine className="w-6 h-6" />, name: "Washing Machine" },
    { icon: <Wrench className="w-6 h-6" />, name: "Carpentry" }
  ];

  return (
    <div className="w-full pb-6 animate-fade-in">
      <div className="mb-6">
        <BackButton withLabel />
      </div>

      <div className="bg-primary text-white p-6 rounded-b-3xl mb-6">
        <h1 className="text-2xl font-bold mb-1">{t('appTitle')} Demo</h1>
        <p className="opacity-90">Explore our services without signing up</p>
        
        <Card className="bg-white mt-6 p-4 rounded-lg text-foreground">
          <div className="flex items-center mb-3">
            <Coins className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="font-semibold">{t('fixsifyCoins')} (Demo)</h3>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-neutral-300">{t('availableBalance')}</p>
              <p className="text-xl font-bold text-yellow-600">1,250 Coins</p>
              <p className="text-xs text-neutral-400">= ₹125.00</p>
            </div>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Wallet className="w-4 h-4" />
              {t('wallet')}
            </Button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center text-green-600">
              <Gift className="w-4 h-4 mr-2" />
              <span>Earn 400 coins when referral completes a job</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Star className="w-4 h-4 mr-2" />
              <span>Get 1% back as coins for online payments</span>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-center">
            <span className="font-medium">{t('exchangeRate')}</span>
          </div>
        </Card>
      </div>
      
      <div className="mb-6">
        <Button 
          className="w-full h-14 text-lg"
          onClick={() => navigate("/language-selection")}
        >
          <Wrench className="mr-2 w-5 h-5" />
          Try Booking a Service
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
      
      <h2 className="font-semibold mb-3">{t('services')}</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {demoServices.map((service, index) => (
          <Card key={index} className="p-3 flex flex-col items-center justify-center text-center">
            <div className="bg-neutral-100 p-2 rounded-full mb-2">
              {service.icon}
            </div>
            <h3 className="text-xs">{service.name}</h3>
          </Card>
        ))}
      </div>

      <Card className="mb-6 p-4">
        <h3 className="font-semibold mb-3">Demo Features</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span>Multi-language support (6 languages)</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span>Real-time worker tracking</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span>Secure payment system</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span>Reward points system</span>
          </div>
        </div>
      </Card>
      
      <div className="space-y-3">
        <Button 
          className="w-full"
          onClick={() => navigate("/language-selection")}
        >
          {t('getStarted')} - {t('customer')}
        </Button>
        
        <Button 
          variant="outline"
          className="w-full"
          onClick={() => navigate("/language-selection")}
        >
          {t('getStarted')} - {t('worker')}
        </Button>
      </div>
    </div>
  );
}

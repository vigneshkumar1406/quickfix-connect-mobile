
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import OtpLogin from "@/components/Auth/OtpLogin";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [step, setStep] = useState("landing"); // landing, login
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    navigate("/customer/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        {step === "landing" && (
          <>
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold mb-2 text-primary">{t('appTitle')}</h1>
              <p className="text-neutral-300">{t('appSubtitle')}</p>
            </div>

            <div className="w-full max-w-md space-y-4">
              <Button
                className="w-full h-12"
                onClick={() => navigate("/language-selection")}
              >
                {t('getStarted')}
              </Button>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => navigate("/guest-explorer")}
              >
                {t('exploreGuest')}
              </Button>

              <Card className="p-6">
                <h2 className="font-semibold mb-3">Why QuickFix?</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Verified professionals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>On-demand service booking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Live tracking of workers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Cashless payments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Multi-language support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Reward points system</span>
                  </li>
                </ul>
              </Card>

              <div className="flex gap-2">
                <Button 
                  variant="link" 
                  onClick={() => navigate("/faq")}
                  className="flex-1"
                >
                  FAQ
                </Button>
                <Button 
                  variant="link" 
                  onClick={() => navigate("/about")}
                  className="flex-1"
                >
                  About Us
                </Button>
              </div>

              <div className="text-center">
                <Button variant="link" onClick={() => setStep("login")}>
                  Already have an account? Log in
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "login" && (
          <>
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold mb-2 text-primary">{t('appTitle')}</h1>
              <p className="text-neutral-300">Login with OTP</p>
            </div>

            <div className="w-full max-w-md space-y-4">
              <OtpLogin />
              
              <div className="text-center">
                <Button variant="link" onClick={() => setStep("landing")}>
                  Back to home
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="p-6 text-center text-neutral-300 text-sm">
        © 2025 QuickFix. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;

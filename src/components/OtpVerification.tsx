
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "./BackButton";
import { useAuth } from "@/contexts/AuthContext";

export default function OtpVerification() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { sendOTP, verifyOTP } = useAuth();
  
  const userRole = localStorage.getItem("quickfix-role") || "customer";

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsLoading(true);
    const result = await sendOTP(phone);
    setIsLoading(false);
    
    if (result.success) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setIsLoading(true);
    const result = await verifyOTP(phone, otp);
    setIsLoading(false);
    
    if (result.success) {
      // Navigate based on user role
      if (userRole === "worker") {
        navigate("/worker/registration");
      } else {
        navigate("/customer/dashboard");
      }
    }
  };

  const handleSkip = () => {
    if (userRole === "worker") {
      navigate("/worker/registration");
    } else {
      navigate("/customer/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      {/* reCAPTCHA container - invisible */}
      <div id="recaptcha-container"></div>
      
      <div className="mb-6">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-2 text-center">Phone Verification</h1>
      <p className="text-neutral-300 text-center mb-8">
        {otpSent
          ? "Enter the OTP sent to your phone"
          : "Enter your phone number to continue"}
      </p>

      {!otpSent ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Phone Number</label>
            <Input
              type="tel"
              placeholder="Enter your 10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full"
              maxLength={10}
            />
          </div>
          <Button
            onClick={handleSendOtp}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </Button>
          <div className="text-center">
            <Button
              variant="link"
              onClick={handleSkip}
              className="text-neutral-300"
            >
              Skip for now
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-center text-sm">
            We've sent a code to: <strong>+91 {phone}</strong>
          </p>
          
          <OtpInput 
            length={6} 
            onComplete={handleVerifyOtp}
            className="mb-6" 
          />
          
          <div className="space-y-3">
            <Button 
              disabled={isLoading}
              variant="outline"
              onClick={() => setOtpSent(false)} 
              className="w-full"
            >
              Change Phone Number
            </Button>
            
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={handleSkip}
                className="text-neutral-300"
              >
                Skip for now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

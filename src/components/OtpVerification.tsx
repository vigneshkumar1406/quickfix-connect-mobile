import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "./BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function OtpVerification() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, user } = useAuth();

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
    
    if (result.success && result.user) {
      // Save role to database after successful authentication
      const pendingRole = sessionStorage.getItem("fixsify-pending-role") || "customer";
      
      try {
        // Get current user from Supabase auth
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Insert role into user_roles table
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authUser.id,
              role: pendingRole as "admin" | "customer" | "worker" | "call_center"
            });
          
          if (roleError) {
            console.error('Error saving user role:', roleError);
            toast.error('Failed to save user role');
            setIsLoading(false);
            return;
          }
          
          // Clear pending role from sessionStorage
          sessionStorage.removeItem("fixsify-pending-role");
          
          // Mark as just registered for new users
          sessionStorage.setItem('just-registered', 'true');
          
          // Navigate based on user role
          if (pendingRole === "worker") {
            navigate("/worker/registration");
          } else {
            navigate("/customer/dashboard");
          }
        }
      } catch (error) {
        console.error('Error in post-verification:', error);
        toast.error('An error occurred during setup');
      }
    }
    
    setIsLoading(false);
  };

  const handleSkip = async () => {
    // Mark as skipped verification
    sessionStorage.setItem('skipped-verification', 'true');
    
    const pendingRole = sessionStorage.getItem("fixsify-pending-role") || "customer";
    
    // If user is authenticated, save role to database
    if (user) {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          await supabase
            .from('user_roles')
            .insert({
              user_id: authUser.id,
              role: pendingRole as "admin" | "customer" | "worker" | "call_center"
            });
          
          sessionStorage.removeItem("fixsify-pending-role");
        }
      } catch (error) {
        console.error('Error saving role on skip:', error);
      }
    }
    
    if (pendingRole === "worker") {
      navigate("/worker/registration");
    } else {
      navigate("/customer/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
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
          
          {/* reCAPTCHA container - now visible */}
          <div className="flex justify-center">
            <div id="recaptcha-container"></div>
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


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { Card } from "@/components/ui/card";
import PaytmPayment from "@/components/Payments/PaytmPayment";

export default function WorkerPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const registrationFee = 99;
  
  const handlePaymentSuccess = (response: any) => {
    console.log("Registration payment successful:", response);
    toast.success("Registration payment successful!");
    navigate("/worker/dashboard");
  };

  const handlePaymentFailure = (error: any) => {
    console.error("Registration payment failed:", error);
    toast.error("Payment failed. Please try again.");
  };
  
  const handleSkip = () => {
    navigate("/worker/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">One-Time Registration</h1>
      <p className="text-neutral-300 mb-6">Complete your registration with a one-time payment</p>
      
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-medium">Registration Fee</h3>
            <p className="text-neutral-300 text-sm">One-time payment</p>
          </div>
          <div className="text-xl font-bold">₹{registrationFee}.00</div>
        </div>
        
        <div className="bg-neutral-100 p-4 rounded-md mb-6">
          <h4 className="font-medium mb-2">What you get:</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Verified worker badge</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Priority job notifications</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Customer contact information access</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Detailed job history and analytics</span>
            </li>
          </ul>
        </div>
      </Card>
      
      <div className="space-y-3">
        <PaytmPayment
          amount={registrationFee}
          description="Worker Registration Fee"
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
        
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
  );
}

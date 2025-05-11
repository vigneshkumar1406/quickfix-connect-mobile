
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WorkerPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handlePayment = () => {
    setIsLoading(true);
    
    // Simulate payment process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Payment successful!");
      navigate("/worker/dashboard");
    }, 2000);
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
          <div className="text-xl font-bold">₹99.00</div>
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
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="1234 5678 9012 3456" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="123" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Card Holder Name</Label>
            <Input id="name" placeholder="Name on card" />
          </div>
        </div>
      </Card>
      
      <div className="space-y-3">
        <Button 
          onClick={handlePayment} 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? "Processing..." : "Pay ₹99.00"}
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
  );
}

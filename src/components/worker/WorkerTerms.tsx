
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function WorkerTerms() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  
  const handleContinue = () => {
    if (!agreed) {
      toast.error("You must agree to the terms and conditions to continue");
      return;
    }
    
    navigate("/worker/payment");
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Terms & Conditions</h1>
      <p className="text-neutral-300 mb-6">Please read and accept our terms</p>
      
      <Card className="mb-6">
        <ScrollArea className="h-64 rounded-md border p-4">
          <div className="space-y-4">
            <h2 className="font-semibold">Fixsify Worker Terms of Service</h2>
            
            <p>These Terms of Service ("Terms") govern your access to and use of the Fixsify platform as a service provider ("Worker"). By accessing or using the Fixsify platform, you agree to be bound by these Terms.</p>
            
            <h3 className="font-semibold mt-4">1. Eligibility</h3>
            <p>To be eligible to use Fixsify as a Worker, you must:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into these Terms</li>
              <li>Have the necessary skills, experience, and qualifications to provide the services you offer</li>
              <li>Complete the registration process and be approved by Fixsify</li>
            </ul>
            
            <h3 className="font-semibold mt-4">2. Worker Responsibilities</h3>
            <p>As a Worker, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide services in a professional, competent, and timely manner</li>
              <li>Arrive at scheduled appointments on time</li>
              <li>Communicate with customers promptly and professionally</li>
              <li>Complete services as described and agreed upon with customers</li>
              <li>Maintain appropriate insurance coverage for your services</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
            
            <h3 className="font-semibold mt-4">3. Fees and Payments</h3>
            <p>By using Fixsify as a Worker, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pay a one-time registration fee of ₹99</li>
              <li>Fixsify will retain a service fee of 10% from each completed job</li>
              <li>Payments will be processed within 3-5 business days after job completion</li>
              <li>You are responsible for reporting and paying all applicable taxes</li>
            </ul>
            
            <h3 className="font-semibold mt-4">4. Termination</h3>
            <p>Fixsify reserves the right to terminate a Worker's account for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Violation of these Terms</li>
              <li>Consistent poor customer ratings</li>
              <li>Fraudulent activity</li>
              <li>Any other reason determined by Fixsify in its sole discretion</li>
            </ul>
          </div>
        </ScrollArea>
      </Card>
      
      <div className="flex items-start space-x-3 mb-6">
        <Checkbox 
          id="terms" 
          checked={agreed} 
          onCheckedChange={() => setAgreed(!agreed)} 
        />
        <label htmlFor="terms" className="text-sm">
          I have read and agree to the Terms and Conditions, including the processing of my personal data as described in the Privacy Policy.
        </label>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={handleContinue} 
          disabled={!agreed} 
          className="w-full"
        >
          Accept & Continue
        </Button>
        
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => navigate("/worker/payment")}
            className="text-neutral-300"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}

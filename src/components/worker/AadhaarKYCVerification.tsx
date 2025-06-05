
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, FileText, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../BackButton";

interface KYCStep {
  id: number;
  title: string;
  completed: boolean;
}

export default function AadhaarKYCVerification() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const steps: KYCStep[] = [
    { id: 1, title: "Enter Aadhaar Number", completed: false },
    { id: 2, title: "OTP Verification", completed: false },
    { id: 3, title: "Digital Locker Access", completed: false },
    { id: 4, title: "Verification Complete", completed: false }
  ];

  const handleAadhaarSubmit = async () => {
    if (aadhaarNumber.length !== 12) {
      toast.error("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    setVerifying(true);
    // Simulate API call to Aadhaar service
    setTimeout(() => {
      setOtpSent(true);
      setCurrentStep(2);
      setVerifying(false);
      toast.success("OTP sent to your registered mobile number");
    }, 2000);
  };

  const handleOTPVerification = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifying(true);
    // Simulate OTP verification
    setTimeout(() => {
      setCurrentStep(3);
      setVerifying(false);
      toast.success("OTP verified successfully");
    }, 1500);
  };

  const handleDigitalLockerAccess = async () => {
    setVerifying(true);
    // Simulate digital locker access
    setTimeout(() => {
      setCurrentStep(4);
      setVerified(true);
      setVerifying(false);
      toast.success("Digital documents verified successfully");
    }, 3000);
  };

  const handleComplete = () => {
    toast.success("KYC verification completed successfully!");
    navigate("/worker/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Aadhaar KYC Verification</h1>
        <p className="text-gray-600">Verify your identity using Digital Locker</p>
      </div>

      {/* Progress Steps */}
      <Card className="p-4 mb-6">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                currentStep > step.id ? 'bg-green-500 text-white' :
                currentStep === step.id ? 'bg-primary text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
              </div>
              <span className={`text-sm ${
                currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Enter Aadhaar Number</h3>
            <p className="text-sm text-gray-600">Your Aadhaar details are securely processed</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="aadhaar">Aadhaar Number</Label>
              <Input
                id="aadhaar"
                placeholder="Enter 12-digit Aadhaar number"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                maxLength={12}
              />
            </div>
            
            <Button 
              onClick={handleAadhaarSubmit}
              disabled={verifying || aadhaarNumber.length !== 12}
              className="w-full"
            >
              {verifying ? "Sending OTP..." : "Send OTP"}
            </Button>
          </div>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">OTP Verification</h3>
            <p className="text-sm text-gray-600">Enter the OTP sent to your registered mobile</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="otp">6-Digit OTP</Label>
              <Input
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
            </div>
            
            <Button 
              onClick={handleOTPVerification}
              disabled={verifying || otp.length !== 6}
              className="w-full"
            >
              {verifying ? "Verifying..." : "Verify OTP"}
            </Button>
            
            <Button variant="outline" onClick={() => setCurrentStep(1)} className="w-full">
              Change Aadhaar Number
            </Button>
          </div>
        </Card>
      )}

      {currentStep === 3 && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Digital Locker Access</h3>
            <p className="text-sm text-gray-600">Accessing your verified documents from Digital Locker</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Documents being verified:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Aadhaar Card</li>
                <li>• Personal Details</li>
                <li>• Address Verification</li>
                <li>• Digital Signature</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleDigitalLockerAccess}
              disabled={verifying}
              className="w-full"
            >
              {verifying ? "Accessing Digital Locker..." : "Access Digital Locker"}
            </Button>
          </div>
        </Card>
      )}

      {currentStep === 4 && verified && (
        <Card className="p-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-green-700">Verification Complete!</h3>
            <p className="text-sm text-gray-600 mb-6">Your KYC has been successfully verified using Digital Locker</p>
            
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-green-900 mb-2">Verified Information:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ Identity Verified</li>
                <li>✓ Address Verified</li>
                <li>✓ Documents Authentic</li>
                <li>✓ Digital Signature Valid</li>
              </ul>
            </div>
            
            <Button onClick={handleComplete} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="p-4 bg-yellow-50 border-yellow-200 mt-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-1" />
          <div>
            <h4 className="font-medium text-yellow-900">Security Notice</h4>
            <p className="text-sm text-yellow-700">Your Aadhaar data is processed securely and not stored on our servers. We use official government APIs for verification.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

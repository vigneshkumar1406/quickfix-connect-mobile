
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Camera, Upload } from "lucide-react";
import { workerAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const KYCVerification = ({ onComplete }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    panNumber: '',
    aadhaarFront: null,
    aadhaarBack: null,
    selfie: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleCaptureImage = (fieldName) => {
    // In a real app, this would open the camera
    toast.info("Camera functionality would open here");
  };

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, you would upload the files to your server
      // and then send the KYC data for verification
      
      // Mock API call for KYC verification
      if (!user?.id) {
        toast.error("User not authenticated");
        setLoading(false);
        return;
      }
      
      const response = await workerAPI.verifyKYC(user.id, {
        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber,
        // In a real app, these would be URLs to the uploaded files
        aadhaarFrontUrl: 'mock_url_for_aadhaar_front',
        aadhaarBackUrl: 'mock_url_for_aadhaar_back',
        selfieUrl: 'mock_url_for_selfie'
      });
      
      setLoading(false);
      
      if (response.success) {
        toast.success("KYC verification submitted successfully");
        if (onComplete) onComplete(response);
      } else {
        toast.error(response.message || "KYC verification failed");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred during KYC verification");
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-2">KYC Verification</h2>
      <p className="text-neutral-300 mb-6">Please complete identity verification</p>
      
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
            <Input
              id="aadhaarNumber"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleInputChange}
              placeholder="XXXX XXXX XXXX"
              maxLength={12}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="panNumber">PAN Number (Optional)</Label>
            <Input
              id="panNumber"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChange}
              placeholder="XXXXXXXXXX"
              maxLength={10}
            />
          </div>
          
          <Button 
            onClick={handleNextStep} 
            className="w-full"
            disabled={!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12}
          >
            Next
          </Button>
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Aadhaar Front</Label>
            <div className="border-2 border-dashed border-border rounded-md p-4 text-center">
              {formData.aadhaarFront ? (
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-100 p-2 mb-2">
                    <img 
                      src={URL.createObjectURL(formData.aadhaarFront)} 
                      alt="Aadhaar Front" 
                      className="h-32 object-contain"
                    />
                  </div>
                  <p className="text-sm text-neutral-300">{formData.aadhaarFront.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <Upload className="h-10 w-10 text-neutral-300 mb-2" />
                  <p className="text-sm text-neutral-300">Upload Aadhaar Front</p>
                </div>
              )}
              
              <div className="flex space-x-2 mt-4">
                <label className="flex-1">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </span>
                  </Button>
                  <Input
                    type="file"
                    name="aadhaarFront"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleCaptureImage('aadhaarFront')}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Camera
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Aadhaar Back</Label>
            <div className="border-2 border-dashed border-border rounded-md p-4 text-center">
              {formData.aadhaarBack ? (
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-100 p-2 mb-2">
                    <img 
                      src={URL.createObjectURL(formData.aadhaarBack)} 
                      alt="Aadhaar Back" 
                      className="h-32 object-contain"
                    />
                  </div>
                  <p className="text-sm text-neutral-300">{formData.aadhaarBack.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <Upload className="h-10 w-10 text-neutral-300 mb-2" />
                  <p className="text-sm text-neutral-300">Upload Aadhaar Back</p>
                </div>
              )}
              
              <div className="flex space-x-2 mt-4">
                <label className="flex-1">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </span>
                  </Button>
                  <Input
                    type="file"
                    name="aadhaarBack"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleCaptureImage('aadhaarBack')}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Camera
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handlePreviousStep} 
              className="flex-1"
            >
              Back
            </Button>
            
            <Button 
              onClick={handleNextStep} 
              className="flex-1"
              disabled={!formData.aadhaarFront || !formData.aadhaarBack}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Take a Selfie</Label>
            <div className="border-2 border-dashed border-border rounded-md p-4 text-center">
              {formData.selfie ? (
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-100 p-2 mb-2">
                    <img 
                      src={URL.createObjectURL(formData.selfie)} 
                      alt="Selfie" 
                      className="h-32 object-contain"
                    />
                  </div>
                  <p className="text-sm text-neutral-300">{formData.selfie.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <Camera className="h-10 w-10 text-neutral-300 mb-2" />
                  <p className="text-sm text-neutral-300">Take a clear selfie</p>
                </div>
              )}
              
              <div className="flex space-x-2 mt-4">
                <label className="flex-1">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </span>
                  </Button>
                  <Input
                    type="file"
                    name="selfie"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleCaptureImage('selfie')}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Camera
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-sm text-neutral-300 mb-4">
              I confirm that all the information provided is accurate and authentic. QuickFix may verify this information with government databases.
            </p>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep} 
                className="flex-1"
                disabled={loading}
              >
                Back
              </Button>
              
              <Button 
                onClick={handleSubmit} 
                className="flex-1"
                disabled={!formData.selfie || loading}
              >
                {loading ? 'Verifying...' : 'Submit KYC'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default KYCVerification;

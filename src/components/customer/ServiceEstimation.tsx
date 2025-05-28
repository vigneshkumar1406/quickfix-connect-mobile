
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Calculator, MapPin, Phone, User, 
  Clock, Wrench, Send, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { Slider } from "@/components/ui/slider";

interface EstimationForm {
  service: string;
  description: string;
  customerName: string;
  customerPhone: string;
  address: string;
  urgency: 'low' | 'medium' | 'high';
  preferredTime: string;
  estimatedBudget: number[];
}

export default function ServiceEstimation() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [estimationForm, setEstimationForm] = useState<EstimationForm>({
    service: "",
    description: "",
    customerName: "",
    customerPhone: "",
    address: "",
    urgency: "medium",
    preferredTime: "",
    estimatedBudget: [500]
  });

  const services = [
    "Home Cleaning", "Plumbing", "Electrical", "Painting", 
    "Carpentry", "Fridge Repair", "Washing Machine", 
    "Appliances", "Pest Control", "AC Service"
  ];

  const handleInputChange = (field: keyof EstimationForm, value: any) => {
    setEstimationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitEstimation = () => {
    // Validate required fields
    if (!estimationForm.service || !estimationForm.description || 
        !estimationForm.customerName || !estimationForm.customerPhone || 
        !estimationForm.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("Estimation request:", estimationForm);
    setIsSubmitted(true);
    toast.success("Estimation request submitted successfully!");
    
    // Simulate sending to workers
    setTimeout(() => {
      toast.info("We'll send you quotes from nearby workers soon!");
    }, 2000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
        <div className="mb-4">
          <BackButton withLabel />
        </div>
        
        <Card className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Estimation Request Sent!</h2>
            <p className="text-neutral-300">
              We've sent your request to nearby workers. You'll receive quotes within 24 hours.
            </p>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="bg-neutral-50 p-3 rounded-lg">
              <h4 className="font-medium mb-1">Service Requested</h4>
              <p className="text-sm text-neutral-300">{estimationForm.service}</p>
            </div>
            
            <div className="bg-neutral-50 p-3 rounded-lg">
              <h4 className="font-medium mb-1">Estimated Budget</h4>
              <p className="text-sm text-neutral-300">₹{estimationForm.estimatedBudget[0]}</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${getUrgencyColor(estimationForm.urgency)}`}>
              <h4 className="font-medium mb-1">Priority</h4>
              <p className="text-sm capitalize">{estimationForm.urgency}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/customer/dashboard")}
              className="w-full"
            >
              Back to Dashboard
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setEstimationForm({
                  service: "",
                  description: "",
                  customerName: "",
                  customerPhone: "",
                  address: "",
                  urgency: "medium",
                  preferredTime: "",
                  estimatedBudget: [500]
                });
              }}
              className="w-full"
            >
              Request Another Estimation
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Get Service Estimation</h1>
      <p className="text-neutral-300 mb-6">
        Tell us about your service needs and get quotes from qualified workers
      </p>
      
      <Card className="p-6 mb-6">
        <div className="space-y-4">
          {/* Service Selection */}
          <div>
            <Label htmlFor="service" className="text-sm font-medium mb-2 block">
              Service Type *
            </Label>
            <select
              id="service"
              value={estimationForm.service}
              onChange={(e) => handleInputChange('service', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium mb-2 block">
              Service Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what work needs to be done..."
              value={estimationForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="customerName" className="text-sm font-medium mb-2 block">
                Your Name *
              </Label>
              <Input
                id="customerName"
                placeholder="Enter your full name"
                value={estimationForm.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="customerPhone" className="text-sm font-medium mb-2 block">
                Phone Number *
              </Label>
              <Input
                id="customerPhone"
                placeholder="+91 xxxxx xxxxx"
                value={estimationForm.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" className="text-sm font-medium mb-2 block">
              Service Address *
            </Label>
            <Textarea
              id="address"
              placeholder="Enter your complete address..."
              value={estimationForm.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          {/* Budget Range */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Expected Budget Range
            </Label>
            <div className="px-3">
              <Slider
                value={estimationForm.estimatedBudget}
                onValueChange={(value) => handleInputChange('estimatedBudget', value)}
                max={5000}
                min={100}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹100</span>
                <span className="font-medium">₹{estimationForm.estimatedBudget[0]}</span>
                <span>₹5000+</span>
              </div>
            </div>
          </div>

          {/* Urgency */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Priority Level</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => handleInputChange('urgency', level)}
                  className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                    estimationForm.urgency === level
                      ? getUrgencyColor(level)
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Time */}
          <div>
            <Label htmlFor="preferredTime" className="text-sm font-medium mb-2 block">
              Preferred Time (Optional)
            </Label>
            <Input
              id="preferredTime"
              type="datetime-local"
              value={estimationForm.preferredTime}
              onChange={(e) => handleInputChange('preferredTime', e.target.value)}
            />
          </div>
        </div>
      </Card>
      
      <Button 
        onClick={handleSubmitEstimation}
        className="w-full h-12"
      >
        <Send className="w-4 h-4 mr-2" />
        Submit Estimation Request
      </Button>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-1">How it works:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• We'll send your request to nearby qualified workers</li>
          <li>• You'll receive multiple quotes within 24 hours</li>
          <li>• Compare prices and choose the best worker for you</li>
          <li>• Book directly through the app</li>
        </ul>
      </div>
    </div>
  );
}

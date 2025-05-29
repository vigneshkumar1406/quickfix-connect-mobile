
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Calculator, MapPin, Phone, User, 
  Clock, Wrench, Send, CheckCircle, Star, Shield, Award
} from "lucide-react";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { LoadingSpinner } from "../ui/loading";

interface EstimationForm {
  service: string;
  description: string;
  customerName: string;
  customerPhone: string;
  address: string;
  urgency: 'low' | 'medium' | 'high';
  preferredTime: string;
  estimatedBudget: number;
}

export default function ServiceEstimation() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [estimationForm, setEstimationForm] = useState<EstimationForm>({
    service: "",
    description: "",
    customerName: "",
    customerPhone: "",
    address: "",
    urgency: "medium",
    preferredTime: "",
    estimatedBudget: 500
  });

  const services = [
    { name: "Home Cleaning", price: "₹199 onwards", rating: 4.8, image: "🏠" },
    { name: "Plumbing", price: "₹149 onwards", rating: 4.7, image: "🔧" },
    { name: "Electrical", price: "₹199 onwards", rating: 4.9, image: "⚡" },
    { name: "Painting", price: "₹299 onwards", rating: 4.6, image: "🎨" },
    { name: "Carpentry", price: "₹249 onwards", rating: 4.8, image: "🔨" },
    { name: "AC Service", price: "₹199 onwards", rating: 4.9, image: "❄️" },
    { name: "Appliance Repair", price: "₹179 onwards", rating: 4.7, image: "🔧" },
    { name: "Pest Control", price: "₹399 onwards", rating: 4.8, image: "🐛" },
  ];

  const handleServiceSelect = (service: any) => {
    setSelectedService(service.name);
    setEstimationForm(prev => ({
      ...prev,
      service: service.name
    }));
  };

  const handleInputChange = (field: keyof EstimationForm, value: any) => {
    setEstimationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitEstimation = async () => {
    // Validate required fields
    if (!estimationForm.service || !estimationForm.description || 
        !estimationForm.customerName || !estimationForm.customerPhone || 
        !estimationForm.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    console.log("Estimation request:", estimationForm);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Estimation request submitted successfully!");
    }, 2000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-500 bg-red-50 text-red-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-green-500 bg-green-50 text-green-700';
      default: return 'border-gray-300 bg-gray-50 text-gray-700';
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
        <div className="mb-4">
          <BackButton withLabel />
        </div>
        
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
          <p className="text-gray-600">
            We'll connect you with verified professionals shortly
          </p>
        </div>
        
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Service</span>
              <span className="font-medium">{estimationForm.service}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected Budget</span>
              <span className="font-medium text-primary">₹{estimationForm.estimatedBudget}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Priority</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getUrgencyColor(estimationForm.urgency)}`}>
                {estimationForm.urgency}
              </span>
            </div>
          </div>
        </Card>
        
        <div className="space-y-3">
          <Button onClick={() => navigate("/customer/dashboard")} className="w-full">
            Back to Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setIsSubmitted(false);
              setSelectedService("");
              setEstimationForm({
                service: "",
                description: "",
                customerName: "",
                customerPhone: "",
                address: "",
                urgency: "medium",
                preferredTime: "",
                estimatedBudget: 500
              });
            }}
            className="w-full"
          >
            Get Another Estimation
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedService) {
    return (
      <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
        <div className="mb-4">
          <BackButton withLabel />
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Get Service Estimation</h1>
          <p className="text-gray-600">Choose a service to get instant quotes from verified professionals</p>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary"
              onClick={() => handleServiceSelect(service)}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{service.image}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{service.rating}</span>
                    <span>•</span>
                    <span className="text-primary font-medium">{service.price}</span>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-900">100% Safe & Secure</h4>
              <p className="text-sm text-blue-700">All professionals are background verified</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => setSelectedService("")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{selectedService}</h1>
        <p className="text-gray-600">Tell us about your requirements</p>
      </div>
      
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                Describe your requirement *
              </Label>
              <Textarea
                id="description"
                placeholder="What work needs to be done? Be specific about your requirements..."
                value={estimationForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium mb-2 block">
                Service Location *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Textarea
                  id="address"
                  placeholder="Enter your complete address..."
                  value={estimationForm.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="pl-10 min-h-[60px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="customerName" className="text-sm font-medium mb-2 block">
                  Your Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="customerName"
                    placeholder="Enter your full name"
                    value={estimationForm.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customerPhone" className="text-sm font-medium mb-2 block">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="customerPhone"
                    placeholder="+91 xxxxx xxxxx"
                    value={estimationForm.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">When do you need this service?</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => handleInputChange('urgency', level)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      estimationForm.urgency === level
                        ? getUrgencyColor(level)
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {level === 'low' && '📅 Within a week'}
                    {level === 'medium' && '⚡ In 2-3 days'}
                    {level === 'high' && '🚨 Urgent'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Expected Budget Range
              </Label>
              <div className="space-y-2">
                <Input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={estimationForm.estimatedBudget}
                  onChange={(e) => handleInputChange('estimatedBudget', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹100</span>
                  <span className="font-medium text-primary">₹{estimationForm.estimatedBudget}</span>
                  <span>₹5000+</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Button 
          onClick={handleSubmitEstimation}
          disabled={isLoading}
          className="w-full h-12 text-lg"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Get Free Quotes
            </>
          )}
        </Button>
        
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-medium text-green-900">Get Multiple Quotes</h4>
              <p className="text-sm text-green-700">Compare prices from verified professionals</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

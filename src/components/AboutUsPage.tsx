
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Users, Zap, Heart, Award, CheckCircle } from "lucide-react";
import BackButton from "./BackButton";

export default function AboutUsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Verified Professionals",
      description: "All workers are KYC verified and background checked for your safety"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: "Quick Service",
      description: "Get connected with nearby workers within minutes of booking"
    },
    {
      icon: <Heart className="w-6 h-6 text-red-600" />,
      title: "Customer First",
      description: "Your satisfaction is our priority with 24/7 support"
    },
    {
      icon: <Award className="w-6 h-6 text-green-600" />,
      title: "Quality Assured",
      description: "Rating system ensures high-quality service delivery"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "5,000+", label: "Verified Workers" },
    { number: "50,000+", label: "Services Completed" },
    { number: "4.8/5", label: "Average Rating" }
  ];

  return (
    <div className="w-full pb-6 animate-fade-in">
      <div className="mb-6">
        <BackButton withLabel />
      </div>

      <div className="bg-primary text-white p-6 rounded-b-3xl mb-6">
        <h1 className="text-2xl font-bold mb-1">About Fixsify</h1>
        <p className="opacity-90">Connecting skilled professionals with customers who need their services</p>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Our Mission</h2>
        <p className="text-neutral-600 leading-relaxed mb-4">
          Fixsify is revolutionizing the way people access home services. We connect customers with skilled, 
          verified professionals in their local area, making it easier than ever to get quality work done quickly and safely.
        </p>
        <p className="text-neutral-600 leading-relaxed">
          Whether you need a plumber, electrician, cleaner, or any other home service professional, 
          Fixsify ensures you get reliable, professional service with complete transparency and fair pricing.
        </p>
      </Card>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Why Choose Fixsify?</h2>
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start">
                <div className="bg-neutral-100 p-2 rounded-full mr-3 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-neutral-600">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-xl font-bold mb-4 text-center">Our Impact</h2>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-primary">{stat.number}</div>
              <div className="text-sm text-neutral-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">How It Works</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold">Book Your Service</h3>
              <p className="text-sm text-neutral-600">Choose your service, location, and preferred time</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold">Get Matched</h3>
              <p className="text-sm text-neutral-600">We find the best nearby professional for your needs</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold">Track & Pay</h3>
              <p className="text-sm text-neutral-600">Track progress in real-time and pay securely through the app</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Button 
          className="w-full"
          onClick={() => navigate("/language-selection")}
        >
          Get Started as Customer
        </Button>
        
        <Button 
          variant="outline"
          className="w-full"
          onClick={() => navigate("/language-selection")}
        >
          Join as Worker
        </Button>
      </div>
    </div>
  );
}

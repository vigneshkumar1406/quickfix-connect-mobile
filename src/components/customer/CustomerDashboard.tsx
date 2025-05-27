import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Wrench, Star, Users, Phone, Wallet, Clock, 
  Coins, Gift, History, TrendingUp, ChevronDown, ChevronUp
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { toast } from "sonner";
import { useState } from "react";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentLocation, getUserLocation } = useLocation();
  const [isWalletExpanded, setIsWalletExpanded] = useState(false);

  const handleBookService = () => {
    if (!currentLocation) {
      getUserLocation();
    }
    navigate("/customer/book-service");
  };

  const handleServiceSelect = (serviceName: string) => {
    console.log("Service selected:", serviceName);
    navigate("/customer/book-service", { state: { selectedService: serviceName } });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "book-later":
        navigate("/customer/book-service", { state: { bookingType: "later" } });
        break;
      case "for-others":
        navigate("/customer/book-service", { state: { bookingFor: "others" } });
        break;
      case "contact":
        toast.info("Contact feature coming soon!");
        break;
      default:
        break;
    }
  };

  const handleWalletClick = () => {
    navigate("/customer/wallet");
  };

  const services = [
    { 
      name: "Home Cleaning", 
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop&crop=center"
    },
    { 
      name: "Plumbing", 
      image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&h=200&fit=crop&crop=center"
    },
    { 
      name: "Electrical", 
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop&crop=center"
    },
    { 
      name: "Painting", 
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=200&fit=crop&crop=center"
    },
    { 
      name: "Carpentry", 
      image: "https://images.unsplash.com/photo-1609072053033-8e9e11eb6c17?w=200&h=200&fit=crop&crop=center"
    },
    { 
      name: "Fridge Repair", 
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=200&h=200&fit=crop&crop=center"
    },
    { 
      name: "Washing Machine", 
      image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&h=200&fit=crop&crop=center"
    },
    { 
      name: "Appliances", 
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center"
    },
    { 
      name: "Pest Control", 
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center"
    },
    { 
      name: "AC Service", 
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop&crop=center"
    }
  ];

  return (
    <div className="w-full pb-24 animate-fade-in">
      <div className="bg-primary text-white p-6 rounded-b-3xl mb-6">
        <h1 className="text-2xl font-bold mb-1">QuickFix</h1>
        <p className="opacity-90">Welcome back {user?.name || user?.phoneNumber || 'Customer'}</p>
      </div>
      
      <div className="mb-6">
        <Button 
          className="w-full h-14 text-lg"
          onClick={handleBookService}
        >
          <Wrench className="mr-2 w-5 h-5" />
          Book a Service
        </Button>
      </div>
      
      <h2 className="font-semibold mb-3">Quick Actions</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card 
          className="p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction("book-later")}
        >
          <div className="bg-neutral-100 p-2 rounded-full mb-2">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-xs">Book Later</h3>
        </Card>
        
        <Card 
          className="p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction("for-others")}
        >
          <div className="bg-neutral-100 p-2 rounded-full mb-2">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-xs">For Others</h3>
        </Card>
        
        <Card 
          className="p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction("contact")}
        >
          <div className="bg-neutral-100 p-2 rounded-full mb-2">
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-xs">Contact Us</h3>
        </Card>
      </div>
      
      <h2 className="font-semibold mb-3">Services</h2>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        {services.map((service, index) => (
          <Card 
            key={index} 
            className="p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleServiceSelect(service.name)}
          >
            <div className="w-12 h-12 mb-2 rounded-lg overflow-hidden">
              <img 
                src={service.image} 
                alt={service.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log("Image failed to load:", service.image);
                  e.currentTarget.src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop&crop=center";
                }}
              />
            </div>
            <h3 className="text-xs">{service.name}</h3>
          </Card>
        ))}
      </div>
      
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex items-center mb-3">
            <Star className="w-5 h-5 text-primary mr-2" />
            <h3 className="font-semibold">Reviews</h3>
          </div>
          <p className="text-neutral-300 text-sm">View reviews for completed services</p>
        </div>
        <div className="border-t px-4 py-3 flex justify-between items-center">
          <span className="text-sm">30 past services</span>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
      </Card>
      
      <Button 
        variant="outline" 
        className="w-full mb-6"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Sign Out
      </Button>

      {/* Updated Fixed Wallet Box at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Card 
          className="cursor-pointer transition-all duration-300"
          onClick={handleWalletClick}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Coins className="w-5 h-5 text-yellow-500 mr-2" />
                <div>
                  <h3 className="font-semibold text-sm">QuickFix Coins</h3>
                  <p className="text-xs text-neutral-300">0 Coins available</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold text-yellow-600 mr-2">₹0.00</span>
                <div className="bg-blue-100 p-1 rounded">
                  <Wallet className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

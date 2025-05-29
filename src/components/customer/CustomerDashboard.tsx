import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Wrench, Star, Users, Phone, Wallet, Clock, 
  Coins, Gift, History, TrendingUp, ChevronDown, ChevronUp, Calculator
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useLocation as useLocationContext } from '@/contexts/LocationContext';
import { toast } from "sonner";
import { useState, useEffect } from "react";

// Create a separate component for the auto-sliding image carousel
const ServiceImageCarousel = ({ images, serviceName }: { images: string[], serviceName: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full h-24 rounded-lg overflow-hidden relative">
      <img 
        src={images[currentImageIndex]} 
        alt={`${serviceName} ${currentImageIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
        onError={(e) => {
          console.log("Image failed to load:", images[currentImageIndex]);
          e.currentTarget.src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop&crop=center";
        }}
      />
      <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
        {currentImageIndex + 1}/{images.length}
      </div>
    </div>
  );
};

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentLocation, getUserLocation } = useLocationContext();
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
        navigate("/contact");
        break;
      default:
        break;
    }
  };

  const handleWalletClick = () => {
    navigate("/customer/wallet");
  };

  const handleGetEstimation = () => {
    console.log("Navigating to estimation page");
    navigate("/customer/estimation");
  };

  const services = [
    { 
      name: "Home Cleaning", 
      images: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=200&h=200&fit=crop&crop=center"
      ]
    },
    { 
      name: "Plumbing", 
      images: [
        "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&h=200&fit=crop&crop=center"
      ]
    },
    { 
      name: "Electrical", 
      images: [
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1609010697446-11f2155278f0?w=200&h=200&fit=crop&crop=center"
      ]
    },
    { 
      name: "Painting", 
      images: [
        "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1616464654248-5bbdc3b4c101?w=200&h=200&fit=crop&crop=center"
      ]
    },
    { 
      name: "Carpentry", 
      images: [
        "https://images.unsplash.com/photo-1609072053033-8e9e11eb6c17?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&h=200&fit=crop&crop=center"
      ]
    },
    { 
      name: "Fridge Repair", 
      images: [
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=200&h=200&fit=crop&crop=center"
      ]
    },
    { 
      name: "Washing Machine", 
      images: [
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center"
      ]
    },
    { 
      name: "Appliances", 
      images: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop&crop=center"
      ]
    },
    { 
      name: "Pest Control", 
      images: [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=200&h=200&fit=crop&crop=center"
      ]
    },
    { 
      name: "AC Service", 
      images: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1635247230951-8b1e62516b45?w=200&h=200&fit=crop&crop=center"
      ]
    }
  ];

  return (
    <div className="w-full pb-24 animate-fade-in">
      <div className="bg-primary text-white p-6 rounded-b-3xl mb-6">
        <h1 className="text-2xl font-bold mb-1">QuickFix</h1>
        <p className="opacity-90">Welcome back {user?.name || user?.phoneNumber || 'Customer'}</p>
      </div>
      
      <div className="mb-6 space-y-3">
        <Button 
          className="w-full h-14 text-lg"
          onClick={handleBookService}
        >
          <Wrench className="mr-2 w-5 h-5" />
          Book a Service
        </Button>
        
        <Button 
          variant="outline"
          className="w-full h-12 text-base"
          onClick={handleGetEstimation}
        >
          <Calculator className="mr-2 w-5 h-5" />
          Get Estimation
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
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {services.map((service, index) => (
          <Card 
            key={index} 
            className="p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleServiceSelect(service.name)}
          >
            <ServiceImageCarousel images={service.images} serviceName={service.name} />
            <h3 className="text-xs font-medium mt-2">{service.name}</h3>
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

      {/* Fixed Wallet Box at Bottom */}
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
                  <h3 className="font-semibold text-sm">QuickFix Wallet</h3>
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

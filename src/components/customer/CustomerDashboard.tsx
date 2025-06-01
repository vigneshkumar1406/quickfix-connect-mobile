
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Zap,
  User,
  Bell,
  Settings,
  Wallet,
  History
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "@/contexts/LocationContext";
import ServiceImageSlider from "./ServiceImageSlider";
import CustomerNameModal from "./CustomerNameModal";

const services = [
  {
    id: 1,
    name: "Plumbing",
    description: "Professional plumbing services for all your needs",
    price: "₹199 onwards",
    rating: 4.8,
    bookings: 1200,
    images: [
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300"
    ]
  },
  {
    id: 2,
    name: "Electrical",
    description: "Safe and reliable electrical solutions",
    price: "₹149 onwards",
    rating: 4.7,
    bookings: 980,
    images: [
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300",
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300",
      "https://images.unsplash.com/photo-1621905252472-e8592929c4c6?w=300"
    ]
  },
  {
    id: 3,
    name: "Cleaning",
    description: "Deep cleaning services for your home",
    price: "₹299 onwards",
    rating: 4.9,
    bookings: 1500,
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300"
    ]
  },
  {
    id: 4,
    name: "AC Repair",
    description: "AC installation, repair and maintenance",
    price: "₹399 onwards",
    rating: 4.6,
    bookings: 750,
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300"
    ]
  },
  {
    id: 5,
    name: "Carpenter",
    description: "Furniture repair and woodwork services",
    price: "₹249 onwards",
    rating: 4.8,
    bookings: 890,
    images: [
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300",
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300"
    ]
  },
  {
    id: 6,
    name: "Painting",
    description: "Interior and exterior painting services",
    price: "₹179 onwards",
    rating: 4.7,
    bookings: 650,
    images: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300",
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300"
    ]
  }
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentLocation, getUserLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [isLoadingName, setIsLoadingName] = useState(false);

  // Check if customer name exists
  useEffect(() => {
    const savedName = localStorage.getItem('quickfix_customer_name');
    if (savedName) {
      setCustomerName(savedName);
    } else if (user) {
      // Show name modal for new customers
      setShowNameModal(true);
    }
  }, [user]);

  const handleNameSubmit = (name: string) => {
    setIsLoadingName(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('quickfix_customer_name', name);
      setCustomerName(name);
      setShowNameModal(false);
      setIsLoadingName(false);
      toast.success(`Welcome, ${name}! 🎉`);
    }, 1000);
  };

  const handleServiceSelect = (service: any) => {
    navigate("/customer/book-service", { 
      state: { 
        selectedService: service,
        customerName: customerName 
      } 
    });
  };

  const handleGetEstimation = () => {
    navigate("/customer/estimation");
  };

  const handleMultipleEstimation = () => {
    navigate("/customer/multiple-estimation");
  };

  const handleNotifications = () => {
    navigate("/customer/notifications");
  };

  const handleSettings = () => {
    navigate("/customer/settings");
  };

  const handleProfile = () => {
    navigate("/customer/profile");
  };

  const handleEmergencyCall = () => {
    navigate("/customer/emergency");
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <CustomerNameModal 
        isOpen={showNameModal}
        onSubmit={handleNameSubmit}
        loading={isLoadingName}
      />

      {/* Header - Mobile Optimized */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">
                {customerName ? `Hi, ${customerName}! 👋` : 'Welcome! 👋'}
              </h1>
              <p className="text-xs text-gray-600 truncate">Find trusted professionals</p>
            </div>
            <div className="flex items-center space-x-2 ml-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleNotifications}>
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate("/customer/wallet")}>
                <Wallet className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleSettings}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Location and Search */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600 min-w-0 flex-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs truncate">
                {currentLocation ? "Current Location" : "Location not set"}
              </span>
            </div>
            {!currentLocation && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={getUserLocation}
                className="text-primary p-0 h-auto text-xs flex-shrink-0"
              >
                Set Location
              </Button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border-gray-200 focus:border-primary"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="p-3 h-auto flex-col space-y-1"
              onClick={handleGetEstimation}
            >
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium">Get Estimation</span>
            </Button>
            <Button 
              variant="outline" 
              className="p-3 h-auto flex-col space-y-1"
              onClick={() => navigate("/customer/service-tracking")}
            >
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-xs font-medium">Track Service</span>
            </Button>
            <Button 
              variant="outline" 
              className="p-3 h-auto flex-col space-y-1"
              onClick={handleMultipleEstimation}
            >
              <History className="w-5 h-5 text-green-500" />
              <span className="text-xs font-medium">Multiple Services</span>
            </Button>
            <Button 
              variant="outline" 
              className="p-3 h-auto flex-col space-y-1"
              onClick={handleProfile}
            >
              <User className="w-5 h-5 text-purple-500" />
              <span className="text-xs font-medium">Profile</span>
            </Button>
          </div>
        </div>

        {/* Services Grid - Mobile Optimized */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Popular Services</h2>
          
          {filteredServices.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500 text-sm">No services found matching your search.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex">
                    {/* Image Section - Smaller */}
                    <div className="w-20 h-20 flex-shrink-0">
                      <ServiceImageSlider 
                        images={service.images} 
                        serviceName={service.name}
                        className="h-full"
                      />
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-1 p-3 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                          {service.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {service.rating}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary text-sm">{service.price}</span>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {service.bookings}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Services */}
        <Card className="bg-red-50 border-red-200">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Emergency Services</h3>
            <p className="text-red-600 mb-3 text-sm">Need urgent help? We're available 24/7 for emergency services.</p>
            <Button 
              className="bg-red-600 hover:bg-red-700 w-full"
              onClick={handleEmergencyCall}
            >
              Call Emergency Support
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

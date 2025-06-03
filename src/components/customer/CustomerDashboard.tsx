
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Bell, MapPin, Star, Clock, Phone, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation as useLocationContext } from "@/contexts/LocationContext";
import CustomerNameModal from "./CustomerNameModal";
import { toast } from "sonner";

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
    description: "Expert electrical repairs and installations",
    price: "₹249 onwards",
    rating: 4.7,
    bookings: 980,
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300",
      "https://images.unsplash.com/photo-1621905252472-91b3222d6ca4?w=300",
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300"
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
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300",
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=300"
    ]
  },
  {
    id: 4,
    name: "Painting",
    description: "Interior and exterior painting services",
    price: "₹399 onwards",
    rating: 4.6,
    bookings: 750,
    images: [
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300"
    ]
  }
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { selectedService, customerName, setSelectedService, setCustomerName } = useLocationContext();
  const [showNameModal, setShowNameModal] = useState(false);
  const [isSubmittingName, setIsSubmittingName] = useState(false);

  // Check if customer name is set, if not show modal
  useEffect(() => {
    if (!customerName || customerName.trim() === '') {
      setShowNameModal(true);
    }
  }, [customerName]);

  const handleNameSubmit = async (name: string) => {
    setIsSubmittingName(true);
    
    try {
      // Save customer name
      setCustomerName(name);
      
      // Here you would typically save to your backend/storage
      localStorage.setItem('customerName', name);
      
      toast.success(`Welcome ${name}! You're all set.`);
      setShowNameModal(false);
    } catch (error) {
      toast.error("Failed to save your name. Please try again.");
    } finally {
      setIsSubmittingName(false);
    }
  };

  const handleServiceSelect = (service: any) => {
    console.log("Service selected:", service);
    setSelectedService(service);
    navigate("/customer/book-service");
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'emergency':
        navigate('/customer/emergency-support');
        break;
      case 'multiple':
        navigate('/customer/multiple-estimation');
        break;
      case 'profile':
        navigate('/customer/profile');
        break;
      case 'notifications':
        navigate('/customer/notifications');
        break;
      default:
        toast.info(`${action} feature coming soon!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <CustomerNameModal 
        isOpen={showNameModal}
        onSubmit={handleNameSubmit}
        loading={isSubmittingName}
      />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mr-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Hello, {customerName || 'Guest'}!
              </h1>
              <p className="text-sm text-gray-600">How can we help you today?</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleQuickAction('notifications')}
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleQuickAction('profile')}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Location Banner */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            <div className="flex-1">
              <p className="text-sm opacity-90">Service Location</p>
              <p className="font-medium">T. Nagar, Chennai</p>
            </div>
            <Button variant="secondary" size="sm">
              Change
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Button 
            variant="outline" 
            className="h-16 flex flex-col items-center justify-center bg-red-50 border-red-200 hover:bg-red-100"
            onClick={() => handleQuickAction('emergency')}
          >
            <Phone className="w-5 h-5 mb-1 text-red-600" />
            <span className="text-sm text-red-600">Emergency</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-16 flex flex-col items-center justify-center bg-green-50 border-green-200 hover:bg-green-100"
            onClick={() => handleQuickAction('multiple')}
          >
            <Star className="w-5 h-5 mb-1 text-green-600" />
            <span className="text-sm text-green-600">Multiple Services</span>
          </Button>
        </div>

        {/* Services Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Popular Services</h2>
          <div className="grid grid-cols-2 gap-4">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm"
                onClick={() => handleServiceSelect(service)}
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-gray-100 to-gray-200">
                  <img 
                    src={service.images[0]} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary">{service.price}</span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                    <span className="text-xs text-gray-600">{service.rating}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {service.bookings} bookings
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

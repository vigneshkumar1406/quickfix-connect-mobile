import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail, MessageCircle, Calendar, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { toast } from "sonner";
import ServiceImageSlider from "./ServiceImageSlider";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { currentLocation } = useLocation();
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (service: any) => {
    console.log("Service selected:", service);
    setSelectedService(service);
    
    // Navigate to book service page with service data
    navigate('/customer/book-service', { 
      state: { 
        selectedService: service 
      } 
    });
  };

  // Mock services data - in a real app, this would come from an API
  const services = [
    {
      id: 1,
      name: "Plumbing",
      description: "Pipe repairs, leak fixes, and installations",
      price: "₹199 onwards",
      rating: 4.8,
      images: [
        "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300"
      ]
    },
    {
      id: 2,
      name: "Electrical",
      description: "Expert electrical repairs and installations",
      price: "₹249 onwards",
      rating: 4.7,
      images: [
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300"
      ]
    },
    {
      id: 3,
      name: "Carpentry",
      description: "Furniture repairs and custom woodwork",
      price: "₹299 onwards",
      rating: 4.6,
      images: [
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300"
      ]
    },
    {
      id: 4,
      name: "Painting",
      description: "Interior and exterior painting services",
      price: "₹399 onwards",
      rating: 4.6,
      images: [
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300",
        "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300"
      ]
    },
    {
      id: 5,
      name: "Home Cleaning",
      description: "Deep cleaning and regular maintenance",
      price: "₹199 onwards",
      rating: 4.9,
      images: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300",
        "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300"
      ]
    },
    {
      id: 6,
      name: "Appliance Repair",
      description: "Kitchen and home appliance repairs",
      price: "₹299 onwards",
      rating: 4.7,
      images: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300"
      ]
    },
    {
      id: 7,
      name: "Fridge Repair",
      description: "Professional refrigerator repair service",
      price: "₹349 onwards",
      rating: 4.8,
      images: [
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300"
      ]
    },
    {
      id: 8,
      name: "Washing Machine",
      description: "Washing machine repair and maintenance",
      price: "₹279 onwards",
      rating: 4.6,
      images: [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300",
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300"
      ]
    },
    {
      id: 9,
      name: "Pest Control",
      description: "Complete pest elimination service",
      price: "₹199 onwards",
      rating: 4.7,
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
        "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300"
      ]
    },
    {
      id: 10,
      name: "AC Service",
      description: "Air conditioner repair and maintenance",
      price: "₹399 onwards",
      rating: 4.8,
      images: [
        "https://images.unsplash.com/photo-1631545930683-c7c91dad5e4d?w=300",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QuickFix Dashboard</h1>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {currentLocation?.address || "Chennai, Tamil Nadu"}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/customer/profile')}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">JD</span>
            </div>
            Profile
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-red-50 border-red-200"
            onClick={() => navigate('/customer/emergency-support')}
          >
            <div className="flex flex-col items-center text-center">
              <Phone className="w-8 h-8 text-red-600 mb-2" />
              <h3 className="font-semibold text-red-800">Book via Call</h3>
              <p className="text-sm text-red-600">Immediate assistance</p>
            </div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => window.open('tel:+911234567890', '_self')}
          >
            <div className="flex flex-col items-center text-center">
              <Phone className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold">Call Now</h3>
              <p className="text-sm text-gray-600">Direct call support</p>
            </div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => window.open('mailto:support@quickfix.com', '_blank')}
          >
            <div className="flex flex-col items-center text-center">
              <Mail className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold">Mail</h3>
              <p className="text-sm text-gray-600">Email support</p>
            </div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => window.open('https://wa.me/911234567890', '_blank')}
          >
            <div className="flex flex-col items-center text-center">
              <MessageCircle className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-green-800">WhatsApp</h3>
              <p className="text-sm text-green-600">Chat support</p>
            </div>
          </Card>
        </div>

        {/* Chat with Support */}
        <Card className="p-4 mb-8 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-blue-800">Chat with Support</h3>
                <p className="text-sm text-blue-600">Get instant help from our support team</p>
              </div>
            </div>
            <Button 
              onClick={() => toast.info("Chat support will be available soon")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Chat
            </Button>
          </div>
        </Card>

        {/* Services Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Our Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {services.map((service) => (
              <Card 
                key={service.id}
                className="p-3 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => handleServiceClick(service)}
              >
                <div className="aspect-square mb-3">
                  <ServiceImageSlider
                    images={service.images}
                    serviceName={service.name}
                    className="w-full h-full rounded-lg"
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-primary">{service.price}</span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                    <span className="text-xs">{service.rating}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* QuickFix Wallet */}
        <Card 
          className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/customer/wallet')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <h3 className="font-semibold text-purple-800 text-lg">QuickFix Wallet</h3>
                <p className="text-purple-600">Manage your coins and payments</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-800">2,450</p>
              <p className="text-sm text-purple-600">QuickFix Coins</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

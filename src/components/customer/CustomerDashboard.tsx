
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Wrench, Home, Star, Users, Phone, Wallet, HelpCircle, Clock, 
  Refrigerator, WashingMachine
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { toast } from "sonner";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentLocation, getUserLocation } = useLocation();

  const handleBookService = () => {
    // Request location before booking service
    if (!currentLocation) {
      getUserLocation();
    }
    navigate("/customer/book-service");
  };

  return (
    <div className="w-full pb-6 animate-fade-in">
      <div className="bg-primary text-white p-6 rounded-b-3xl mb-6">
        <h1 className="text-2xl font-bold mb-1">QuickFix</h1>
        <p className="opacity-90">Welcome back {user?.name || ''}</p>
        
        <Card className="bg-white mt-6 p-3 rounded-lg text-foreground">
          <div className="flex items-center mb-3">
            <Wallet className="w-5 h-5 text-primary mr-2" />
            <h3 className="font-semibold">QuickFix Wallet</h3>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-neutral-300">Available Balance</p>
              <p className="text-xl font-bold">₹0.00</p>
            </div>
            <Button size="sm" variant="outline">Add Money</Button>
          </div>
        </Card>
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
        <Card className="p-3 flex flex-col items-center justify-center text-center">
          <div className="bg-neutral-100 p-2 rounded-full mb-2">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-xs">Book Later</h3>
        </Card>
        
        <Card className="p-3 flex flex-col items-center justify-center text-center">
          <div className="bg-neutral-100 p-2 rounded-full mb-2">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-xs">For Others</h3>
        </Card>
        
        <Card className="p-3 flex flex-col items-center justify-center text-center">
          <div className="bg-neutral-100 p-2 rounded-full mb-2">
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-xs">Contact Us</h3>
        </Card>
      </div>
      
      <h2 className="font-semibold mb-3">Services</h2>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Home className="w-6 h-6" />, name: "Home Cleaning" },
          { icon: <Wrench className="w-6 h-6" />, name: "Plumbing" },
          { icon: <Wrench className="w-6 h-6" />, name: "Electrical" },
          { icon: <Wrench className="w-6 h-6" />, name: "Painting" },
          { icon: <Wrench className="w-6 h-6" />, name: "Carpentry" },
          { icon: <Refrigerator className="w-6 h-6" />, name: "Fridge Repair" },
          { icon: <WashingMachine className="w-6 h-6" />, name: "Washing Machine" },
          { icon: <Wrench className="w-6 h-6" />, name: "Appliances" },
          { icon: <Wrench className="w-6 h-6" />, name: "Pest Control" },
          { icon: <HelpCircle className="w-6 h-6" />, name: "More" }
        ].map((service, index) => (
          <Card key={index} className="p-3 flex flex-col items-center justify-center text-center">
            <div className="bg-neutral-100 p-2 rounded-full mb-2">
              {service.icon}
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
        className="w-full"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}

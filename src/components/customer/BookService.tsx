
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { 
  Clock, Calendar, MapPin, User, Users, ArrowRight, Navigation, Map
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation as useLocationContext } from '@/contexts/LocationContext';

const services = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Home Cleaning",
  "Appliance Repair",
  "Fridge Repair",
  "Washing Machine",
  "Pest Control",
  "AC Service",
];

export default function BookService() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLocation, getUserLocation } = useLocationContext();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingType, setBookingType] = useState("now");
  const [bookingFor, setBookingFor] = useState("self");
  const [address, setAddress] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  // Check if service was pre-selected from dashboard
  useEffect(() => {
    if (location.state?.selectedService) {
      setSelectedService(location.state.selectedService);
    }
  }, [location.state]);

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
  };

  const handleCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      await getUserLocation();
      if (currentLocation) {
        // Simulate reverse geocoding - in real app, use Google Maps API
        const mockAddress = "123 Main Street, Adyar, Chennai, Tamil Nadu 600020";
        setAddress(mockAddress);
        toast.success("Current location fetched");
      }
    } catch (error) {
      toast.error("Failed to get current location");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocateOnMap = () => {
    // For now, simulate map selection
    const mockAddress = "456 Park Avenue, T. Nagar, Chennai, Tamil Nadu 600017";
    setAddress(mockAddress);
    toast.success("Location selected from map");
  };
  
  const handleBookService = () => {
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }

    if (!address && bookingType === "now") {
      toast.error("Please provide an address");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsLoading(false);
      navigate("/customer/finding-service");
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Book a Service</h1>
      <p className="text-neutral-300 mb-6">Select service and preferences</p>
      
      {/* Address Section */}
      <div className="mb-6">
        <h2 className="font-semibold mb-3">Service Address</h2>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCurrentLocation}
              disabled={isLoadingLocation}
              className="flex-1"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {isLoadingLocation ? "Loading..." : "Current Location"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLocateOnMap}
              className="flex-1"
            >
              <Map className="w-4 h-4 mr-2" />
              Locate on Map
            </Button>
          </div>
          
          <Textarea
            placeholder="Enter or edit your address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </div>
      
      <Tabs defaultValue="now" className="mb-6" onValueChange={(v) => setBookingType(v)}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="now" className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Book Now
          </TabsTrigger>
          <TabsTrigger value="later" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="now">
          <Card className="p-4">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-primary mr-2" />
              <div>
                <p className="text-sm font-medium">Immediate Service</p>
                <p className="text-xs text-neutral-300">Service will be scheduled as soon as possible</p>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="later">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="time">Select Time</Label>
                <Input
                  id="time"
                  type="time"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mb-6">
        <h2 className="font-semibold mb-3">Book For</h2>
        <RadioGroup defaultValue="self" onValueChange={setBookingFor}>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="self" id="self" />
              <Label htmlFor="self" className="flex items-center cursor-pointer">
                <User className="w-4 h-4 mr-1" />
                Self
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="others" id="others" />
              <Label htmlFor="others" className="flex items-center cursor-pointer">
                <Users className="w-4 h-4 mr-1" />
                Someone else
              </Label>
            </div>
          </div>
        </RadioGroup>
        
        {bookingFor === "others" && (
          <div className="mt-4 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter name" />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <h2 className="font-semibold mb-3">Select Service</h2>
        <div className="grid grid-cols-2 gap-3">
          {services.map((service) => (
            <Card
              key={service}
              className={`p-4 cursor-pointer transition-all ${
                selectedService === service
                  ? "border-primary bg-primary/5"
                  : ""
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              <p className="text-center">{service}</p>
            </Card>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={handleBookService} 
        disabled={isLoading || !selectedService} 
        className="w-full"
      >
        {isLoading ? "Processing..." : "Continue"}
        <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );
}

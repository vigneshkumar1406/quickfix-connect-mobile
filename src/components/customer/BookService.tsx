import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Users,
  CheckCircle,
  AlertCircle,
  Navigation,
  ArrowRight,
  Calculator
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation as useLocationContext } from "@/contexts/LocationContext";
import ContactBookModal from "./ContactBookModal";
import BackButton from "@/components/BackButton";
import MapPickerWithSearch from "./MapPickerWithSearch";

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
  const { 
    currentLocation, 
    getUserLocation, 
    loading: locationLoading, 
    error: locationError,
    reverseGeocode 
  } = useLocationContext();
  
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingType, setBookingType] = useState("now");
  const [bookingFor, setBookingFor] = useState("self");
  const [address, setAddress] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [showContactBook, setShowContactBook] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  
  // Check if service was pre-selected from dashboard or quick actions
  useEffect(() => {
    console.log("Location state:", location.state);
    
    if (location.state?.selectedService) {
      console.log("Pre-selected service:", location.state.selectedService);
      setSelectedService(location.state.selectedService);
    }
    
    if (location.state?.bookingType) {
      console.log("Pre-selected booking type:", location.state.bookingType);
      setBookingType(location.state.bookingType);
    }
    
    if (location.state?.bookingFor) {
      console.log("Pre-selected booking for:", location.state.bookingFor);
      setBookingFor(location.state.bookingFor);
    }
  }, [location.state]);

  const handleServiceSelect = (service: string) => {
    console.log("Service selected manually:", service);
    setSelectedService(service);
  };

  const handleCurrentLocation = async () => {
    console.log("Getting current location...");
    setIsLoadingLocation(true);
    
    try {
      const location = await getUserLocation();
      console.log("Current location received:", location);
      
      if (location) {
        // Get human-readable address
        const addressText = await reverseGeocode(location.lat, location.lng);
        setAddress(addressText);
        toast.success("Current location fetched successfully");
      } else {
        throw new Error("Unable to get location");
      }
    } catch (error) {
      console.error("Error getting location:", error);
      toast.error("Could not get current location. Please enter manually or check your location permissions.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleMapLocationSelect = (selectedLocation: { lat: number; lng: number; address: string }) => {
    console.log("Location selected from map:", selectedLocation);
    setAddress(selectedLocation.address);
    setShowMapPicker(false);
    toast.success("Location selected from map");
  };

  const handleLocateOnMap = () => {
    console.log("Opening map location picker...");
    setShowMapPicker(true);
  };

  const handleGetEstimation = () => {
    if (!selectedService) {
      toast.error("Please select a service first");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide a service address");
      return;
    }

    const bookingDetails = {
      service: selectedService,
      address: address,
      bookingType: bookingType,
      scheduledDate: bookingType === "later" ? selectedDate : null,
      scheduledTime: bookingType === "later" ? selectedTime : null,
      customerName: bookingFor === "others" ? customerName : null,
      customerPhone: bookingFor === "others" ? customerPhone : null,
      location: currentLocation
    };

    navigate("/customer/estimation", { state: { bookingDetails } });
  };
  
  const handleBookService = () => {
    console.log("Attempting to book service...");
    console.log("Selected service:", selectedService);
    console.log("Address:", address);
    console.log("Booking type:", bookingType);
    console.log("Booking for:", bookingFor);
    
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide a service address");
      return;
    }
    
    if (bookingType === "later") {
      if (!selectedDate) {
        toast.error("Please select a date for scheduled service");
        return;
      }
      if (!selectedTime) {
        toast.error("Please select a time for scheduled service");
        return;
      }
    }
    
    if (bookingFor === "others") {
      if (!customerName.trim()) {
        toast.error("Please enter the customer name");
        return;
      }
      if (!customerPhone.trim()) {
        toast.error("Please enter the customer phone number");
        return;
      }
    }
    
    setIsLoading(true);
    
    // Simulate booking process
    console.log("Processing booking...");
    setTimeout(() => {
      setIsLoading(false);
      console.log("Booking successful, navigating to finding service page");
      
      // Pass booking details to the next page
      const bookingDetails = {
        service: selectedService,
        address: address,
        bookingType: bookingType,
        scheduledDate: bookingType === "later" ? selectedDate : null,
        scheduledTime: bookingType === "later" ? selectedTime : null,
        customerName: bookingFor === "others" ? customerName : null,
        customerPhone: bookingFor === "others" ? customerPhone : null,
        location: currentLocation // Include current location coordinates if available
      };
      
      navigate("/customer/finding-service", { state: { bookingDetails } });
    }, 1500);
  };

  const handleBookForOthers = () => {
    setShowContactBook(true);
  };

  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact);
    setCustomerName(contact.name);
    setCustomerPhone(contact.phone);
    setBookingFor("others");
    toast.success(`Booking for ${contact.name}`);
  };

  if (showMapPicker) {
    return (
      <MapPickerWithSearch
        onLocationSelect={handleMapLocationSelect}
        onClose={() => setShowMapPicker(false)}
        initialLocation={currentLocation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <ContactBookModal 
        isOpen={showContactBook}
        onClose={() => setShowContactBook(false)}
        onSelectContact={handleContactSelect}
      />

      <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
        <div className="mb-4">
          <BackButton withLabel />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Book a Service</h1>
        <p className="text-neutral-300 mb-6">Select service and preferences</p>
        
        {/* Location Error Alert */}
        {locationError && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {locationError}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Address Section */}
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Service Address</h2>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCurrentLocation}
                disabled={isLoadingLocation || locationLoading}
                className="flex-1"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {isLoadingLocation || locationLoading ? "Getting Location..." : "Current Location"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLocateOnMap}
                disabled={isLoadingLocation}
                className="flex-1"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Locate on Map
              </Button>
            </div>
            
            <Textarea
              placeholder="Enter your complete address including street, area, city, and pincode..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="min-h-[100px]"
            />
            
            {address && (
              <div className="text-xs text-green-600 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Address ready for booking
              </div>
            )}
            
            {currentLocation && (
              <div className="text-xs text-blue-600 flex items-center">
                <Navigation className="w-3 h-3 mr-1" />
                Location: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </div>
            )}
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
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Select Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                {selectedDate && selectedTime && (
                  <div className="text-xs text-green-600 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Scheduled for {selectedDate} at {selectedTime}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Book For</h2>
          <RadioGroup value={bookingFor} onValueChange={setBookingFor}>
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
                <Label htmlFor="name">Customer Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter customer name" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="phone">Customer Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="Enter phone number" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Select Service</h2>
          {selectedService && (
            <div className="mb-3 p-2 bg-primary/10 rounded text-sm text-primary">
              Selected: {selectedService}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {services.map((service) => (
              <Card
                key={service}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedService === service
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => handleServiceSelect(service)}
              >
                <p className="text-center text-sm">{service}</p>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Updated Action Buttons with Estimation Option */}
        <div className="space-y-3">
          <Button 
            onClick={handleBookService} 
            disabled={isLoading || !selectedService || !address.trim()} 
            className="w-full"
          >
            {isLoading ? "Processing..." : "Continue to Find Service Provider"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleGetEstimation}
            disabled={!selectedService || !address.trim()}
            className="w-full"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Get Estimation First
          </Button>
        </div>
      </div>
    </div>
  );
}

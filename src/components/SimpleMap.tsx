
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Search } from "lucide-react";
import { toast } from "sonner";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

export default function SimpleMap() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          };
          setCurrentLocation(location);
          setIsLoading(false);
          toast.success("Location found!");
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
          toast.error("Unable to get your location. Please check permissions.");
        }
      );
    } else {
      setIsLoading(false);
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Your Location
        </h3>
        
        {currentLocation ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <MapPin className="w-4 h-4 text-green-600 mr-2" />
                <span className="font-medium text-green-800">Location Found</span>
              </div>
              <p className="text-sm text-green-700">
                Latitude: {currentLocation.lat.toFixed(6)}<br />
                Longitude: {currentLocation.lng.toFixed(6)}
              </p>
            </div>
            
            <Button 
              onClick={getCurrentLocation}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Update Location
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">
                We need your location to find nearby services
              </p>
              <Button 
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>Getting Location...</>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    Get My Location
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Or search for your location
              </p>
              <Button variant="ghost" size="sm" className="text-primary">
                <Search className="w-4 h-4 mr-2" />
                Search Address
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            📍 Your location helps us find the nearest service providers and provide accurate quotes.
          </p>
        </div>
      </Card>
    </div>
  );
}

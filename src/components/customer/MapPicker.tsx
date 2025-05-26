
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Target } from "lucide-react";
import { toast } from "sonner";

interface MapPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onClose: () => void;
  initialLocation?: { lat: number; lng: number } | null;
}

export default function MapPicker({ onLocationSelect, onClose, initialLocation }: MapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || { lat: 13.0827, lng: 80.2707 } // Default to Chennai
  );
  const [address, setAddress] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Reverse geocode function
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.display_name) {
          return data.display_name;
        }
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Handle map click simulation (in a real app, this would be handled by the map library)
  const handleMapClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert click position to coordinates (this is a simplified simulation)
    // In a real map, you'd get actual coordinates from the map library
    const lat = 13.0827 + (y - rect.height / 2) / 1000;
    const lng = 80.2707 + (x - rect.width / 2) / 1000;
    
    setSelectedLocation({ lat, lng });
    
    const addressText = await reverseGeocode(lat, lng);
    setAddress(addressText);
    setIsLoadingAddress(false);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setSelectedLocation(location);
        
        const addressText = await reverseGeocode(location.lat, location.lng);
        setAddress(addressText);
        setIsLoadingAddress(false);
        
        toast.success("Current location selected");
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Could not get current location");
      }
    );
  };

  // Initialize with current location or default
  useEffect(() => {
    if (selectedLocation) {
      reverseGeocode(selectedLocation.lat, selectedLocation.lng).then(addressText => {
        setAddress(addressText);
        setIsLoadingAddress(false);
      });
    }
  }, []);

  const handleConfirmLocation = () => {
    if (selectedLocation && address) {
      onLocationSelect({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: address
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Select Location</h1>
      <p className="text-neutral-300 mb-6">Tap on the map to select your location</p>
      
      {/* Map Container */}
      <Card className="mb-4 overflow-hidden">
        <div 
          ref={mapRef}
          className="relative h-80 bg-gradient-to-br from-green-100 to-blue-100 cursor-crosshair"
          onClick={handleMapClick}
        >
          {/* Simulated map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-200 to-gray-200">
            <div className="absolute inset-0 opacity-30">
              {/* Simulated streets */}
              <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-400"></div>
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400"></div>
              <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-400"></div>
              <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-gray-400"></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-400"></div>
              <div className="absolute top-0 bottom-0 left-3/4 w-1 bg-gray-400"></div>
            </div>
          </div>
          
          {/* Selected location marker */}
          {selectedLocation && (
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-full"
              style={{
                left: '50%',
                top: '50%'
              }}
            >
              <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" />
            </div>
          )}
          
          {/* Instructions overlay */}
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm">
              <p className="text-gray-700">Tap anywhere on the map to select a location</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Current Location Button */}
      <Button 
        variant="outline" 
        onClick={getCurrentLocation}
        className="w-full mb-4"
      >
        <Target className="w-4 h-4 mr-2" />
        Use Current Location
      </Button>
      
      {/* Selected Address */}
      {selectedLocation && (
        <Card className="p-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              Selected Location
            </div>
            <div className="text-xs text-gray-500">
              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </div>
            {isLoadingAddress ? (
              <div className="text-sm text-gray-500">Loading address...</div>
            ) : (
              <div className="text-sm">{address}</div>
            )}
          </div>
        </Card>
      )}
      
      {/* Confirm Button */}
      <Button 
        onClick={handleConfirmLocation}
        disabled={!selectedLocation || !address || isLoadingAddress}
        className="w-full"
      >
        Confirm Location
      </Button>
    </div>
  );
}

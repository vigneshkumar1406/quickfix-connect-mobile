
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crosshair } from "lucide-react";
import OlaMap from "@/components/OlaMap";
import { toast } from "sonner";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface MapPickerWithSearchProps {
  onLocationSelect: (location: Location) => void;
  onClose: () => void;
  initialLocation?: Location | null;
}

export default function MapPickerWithSearch({ 
  onLocationSelect, 
  onClose, 
  initialLocation 
}: MapPickerWithSearchProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    toast.loading("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          
          const location = {
            lat: latitude,
            lng: longitude,
            address: address
          };
          
          setSelectedLocation(location);
          toast.dismiss();
          toast.success("Current location set");
        } catch (error) {
          toast.dismiss();
          toast.error("Failed to get address");
        }
      },
      (error) => {
        toast.dismiss();
        toast.error("Failed to get your location");
      }
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-semibold">Select Location</h2>
          <div className="w-10" />
        </div>
        
        <div className="p-4">
          <OlaMap 
            onLocationSelect={handleLocationSelect}
            initialLocation={initialLocation}
            height="500px"
            showControls={true}
          />
          
          {selectedLocation && (
            <div className="mt-4 space-y-2">
              <Button 
                onClick={handleConfirm}
                className="w-full"
              >
                Confirm Location
              </Button>
              <Button 
                onClick={handleUseCurrentLocation}
                variant="outline"
                className="w-full"
              >
                <Crosshair className="w-4 h-4 mr-2" />
                Use Current Location
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

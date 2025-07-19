
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import OlaMap from "@/components/OlaMap";

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
            <div className="mt-4">
              <Button 
                onClick={handleConfirm}
                className="w-full"
              >
                Confirm Location
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

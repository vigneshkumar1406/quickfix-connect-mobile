import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, Loader2 } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface LocationTrackerProps {
  bookingId: string;
  workerId: string;
  customerLocation?: { lat: number; lng: number };
  onLocationUpdate?: (location: LocationData) => void;
}

export default function LocationTracker({ 
  bookingId, 
  workerId, 
  customerLocation, 
  onLocationUpdate 
}: LocationTrackerProps) {
  const [workerLocation, setWorkerLocation] = useState<LocationData | null>(null);
  const [isTracking] = useState(false);

  const openInMaps = () => {
    if (workerLocation && customerLocation) {
      const url = `https://www.google.com/maps/dir/${customerLocation.lat},${customerLocation.lng}/${workerLocation.latitude},${workerLocation.longitude}`;
      window.open(url, '_blank');
    }
  };

  if (!isTracking) {
    return (
      <Card className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground">Real-time tracking coming soon...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="font-medium">Worker Location</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={openInMaps}
          className="flex items-center"
        >
          <Navigation className="w-4 h-4 mr-1" />
          Directions
        </Button>
      </div>

      {workerLocation && (
        <div className="space-y-3">
          <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Live tracking: {workerLocation.latitude.toFixed(4)}, {workerLocation.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

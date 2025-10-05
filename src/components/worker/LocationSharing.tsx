import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { MapPin, Navigation, StopCircle } from "lucide-react";
import { locationAPI } from "@/services/api";

interface LocationSharingProps {
  bookingId: string;
  workerId: string;
  isJobActive?: boolean;
}

export default function LocationSharing({ 
  bookingId, 
  workerId, 
  isJobActive = false 
}: LocationSharingProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const startLocationSharing = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    try {
      setLocationError(null);
      
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation(position);
          // Update location in profiles table
          locationAPI.updateLocation(
            workerId,
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError(error.message);
          toast.error(`Location error: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );

      setWatchId(id);
      setIsSharing(true);
      toast.success("Location sharing started");
    } catch (error) {
      console.error('Error starting location sharing:', error);
      toast.error("Failed to start location sharing");
    }
  };

  const stopLocationSharing = async () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    setIsSharing(false);
    setCurrentLocation(null);
    toast.success("Location sharing stopped");
  };

  const openCurrentLocationInMaps = () => {
    if (currentLocation) {
      const { latitude, longitude } = currentLocation.coords;
      const url = `https://www.google.com/maps/@${latitude},${longitude},15z`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Location Sharing</h3>
        <div className="flex items-center">
          {isSharing && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          )}
          <span className="text-sm text-muted-foreground">
            {isSharing ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {locationError && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {locationError}
          </div>
        )}

        {currentLocation && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Location:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={openCurrentLocationInMaps}
                className="h-6 px-2"
              >
                <Navigation className="w-3 h-3 mr-1" />
                View
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              {currentLocation.coords.latitude.toFixed(6)}, {currentLocation.coords.longitude.toFixed(6)}
            </div>
            {currentLocation.coords.accuracy && (
              <div className="text-xs text-muted-foreground">
                Accuracy: ±{Math.round(currentLocation.coords.accuracy)}m
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Last update: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!isSharing ? (
            <Button
              onClick={startLocationSharing}
              className="flex-1"
              disabled={!isJobActive}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Start Sharing Location
            </Button>
          ) : (
            <Button
              onClick={stopLocationSharing}
              variant="destructive"
              className="flex-1"
            >
              <StopCircle className="w-4 h-4 mr-2" />
              Stop Sharing
            </Button>
          )}
        </div>

        {!isJobActive && (
          <p className="text-xs text-muted-foreground text-center">
            Location sharing is only available during active jobs
          </p>
        )}
      </div>
    </Card>
  );
}

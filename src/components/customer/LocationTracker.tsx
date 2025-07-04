import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, Loader2 } from "lucide-react";

interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  heading?: number;
  speed?: number;
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
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [eta, setEta] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to real-time location updates
    const channel = supabase
      .channel('location-tracking')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'location_tracking',
          filter: `booking_id=eq.${bookingId}`
        },
        (payload) => {
          const newLocation = payload.new as LocationData;
          setWorkerLocation(newLocation);
          setIsTracking(true);
          onLocationUpdate?.(newLocation);
        }
      )
      .subscribe();

    // Fetch initial location data
    fetchInitialLocation();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, workerId]);

  const fetchInitialLocation = async () => {
    try {
      const { data, error } = await supabase
        .from('location_tracking')
        .select('*')
        .eq('booking_id', bookingId)
        .eq('worker_id', workerId)
        .eq('is_active', true)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setWorkerLocation(data[0]);
        setIsTracking(true);
      }
    } catch (error) {
      console.error('Error fetching initial location:', error);
    }
  };

  const formatDistance = (dist: number) => {
    if (dist < 1) {
      return `${Math.round(dist * 1000)}m away`;
    }
    return `${dist.toFixed(1)}km away`;
  };

  const formatETA = (timestamp: string) => {
    const now = new Date();
    const etaTime = new Date(timestamp);
    const diffMinutes = Math.max(0, Math.floor((etaTime.getTime() - now.getTime()) / (1000 * 60)));
    
    if (diffMinutes <= 0) {
      return "Arriving now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      return `${hours}h ${mins}m`;
    }
  };

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
          <span className="text-sm text-muted-foreground">Waiting for location tracking...</span>
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
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
              <span>Current Location</span>
            </div>
            <span className="text-muted-foreground">
              {new Date(workerLocation.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {distance && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Distance</span>
              <span className="font-medium">{formatDistance(distance)}</span>
            </div>
          )}

          {eta && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                <span>ETA</span>
              </div>
              <span className="font-medium">{formatETA(eta)}</span>
            </div>
          )}

          <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Live tracking: {workerLocation.latitude.toFixed(4)}, {workerLocation.longitude.toFixed(4)}
              </p>
              {workerLocation.accuracy && (
                <p className="text-xs text-muted-foreground mt-1">
                  Accuracy: ±{Math.round(workerLocation.accuracy)}m
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
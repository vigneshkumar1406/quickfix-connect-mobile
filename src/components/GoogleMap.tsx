
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Search } from "lucide-react";
import { toast } from "sonner";
import { Loading } from "@/components/ui/loading";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface GoogleMapProps {
  onLocationSelect?: (location: Location) => void;
  initialLocation?: Location | null;
  height?: string;
  showControls?: boolean;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function GoogleMap({ 
  onLocationSelect, 
  initialLocation, 
  height = "400px", 
  showControls = true 
}: GoogleMapProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(initialLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const API_KEY = "AIzaSyD54BlvZV3leYYBSSZtbJKMinUtTJ7WSfQ";

  useEffect(() => {
    loadGoogleMaps();
  }, []);

  const loadGoogleMaps = () => {
    if (window.google) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = initializeMap;
    
    script.onerror = () => {
      toast.error("Failed to load Google Maps");
    };
    
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const defaultLocation = currentLocation || { lat: 13.0827, lng: 80.2707 };

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Add click listener to map
    mapInstanceRef.current.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      handleLocationSelect(lat, lng);
    });

    // Initialize autocomplete if search input exists
    if (searchInputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          componentRestrictions: { country: 'in' },
          fields: ['place_id', 'geometry', 'name', 'formatted_address'],
        }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          handleLocationSelect(lat, lng, place.formatted_address);
          mapInstanceRef.current.setCenter({ lat, lng });
        }
      });
    }

    // Add initial marker if location exists
    if (currentLocation) {
      addMarker(currentLocation.lat, currentLocation.lng);
    }

    setMapLoaded(true);
  };

  const addMarker = (lat: number, lng: number) => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    markerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      title: 'Selected Location',
    });
  };

  const handleLocationSelect = async (lat: number, lng: number, address?: string) => {
    addMarker(lat, lng);
    
    let locationAddress = address;
    if (!locationAddress) {
      locationAddress = await reverseGeocode(lat, lng);
    }

    const location = { lat, lng, address: locationAddress };
    setCurrentLocation(location);
    
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results: any[], status: string) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            resolve(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        }
      );
    });
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          handleLocationSelect(lat, lng);
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter({ lat, lng });
            mapInstanceRef.current.setZoom(16);
          }
          
          setIsLoading(false);
          toast.success("Current location found!");
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

  if (!mapLoaded && showControls) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center" style={{ height }}>
          <Loading size="lg" />
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {showControls && (
        <>
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Select Location
          </h3>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search places..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </>
      )}
      
      {/* Map Container */}
      <Card className={`mb-4 overflow-hidden ${!showControls ? 'mb-0' : ''}`}>
        <div 
          ref={mapRef}
          style={{ height }}
          className="w-full bg-gray-100"
        />
      </Card>
      
      {showControls && (
        <>
          <Button 
            variant="outline" 
            onClick={getCurrentLocation}
            className="w-full mb-4"
            disabled={isLoading}
          >
            <Navigation className="w-4 h-4 mr-2" />
            {isLoading ? 'Getting Location...' : 'Use Current Location'}
          </Button>
          
          {currentLocation && (
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  Selected Location
                </div>
                <div className="text-xs text-gray-500">
                  {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </div>
                <div className="text-sm">{currentLocation.address}</div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

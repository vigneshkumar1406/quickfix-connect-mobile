
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
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scriptLoadedRef = useRef(false);

  const API_KEY = "AIzaSyD54BlvZV3leYYBSSZtbJKMinUtTJ7WSfQ";

  useEffect(() => {
    console.log("GoogleMap component mounting, loading maps...");
    loadGoogleMaps();
    
    return () => {
      console.log("GoogleMap component unmounting");
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const loadGoogleMaps = () => {
    console.log("Loading Google Maps...");
    
    if (window.google && window.google.maps) {
      console.log("Google Maps already loaded, initializing...");
      initializeMap();
      return;
    }

    if (scriptLoadedRef.current) {
      console.log("Script already loading...");
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      console.log("Google Maps script already exists, waiting for load...");
      existingScript.addEventListener('load', initializeMap);
      existingScript.addEventListener('error', handleScriptError);
      return;
    }

    console.log("Creating new Google Maps script...");
    scriptLoadedRef.current = true;
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap&loading=async`;
    script.async = true;
    script.defer = true;
    
    window.initMap = initializeMap;
    
    script.addEventListener('load', () => {
      console.log("Google Maps script loaded successfully");
    });
    
    script.addEventListener('error', handleScriptError);
    
    document.head.appendChild(script);
  };

  const handleScriptError = () => {
    console.error("Failed to load Google Maps");
    setLoadingError("Failed to load map. Please check your internet connection.");
    setIsLoading(false);
    toast.error("Failed to load map");
  };

  const initializeMap = () => {
    console.log("Initializing Google Maps...");
    
    if (!mapRef.current) {
      console.error("Map container not found");
      setLoadingError("Map container not available");
      setIsLoading(false);
      return;
    }

    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded");
      setLoadingError("Google Maps API not available");
      setIsLoading(false);
      return;
    }

    try {
      const defaultLocation = currentLocation || { lat: 13.0827, lng: 80.2707 };
      console.log("Creating map with center:", defaultLocation);

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      console.log("Map created successfully");

      // Add click listener to map
      mapInstanceRef.current.addListener('click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log("Map clicked at:", lat, lng);
        handleLocationSelect(lat, lng);
      });

      // Initialize autocomplete if search input exists
      if (searchInputRef.current && window.google.maps.places) {
        try {
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
          console.log("Autocomplete initialized");
        } catch (autocompleteError) {
          console.error("Error initializing autocomplete:", autocompleteError);
        }
      }

      // Add initial marker if location exists
      if (currentLocation) {
        addMarker(currentLocation.lat, currentLocation.lng);
      }

      setMapLoaded(true);
      setIsLoading(false);
      setLoadingError(null);
      console.log("Map initialization completed");
      
    } catch (error) {
      console.error("Error initializing map:", error);
      setLoadingError("Failed to initialize map");
      setIsLoading(false);
      toast.error("Failed to initialize map");
    }
  };

  const addMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current || !window.google) return;
    
    console.log("Adding marker at:", lat, lng);
    
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
    console.log("Location selected:", lat, lng);
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
    console.log("Reverse geocoding:", lat, lng);
    
    if (!window.google || !window.google.maps) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results: any[], status: string) => {
          if (status === 'OK' && results[0]) {
            console.log("Reverse geocoding successful:", results[0].formatted_address);
            resolve(results[0].formatted_address);
          } else {
            console.log("Reverse geocoding failed, using coordinates");
            resolve(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        }
      );
    });
  };

  const getCurrentLocation = () => {
    console.log("Getting current location...");
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          console.log("Current location found:", lat, lng);
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

  if (loadingError) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-500 mb-4">{loadingError}</p>
          <Button onClick={() => {
            setLoadingError(null);
            setIsLoading(true);
            scriptLoadedRef.current = false;
            loadGoogleMaps();
          }}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center" style={{ height }}>
          <Loading size="lg" />
          <p className="mt-4 text-sm text-gray-500">Loading map...</p>
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

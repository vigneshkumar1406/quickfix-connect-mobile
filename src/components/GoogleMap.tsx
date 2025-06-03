
import { useEffect, useRef, useState } from "react";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface GoogleMapProps {
  initialLocation?: Location | { lat: number; lng: number } | null;
  onLocationSelect?: (location: Location) => void;
  onLocationChange?: (location: { lat: number; lng: number }) => void;
  className?: string;
  height?: string;
  showControls?: boolean;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMap = ({ 
  initialLocation, 
  onLocationSelect, 
  onLocationChange, 
  className = "", 
  height = "300px",
  showControls = false 
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const mapInstanceRef = useRef<any>(null);

  const loadGoogleMaps = () => {
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    console.log("Loading Google Maps...");
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places&callback=initMap&loading=async`;
    script.async = true;
    script.defer = true;

    window.initMap = () => {
      console.log("Google Maps script loaded successfully");
      initializeMap();
    };

    script.onerror = () => {
      console.error("Failed to load Google Maps API");
    };

    console.log("Creating new Google Maps script...");
    document.head.appendChild(script);
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
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

  const initializeMap = async () => {
    console.log("Initializing Google Maps...");
    
    if (!mapRef.current) {
      console.log("Map container not found during initialization");
      return;
    }

    if (!window.google || !window.google.maps) {
      console.log("Google Maps API not available");
      return;
    }

    try {
      const defaultLocation = { lat: 13.0843, lng: 80.2705 };
      let centerLocation = defaultLocation;

      if (initialLocation) {
        if ('address' in initialLocation) {
          centerLocation = { lat: initialLocation.lat, lng: initialLocation.lng };
        } else {
          centerLocation = initialLocation;
        }
      }

      const mapOptions = {
        center: centerLocation,
        zoom: 15,
        mapTypeControl: showControls,
        streetViewControl: showControls,
        fullscreenControl: showControls,
      };

      const mapInstance = new window.google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = mapInstance;
      setMap(mapInstance);

      const marker = new window.google.maps.Marker({
        position: mapOptions.center,
        map: mapInstance,
        draggable: true,
      });

      const handleLocationChange = async (lat: number, lng: number) => {
        const address = await reverseGeocode(lat, lng);
        const location: Location = { lat, lng, address };
        
        if (onLocationSelect) {
          onLocationSelect(location);
        }
        if (onLocationChange) {
          onLocationChange({ lat, lng });
        }
      };

      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (position) {
          handleLocationChange(position.lat(), position.lng());
        }
      });

      mapInstance.addListener("click", (e: any) => {
        marker.setPosition(e.latLng);
        handleLocationChange(e.latLng.lat(), e.latLng.lng());
      });

      setIsMapLoaded(true);
      console.log("Google Maps initialized successfully");
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  useEffect(() => {
    console.log("GoogleMap component mounting, loading maps...");
    
    // Use a longer delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      if (!mapRef.current) {
        console.log("Map container still not available, retrying...");
        // Try again with a longer delay
        setTimeout(() => {
          if (mapRef.current) {
            loadGoogleMaps();
          }
        }, 500);
        return;
      }
      
      loadGoogleMaps();
    }, 200);

    return () => {
      console.log("GoogleMap component unmounting");
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (initialLocation && mapInstanceRef.current && window.google) {
      let newLocation;
      if ('address' in initialLocation) {
        newLocation = { lat: initialLocation.lat, lng: initialLocation.lng };
      } else {
        newLocation = initialLocation;
      }
      
      const newLatLng = new window.google.maps.LatLng(newLocation.lat, newLocation.lng);
      mapInstanceRef.current.setCenter(newLatLng);
    }
  }, [initialLocation]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div
        ref={mapRef}
        className="w-full h-full min-h-[300px] bg-gray-200 rounded-lg"
        id="map-container"
      />
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;

import { useEffect, useRef, useState } from "react";

interface GoogleMapProps {
  initialLocation?: { lat: number; lng: number };
  onLocationChange?: (location: { lat: number; lng: number }) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMap = ({ initialLocation, onLocationChange, className = "" }: GoogleMapProps) => {
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

  const initializeMap = () => {
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
      const mapOptions = {
        center: initialLocation || { lat: 13.0843, lng: 80.2705 },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      };

      const mapInstance = new window.google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = mapInstance;
      setMap(mapInstance);

      const marker = new window.google.maps.Marker({
        position: mapOptions.center,
        map: mapInstance,
        draggable: true,
      });

      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (position && onLocationChange) {
          onLocationChange({
            lat: position.lat(),
            lng: position.lng(),
          });
        }
      });

      mapInstance.addListener("click", (e: any) => {
        marker.setPosition(e.latLng);
        if (onLocationChange) {
          onLocationChange({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });
        }
      });

      setIsMapLoaded(true);
      console.log("Google Maps initialized successfully");
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  useEffect(() => {
    console.log("GoogleMap component mounting, loading maps...");
    
    const timer = setTimeout(() => {
      if (!mapRef.current) {
        console.log("Map container still not available, retrying...");
        return;
      }
      
      loadGoogleMaps();
    }, 100);

    return () => {
      console.log("GoogleMap component unmounting");
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (initialLocation && mapInstanceRef.current) {
      const newLatLng = new window.google.maps.LatLng(
        initialLocation.lat,
        initialLocation.lng
      );
      mapInstanceRef.current.setCenter(newLatLng);
    }
  }, [initialLocation]);

  return (
    <div className={`relative ${className}`}>
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

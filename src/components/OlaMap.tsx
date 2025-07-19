
import { useEffect, useRef, useState } from "react";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface OlaMapProps {
  initialLocation?: Location | { lat: number; lng: number } | null;
  onLocationSelect?: (location: Location) => void;
  onLocationChange?: (location: { lat: number; lng: number }) => void;
  className?: string;
  height?: string;
  showControls?: boolean;
}

declare global {
  interface Window {
    olaMaps: any;
    OlaMaps: any;
    initOlaMap: () => void;
  }
}

const OlaMap = ({ 
  initialLocation, 
  onLocationSelect, 
  onLocationChange, 
  className = "", 
  height = "300px",
  showControls = false 
}: OlaMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const mapInstanceRef = useRef<any>(null);

  const loadOlaMaps = () => {
    if (window.olaMaps) {
      initializeMap();
      return;
    }

    // Ola Maps credentials
    const apiKey = "1mfBr5ce50Pg77zlRdw6LDZZMSzJgQyftn5sQa4S";
    const projectId = "898e2a02-e295-4bfa-aa47-9cea36f37d3b";
    
    console.log("Loading Ola Maps...");
    const script = document.createElement("script");
    script.src = `https://apis.olamaps.io/api/maps/sdk.js?api_key=${apiKey}&project_id=${projectId}&callback=initOlaMap`;
    script.async = true;
    script.defer = true;

    window.initOlaMap = () => {
      console.log("Ola Maps script loaded successfully");
      window.olaMaps = (window as any).OlaMaps;
      initializeMap();
    };

    script.onerror = () => {
      console.error("Failed to load Ola Maps API");
      setError("Failed to load Ola Maps. Please check your internet connection.");
    };

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
    console.log("Initializing Ola Maps...");
    
    if (!mapRef.current) {
      console.log("Map container not found during initialization");
      setError("Map container not available");
      return;
    }

    if (!window.olaMaps) {
      console.log("Ola Maps API not available");
      setError("Ola Maps API not loaded");
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
        center: [centerLocation.lng, centerLocation.lat], // Ola Maps uses [lng, lat] format
        zoom: 15,
        container: mapRef.current,
        style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json'
      };

      const mapInstance = new window.olaMaps.Map(mapOptions);
      mapInstanceRef.current = mapInstance;
      setMap(mapInstance);

      // Wait for map to load
      mapInstance.on('load', () => {
        // Add marker
        const marker = new window.olaMaps.Marker({
          lngLat: [centerLocation.lng, centerLocation.lat],
          draggable: true
        }).addTo(mapInstance);

        const handleLocationChange = async (lngLat: [number, number]) => {
          const [lng, lat] = lngLat;
          const address = await reverseGeocode(lat, lng);
          const location: Location = { lat, lng, address };
          
          if (onLocationSelect) {
            onLocationSelect(location);
          }
          if (onLocationChange) {
            onLocationChange({ lat, lng });
          }
        };

        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          handleLocationChange([lngLat.lng, lngLat.lat]);
        });

        mapInstance.on('click', (e: any) => {
          const lngLat = e.lngLat;
          marker.setLngLat([lngLat.lng, lngLat.lat]);
          handleLocationChange([lngLat.lng, lngLat.lat]);
        });

        setIsMapLoaded(true);
        setError("");
        console.log("Ola Maps initialized successfully");
      });

      mapInstance.on('error', (e: any) => {
        console.error("Ola Maps error:", e);
        setError("Failed to load Ola Maps");
      });

    } catch (error) {
      console.error("Error initializing map:", error);
      setError("Failed to initialize Ola Maps");
    }
  };

  useEffect(() => {
    console.log("OlaMap component mounting, loading maps...");
    
    const timer = setTimeout(() => {
      if (!mapRef.current) {
        console.log("Map container still not available, retrying...");
        setTimeout(() => {
          if (mapRef.current) {
            loadOlaMaps();
          } else {
            setError("Map container failed to load");
          }
        }, 500);
        return;
      }
      
      loadOlaMaps();
    }, 100);

    return () => {
      console.log("OlaMap component unmounting");
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (initialLocation && mapInstanceRef.current && window.olaMaps) {
      let newLocation;
      if ('address' in initialLocation) {
        newLocation = { lat: initialLocation.lat, lng: initialLocation.lng };
      } else {
        newLocation = initialLocation;
      }
      
      mapInstanceRef.current.setCenter([newLocation.lng, newLocation.lat]);
    }
  }, [initialLocation]);

  if (error) {
    return (
      <div className={`relative ${className}`} style={{ height }}>
        <div className="w-full h-full min-h-[300px] bg-gray-100 rounded-lg flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-sm text-gray-600">{error}</p>
            <p className="text-xs text-gray-500 mt-1">
              Please check your Ola Maps configuration
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div
        ref={mapRef}
        className="w-full h-full min-h-[300px] bg-gray-200 rounded-lg"
        id="map-container"
      />
      {!isMapLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default OlaMap;

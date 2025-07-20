
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
    console.log("Starting to load Ola Maps...");
    
    if (window.olaMaps) {
      console.log("Ola Maps already loaded, initializing...");
      initializeMap();
      return;
    }

    // Load Ola Maps SDK
    console.log("Loading Ola Maps SDK...");
    const script = document.createElement("script");
    script.src = "https://api.olamaps.io/tiles/v1/sdk/olamaps-js-sdk.umd.js";
    script.async = true;
    script.defer = true;

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://api.olamaps.io/tiles/v1/sdk/olamaps-js-sdk.css";
    document.head.appendChild(css);

    script.onload = () => {
      console.log("Ola Maps SDK loaded successfully");
      
      // Debug: Log the actual SDK structure
      console.log("Available SDK objects:", Object.keys(window as any));
      console.log("OlaMapsSDK object:", (window as any).OlaMapsSDK);
      
      if ((window as any).OlaMapsSDK) {
        console.log("OlaMapsSDK properties:", Object.keys((window as any).OlaMapsSDK));
        window.olaMaps = (window as any).OlaMapsSDK;
      } else if ((window as any).OlaMap) {
        console.log("Found OlaMap directly on window");
        window.olaMaps = { OlaMap: (window as any).OlaMap };
      } else {
        console.error("No Ola Maps SDK found on window object");
        setError("Ola Maps SDK not properly loaded");
        return;
      }
      
      initializeMap();
    };

    script.onerror = () => {
      console.error("Failed to load Ola Maps SDK");
      setError("Failed to load Ola Maps SDK. Please check your internet connection.");
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

      // Initialize Ola Maps with proper authentication
      console.log("Creating map with center:", centerLocation);
      console.log("Available methods on olaMaps:", Object.keys(window.olaMaps));
      
      let mapInstance;
      
      // Try different constructor patterns
      try {
        if (window.olaMaps.OlaMap) {
          console.log("Using OlaMap constructor");
          mapInstance = new window.olaMaps.OlaMap({
            apiKey: '1mfBr5ce50Pg77zlRdw6LDZZMSzJgQyftn5sQa4S',
            container: mapRef.current,
            center: [centerLocation.lng, centerLocation.lat],
            zoom: 15,
            style: 'default-light-standard'
          });
        } else if (window.olaMaps.Map) {
          console.log("Using Map constructor");
          mapInstance = new window.olaMaps.Map({
            apiKey: '1mfBr5ce50Pg77zlRdw6LDZZMSzJgQyftn5sQa4S',
            container: mapRef.current,
            center: [centerLocation.lng, centerLocation.lat],
            zoom: 15,
            style: 'default-light-standard'
          });
        } else if (typeof window.olaMaps === 'function') {
          console.log("Using direct constructor");
          mapInstance = new window.olaMaps({
            apiKey: '1mfBr5ce50Pg77zlRdw6LDZZMSzJgQyftn5sQa4S',
            container: mapRef.current,
            center: [centerLocation.lng, centerLocation.lat],
            zoom: 15,
            style: 'default-light-standard'
          });
        } else if (window.olaMaps.createMap) {
          console.log("Using createMap factory method");
          mapInstance = window.olaMaps.createMap({
            apiKey: '1mfBr5ce50Pg77zlRdw6LDZZMSzJgQyftn5sQa4S',
            container: mapRef.current,
            center: [centerLocation.lng, centerLocation.lat],
            zoom: 15,
            style: 'default-light-standard'
          });
        } else {
          throw new Error("No valid constructor found. Available methods: " + Object.keys(window.olaMaps).join(', '));
        }
      } catch (constructorError) {
        console.error("Constructor error:", constructorError);
        throw new Error("Failed to create map instance: " + (constructorError as Error).message);
      }

      mapInstanceRef.current = mapInstance;
      setMap(mapInstance);

      mapInstance.on('load', () => {
        console.log("Map loaded successfully");
        
        // Add marker
        const marker = new window.olaMaps.Marker({
          draggable: true
        })
        .setLngLat([centerLocation.lng, centerLocation.lat])
        .addTo(mapInstance);

        const handleLocationChange = async (lngLat: { lng: number; lat: number }) => {
          const { lng, lat } = lngLat;
          console.log("Location changed to:", lat, lng);
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
          handleLocationChange(lngLat);
        });

        mapInstance.on('click', (e: any) => {
          const lngLat = e.lngLat;
          marker.setLngLat([lngLat.lng, lngLat.lat]);
          handleLocationChange(lngLat);
        });

        setIsMapLoaded(true);
        setError("");
        console.log("Ola Maps initialized successfully");
      });

      mapInstance.on('error', (e: any) => {
        console.error("Map error:", e);
        setError("Failed to load map tiles");
      });

    } catch (error) {
      console.error("Error initializing map:", error);
      setError("Failed to initialize Ola Maps: " + (error as Error).message);
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


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

    // Try a simpler approach first - use Mapbox GL JS with Ola Maps tiles
    console.log("Loading Mapbox GL JS for Ola Maps tiles...");
    const script = document.createElement("script");
    script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js";
    script.async = true;
    script.defer = true;

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css";
    document.head.appendChild(css);

    script.onload = () => {
      console.log("Mapbox GL JS loaded successfully");
      window.olaMaps = (window as any).mapboxgl;
      initializeMap();
    };

    script.onerror = () => {
      console.error("Failed to load Mapbox GL JS");
      setError("Failed to load map library. Please check your internet connection.");
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

      // Use Mapbox GL with Ola Maps tiles
      console.log("Creating map with center:", centerLocation);
      
      const mapInstance = new window.olaMaps.Map({
        container: mapRef.current,
        style: {
          version: 8,
          sources: {
            'ola-tiles': {
              type: 'raster',
              tiles: [
                `https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/{z}/{x}/{y}.png?api_key=1mfBr5ce50Pg77zlRdw6LDZZMSzJgQyftn5sQa4S`
              ],
              tileSize: 256
            }
          },
          layers: [
            {
              id: 'ola-layer',
              type: 'raster',
              source: 'ola-tiles'
            }
          ]
        },
        center: [centerLocation.lng, centerLocation.lat],
        zoom: 15
      });

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

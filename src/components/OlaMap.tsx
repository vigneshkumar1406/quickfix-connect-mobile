import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
  const markerRef = useRef<any>(null);


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
    console.log("Initializing map...");
    
    if (!mapRef.current) {
      console.log("Map container not found during initialization");
      setError("Map container not available");
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

      console.log("Creating map with center:", centerLocation);

      // Initialize Leaflet map
      const mapInstance = L.map(mapRef.current, {
        center: [centerLocation.lat, centerLocation.lng],
        zoom: 15,
        zoomControl: showControls
      });

      // Use OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstance);

      mapInstanceRef.current = mapInstance;
      setMap(mapInstance);

      // Add draggable marker
      const marker = L.marker([centerLocation.lat, centerLocation.lng], {
        draggable: true
      }).addTo(mapInstance);

      markerRef.current = marker;

      const handleLocationChange = async (lat: number, lng: number) => {
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

      // Handle marker drag
      marker.on('dragend', () => {
        const latlng = marker.getLatLng();
        handleLocationChange(latlng.lat, latlng.lng);
      });

      // Handle map click
      mapInstance.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        handleLocationChange(lat, lng);
      });

      setIsMapLoaded(true);
      setError("");
      console.log("Map initialized successfully");

    } catch (error) {
      console.error("Error initializing map:", error);
      setError("Failed to initialize map: " + (error as Error).message);
    }
  };

  useEffect(() => {
    console.log("OlaMap component mounting...");
    
    const timer = setTimeout(() => {
      if (mapRef.current) {
        initializeMap();
      } else {
        setError("Map container failed to load");
      }
    }, 100);

    return () => {
      console.log("OlaMap component unmounting");
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (initialLocation && mapInstanceRef.current && markerRef.current) {
      let newLocation;
      if ('address' in initialLocation) {
        newLocation = { lat: initialLocation.lat, lng: initialLocation.lng };
      } else {
        newLocation = initialLocation;
      }
      
      mapInstanceRef.current.setView([newLocation.lat, newLocation.lng], 15);
      markerRef.current.setLatLng([newLocation.lat, newLocation.lng]);
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
              Please check your internet connection
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
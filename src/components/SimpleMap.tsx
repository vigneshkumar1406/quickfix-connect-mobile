
import OlaMap from "./OlaMap";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface SimpleMapProps {
  onLocationSelect?: (location: Location) => void;
  initialLocation?: Location | null;
}

export default function SimpleMap({ onLocationSelect, initialLocation }: SimpleMapProps) {
  return (
    <OlaMap 
      onLocationSelect={onLocationSelect}
      initialLocation={initialLocation}
      height="400px"
      showControls={true}
    />
  );
}

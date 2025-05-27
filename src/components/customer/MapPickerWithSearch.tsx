
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Target, Search, Star, Plus, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface SavedPlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface MapPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onClose: () => void;
  initialLocation?: { lat: number; lng: number } | null;
}

const importantPlaces = [
  { name: "Airport", address: "Chennai International Airport, Tamil Nadu", lat: 12.9941, lng: 80.1709 },
  { name: "Central Railway Station", address: "Chennai Central, Tamil Nadu", lat: 13.0827, lng: 80.2785 },
  { name: "Marina Beach", address: "Marina Beach, Chennai, Tamil Nadu", lat: 13.0475, lng: 80.2824 },
  { name: "Express Avenue Mall", address: "Express Avenue, Royapettah, Chennai", lat: 13.0569, lng: 80.2570 },
  { name: "Phoenix MarketCity", address: "Phoenix MarketCity, Velachery, Chennai", lat: 12.9756, lng: 80.2207 },
  { name: "T. Nagar", address: "T. Nagar, Chennai, Tamil Nadu", lat: 13.0418, lng: 80.2341 },
];

export default function MapPickerWithSearch({ onLocationSelect, onClose, initialLocation }: MapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || { lat: 13.0827, lng: 80.2707 }
  );
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Load saved places from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quickfix_saved_places');
    if (saved) {
      setSavedPlaces(JSON.parse(saved));
    }
  }, []);

  // Save places to localStorage
  const savePlacesToStorage = (places: SavedPlace[]) => {
    localStorage.setItem('quickfix_saved_places', JSON.stringify(places));
    setSavedPlaces(places);
  };

  // Search places using Nominatim API
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchPlaces(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reverse geocode function
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
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

  // Handle search result selection
  const handleSearchResultSelect = async (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setSelectedLocation({ lat, lng });
    setAddress(result.display_name);
    setSearchQuery("");
    setSearchResults([]);
    setIsLoadingAddress(false);
  };

  // Handle important place selection
  const handleImportantPlaceSelect = (place: any) => {
    setSelectedLocation({ lat: place.lat, lng: place.lng });
    setAddress(place.address);
    setIsLoadingAddress(false);
  };

  // Handle saved place selection
  const handleSavedPlaceSelect = (place: SavedPlace) => {
    setSelectedLocation({ lat: place.lat, lng: place.lng });
    setAddress(place.address);
    setIsLoadingAddress(false);
  };

  // Handle map click simulation
  const handleMapClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const lat = 13.0827 + (y - rect.height / 2) / 1000;
    const lng = 80.2707 + (x - rect.width / 2) / 1000;
    
    setSelectedLocation({ lat, lng });
    
    const addressText = await reverseGeocode(lat, lng);
    setAddress(addressText);
    setIsLoadingAddress(false);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setSelectedLocation(location);
        
        const addressText = await reverseGeocode(location.lat, location.lng);
        setAddress(addressText);
        setIsLoadingAddress(false);
        
        toast.success("Current location selected");
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Could not get current location");
      }
    );
  };

  // Save current place
  const saveCurrentPlace = () => {
    if (!selectedLocation || !address || !placeName.trim()) {
      toast.error("Please select a location and enter a name");
      return;
    }

    const newPlace: SavedPlace = {
      id: Date.now().toString(),
      name: placeName.trim(),
      address: address,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng
    };

    const updatedPlaces = [...savedPlaces, newPlace];
    savePlacesToStorage(updatedPlaces);
    
    setShowSaveDialog(false);
    setPlaceName("");
    toast.success("Place saved successfully!");
  };

  // Remove saved place
  const removeSavedPlace = (placeId: string) => {
    const updatedPlaces = savedPlaces.filter(place => place.id !== placeId);
    savePlacesToStorage(updatedPlaces);
    toast.success("Place removed");
  };

  const handleConfirmLocation = () => {
    if (selectedLocation && address) {
      onLocationSelect({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: address
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        {selectedLocation && (
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Save Place
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save This Place</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="placeName">Place Name</Label>
                  <Input
                    id="placeName"
                    placeholder="e.g., Home, Office, Gym"
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                  />
                </div>
                <Button onClick={saveCurrentPlace} className="w-full">
                  Save Place
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Select Location</h1>
      <p className="text-neutral-300 mb-6">Search or tap on the map to select your location</p>
      
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search places..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        
        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => handleSearchResultSelect(result)}
              >
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{result.display_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* Important Places */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">Important Places</h3>
        <div className="grid grid-cols-2 gap-2">
          {importantPlaces.map((place, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="justify-start text-xs"
              onClick={() => handleImportantPlaceSelect(place)}
            >
              <Star className="w-3 h-3 mr-1" />
              {place.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Saved Places */}
      {savedPlaces.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Saved Places</h3>
          <div className="space-y-2">
            {savedPlaces.map((place) => (
              <div key={place.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start flex-1 text-xs"
                  onClick={() => handleSavedPlaceSelect(place)}
                >
                  <Bookmark className="w-3 h-3 mr-1" />
                  {place.name}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSavedPlace(place.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Map Container */}
      <Card className="mb-4 overflow-hidden">
        <div 
          ref={mapRef}
          className="relative h-80 bg-gradient-to-br from-green-100 to-blue-100 cursor-crosshair"
          onClick={handleMapClick}
        >
          {/* Simulated map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-200 to-gray-200">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-400"></div>
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400"></div>
              <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-400"></div>
              <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-gray-400"></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-400"></div>
              <div className="absolute top-0 bottom-0 left-3/4 w-1 bg-gray-400"></div>
            </div>
          </div>
          
          {selectedLocation && (
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-full"
              style={{ left: '50%', top: '50%' }}
            >
              <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" />
            </div>
          )}
          
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm">
              <p className="text-gray-700">Tap anywhere on the map to select a location</p>
            </div>
          </div>
        </div>
      </Card>
      
      <Button 
        variant="outline" 
        onClick={getCurrentLocation}
        className="w-full mb-4"
      >
        <Target className="w-4 h-4 mr-2" />
        Use Current Location
      </Button>
      
      {selectedLocation && (
        <Card className="p-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              Selected Location
            </div>
            <div className="text-xs text-gray-500">
              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </div>
            {isLoadingAddress ? (
              <div className="text-sm text-gray-500">Loading address...</div>
            ) : (
              <div className="text-sm">{address}</div>
            )}
          </div>
        </Card>
      )}
      
      <Button 
        onClick={handleConfirmLocation}
        disabled={!selectedLocation || !address || isLoadingAddress}
        className="w-full"
      >
        Confirm Location
      </Button>
    </div>
  );
}

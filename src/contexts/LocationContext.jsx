
import { createContext, useContext, useState, useEffect } from 'react';
import { locationAPI, workerAPI } from '../services/supabaseAPI';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get user's location with better error handling
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMsg = "Geolocation is not supported by your browser";
        setError(errorMsg);
        console.error(errorMsg);
        toast.error(errorMsg);
        reject(new Error(errorMsg));
        return;
      }
      
      console.log("Getting user location...");
      setLoading(true);
      setError(null);
      
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Cache for 1 minute
      };
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("Location retrieved successfully:", position);
          
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          console.log("Processed location:", location);
          setCurrentLocation(location);
          setLoading(false);
          setError(null);
          
          // If user is authenticated, update location in backend
          if (isAuthenticated && user?.id) {
            console.log("Updating location in backend...");
            await updateLocationInBackend(location);
          }
          
          resolve(location);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);
          
          let errorMessage = "Unable to get your location";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location permissions in your browser.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
            default:
              errorMessage = "An unknown error occurred while getting location.";
              break;
          }
          
          setError(errorMessage);
          toast.error(errorMessage);
          reject(error);
        },
        options
      );
    });
  };
  
  // Start location tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by your browser";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    console.log("Starting location tracking...");
    setTrackingEnabled(true);
    
    // Get initial location
    getUserLocation().catch(console.error);
    
    // Set up periodic tracking
    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 30000 // Cache for 30 seconds during tracking
    };
    
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        console.log("Location updated during tracking:", position);
        
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        
        setCurrentLocation(location);
        
        // If user is authenticated, update location in backend
        if (isAuthenticated && user?.id) {
          await updateLocationInBackend(location);
        }
      },
      (error) => {
        console.error("Location tracking error:", error);
        let errorMessage = "Location tracking failed";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied during tracking";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable during tracking";
            break;
          case error.TIMEOUT:
            errorMessage = "Location tracking timed out";
            break;
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      },
      options
    );
    
    // Store watchId for cleanup
    localStorage.setItem('quickfix_location_watchId', watchId.toString());
  };
  
  // Stop location tracking
  const stopTracking = () => {
    console.log("Stopping location tracking...");
    const watchId = localStorage.getItem('quickfix_location_watchId');
    if (watchId) {
      navigator.geolocation.clearWatch(parseInt(watchId));
      localStorage.removeItem('quickfix_location_watchId');
    }
    
    setTrackingEnabled(false);
  };
  
  // Update location in backend
  const updateLocationInBackend = async (location) => {
    if (!isAuthenticated || !user?.id) {
      console.log("Not authenticated, skipping backend update");
      return;
    }
    
    try {
      console.log("Updating location in backend:", location);
      
      // Get address from coordinates using reverse geocoding
      const address = await reverseGeocode(location.lat, location.lng);
      
      const locationData = {
        user_id: user.id,
        latitude: location.lat,
        longitude: location.lng,
        address: address,
        is_current: true
      };
      
      const result = await locationAPI.updateLocation(locationData);
      if (result.success) {
        console.log("Location updated successfully in backend");
      } else {
        console.error("Failed to update location:", result.message);
      }
    } catch (error) {
      console.error("Failed to update location in backend:", error);
    }
  };
  
  // Find nearby workers
  const findNearbyWorkers = async (serviceType, radius = 10) => {
    if (!currentLocation) {
      const errorMsg = "Current location not available. Please enable location access.";
      console.error(errorMsg);
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
    
    console.log("Finding nearby workers for:", serviceType, "at location:", currentLocation);
    setLoading(true);
    
    try {
      const response = await workerAPI.findNearbyWorkers(
        currentLocation.lat, 
        currentLocation.lng, 
        serviceType, 
        radius
      );
      
      setLoading(false);
      
      if (response.success) {
        console.log("Found workers:", response.data);
        return response;
      } else {
        console.error("Failed to find workers:", response.message);
        toast.error("No workers found in your area");
        return response;
      }
    } catch (error) {
      console.error("Error finding nearby workers:", error);
      setLoading(false);
      toast.error("Failed to find nearby workers");
      return { success: false, message: error.message };
    }
  };
  
  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat, lng) => {
    console.log("Reverse geocoding:", lat, lng);
    
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("Reverse geocoding response:", data);
        
        if (data.display_name) {
          return data.display_name;
        }
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
    
    // Fallback to coordinates
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };
  
  // Check location permissions
  const checkLocationPermission = async () => {
    if (!navigator.permissions) {
      return 'unknown';
    }
    
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      console.error("Error checking location permission:", error);
      return 'unknown';
    }
  };
  
  // Initialize location on mount if tracking was enabled
  useEffect(() => {
    const wasTracking = localStorage.getItem('quickfix_tracking_enabled') === 'true';
    
    if (wasTracking && isAuthenticated) {
      console.log("Restoring location tracking on mount");
      startTracking();
    }
    
    // Check location permission on mount
    checkLocationPermission().then(permission => {
      console.log("Location permission status:", permission);
      if (permission === 'denied') {
        setError("Location access is denied. Please enable it in your browser settings.");
      }
    });
    
    return () => {
      if (trackingEnabled) {
        stopTracking();
      }
    };
  }, [isAuthenticated]);
  
  // Save tracking status when it changes
  useEffect(() => {
    localStorage.setItem('quickfix_tracking_enabled', trackingEnabled.toString());
  }, [trackingEnabled]);
  
  const value = {
    currentLocation,
    trackingEnabled,
    loading,
    error,
    getUserLocation,
    startTracking,
    stopTracking,
    findNearbyWorkers,
    reverseGeocode,
    checkLocationPermission
  };
  
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

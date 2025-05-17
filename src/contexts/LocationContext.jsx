
import { createContext, useContext, useState, useEffect } from 'react';
import { locationAPI } from '../services/api';
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
  
  // Get user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      toast.error("Location services not supported");
      return;
    }
    
    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        
        setCurrentLocation(location);
        setLoading(false);
        
        // If user is authenticated, update location in backend
        if (isAuthenticated && user) {
          updateLocationInBackend(location);
        }
      },
      (error) => {
        setLoading(false);
        setError(error.message);
        toast.error(`Error getting location: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };
  
  // Start location tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    
    setTrackingEnabled(true);
    getUserLocation(); // Get initial location
    
    // Set up periodic tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        
        setCurrentLocation(location);
        
        // If user is authenticated, update location in backend
        if (isAuthenticated && user) {
          updateLocationInBackend(location);
        }
      },
      (error) => {
        setError(error.message);
        toast.error(`Location tracking error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
    
    // Store watchId for cleanup
    localStorage.setItem('quickfix_location_watchId', watchId);
  };
  
  // Stop location tracking
  const stopTracking = () => {
    const watchId = localStorage.getItem('quickfix_location_watchId');
    if (watchId) {
      navigator.geolocation.clearWatch(parseInt(watchId));
      localStorage.removeItem('quickfix_location_watchId');
    }
    
    setTrackingEnabled(false);
  };
  
  // Update location in backend
  const updateLocationInBackend = async (location) => {
    if (!isAuthenticated || !user) return;
    
    try {
      await locationAPI.updateLocation(user.id, location);
    } catch (error) {
      console.error("Failed to update location in backend:", error);
    }
  };
  
  // Find nearby workers
  const findNearbyWorkers = async (serviceType, radius = 10) => {
    if (!currentLocation) {
      toast.error("Current location not available");
      return { success: false, message: "Location not available" };
    }
    
    setLoading(true);
    try {
      const response = await locationAPI.findNearbyWorkers(currentLocation, radius, serviceType);
      setLoading(false);
      
      if (response.success) {
        return response;
      } else {
        toast.error(response.message || "Failed to find nearby workers");
        return response;
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while finding nearby workers");
      return { success: false, message: error.message };
    }
  };
  
  // Initialize location on mount if tracking was enabled
  useEffect(() => {
    const wasTracking = localStorage.getItem('quickfix_tracking_enabled') === 'true';
    
    if (wasTracking) {
      startTracking();
    }
    
    return () => {
      if (trackingEnabled) {
        stopTracking();
      }
    };
  }, []);
  
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
    findNearbyWorkers
  };
  
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

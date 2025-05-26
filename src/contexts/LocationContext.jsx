
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
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMsg = "Geolocation is not supported by your browser";
        setError(errorMsg);
        console.error(errorMsg);
        reject(new Error(errorMsg));
        return;
      }
      
      console.log("Getting user location...");
      setLoading(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location retrieved:", position);
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          setCurrentLocation(location);
          setLoading(false);
          setError(null);
          
          // If user is authenticated, update location in backend
          if (isAuthenticated && user) {
            updateLocationInBackend(location);
          }
          
          resolve(location);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);
          setError(error.message);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  };
  
  // Start location tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    
    console.log("Starting location tracking...");
    setTrackingEnabled(true);
    getUserLocation(); // Get initial location
    
    // Set up periodic tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log("Location updated:", position);
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
        console.error("Location tracking error:", error);
        setError(error.message);
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
    if (!isAuthenticated || !user) return;
    
    try {
      console.log("Updating location in backend:", location);
      await locationAPI.updateLocation(user.id || user.uid, location);
    } catch (error) {
      console.error("Failed to update location in backend:", error);
    }
  };
  
  // Find nearby workers
  const findNearbyWorkers = async (serviceType, radius = 10) => {
    if (!currentLocation) {
      const errorMsg = "Current location not available";
      console.error(errorMsg);
      return { success: false, message: errorMsg };
    }
    
    console.log("Finding nearby workers for:", serviceType);
    setLoading(true);
    try {
      const response = await locationAPI.findNearbyWorkers(currentLocation, radius, serviceType);
      setLoading(false);
      
      if (response.success) {
        console.log("Found workers:", response);
        return response;
      } else {
        console.error("Failed to find workers:", response.message);
        return response;
      }
    } catch (error) {
      console.error("Error finding nearby workers:", error);
      setLoading(false);
      return { success: false, message: error.message };
    }
  };
  
  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat, lng) => {
    console.log("Reverse geocoding:", lat, lng);
    // In a real app, you would use Google Maps Geocoding API
    // For now, return a mock address
    return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}\nMock Address: Street, Area, City, Pincode`;
  };
  
  // Initialize location on mount if tracking was enabled
  useEffect(() => {
    const wasTracking = localStorage.getItem('quickfix_tracking_enabled') === 'true';
    
    if (wasTracking) {
      console.log("Restoring location tracking on mount");
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
    findNearbyWorkers,
    reverseGeocode
  };
  
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

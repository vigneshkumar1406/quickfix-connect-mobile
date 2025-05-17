
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check for existing auth on load
  useEffect(() => {
    const storedUser = localStorage.getItem('quickfix_user');
    const token = localStorage.getItem('quickfix_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);
  
  // OTP Authentication
  const sendOTP = async (phoneNumber) => {
    setLoading(true);
    try {
      const response = await authAPI.sendOTP(phoneNumber);
      setLoading(false);
      
      if (response.success) {
        toast.success("OTP sent successfully");
        return { success: true };
      } else {
        toast.error(response.message || "Failed to send OTP");
        return { success: false, error: response.message };
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while sending OTP");
      return { success: false, error: error.message };
    }
  };
  
  const verifyOTP = async (phoneNumber, otp) => {
    setLoading(true);
    try {
      const response = await authAPI.verifyOTP(phoneNumber, otp);
      setLoading(false);
      
      if (response.success) {
        // Create a user object
        const userObject = {
          phoneNumber,
          id: `user_${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        
        // Save to state and localStorage
        setUser(userObject);
        setIsAuthenticated(true);
        localStorage.setItem('quickfix_user', JSON.stringify(userObject));
        localStorage.setItem('quickfix_token', response.token);
        
        toast.success("Successfully logged in");
        return { success: true };
      } else {
        toast.error(response.message || "Invalid OTP");
        return { success: false, error: response.message };
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while verifying OTP");
      return { success: false, error: error.message };
    }
  };
  
  const logout = () => {
    localStorage.removeItem('quickfix_user');
    localStorage.removeItem('quickfix_token');
    setUser(null);
    setIsAuthenticated(false);
    toast.info("You have been logged out");
  };
  
  const value = {
    user,
    loading,
    isAuthenticated,
    sendOTP,
    verifyOTP,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

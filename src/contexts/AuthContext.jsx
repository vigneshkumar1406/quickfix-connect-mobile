
import { createContext, useContext, useState, useEffect } from 'react';
import { sendFirebaseOTP, verifyFirebaseOTP, clearConfirmationResult } from '../services/firebaseAuth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userObject = {
          uid: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber,
          createdAt: firebaseUser.metadata.creationTime
        };
        setUser(userObject);
        setIsAuthenticated(true);
        localStorage.setItem('quickfix_user', JSON.stringify(userObject));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('quickfix_user');
        localStorage.removeItem('quickfix_token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  // Firebase OTP Authentication
  const sendOTP = async (phoneNumber) => {
    setLoading(true);
    try {
      const response = await sendFirebaseOTP(phoneNumber);
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
      const response = await verifyFirebaseOTP(otp);
      setLoading(false);
      
      if (response.success) {
        // Firebase will automatically trigger the auth state change
        // which will update our user state
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
  
  const logout = async () => {
    try {
      await signOut(auth);
      clearConfirmationResult();
      toast.info("You have been logged out");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Error signing out:", error);
    }
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

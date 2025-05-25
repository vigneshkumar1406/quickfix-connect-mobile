
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult,
  Auth 
} from "firebase/auth";
import { auth } from "@/config/firebase";

let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

export const initializeRecaptcha = () => {
  console.log('Current hostname:', window.location.hostname);
  console.log('Current origin:', window.location.origin);
  
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'normal',
      'callback': () => {
        console.log('reCAPTCHA solved successfully');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired, please try again');
      },
      'error-callback': (error: any) => {
        console.error('reCAPTCHA error:', error);
      }
    });
  }
  return recaptchaVerifier;
};

export const sendFirebaseOTP = async (phoneNumber: string): Promise<{ success: boolean; message?: string }> => {
  try {
    // Clear any existing verification
    if (recaptchaVerifier) {
      console.log('Clearing existing reCAPTCHA verifier');
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
    
    // Check if reCAPTCHA container exists
    const container = document.getElementById('recaptcha-container');
    if (!container) {
      return {
        success: false,
        message: "reCAPTCHA container not found. Please refresh the page and try again."
      };
    }
    
    // Clear the container
    container.innerHTML = '';
    
    // Ensure phone number has country code
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    console.log('Attempting to send OTP to:', formattedPhone);
    console.log('Current domain:', window.location.hostname);
    
    const recaptcha = initializeRecaptcha();
    
    // Render the reCAPTCHA
    console.log('Rendering reCAPTCHA...');
    await recaptcha.render();
    console.log('reCAPTCHA rendered successfully');
    
    console.log('Sending OTP via Firebase...');
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptcha);
    console.log('OTP sent successfully');
    
    return { 
      success: true, 
      message: "OTP sent successfully" 
    };
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/captcha-check-failed') {
      return { 
        success: false, 
        message: `Domain authorization failed. Current domain: ${window.location.hostname}. Please ensure this domain is added to Firebase Auth settings.` 
      };
    } else if (error.code === 'auth/too-many-requests') {
      return { 
        success: false, 
        message: "Too many requests. Please try again later." 
      };
    } else if (error.code === 'auth/invalid-phone-number') {
      return { 
        success: false, 
        message: "Invalid phone number format." 
      };
    } else if (error.code === 'auth/quota-exceeded') {
      return { 
        success: false, 
        message: "SMS quota exceeded. Please try again later or contact support." 
      };
    }
    
    return { 
      success: false, 
      message: error.message || "Failed to send OTP" 
    };
  }
};

export const verifyFirebaseOTP = async (otp: string): Promise<{ success: boolean; message?: string; user?: any }> => {
  try {
    if (!confirmationResult) {
      return { 
        success: false, 
        message: "No OTP request found. Please request OTP first." 
      };
    }

    const result = await confirmationResult.confirm(otp);
    const user = result.user;
    
    return { 
      success: true, 
      message: "Phone number verified successfully",
      user: {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        createdAt: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    
    if (error.code === 'auth/invalid-verification-code') {
      return { 
        success: false, 
        message: "Invalid OTP. Please check and try again." 
      };
    } else if (error.code === 'auth/code-expired') {
      return { 
        success: false, 
        message: "OTP has expired. Please request a new one." 
      };
    }
    
    return { 
      success: false, 
      message: error.message || "Failed to verify OTP" 
    };
  }
};

export const clearConfirmationResult = () => {
  confirmationResult = null;
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
};

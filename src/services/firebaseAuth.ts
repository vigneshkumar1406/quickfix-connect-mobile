
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
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });
  }
  return recaptchaVerifier;
};

export const sendFirebaseOTP = async (phoneNumber: string): Promise<{ success: boolean; message?: string }> => {
  try {
    // Ensure phone number has country code
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    
    const recaptcha = initializeRecaptcha();
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptcha);
    
    return { 
      success: true, 
      message: "OTP sent successfully" 
    };
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/too-many-requests') {
      return { 
        success: false, 
        message: "Too many requests. Please try again later." 
      };
    } else if (error.code === 'auth/invalid-phone-number') {
      return { 
        success: false, 
        message: "Invalid phone number format." 
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

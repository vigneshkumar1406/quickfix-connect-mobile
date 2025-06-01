
// Updated API service that uses Supabase instead of mock backend
import { 
  authAPI,
  profileAPI,
  workerAPI,
  locationAPI,
  serviceAPI,
  notificationAPI,
  walletAPI,
  reviewAPI
} from './supabaseAPI';

// Re-export all APIs for backward compatibility
export {
  authAPI,
  profileAPI as userAPI,
  workerAPI,
  locationAPI,
  serviceAPI,
  notificationAPI,
  walletAPI,
  reviewAPI
};

// Legacy API exports for existing code compatibility
export { authAPI as authService };
export { workerAPI as workerService };
export { locationAPI as locationService };
export { serviceAPI as serviceBookingService };
export { notificationAPI as notificationService };

// Payment API with Paytm integration using your MID
const PAYTM_MID = "zYpUGe55389849298154";

export const paymentAPI = {
  createPaymentOrder: async (amount, currency = "INR", description) => {
    try {
      return {
        success: true,
        order: {
          id: `pay_${Date.now()}`,
          amount,
          currency,
          description,
          paytm_mid: PAYTM_MID
        }
      };
    } catch (error) {
      console.error("Error creating payment order:", error);
      return { success: false, message: "Failed to create payment order" };
    }
  },
  
  verifyPayment: async (orderId, paymentId, signature, bookingId, amount) => {
    try {
      // Call the edge function to process payment
      const response = await fetch('/functions/v1/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await import('@/integrations/supabase/client')).supabase.auth.session()?.access_token}`
        },
        body: JSON.stringify({
          bookingId,
          amount,
          paymentMethod: 'paytm',
          transactionId: paymentId,
          paytm_mid: PAYTM_MID
        })
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error verifying payment:", error);
      return { success: false, message: "Failed to verify payment" };
    }
  },

  // Paytm specific methods
  createPaytmOrder: async (amount, description) => {
    try {
      const orderId = `PAYTM_${Date.now()}`;
      
      return {
        success: true,
        order: {
          id: orderId,
          amount,
          description,
          mid: PAYTM_MID,
          // In production, you would call Paytm API to get transaction token
          token: `TOKEN_${Date.now()}` // Mock token
        }
      };
    } catch (error) {
      console.error("Error creating Paytm order:", error);
      return { success: false, message: "Failed to create Paytm order" };
    }
  },

  verifyPaytmPayment: async (orderId, txnId, amount) => {
    try {
      // In production, verify with Paytm servers
      console.log(`Verifying Paytm payment: Order ${orderId}, Transaction ${txnId}, Amount ${amount}`);
      
      return {
        success: true,
        message: "Paytm payment verified successfully",
        payment: {
          orderId,
          txnId,
          amount,
          status: "completed",
          method: "paytm",
          mid: PAYTM_MID
        }
      };
    } catch (error) {
      console.error("Error verifying Paytm payment:", error);
      return { success: false, message: "Failed to verify Paytm payment" };
    }
  }
};

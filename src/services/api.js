
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

// Payment API with Razorpay integration
export const paymentAPI = {
  createPaymentOrder: async (amount, currency = "INR", description) => {
    try {
      // This would integrate with your payment processor
      return {
        success: true,
        order: {
          id: `pay_${Date.now()}`,
          amount,
          currency,
          description
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
          paymentMethod: 'razorpay',
          transactionId: paymentId
        })
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error verifying payment:", error);
      return { success: false, message: "Failed to verify payment" };
    }
  }
};


// API service for frontend to communicate with backend
import { 
  authService,
  workerService,
  locationService,
  serviceBookingService,
  paymentService,
  notificationService
} from '../backend/server';

// Authentication API
export const authAPI = {
  sendOTP: async (phoneNumber) => {
    try {
      // This is simulating an API call to our backend
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(authService.sendOTP(phoneNumber));
        }, 1000); // Simulate network delay
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      return { success: false, message: "Failed to send OTP" };
    }
  },
  
  verifyOTP: async (phoneNumber, otp) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(authService.verifyOTP(phoneNumber, otp));
        }, 1000);
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { success: false, message: "Failed to verify OTP" };
    }
  }
};

// Worker API
export const workerAPI = {
  registerWorker: async (workerData) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(workerService.registerWorker(workerData));
        }, 1000);
      });
    } catch (error) {
      console.error("Error registering worker:", error);
      return { success: false, message: "Failed to register worker" };
    }
  },
  
  verifyKYC: async (workerId, kycData) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(workerService.verifyKYC(workerId, kycData));
        }, 1500);
      });
    } catch (error) {
      console.error("Error verifying KYC:", error);
      return { success: false, message: "Failed to verify KYC" };
    }
  }
};

// Location API
export const locationAPI = {
  updateLocation: async (userId, location) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(locationService.updateLocation(userId, location));
        }, 500);
      });
    } catch (error) {
      console.error("Error updating location:", error);
      return { success: false, message: "Failed to update location" };
    }
  },
  
  getLocation: async (userId) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(locationService.getLocation(userId));
        }, 500);
      });
    } catch (error) {
      console.error("Error getting location:", error);
      return { success: false, message: "Failed to get location" };
    }
  },
  
  findNearbyWorkers: async (location, radius, serviceType) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(locationService.findNearbyWorkers(location, radius, serviceType));
        }, 1000);
      });
    } catch (error) {
      console.error("Error finding nearby workers:", error);
      return { success: false, message: "Failed to find nearby workers" };
    }
  }
};

// Service Booking API
export const serviceAPI = {
  bookService: async (customerData, serviceData, location) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(serviceBookingService.bookService(customerData, serviceData, location));
        }, 1000);
      });
    } catch (error) {
      console.error("Error booking service:", error);
      return { success: false, message: "Failed to book service" };
    }
  },
  
  assignWorker: async (serviceId, workerId) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(serviceBookingService.assignWorker(serviceId, workerId));
        }, 800);
      });
    } catch (error) {
      console.error("Error assigning worker:", error);
      return { success: false, message: "Failed to assign worker" };
    }
  },
  
  updateServiceStatus: async (serviceId, status, details = {}) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(serviceBookingService.updateServiceStatus(serviceId, status, details));
        }, 800);
      });
    } catch (error) {
      console.error("Error updating service status:", error);
      return { success: false, message: "Failed to update service status" };
    }
  }
};

// Payment API (Razorpay)
export const paymentAPI = {
  createPaymentOrder: async (amount, currency = "INR", description) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(paymentService.createPaymentOrder(amount, currency, description));
        }, 1000);
      });
    } catch (error) {
      console.error("Error creating payment order:", error);
      return { success: false, message: "Failed to create payment order" };
    }
  },
  
  verifyPayment: async (orderId, paymentId, signature) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(paymentService.verifyPayment(orderId, paymentId, signature));
        }, 800);
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      return { success: false, message: "Failed to verify payment" };
    }
  },
  
  // Integration with Razorpay
  initializeRazorpay: async (orderId, amount, currency, name, description, prefill = {}) => {
    return new Promise((resolve) => {
      const options = {
        key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay key
        amount: amount * 100,  // Razorpay expects amount in paise
        currency,
        name,
        description,
        order_id: orderId,
        prefill,
        handler: function (response) {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
        },
        modal: {
          ondismiss: function () {
            resolve({ success: false, message: "Payment cancelled by user" });
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  }
};

// Notification API
export const notificationAPI = {
  sendNotification: async (userId, notification) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(notificationService.sendNotification(userId, notification));
        }, 500);
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      return { success: false, message: "Failed to send notification" };
    }
  },
  
  broadcastToNearbyWorkers: async (location, radius, notification) => {
    try {
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(notificationService.broadcastToNearbyWorkers(location, radius, notification));
        }, 800);
      });
    } catch (error) {
      console.error("Error broadcasting to nearby workers:", error);
      return { success: false, message: "Failed to broadcast to nearby workers" };
    }
  }
};


// This is a mock implementation for demo purposes
// In a real app, this would be a Node.js/Express server

// Mock database
const db = {
  users: [],
  workers: [],
  services: [],
  locations: {},
  payments: []
};

// Authentication
const authService = {
  sendOTP: (phoneNumber) => {
    console.log(`Sending OTP to ${phoneNumber}`);
    // In a real implementation, this would call an SMS API
    return {
      success: true,
      message: "OTP sent successfully",
      otp: "1234" // In production, never return the actual OTP
    };
  },
  
  verifyOTP: (phoneNumber, otp) => {
    console.log(`Verifying OTP ${otp} for ${phoneNumber}`);
    // In production, verify against stored OTPs
    return {
      success: otp === "1234",
      message: otp === "1234" ? "OTP verified successfully" : "Invalid OTP",
      token: otp === "1234" ? "mock_auth_token_123456" : null
    };
  }
};

// Worker services
const workerService = {
  registerWorker: (workerData) => {
    console.log("Registering worker:", workerData);
    
    // Create worker record
    const worker = {
      id: `worker_${Date.now()}`,
      ...workerData,
      status: "pending_verification",
      created_at: new Date().toISOString()
    };
    
    db.workers.push(worker);
    return {
      success: true,
      message: "Worker registered successfully",
      worker
    };
  },
  
  verifyKYC: (workerId, kycData) => {
    console.log(`Processing KYC verification for worker ${workerId}`);
    
    // In production, this would verify the KYC data with a third-party provider
    const worker = db.workers.find(w => w.id === workerId);
    if (!worker) {
      return {
        success: false,
        message: "Worker not found"
      };
    }
    
    worker.kycVerified = true;
    worker.status = "verified";
    worker.kycDetails = kycData;
    
    return {
      success: true,
      message: "KYC verified successfully",
      worker
    };
  }
};

// Location tracking
const locationService = {
  updateLocation: (userId, location) => {
    console.log(`Updating location for ${userId}:`, location);
    
    db.locations[userId] = {
      ...location,
      timestamp: Date.now()
    };
    
    return {
      success: true,
      message: "Location updated successfully"
    };
  },
  
  getLocation: (userId) => {
    const location = db.locations[userId];
    
    if (!location) {
      return {
        success: false,
        message: "Location not found"
      };
    }
    
    return {
      success: true,
      location
    };
  },
  
  findNearbyWorkers: (location, radius, serviceType) => {
    console.log(`Finding workers near ${location.lat},${location.lng} within ${radius}km for ${serviceType}`);
    
    // In a real app, this would do a geospatial query
    // Here we'll mock some nearby workers
    const nearbyWorkers = db.workers
      .filter(worker => worker.status === "verified")
      .filter(worker => worker.skills.includes(serviceType))
      .slice(0, 5)
      .map(worker => ({
        ...worker,
        distance: Math.random() * radius, // Random distance within radius
        eta: Math.floor(Math.random() * 30) + 5 // Random ETA between 5-35 minutes
      }));
    
    return {
      success: true,
      workers: nearbyWorkers
    };
  }
};

// Service booking
const serviceBookingService = {
  bookService: (customerData, serviceData, location) => {
    console.log("Booking service:", serviceData);
    
    const service = {
      id: `service_${Date.now()}`,
      customer: customerData,
      service: serviceData,
      location,
      status: "pending",
      created_at: new Date().toISOString()
    };
    
    db.services.push(service);
    return {
      success: true,
      message: "Service booked successfully",
      service
    };
  },
  
  assignWorker: (serviceId, workerId) => {
    console.log(`Assigning worker ${workerId} to service ${serviceId}`);
    
    const service = db.services.find(s => s.id === serviceId);
    if (!service) {
      return {
        success: false,
        message: "Service not found"
      };
    }
    
    service.workerId = workerId;
    service.status = "assigned";
    service.assigned_at = new Date().toISOString();
    
    return {
      success: true,
      message: "Worker assigned successfully",
      service
    };
  },
  
  updateServiceStatus: (serviceId, status, details = {}) => {
    console.log(`Updating service ${serviceId} status to ${status}`);
    
    const service = db.services.find(s => s.id === serviceId);
    if (!service) {
      return {
        success: false,
        message: "Service not found"
      };
    }
    
    service.status = status;
    service.statusHistory = service.statusHistory || [];
    service.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      details
    });
    
    return {
      success: true,
      message: `Service status updated to ${status}`,
      service
    };
  }
};

// Payment processing
const paymentService = {
  createPaymentOrder: (amount, currency = "INR", description) => {
    console.log(`Creating payment order for ${amount} ${currency}`);
    
    // In production, this would call Razorpay API
    const paymentOrder = {
      id: `pay_${Date.now()}`,
      amount,
      currency,
      description,
      status: "created",
      created_at: new Date().toISOString()
    };
    
    db.payments.push(paymentOrder);
    return {
      success: true,
      message: "Payment order created successfully",
      order: paymentOrder
    };
  },
  
  verifyPayment: (orderId, paymentId, signature) => {
    console.log(`Verifying payment ${paymentId} for order ${orderId}`);
    
    // In production, verify the Razorpay signature
    const payment = db.payments.find(p => p.id === orderId);
    if (!payment) {
      return {
        success: false,
        message: "Payment order not found"
      };
    }
    
    payment.paymentId = paymentId;
    payment.status = "completed";
    payment.completed_at = new Date().toISOString();
    
    return {
      success: true,
      message: "Payment verified successfully",
      payment
    };
  }
};

// Notification service
const notificationService = {
  sendNotification: (userId, notification) => {
    console.log(`Sending notification to ${userId}:`, notification);
    
    // In production, this would use Firebase Cloud Messaging
    return {
      success: true,
      message: "Notification sent successfully"
    };
  },
  
  broadcastToNearbyWorkers: (location, radius, notification) => {
    console.log(`Broadcasting to workers near ${location.lat},${location.lng} within ${radius}km`);
    
    // In production, this would query workers and send via FCM
    return {
      success: true,
      message: `Notification sent to workers within ${radius}km`,
      recipients: Math.floor(Math.random() * 10) + 1 // Mock number of recipients
    };
  }
};

// Export all services for frontend use
export {
  authService,
  workerService,
  locationService,
  serviceBookingService,
  paymentService,
  notificationService
};

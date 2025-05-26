
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types
export interface Profile {
  id: string;
  phone_number?: string;
  full_name?: string;
  avatar_url?: string;
  user_type: 'customer' | 'worker';
}

export interface Worker {
  id: string;
  user_id: string;
  skills: string[];
  experience_years: number;
  hourly_rate?: number;
  description?: string;
  kyc_verified: boolean;
  status: 'pending_verification' | 'verified' | 'suspended';
  rating: number;
  total_jobs: number;
  available: boolean;
}

export interface ServiceBooking {
  id: string;
  customer_id: string;
  worker_id?: string;
  service_type: string;
  description?: string;
  booking_type: 'now' | 'scheduled';
  scheduled_date?: string;
  scheduled_time?: string;
  customer_name?: string;
  customer_phone?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  estimated_cost?: number;
  final_cost?: number;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
}

export interface UserLocation {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  is_current: boolean;
}

// Authentication API
export const authAPI = {
  signInWithPhone: async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });
      
      if (error) throw error;
      
      return { success: true, message: "OTP sent successfully" };
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      return { success: false, message: error.message };
    }
  },

  verifyOTP: async (phone: string, otp: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp,
        type: 'sms'
      });
      
      if (error) throw error;
      
      return { 
        success: true, 
        message: "OTP verified successfully",
        user: data.user,
        session: data.session
      };
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      return { success: false, message: error.message };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true, message: "Signed out successfully" };
    } catch (error: any) {
      console.error("Error signing out:", error);
      return { success: false, message: error.message };
    }
  }
};

// Profile API
export const profileAPI = {
  getProfile: async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  },

  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error updating profile:", error);
      return { success: false, message: error.message };
    }
  },

  createProfile: async (profile: Partial<Profile>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error creating profile:", error);
      return { success: false, message: error.message };
    }
  }
};

// Worker API
export const workerAPI = {
  registerWorker: async (workerData: Partial<Worker>) => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .insert(workerData)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error registering worker:", error);
      return { success: false, message: error.message };
    }
  },

  updateWorker: async (workerId: string, updates: Partial<Worker>) => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .update(updates)
        .eq('id', workerId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error updating worker:", error);
      return { success: false, message: error.message };
    }
  },

  getWorkerByUserId: async (userId: string): Promise<Worker | null> => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error("Error fetching worker:", error);
      return null;
    }
  },

  findNearbyWorkers: async (latitude: number, longitude: number, serviceType: string, radius: number = 10) => {
    try {
      // For now, we'll get all verified workers with the required skill
      // In production, you'd use PostGIS for proper geospatial queries
      const { data, error } = await supabase
        .from('workers')
        .select('*, profiles!workers_user_id_fkey(*)')
        .eq('status', 'verified')
        .eq('available', true)
        .contains('skills', [serviceType]);
      
      if (error) throw error;
      
      // Mock distance calculation for demo
      const workersWithDistance = data.map(worker => ({
        ...worker,
        distance: Math.random() * radius,
        eta: Math.floor(Math.random() * 30) + 5
      }));
      
      return { success: true, data: workersWithDistance };
    } catch (error: any) {
      console.error("Error finding nearby workers:", error);
      return { success: false, message: error.message };
    }
  }
};

// Location API
export const locationAPI = {
  updateLocation: async (locationData: Partial<UserLocation>) => {
    try {
      // First, set all user's locations to not current
      const { error: updateError } = await supabase
        .from('user_locations')
        .update({ is_current: false })
        .eq('user_id', locationData.user_id);
      
      if (updateError) throw updateError;
      
      // Insert new current location
      const { data, error } = await supabase
        .from('user_locations')
        .insert({ ...locationData, is_current: true })
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error updating location:", error);
      return { success: false, message: error.message };
    }
  },

  getCurrentLocation: async (userId: string): Promise<UserLocation | null> => {
    try {
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_current', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error("Error fetching current location:", error);
      return null;
    }
  }
};

// Service Booking API
export const serviceAPI = {
  createBooking: async (bookingData: Partial<ServiceBooking>) => {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .insert(bookingData)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error creating booking:", error);
      return { success: false, message: error.message };
    }
  },

  updateBooking: async (bookingId: string, updates: Partial<ServiceBooking>) => {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .update(updates)
        .eq('id', bookingId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error updating booking:", error);
      return { success: false, message: error.message };
    }
  },

  getBooking: async (bookingId: string): Promise<ServiceBooking | null> => {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select('*, workers(*), profiles!service_bookings_customer_id_fkey(*)')
        .eq('id', bookingId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching booking:", error);
      return null;
    }
  },

  getUserBookings: async (userId: string, userType: 'customer' | 'worker') => {
    try {
      let query = supabase
        .from('service_bookings')
        .select('*, workers(*), profiles!service_bookings_customer_id_fkey(*)');
      
      if (userType === 'customer') {
        query = query.eq('customer_id', userId);
      } else {
        // For workers, we need to join with the workers table
        query = query.eq('worker_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching user bookings:", error);
      return { success: false, message: error.message };
    }
  }
};

// Notification API
export const notificationAPI = {
  createNotification: async (userId: string, title: string, message: string, type?: string, data?: any) => {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type: type || 'general',
          data
        })
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data: notification };
    } catch (error: any) {
      console.error("Error creating notification:", error);
      return { success: false, message: error.message };
    }
  },

  getUserNotifications: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      return { success: false, message: error.message };
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      return { success: false, message: error.message };
    }
  }
};

// Wallet API
export const walletAPI = {
  getWallet: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching wallet:", error);
      return { success: false, message: error.message };
    }
  },

  updateBalance: async (userId: string, amount: number, type: 'credit' | 'debit', description: string) => {
    try {
      // Get current wallet
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (walletError) throw walletError;
      
      const newBalance = type === 'credit' 
        ? wallet.balance + amount 
        : wallet.balance - amount;
      
      // Update wallet balance
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ 
          balance: newBalance,
          total_earned: type === 'credit' ? wallet.total_earned + amount : wallet.total_earned,
          total_spent: type === 'debit' ? wallet.total_spent + amount : wallet.total_spent
        })
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          amount,
          type,
          description
        });
      
      if (transactionError) throw transactionError;
      
      return { success: true };
    } catch (error: any) {
      console.error("Error updating wallet balance:", error);
      return { success: false, message: error.message };
    }
  },

  getTransactions: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*, wallets!inner(user_id)')
        .eq('wallets.user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      return { success: false, message: error.message };
    }
  }
};

// Reviews API
export const reviewAPI = {
  createReview: async (bookingId: string, customerId: string, workerId: string, rating: number, comment?: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          booking_id: bookingId,
          customer_id: customerId,
          worker_id: workerId,
          rating,
          comment
        })
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error creating review:", error);
      return { success: false, message: error.message };
    }
  },

  getWorkerReviews: async (workerId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles!reviews_customer_id_fkey(*)')
        .eq('worker_id', workerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching worker reviews:", error);
      return { success: false, message: error.message };
    }
  }
};

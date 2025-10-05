import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

// Use Supabase generated types
type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

type Worker = Database['public']['Tables']['workers']['Row'];
type WorkerInsert = Database['public']['Tables']['workers']['Insert'];
type WorkerUpdate = Database['public']['Tables']['workers']['Update'];

type ServiceBooking = Database['public']['Tables']['service_bookings']['Row'];
type ServiceBookingInsert = Database['public']['Tables']['service_bookings']['Insert'];
type ServiceBookingUpdate = Database['public']['Tables']['service_bookings']['Update'];

type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

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
      return data as Profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  },

  updateProfile: async (userId: string, updates: ProfileUpdate) => {
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

  createProfile: async (profile: ProfileInsert) => {
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
  registerWorker: async (workerData: WorkerInsert) => {
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

  updateWorker: async (workerId: string, updates: WorkerUpdate) => {
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

  getWorker: async (workerId: string) => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*, profiles!workers_user_id_fkey(*)')
        .eq('id', workerId)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching worker:", error);
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
      return data as Worker;
    } catch (error) {
      console.error("Error fetching worker:", error);
      return null;
    }
  },

  findNearbyWorkers: async (latitude: number, longitude: number, serviceType: string, radius: number = 10) => {
    try {
      // Get all verified workers with the required skill
      const { data, error } = await supabase
        .from('workers')
        .select('*, profiles!workers_user_id_fkey(*)')
        .eq('kyc_verified', true)
        .eq('is_available', true)
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

// Location API - stores location in profiles table
export const locationAPI = {
  updateLocation: async (userId: string, latitude: number, longitude: number, address?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          latitude, 
          longitude, 
          address 
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error updating location:", error);
      return { success: false, message: error.message };
    }
  },

  getCurrentLocation: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('latitude, longitude, address')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching current location:", error);
      return { success: false, message: error.message };
    }
  }
};

// Service Booking API
export const serviceAPI = {
  createBooking: async (bookingData: ServiceBookingInsert) => {
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

  updateBooking: async (bookingId: string, updates: ServiceBookingUpdate) => {
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

  getBooking: async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select('*, workers(*), profiles!service_bookings_customer_id_fkey(*)')
        .eq('id', bookingId)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching booking:", error);
      return { success: false, message: error.message };
    }
  },

  getBookings: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select('*, workers(*), profiles!service_bookings_customer_id_fkey(*)')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      return { success: false, message: error.message };
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
      const notificationData: NotificationInsert = {
        user_id: userId,
        title,
        message,
        type: type || 'general',
        data
      };

      const { data: notification, error } = await supabase
        .from('notifications')
        .insert(notificationData)
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

  updateBalance: async (userId: string, amount: number, type: 'credit' | 'debit', description: string, bookingId?: string) => {
    try {
      // Get current wallet
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (walletError) throw walletError;
      
      // Create wallet if it doesn't exist
      if (!wallet) {
        const { error: createError } = await supabase
          .from('wallets')
          .insert({ user_id: userId, balance: 0, total_earned: 0 });
        
        if (createError) throw createError;
      }
      
      const currentBalance = wallet?.balance || 0;
      const currentEarned = wallet?.total_earned || 0;
      
      const newBalance = type === 'credit' 
        ? currentBalance + amount 
        : currentBalance - amount;
      
      // Update wallet balance
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ 
          balance: newBalance,
          total_earned: type === 'credit' ? currentEarned + amount : currentEarned
        })
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: userId,
          amount,
          type,
          description,
          booking_id: bookingId,
          balance_after: newBalance
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
        .select('*')
        .eq('user_id', userId)
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
  },

  getCustomerReviews: async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, service_bookings!reviews_booking_id_fkey(service_type)')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Simple return without worker names for now
      const transformedData = data || [];
      
      return { success: true, data: transformedData };
    } catch (error: any) {
      console.error("Error fetching customer reviews:", error);
      return { success: false, message: error.message };
    }
  }
};

// Service Categories API - Using fallback data
export const serviceCategoryAPI = {
  getCategories: async () => {
    try {
      // Return mock data since the service_categories table isn't in the current types
      console.log("Using fallback service categories");
      return {
        success: true,
        data: [
          { id: '1', name: 'Home Cleaning', description: 'Professional home cleaning services', base_price: 299, icon_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop&crop=center' },
          { id: '2', name: 'Plumbing', description: 'Plumbing repair and installation services', base_price: 399, icon_url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&h=200&fit=crop&crop=center' },
          { id: '3', name: 'Electrical', description: 'Electrical repair and installation services', base_price: 499, icon_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop&crop=center' },
          { id: '4', name: 'Painting', description: 'Interior and exterior painting services', base_price: 599, icon_url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=200&fit=crop&crop=center' }
        ]
      };
    } catch (error: any) {
      console.error("Error fetching service categories:", error);
      // Return fallback data on error
      return {
        success: true,
        data: [
          { id: '1', name: 'Home Cleaning', description: 'Professional home cleaning services', base_price: 299, icon_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop&crop=center' },
          { id: '2', name: 'Plumbing', description: 'Plumbing repair and installation services', base_price: 399, icon_url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&h=200&fit=crop&crop=center' },
          { id: '3', name: 'Electrical', description: 'Electrical repair and installation services', base_price: 499, icon_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop&crop=center' },
          { id: '4', name: 'Painting', description: 'Interior and exterior painting services', base_price: 599, icon_url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=200&fit=crop&crop=center' }
        ]
      };
    }
  }
};

// Export types for use in other files
export type { Profile, Worker, ServiceBooking };

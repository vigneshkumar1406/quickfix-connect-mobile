
import { supabase } from "@/integrations/supabase/client";

export interface ServiceGallery {
  id: string;
  service_type: string;
  title: string;
  description: string | null;
  image_url: string;
  display_order: number | null;
  is_featured: boolean | null;
  created_at: string;
}

export interface WorkerPortfolio {
  id: string;
  worker_id: string;
  title: string;
  description: string | null;
  service_type: string;
  image_url: string | null;
  completion_date: string | null;
  customer_rating: number | null;
  created_at: string;
  updated_at: string;
}

// Service Gallery API
export const serviceGalleryAPI = {
  getServiceImages: async (serviceType: string): Promise<ServiceGallery[]> => {
    try {
      const { data, error } = await supabase
        .from('service_galleries')
        .select('*')
        .eq('service_type', serviceType)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching service images:', error);
      return [];
    }
  },

  getAllServiceImages: async (): Promise<ServiceGallery[]> => {
    try {
      const { data, error } = await supabase
        .from('service_galleries')
        .select('*')
        .order('service_type', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all service images:', error);
      return [];
    }
  },

  getFeaturedImages: async (): Promise<ServiceGallery[]> => {
    try {
      const { data, error } = await supabase
        .from('service_galleries')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured images:', error);
      return [];
    }
  }
};

// Worker Portfolio API
export const workerPortfolioAPI = {
  getWorkerPortfolios: async (workerId: string): Promise<WorkerPortfolio[]> => {
    try {
      const { data, error } = await supabase
        .from('worker_portfolios')
        .select('*')
        .eq('worker_id', workerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching worker portfolios:', error);
      return [];
    }
  },

  getPortfoliosByServiceType: async (serviceType: string): Promise<WorkerPortfolio[]> => {
    try {
      const { data, error } = await supabase
        .from('worker_portfolios')
        .select(`
          *,
          workers!inner(
            id,
            rating,
            total_jobs,
            profiles!inner(full_name)
          )
        `)
        .eq('service_type', serviceType)
        .order('customer_rating', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching portfolios by service type:', error);
      return [];
    }
  },

  createPortfolio: async (portfolio: Omit<WorkerPortfolio, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('worker_portfolios')
        .insert(portfolio)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error creating portfolio:', error);
      return { success: false, message: error.message };
    }
  },

  updatePortfolio: async (portfolioId: string, updates: Partial<WorkerPortfolio>) => {
    try {
      const { data, error } = await supabase
        .from('worker_portfolios')
        .update(updates)
        .eq('id', portfolioId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating portfolio:', error);
      return { success: false, message: error.message };
    }
  },

  deletePortfolio: async (portfolioId: string) => {
    try {
      const { error } = await supabase
        .from('worker_portfolios')
        .delete()
        .eq('id', portfolioId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting portfolio:', error);
      return { success: false, message: error.message };
    }
  },

  uploadPortfolioImage: async (file: File, portfolioId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${portfolioId}-${Date.now()}.${fileExt}`;
      const filePath = `portfolios/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolios')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolios')
        .getPublicUrl(filePath);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error('Error uploading portfolio image:', error);
      return { success: false, message: error.message };
    }
  }
};

// Portfolio and Service Gallery fallback data
// These tables don't exist yet, so we return mock data

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

const mockServiceImages: ServiceGallery[] = [
  {
    id: '1',
    service_type: 'plumbing',
    title: 'Expert Plumbing Services',
    description: 'Professional plumbing repair and installation',
    image_url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop',
    display_order: 1,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    service_type: 'electrical',
    title: 'Electrical Repairs',
    description: 'Safe and reliable electrical services',
    image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop',
    display_order: 2,
    is_featured: true,
    created_at: new Date().toISOString()
  }
];

// Service Gallery API - Returns mock data
export const serviceGalleryAPI = {
  getServiceImages: async (serviceType: string): Promise<ServiceGallery[]> => {
    console.log('Using fallback service images for:', serviceType);
    return mockServiceImages.filter(img => img.service_type === serviceType);
  },

  getAllServiceImages: async (): Promise<ServiceGallery[]> => {
    console.log('Using fallback service images');
    return mockServiceImages;
  },

  getFeaturedImages: async (): Promise<ServiceGallery[]> => {
    console.log('Using fallback featured images');
    return mockServiceImages.filter(img => img.is_featured);
  }
};

// Worker Portfolio API - Returns mock data
export const workerPortfolioAPI = {
  getWorkerPortfolios: async (workerId: string): Promise<WorkerPortfolio[]> => {
    console.log('Portfolio feature not yet implemented');
    return [];
  },

  getPortfoliosByServiceType: async (serviceType: string): Promise<WorkerPortfolio[]> => {
    console.log('Portfolio feature not yet implemented');
    return [];
  },

  createPortfolio: async (portfolio: Partial<WorkerPortfolio>) => {
    console.log('Portfolio feature not yet implemented');
    return { success: false, message: 'Portfolio feature coming soon' };
  },

  updatePortfolio: async (portfolioId: string, updates: Partial<WorkerPortfolio>) => {
    console.log('Portfolio feature not yet implemented');
    return { success: false, message: 'Portfolio feature coming soon' };
  },

  deletePortfolio: async (portfolioId: string) => {
    console.log('Portfolio feature not yet implemented');
    return { success: false, message: 'Portfolio feature coming soon' };
  },

  uploadPortfolioImage: async (file: File, portfolioId: string) => {
    console.log('Portfolio feature not yet implemented');
    return { success: false, message: 'Portfolio feature coming soon' };
  }
};

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { serviceGalleryAPI } from "@/services/portfolioAPI";

interface ServiceImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  is_featured: boolean;
}

interface ServiceImageSliderProps {
  serviceType: string;
  className?: string;
}

export default function ServiceImageSlider({ serviceType, className = "" }: ServiceImageSliderProps) {
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceImages();
  }, [serviceType]);

  const fetchServiceImages = async () => {
    try {
      const data = await serviceGalleryAPI.getServiceImages(serviceType);
      setImages(data);
    } catch (error) {
      console.error('Error fetching service images:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
          <div className="bg-gray-200 rounded h-4 mb-2"></div>
          <div className="bg-gray-200 rounded h-3"></div>
        </div>
      </Card>
    );
  }

  if (images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative">
        <img
          src={currentImage.image_url}
          alt={currentImage.title}
          className="w-full h-48 sm:h-56 object-cover"
        />
        
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {currentImage.is_featured && (
          <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm mb-1">{currentImage.title}</h3>
        {currentImage.description && (
          <p className="text-xs text-gray-600">{currentImage.description}</p>
        )}
      </div>
    </Card>
  );
}

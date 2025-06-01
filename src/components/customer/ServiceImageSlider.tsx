
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceImageSliderProps {
  images: string[];
  serviceName: string;
  className?: string;
}

export default function ServiceImageSlider({ images, serviceName, className = "" }: ServiceImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className || "aspect-square"}`}>
        <span className="text-gray-500 text-xs">{serviceName}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gray-100 group ${className || "aspect-square"}`}>
      {/* Main Image */}
      <img
        src={images[currentIndex]}
        alt={`${serviceName} ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300";
        }}
      />

      {/* Navigation Arrows - Only show if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </>
      )}

      {/* Dots Indicator - Only show if multiple images */}
      {images.length > 1 && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToSlide(index, e)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? "bg-white scale-110" 
                  : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Loading overlay */}
      <div className="absolute inset-0 bg-gray-200 animate-pulse opacity-0 transition-opacity duration-200" />
    </div>
  );
}


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { reviewAPI } from "@/services/supabaseAPI";
import { toast } from "sonner";

export default function MyRatings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadReviews();
    }
  }, [user]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const result = await reviewAPI.getCustomerReviews(user?.id);
      if (result.success) {
        setReviews(result.data || []);
      } else {
        toast.error("Failed to load reviews");
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return "0";
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">My Ratings & Reviews</h1>
        </div>

        {/* Summary Card */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(parseFloat(calculateAverageRating())))}
            </div>
            <h2 className="text-2xl font-bold">{calculateAverageRating()}</h2>
            <p className="text-sm opacity-90">
              Average rating from {reviews.length} reviews
            </p>
          </div>
        </Card>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center mb-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 font-semibold">{review.rating}/5</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">Service Provider</p>
                    <div className="flex items-center mt-1">
                      <User className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {review.worker_name || 'Service Provider'}
                      </span>
                    </div>
                  </div>
                </div>

                {review.comment && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <p className="text-sm">{review.comment}</p>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  <p>Booking ID: #{String(review.booking_id || 'N/A').slice(-8)}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No reviews yet</p>
            <p className="text-sm text-gray-400 mb-4">
              Complete a service to leave your first review
            </p>
            <Button onClick={() => navigate("/customer/book-service")}>
              Book a Service
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

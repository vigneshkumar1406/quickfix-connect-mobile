
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyRatings() {
  const navigate = useNavigate();
  const [ratings] = useState([
    {
      id: 1,
      service: "Plumbing Repair",
      worker: "Rajesh K",
      rating: 5,
      comment: "Excellent work, very professional",
      date: "2024-01-15"
    },
    {
      id: 2,
      service: "Electrical Work",
      worker: "Suresh M",
      rating: 4,
      comment: "Good service, completed on time",
      date: "2024-01-10"
    }
  ]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">My Ratings</h1>
        </div>

        <div className="space-y-4">
          {ratings.map((rating) => (
            <Card key={rating.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{rating.service}</h3>
                    <p className="text-sm text-gray-600">Worker: {rating.worker}</p>
                  </div>
                  <div className="flex">
                    {renderStars(rating.rating)}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700">"{rating.comment}"</p>
                
                <p className="text-xs text-gray-500">
                  Rated on {new Date(rating.date).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

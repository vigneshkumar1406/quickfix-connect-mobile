
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Star, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ReviewService() {
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  const handleRatingChange = (value: number) => {
    setRating(value);
  };
  
  const handlePayment = () => {
    // Simulate payment
    setPaymentComplete(true);
    toast.success("Payment completed successfully");
  };
  
  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }
    
    toast.success("Thank you for your review!");
    navigate("/customer/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="bg-primary text-white p-6 rounded-b-3xl mb-6">
        <h1 className="text-2xl font-bold mb-1">Service Complete</h1>
        <p className="opacity-90">Your service has been completed</p>
      </div>
      
      {!paymentComplete ? (
        <Card className="mb-6 p-4">
          <h2 className="font-semibold mb-4">Bill Details</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span>Service Type</span>
              <span className="font-medium">Plumbing</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Service Charge</span>
              <span className="font-medium">₹350.00</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Parts & Materials</span>
              <span className="font-medium">₹120.00</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Taxes</span>
              <span className="font-medium">₹30.00</span>
            </div>
            
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold">Total Amount</span>
              <span className="font-bold">₹500.00</span>
            </div>
          </div>
          
          <Button 
            onClick={handlePayment}
            className="w-full"
          >
            Pay ₹500.00
          </Button>
        </Card>
      ) : (
        <>
          <Card className="mb-6 p-4 border-green-500 bg-green-50">
            <div className="flex items-center justify-center text-green-600 mb-3">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-center font-semibold text-green-700">Payment Successful</h2>
            <p className="text-center text-sm text-green-600">Your payment of ₹500.00 was processed successfully</p>
          </Card>
          
          <Card className="mb-6 p-4">
            <h2 className="font-semibold mb-4">Rate Your Experience</h2>
            
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating >= star 
                        ? "text-yellow-400 fill-current" 
                        : "text-neutral-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <div className="space-y-3 mb-6">
              <Label htmlFor="review">Share Your Feedback</Label>
              <Textarea
                id="review"
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <Button 
              onClick={handleSubmitReview}
              className="w-full"
            >
              Submit Review
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}

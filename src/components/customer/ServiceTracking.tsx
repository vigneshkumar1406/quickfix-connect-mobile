
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { serviceAPI, workerAPI } from "@/services/supabaseAPI";
import { Phone, MapPin, MessageCircle, Clock, Star, User, CheckCircle } from "lucide-react";
import LocationTracker from "./LocationTracker";

type BookingStatus = "pending" | "completed" | "assigned" | "in_progress" | "cancelled";

export default function ServiceTracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const id = location.state?.bookingId || location.state?.booking?.id;
    if (id) {
      setBookingId(id);
      loadBookingDetails(id);
    } else {
      toast.error("No booking ID provided");
      navigate("/customer/dashboard");
    }
  }, [location.state]);

  const loadBookingDetails = async (id: string) => {
    setLoading(true);
    try {
      const result = await serviceAPI.getBooking(id);
      if (result.success && result.data) {
        setBooking(result.data);
        
        if (result.data.worker_id) {
          const workerResult = await workerAPI.getWorker(result.data.worker_id);
          if (workerResult.success) {
            setWorker(workerResult.data);
          }
        }
      } else {
        toast.error("Failed to load booking details");
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error("Error loading booking:", error);
      toast.error("Failed to load booking details");
      navigate("/customer/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (newStatus: BookingStatus) => {
    if (!bookingId) return;

    try {
      const result = await serviceAPI.updateBooking(bookingId, { status: newStatus });
      if (result.success) {
        setBooking(prev => ({ ...prev, status: newStatus }));
        toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const cancelBooking = async () => {
    if (!bookingId) return;

    try {
      const result = await serviceAPI.updateBooking(bookingId, { status: 'cancelled' });
      if (result.success) {
        toast.success("Booking cancelled successfully");
        navigate("/customer/dashboard");
      } else {
        toast.error("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Finding Worker",
          description: "Searching for available service providers",
          color: "text-yellow-600"
        };
      case "assigned":
        return {
          label: "Worker Assigned",
          description: "A service provider has been assigned to your request",
          color: "text-blue-600"
        };
      case "in_progress":
        return {
          label: "Service In Progress",
          description: "Your service is currently being completed",
          color: "text-green-600"
        };
      case "completed":
        return {
          label: "Service Completed",
          description: "Your service has been completed successfully",
          color: "text-green-700"
        };
      case "cancelled":
        return {
          label: "Booking Cancelled",
          description: "This booking has been cancelled",
          color: "text-red-600"
        };
      default:
        return {
          label: "Unknown Status",
          description: "",
          color: "text-gray-600"
        };
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto animate-fade-in p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="w-full max-w-md mx-auto animate-fade-in p-6">
        <div className="text-center">
          <p className="text-red-600">Booking not found</p>
          <Button onClick={() => navigate("/customer/dashboard")} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusDisplay(booking.status);

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Service Tracking</h1>
      <p className="text-neutral-600 mb-6">Track your service request</p>
      
      {/* Status Card */}
      <Card className="p-4 mb-6 border-l-4 border-l-primary">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-semibold text-lg">{booking.service_type}</h2>
          <span className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
        </div>
        
        <p className="text-sm text-neutral-600 mb-4">{statusInfo.description}</p>
        
        {booking.status === "completed" && (
          <Button 
            onClick={() => navigate("/customer/review-service", { 
              state: { bookingId: booking.id, worker } 
            })}
            className="w-full mb-3"
            variant="outline"
          >
            <Star className="mr-2 w-4 h-4" />
            Rate & Review Service
          </Button>
        )}
      </Card>
      
      {/* Booking Details */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3">Booking Details</h3>
        <div className="space-y-2 text-sm">
          <div><strong>Service:</strong> {booking.service_type}</div>
          <div><strong>Booking ID:</strong> #{booking.id.slice(-8)}</div>
          {booking.description && (
            <div><strong>Description:</strong> {booking.description}</div>
          )}
          <div><strong>Address:</strong> {booking.address}</div>
          {booking.scheduled_date && (
            <div>
              <strong>Scheduled:</strong> {new Date(booking.scheduled_date).toLocaleDateString()} 
              {booking.scheduled_time && ` at ${booking.scheduled_time}`}
            </div>
          )}
          {booking.estimated_cost && (
            <div><strong>Estimated Cost:</strong> ₹{booking.estimated_cost}</div>
          )}
        </div>
      </Card>
      
      {/* Worker Details */}
      {worker && booking.status !== 'pending' && (
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-3">Service Provider</h3>
          
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-neutral-200 rounded-full mr-3 flex items-center justify-center">
              <User className="w-6 h-6 text-neutral-600" />
            </div>
            <div>
              <p className="font-medium">{worker.profiles?.full_name || 'Service Provider'}</p>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-sm">{worker.rating || '4.5'}</span>
              </div>
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-neutral-400 mr-2" />
                <span>{worker.profiles?.phone_number || 'Contact Number'}</span>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => window.open(`tel:${worker.profiles?.phone_number}`, '_self')}
              >
                Call
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-neutral-400 mr-2" />
                <span>Send Message</span>
              </div>
              <Button size="sm" variant="outline">
                Chat
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Real-time Location Tracking */}
      {worker && (booking.status === 'assigned' || booking.status === 'in_progress') && (
        <div className="mb-6">
          <LocationTracker
            bookingId={booking.id}
            workerId={worker.id}
            customerLocation={
              booking.latitude && booking.longitude
                ? { lat: booking.latitude, lng: booking.longitude }
                : undefined
            }
            onLocationUpdate={(location) => {
              console.log('Worker location updated:', location);
            }}
          />
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={() => toast.info("Support will contact you soon")}
          variant="outline"
          className="w-full"
        >
          Contact Support
        </Button>
        
        {booking.status !== "completed" && booking.status !== "cancelled" && (
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={cancelBooking}
          >
            Cancel Booking
          </Button>
        )}
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { serviceAPI } from "@/services/supabaseAPI";
import { toast } from "sonner";

export default function MyBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (user?.id) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const result = await serviceAPI.getBookings(user.id);
      if (result.success) {
        setBookings(result.data || []);
      } else {
        toast.error("Failed to load bookings");
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'assigned': return 'text-orange-600 bg-orange-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const handleBookingClick = (booking: any) => {
    if (booking.status === 'completed') {
      navigate("/customer/review-service", { 
        state: { bookingId: booking.id } 
      });
    } else if (booking.status !== 'cancelled') {
      navigate("/customer/tracking", { 
        state: { bookingId: booking.id } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">My Bookings</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'assigned', label: 'Assigned' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key)}
              className="whitespace-nowrap"
            >
              {label}
            </Button>
          ))}
        </div>

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
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card 
                key={booking.id} 
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleBookingClick(booking)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    {getStatusIcon(booking.status)}
                    <h3 className="font-semibold ml-2">{booking.service_type}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Booking ID:</strong> #{booking.id.slice(-8)}</p>
                  <p><strong>Date:</strong> {formatDate(booking.created_at)}</p>
                  {booking.address && (
                    <p><strong>Address:</strong> {booking.address}</p>
                  )}
                  {booking.estimated_cost && (
                    <p><strong>Estimated Cost:</strong> ₹{booking.estimated_cost}</p>
                  )}
                  {booking.final_cost && (
                    <p><strong>Final Cost:</strong> ₹{booking.final_cost}</p>
                  )}
                </div>

                {(booking.status === 'assigned' || booking.status === 'in_progress') && (
                  <Button size="sm" className="mt-3 w-full" variant="outline">
                    Track Service
                  </Button>
                )}

                {booking.status === 'completed' && (
                  <Button size="sm" className="mt-3 w-full" variant="outline">
                    Rate & Review
                  </Button>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500 mb-4">
              {filter === 'all' ? 'No bookings found' : `No ${filter} bookings found`}
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

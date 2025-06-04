
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings] = useState([
    {
      id: 1,
      service: "Plumbing Repair",
      worker: "Rajesh K",
      date: "2024-01-15",
      status: "completed",
      amount: 350,
      rating: 4.8,
      address: "123 Main St, Chennai"
    },
    {
      id: 2,
      service: "Electrical Work",
      worker: "Suresh M",
      date: "2024-01-10",
      status: "completed",
      amount: 450,
      rating: 4.6,
      address: "456 Park Ave, Chennai"
    },
    {
      id: 3,
      service: "AC Service",
      worker: "Kumar S",
      date: "2024-01-20",
      status: "in_progress",
      amount: 400,
      rating: null,
      address: "789 Garden St, Chennai"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{booking.service}</h3>
                  <p className="text-sm text-gray-600">Worker: {booking.worker}</p>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(booking.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {booking.address}
                </div>
                {booking.rating && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    Rating: {booking.rating}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">₹{booking.amount}</span>
                {booking.status === 'completed' && !booking.rating && (
                  <Button size="sm" variant="outline">
                    Rate Service
                  </Button>
                )}
                {booking.status === 'in_progress' && (
                  <Button size="sm" onClick={() => navigate('/customer/tracking')}>
                    Track
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation as useLocationContext } from "@/contexts/LocationContext";
import { serviceAPI } from "@/services/supabaseAPI";
import { 
  MapPin, Clock, User, Search, Bell, Wallet, Settings, 
  Shield, Phone, Wrench, Zap, Home, Car, Brush, Droplets, ChevronRight,
  Hammer, Sparkles, Bug, Snowflake, Refrigerator, Shirt
} from "lucide-react";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentLocation, getUserLocation } = useLocationContext();
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const services = [
    { 
      id: '1',
      name: "Home Cleaning", 
      price: "₹199 onwards", 
      rating: 4.8, 
      image: "🏠",
      route: "/customer/service-estimation",
      icon: Home,
      color: "text-blue-600"
    },
    { 
      id: '2',
      name: "Plumbing", 
      price: "₹149 onwards", 
      rating: 4.7, 
      image: "🔧",
      route: "/customer/plumbing-estimation",
      icon: Wrench,
      color: "text-blue-600"
    },
    { 
      id: '3',
      name: "Electrical", 
      price: "₹199 onwards", 
      rating: 4.9, 
      image: "⚡",
      route: "/customer/electrical-estimation",
      icon: Zap,
      color: "text-yellow-600"
    },
    { 
      id: '4',
      name: "Painting", 
      price: "₹299 onwards", 
      rating: 4.6, 
      image: "🎨",
      route: "/customer/service-estimation",
      icon: Brush,
      color: "text-purple-600"
    },
    { 
      id: '5',
      name: "Carpentry", 
      price: "₹249 onwards", 
      rating: 4.8, 
      image: "🔨",
      route: "/customer/carpentry-estimation",
      icon: Hammer,
      color: "text-orange-600"
    },
    { 
      id: '6',
      name: "AC Service", 
      price: "₹199 onwards", 
      rating: 4.9, 
      image: "❄️",
      route: "/customer/service-estimation",
      icon: Snowflake,
      color: "text-cyan-600"
    },
    { 
      id: '7',
      name: "Appliance Repair", 
      price: "₹179 onwards", 
      rating: 4.7, 
      image: "🔧",
      route: "/customer/service-estimation",
      icon: Wrench,
      color: "text-gray-600"
    },
    { 
      id: '8',
      name: "Pest Control", 
      price: "₹399 onwards", 
      rating: 4.8, 
      image: "🐛",
      route: "/customer/service-estimation",
      icon: Bug,
      color: "text-green-600"
    },
    { 
      id: '9',
      name: "Fridge Repair", 
      price: "₹199 onwards", 
      rating: 4.8, 
      image: "🧊",
      route: "/customer/service-estimation",
      icon: Refrigerator,
      color: "text-indigo-600"
    },
    { 
      id: '10',
      name: "Washing Machine", 
      price: "₹149 onwards", 
      rating: 4.7, 
      image: "👕",
      route: "/customer/service-estimation",
      icon: Shirt,
      color: "text-pink-600"
    }
  ];

  useEffect(() => {
    if (user?.id) {
      loadRecentBookings();
    }
    if (!currentLocation) {
      getUserLocation().catch(console.error);
    }
  }, [user, currentLocation, getUserLocation]);

  const loadRecentBookings = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const result = await serviceAPI.getBookings(user.id);
      if (result.success) {
        setRecentBookings(result.data?.slice(0, 3) || []);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (service: any) => {
    console.log("Service selected:", service);
    navigate(service.route, {
      state: {
        selectedService: service.name,
        serviceData: service
      }
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "emergency":
        navigate("/customer/emergency-support");
        break;
      case "track":
        if (recentBookings.length > 0) {
          const activeBooking = recentBookings.find(b => 
            b.status === 'assigned' || b.status === 'in_progress'
          );
          if (activeBooking) {
            navigate("/customer/tracking", { state: { bookingId: activeBooking.id } });
          } else {
            toast.info("No active bookings to track");
          }
        } else {
          toast.info("No bookings to track");
        }
        break;
      case "support":
        navigate("/customer/emergency-support");
        break;
      case "wallet":
        navigate("/customer/wallet");
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
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
      year: 'numeric'
    });
  };

  return (
    <div className="w-full pb-24 animate-fade-in">
      {/* Header */}
      <div className="bg-primary text-white p-6 rounded-b-3xl mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Hello, {user?.user_metadata?.full_name || 'Customer'}!
            </h1>
            <p className="opacity-90">What can we help you with today?</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white"
              onClick={() => navigate("/customer/notifications")}
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white"
              onClick={() => navigate("/customer/profile")}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {currentLocation && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 opacity-80" />
            <span className="text-sm opacity-90">
              Current location detected
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6 px-4">
        <Card 
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction("emergency")}
        >
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Emergency</h3>
              <p className="text-xs text-neutral-500">24/7 Support</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction("track")}
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Track Service</h3>
              <p className="text-xs text-neutral-500">Live Updates</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Services */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">All Services</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/customer/book-service")}
          >
            <Search className="w-4 h-4 mr-1" />
            Book Now
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.id}
                className="p-3 text-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleServiceClick(service)}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-100 p-2 rounded-full mb-2">
                    <IconComponent className={`w-5 h-5 ${service.color}`} />
                  </div>
                  <h3 className="font-medium text-xs mb-1">{service.name}</h3>
                  <p className="text-xs text-neutral-500">{service.price}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/customer/my-bookings")}
          >
            View All
          </Button>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : recentBookings.length > 0 ? (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <Card 
                key={booking.id} 
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/customer/tracking", { 
                  state: { bookingId: booking.id } 
                })}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{booking.service_type}</h3>
                    <p className="text-sm text-neutral-600 mb-2">
                      {formatDate(booking.created_at)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-neutral-500">No recent bookings</p>
            <Button 
              className="mt-3"
              onClick={() => navigate("/customer/book-service")}
            >
              Book Your First Service
            </Button>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-around">
          <Button variant="ghost" onClick={() => navigate("/customer/dashboard")}>
            <Home className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={() => navigate("/customer/my-bookings")}>
            <Clock className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={() => navigate("/customer/wallet")}>
            <Wallet className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={() => navigate("/customer/settings")}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

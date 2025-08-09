
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Book, HelpCircle, Wallet, Star, MapPin, CreditCard, Clock, Settings, Info, Gift, LogOut, Smartphone, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [profileData] = useState({
    name: "John Doe",
    phone: "+91 98765 43210",
    email: "john.doe@email.com",
    rating: 4.8,
    totalBookings: 12,
    memberSince: "January 2024"
  });

  const handleMenuClick = (item: string) => {
    switch (item) {
      case 'bookings':
        navigate('/customer/my-bookings');
        break;
      case 'devices':
        navigate('/customer/native-devices');
        break;
      case 'help':
        navigate('/customer/emergency-support');
        break;
      case 'wallet':
        navigate('/customer/wallet');
        break;
      case 'addresses':
        toast.info("Manage Addresses - Coming soon");
        break;
      case 'payment':
        navigate('/customer/payment-methods');
        break;
      case 'billing':
        navigate('/customer/billing-history');
        break;
      case 'settings':
        navigate('/customer/settings');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'rating':
        navigate('/customer/my-ratings');
        break;
      case 'refer':
        toast.success("Referral link copied to clipboard!");
        break;
      case 'logout':
        toast.success("Logged out successfully");
        navigate('/');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex flex-col items-center text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => navigate('/customer/edit-profile')}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <h2 className="text-xl font-semibold">{profileData.name}</h2>
              <p className="text-sm text-gray-600">Member since {profileData.memberSince}</p>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleMenuClick('bookings')}
            >
              <div className="flex flex-col items-center text-center">
                <Book className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm font-medium">My Bookings</span>
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleMenuClick('devices')}
            >
              <div className="flex flex-col items-center text-center">
                <Smartphone className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm font-medium">Native Devices</span>
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleMenuClick('help')}
            >
              <div className="flex flex-col items-center text-center">
                <HelpCircle className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm font-medium">Help & Support</span>
              </div>
            </Card>
          </div>

          {/* Menu Items */}
          <Card className="p-4">
            <div className="space-y-1">
              <div 
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleMenuClick('wallet')}
              >
                <Wallet className="w-5 h-5 text-gray-600 mr-3" />
                <span className="flex-1">Wallet</span>
                <span className="text-gray-400">›</span>
              </div>

              <div 
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleMenuClick('rating')}
              >
                <Star className="w-5 h-5 text-gray-600 mr-3" />
                <span className="flex-1">My Rating</span>
                <span className="text-sm text-gray-500 mr-2">{profileData.rating}</span>
                <span className="text-gray-400">›</span>
              </div>

              <div 
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleMenuClick('addresses')}
              >
                <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                <span className="flex-1">Manage Addresses</span>
                <span className="text-gray-400">›</span>
              </div>

              <div 
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleMenuClick('payment')}
              >
                <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                <span className="flex-1">Manage Payment Methods</span>
                <span className="text-gray-400">›</span>
              </div>

              <div 
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleMenuClick('billing')}
              >
                <Clock className="w-5 h-5 text-gray-600 mr-3" />
                <span className="flex-1">Billing History</span>
                <span className="text-gray-400">›</span>
              </div>

              <div 
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleMenuClick('settings')}
              >
                <Settings className="w-5 h-5 text-gray-600 mr-3" />
                <span className="flex-1">Settings</span>
                <span className="text-gray-400">›</span>
              </div>

              <div 
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleMenuClick('about')}
              >
                <Info className="w-5 h-5 text-gray-600 mr-3" />
                <span className="flex-1">About</span>
                <span className="text-gray-400">›</span>
              </div>
            </div>
          </Card>

          {/* Refer & Earn */}
          <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div 
              className="cursor-pointer"
              onClick={() => handleMenuClick('refer')}
            >
              <div className="flex items-center mb-2">
                <Gift className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">Refer & Earn 400 Fixsify Coins</span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                When your friend completes their first booking
              </p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                Refer Now
              </Button>
            </div>
          </Card>

          {/* Logout */}
          <Card className="p-4">
            <div 
              className="flex items-center p-3 rounded-lg hover:bg-red-50 cursor-pointer text-red-600"
              onClick={() => handleMenuClick('logout')}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="flex-1">Logout</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

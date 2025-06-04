
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Receipt, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { serviceAPI } from "@/services/supabaseAPI";
import { toast } from "sonner";

export default function BillingHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadBillingHistory();
    }
  }, [user]);

  const loadBillingHistory = async () => {
    setLoading(true);
    try {
      // Get completed bookings with final costs
      const result = await serviceAPI.getBookings(user?.id);
      if (result.success) {
        const completedBookings = result.data?.filter(booking => 
          booking.status === 'completed' && booking.final_cost
        ) || [];
        setBillingHistory(completedBookings);
      }
    } catch (error) {
      console.error("Error loading billing history:", error);
      toast.error("Failed to load billing history");
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

  const calculateTotal = () => {
    return billingHistory.reduce((total, bill) => total + (bill.final_cost || 0), 0);
  };

  const downloadInvoice = (billId: string) => {
    // In a real app, this would generate and download a PDF invoice
    toast.info("Invoice download feature will be implemented soon");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Billing History</h1>
        </div>

        {/* Summary Card */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Total Spent</h2>
            <p className="text-3xl font-bold">₹{calculateTotal()}</p>
            <p className="text-sm opacity-90 mt-1">
              {billingHistory.length} completed services
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
        ) : billingHistory.length > 0 ? (
          <div className="space-y-4">
            {billingHistory.map((bill) => (
              <Card key={bill.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Receipt className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <h3 className="font-semibold">{bill.service_type}</h3>
                      <p className="text-sm text-gray-600">
                        Invoice #{bill.id.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{bill.final_cost}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(bill.updated_at)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  {bill.address && (
                    <p><strong>Address:</strong> {bill.address}</p>
                  )}
                  <p><strong>Payment Status:</strong> <span className="text-green-600">Paid</span></p>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => downloadInvoice(bill.id)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate("/customer/tracking", { 
                      state: { bookingId: bill.id } 
                    })}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No billing history found</p>
            <Button onClick={() => navigate("/customer/book-service")}>
              Book Your First Service
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

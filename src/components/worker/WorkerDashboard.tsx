
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  Bell, Wallet, Clock, Settings, AlertCircle, ChevronDown, ChevronUp, 
  TrendingUp, Calculator, FileText, Headphones 
} from "lucide-react";

export default function WorkerDashboard() {
  const [available, setAvailable] = useState(false);
  const [hasPayment, setHasPayment] = useState(false);
  const [isWalletExpanded, setIsWalletExpanded] = useState(false);
  const navigate = useNavigate();
  
  // Simulated job notification
  const [showJobNotification, setShowJobNotification] = useState(false);
  
  const handleAvailabilityChange = (checked: boolean) => {
    setAvailable(checked);
    console.log("Availability changed to:", checked);
    
    if (checked) {
      toast.success("You are now available for jobs");
      
      // Simulate job notification after a few seconds
      setTimeout(() => {
        console.log("Showing job notification");
        setShowJobNotification(true);
      }, 3000);
    } else {
      toast.info("You are now offline");
      setShowJobNotification(false);
    }
  };
  
  const handleAcceptJob = () => {
    console.log("Job accept clicked, hasPayment:", hasPayment);
    
    if (!hasPayment) {
      // Show payment required modal
      toast.error("Payment method required to accept jobs");
      navigate("/worker/payment");
      return;
    }
    
    // Simulate accepting job
    setShowJobNotification(false);
    toast.success("Job accepted! Customer details available.");
    navigate("/worker/job-details");
  };
  
  const handleRejectJob = () => {
    console.log("Job rejected");
    setShowJobNotification(false);
    toast.info("Job rejected");
  };

  const handleQuickAction = (action: string) => {
    console.log("Quick action clicked:", action);
    switch (action) {
      case "job-alerts":
        toast.info("Job alerts feature coming soon!");
        break;
      case "job-history":
        toast.info("Job history feature coming soon!");
        break;
      case "payment":
        navigate("/worker/payment");
        break;
      case "settings":
        toast.info("Settings feature coming soon!");
        break;
      case "estimation-check":
        toast.info("Opening estimation check interface...");
        navigate("/worker/estimation-check");
        break;
      case "bill-generation":
        toast.info("Opening bill generation interface...");
        navigate("/worker/bill-generation");
        break;
      case "customer-support":
        toast.info("Connecting to customer support...");
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full pb-24 animate-fade-in">
      <div className="bg-primary text-white p-6 rounded-b-3xl mb-6">
        <h1 className="text-2xl font-bold mb-1">Worker Dashboard</h1>
        <p className="opacity-90">Welcome back, Worker</p>
      </div>
      
      {/* Job Notification */}
      {showJobNotification && (
        <Card className="mb-6 p-4 border-2 border-accent animate-pulse-smooth">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-accent mr-2" />
              <h3 className="font-semibold">New Job Request</h3>
            </div>
            <div className="bg-neutral-100 px-2 py-1 rounded-full text-xs font-medium">
              2.5 km away
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-sm mb-1"><strong>Service:</strong> Plumbing Repair</p>
            <p className="text-sm mb-1"><strong>Location:</strong> Adyar, Chennai</p>
            <p className="text-sm mb-1"><strong>Time:</strong> Now</p>
            <p className="text-sm text-neutral-300">Respond within <span className="text-destructive font-medium">1:00</span> minute</p>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="destructive" 
              onClick={handleRejectJob}
              className="flex-1"
            >
              Reject
            </Button>
            <Button 
              onClick={handleAcceptJob}
              className="flex-1"
            >
              Accept
            </Button>
          </div>
        </Card>
      )}
      
      {/* Availability Status */}
      <Card className="mb-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Availability Status</h3>
            <p className="text-neutral-300 text-sm">
              {available ? "You are available for work" : "You are currently offline"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="availability-mode" className="sr-only">
              Available for work
            </Label>
            <Switch
              id="availability-mode"
              checked={available}
              onCheckedChange={handleAvailabilityChange}
            />
          </div>
        </div>
      </Card>
      
      <h2 className="font-semibold mb-3">Quick Actions</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card 
          className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction("job-alerts")}
        >
          <div className="bg-neutral-100 p-3 rounded-full mb-2">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium">Job Alerts</h3>
        </Card>
        
        <Card 
          className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction("job-history")}
        >
          <div className="bg-neutral-100 p-3 rounded-full mb-2">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium">Job History</h3>
        </Card>
        
        <Card 
          className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction("estimation-check")}
        >
          <div className="bg-neutral-100 p-3 rounded-full mb-2">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium">Estimation Check</h3>
        </Card>
        
        <Card 
          className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction("bill-generation")}
        >
          <div className="bg-neutral-100 p-3 rounded-full mb-2">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium">Bill Generation</h3>
        </Card>
        
        <Card 
          className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction("payment")}
        >
          <div className="bg-neutral-100 p-3 rounded-full mb-2">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium">Payment</h3>
        </Card>
        
        <Card 
          className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleQuickAction("customer-support")}
        >
          <div className="bg-neutral-100 p-3 rounded-full mb-2">
            <Headphones className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium">Customer Support</h3>
        </Card>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full mb-6"
        onClick={() => navigate("/")}
      >
        Sign Out
      </Button>

      {/* Fixed Wallet Box at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Card 
          className="cursor-pointer transition-all duration-300"
          onClick={() => setIsWalletExpanded(!isWalletExpanded)}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="w-5 h-5 text-primary mr-2" />
                <div>
                  <h3 className="font-semibold text-sm">Earnings</h3>
                  <p className="text-xs text-neutral-300">Today's earnings</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold">₹0.00</span>
                {isWalletExpanded ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronUp className="w-4 h-4 ml-2" />}
              </div>
            </div>
            
            {isWalletExpanded && (
              <div className="mt-4 space-y-3 animate-slide-in">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-xs text-neutral-300">This Week</p>
                    <p className="font-bold text-green-600">₹0.00</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-xs text-neutral-300">This Month</p>
                    <p className="font-bold text-blue-600">₹0.00</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="flex-1 text-xs">
                    <Clock className="w-4 h-4 mr-1" />
                    History
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

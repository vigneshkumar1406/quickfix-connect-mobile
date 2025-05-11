
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Bell, Wallet, Clock, Settings, AlertCircle } from "lucide-react";

export default function WorkerDashboard() {
  const [available, setAvailable] = useState(false);
  const [hasPayment, setHasPayment] = useState(false);
  const navigate = useNavigate();
  
  // Simulated job notification
  const [showJobNotification, setShowJobNotification] = useState(false);
  
  const handleAvailabilityChange = (checked: boolean) => {
    setAvailable(checked);
    
    if (checked) {
      toast.success("You are now available for jobs");
      
      // Simulate job notification after a few seconds
      setTimeout(() => {
        setShowJobNotification(true);
      }, 3000);
    } else {
      toast.info("You are now offline");
      setShowJobNotification(false);
    }
  };
  
  const handleAcceptJob = () => {
    if (!hasPayment) {
      // Show payment required modal
      navigate("/worker/payment");
      return;
    }
    
    // Simulate accepting job
    setShowJobNotification(false);
    toast.success("Job accepted! Customer details available.");
    navigate("/worker/job-details");
  };
  
  const handleRejectJob = () => {
    setShowJobNotification(false);
    toast.info("Job rejected");
  };

  return (
    <div className="w-full pb-6 animate-fade-in">
      <div className="bg-primary text-white p-6 rounded-b-3xl mb-6">
        <h1 className="text-2xl font-bold mb-1">Worker Dashboard</h1>
        <p className="opacity-90">Welcome back, Worker</p>
        
        <div className="mt-6 bg-white/10 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white text-primary p-2 rounded-full mr-3">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm opacity-90">Earnings</p>
              <p className="font-bold">₹0.00</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="text-primary">
            View
          </Button>
        </div>
      </div>
      
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
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-neutral-100 p-3 rounded-full mb-2">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium">Job Alerts</h3>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-neutral-100 p-3 rounded-full mb-2">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium">Job History</h3>
        </Card>
        
        <Card 
          className="p-4 flex flex-col items-center justify-center text-center cursor-pointer"
          onClick={() => navigate("/worker/payment")}
        >
          <div className="bg-neutral-100 p-3 rounded-full mb-2">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium">Payment</h3>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-neutral-100 p-3 rounded-full mb-2">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium">Settings</h3>
        </Card>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => navigate("/")}
      >
        Sign Out
      </Button>
    </div>
  );
}

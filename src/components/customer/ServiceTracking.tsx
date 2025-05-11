
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Phone, MapPin, Star, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ServiceTracking() {
  const navigate = useNavigate();
  const [serviceStatus, setServiceStatus] = useState("arriving");
  
  // Simulated worker data
  const worker = {
    name: "Raj Kumar",
    rating: 4.8,
    phone: "+91 ••• ••• 4567",
    arrivalTime: "10 mins",
    serviceType: "Plumbing",
  };
  
  const handleCallWorker = () => {
    toast.info("Calling worker...");
  };
  
  const handleChatWithWorker = () => {
    toast.info("Chat initiated with worker");
  };
  
  const handleServiceComplete = () => {
    // In a real app, this would be triggered by the worker completing the service
    navigate("/customer/review");
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="bg-primary text-white p-6 rounded-b-3xl mb-6">
        <h1 className="text-2xl font-bold mb-1">Service Tracking</h1>
        <p className="opacity-90">{worker.serviceType} Service</p>
      </div>
      
      <Card className="mb-6 p-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mr-3">
            {worker.name[0]}
          </div>
          
          <div>
            <h2 className="font-semibold">{worker.name}</h2>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
              <span className="text-sm">{worker.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-neutral-300 mr-2" />
              <span>{worker.phone}</span>
            </div>
            <Button size="sm" variant="outline" onClick={handleCallWorker}>
              Call
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-neutral-300 mr-2" />
              <span>
                {serviceStatus === "arriving" 
                  ? `Arriving in ${worker.arrivalTime}`
                  : "Working on service"}
              </span>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleChatWithWorker}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="mb-6 p-4">
        <h2 className="font-semibold mb-3">Service Progress</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Service Request</span>
              <span>✓</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Worker Assigned</span>
              <span>✓</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Worker Arrival</span>
              <span>{serviceStatus === "arriving" ? "On the way" : "✓"}</span>
            </div>
            <Progress 
              value={serviceStatus === "arriving" ? 60 : 100} 
              className="h-2" 
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Service Completion</span>
              <span>Pending</span>
            </div>
            <Progress 
              value={serviceStatus === "arriving" ? 0 : 50} 
              className="h-2" 
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Payment</span>
              <span>Pending</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </div>
      </Card>
      
      <div className="h-48 bg-neutral-100 mb-6 rounded-lg flex items-center justify-center">
        <p className="text-neutral-300">Map View</p>
      </div>
      
      {/* This button is just for demo purposes to navigate to the review page */}
      <Button 
        onClick={handleServiceComplete} 
        className="w-full"
      >
        Demo: Complete Service & Review
      </Button>
    </div>
  );
}

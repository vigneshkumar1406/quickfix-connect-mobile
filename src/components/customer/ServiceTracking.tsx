
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { Phone, MapPin, MessageCircle, Clock, Star, ThumbsUp } from "lucide-react";

export default function ServiceTracking() {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState("accepted");
  const [timeRemaining, setTimeRemaining] = useState(10);
  
  // Mock service data - in a real app, this would come from an API
  const serviceData = {
    serviceType: "Plumbing Repair",
    issue: "Leaking tap",
    workerName: "Rajesh K",
    workerRating: 4.8,
    location: "Adyar, Chennai",
    estimatedTime: "15 min",
    contactNumber: "+91 9876 543 210"
  };
  
  // Simulate service progress
  useEffect(() => {
    // Only run the timer if status is "on_the_way"
    if (currentStatus === "on_the_way") {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setCurrentStatus("arrived");
            clearInterval(timer);
            toast.success("Worker has arrived!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentStatus]);
  
  // Handlers for status update
  const handleStartService = () => {
    setCurrentStatus("in_progress");
    toast.info("Service has started");
  };
  
  const handleCompleteService = () => {
    setCurrentStatus("completed");
    toast.success("Service completed successfully!");
    // In a real app, we would update the backend here
  };
  
  // Handler for worker arrival simulation
  const simulateWorkerArrival = () => {
    setCurrentStatus("on_the_way");
    toast.info("Worker is on the way!");
  };
  
  const getStatusDisplay = () => {
    switch (currentStatus) {
      case "accepted":
        return {
          label: "Service Accepted",
          description: "Worker has accepted your service request",
          color: "text-primary"
        };
      case "on_the_way":
        return {
          label: "On the Way",
          description: `Arriving in approximately ${timeRemaining} minutes`,
          color: "text-accent"
        };
      case "arrived":
        return {
          label: "Worker Arrived",
          description: "Worker has arrived at your location",
          color: "text-accent"
        };
      case "in_progress":
        return {
          label: "In Progress",
          description: "Your service is currently in progress",
          color: "text-primary"
        };
      case "completed":
        return {
          label: "Completed",
          description: "Your service has been completed",
          color: "text-green-500"
        };
      default:
        return {
          label: "Unknown Status",
          description: "",
          color: "text-neutral-500"
        };
    }
  };
  
  const status = getStatusDisplay();

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Service Tracking</h1>
      <p className="text-neutral-300 mb-6">Live updates for your service</p>
      
      <Card className="p-4 mb-6 border-l-4" style={{ borderLeftColor: currentStatus === "completed" ? "#10b981" : "#2563eb" }}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-semibold text-lg">{serviceData.serviceType}</h2>
          <span className={`font-medium ${status.color}`}>{status.label}</span>
        </div>
        
        <p className="text-sm text-neutral-300 mb-4">{status.description}</p>
        
        {(currentStatus === "accepted") && (
          <Button 
            onClick={simulateWorkerArrival} 
            className="w-full mb-3"
          >
            Simulate Worker En Route
          </Button>
        )}
        
        {(currentStatus === "arrived") && (
          <Button 
            onClick={handleStartService} 
            className="w-full mb-3"
          >
            Start Service
          </Button>
        )}
        
        {(currentStatus === "in_progress") && (
          <Button 
            onClick={handleCompleteService} 
            className="w-full mb-3"
          >
            Complete Service
          </Button>
        )}
        
        {(currentStatus === "completed") && (
          <Button 
            onClick={() => navigate("/customer/review")} 
            className="w-full mb-3"
            variant="outline"
          >
            <Star className="mr-2 w-4 h-4" />
            Rate Service
          </Button>
        )}
      </Card>
      
      <div className="h-48 bg-neutral-100 mb-6 rounded-lg flex items-center justify-center">
        <p className="text-neutral-300">Live Location Map</p>
      </div>
      
      <Card className="p-4 mb-6">
        <h2 className="font-semibold mb-3">Worker Details</h2>
        
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-neutral-100 rounded-full mr-3 flex items-center justify-center">
            {serviceData.workerName.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{serviceData.workerName}</p>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm">{serviceData.workerRating}</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-neutral-300 mr-2" />
              <span>{serviceData.contactNumber}</span>
            </div>
            <Button size="sm" variant="outline">
              Call
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 text-neutral-300 mr-2" />
              <span>Send Message</span>
            </div>
            <Button size="sm" variant="outline">
              Chat
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-neutral-300 mr-2" />
              <span>{serviceData.location}</span>
            </div>
            <Button size="sm" variant="outline">
              Map
            </Button>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-neutral-300 mr-2" />
            <span>ETA: {currentStatus === "on_the_way" ? `${timeRemaining} min` : serviceData.estimatedTime}</span>
          </div>
        </div>
      </Card>
      
      <div className="space-y-3">
        <Button 
          onClick={() => toast.info("Support will contact you soon")}
          variant="outline"
          className="w-full"
        >
          Contact Support
        </Button>
        
        {currentStatus !== "completed" && (
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => {
              toast.error("Service cancelled");
              navigate("/customer/dashboard");
            }}
          >
            Cancel Service
          </Button>
        )}
      </div>
    </div>
  );
}

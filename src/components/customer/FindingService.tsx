
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function FindingService() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Finding nearby workers");
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  
  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
      
      // Update status messages
      if (progress < 30) {
        setStatusMessage("Finding nearby workers");
      } else if (progress < 60) {
        setStatusMessage("Sending service requests");
      } else if (progress < 90) {
        setStatusMessage("Waiting for worker confirmation");
      } else {
        setStatusMessage("Worker found! Connecting you");
        
        // Navigate to service tracking after a delay
        if (progress >= 98) {
          setTimeout(() => {
            navigate("/customer/tracking");
          }, 1500);
        }
      }
    }, 300);
    
    // Countdown timer
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [progress, navigate]);
  
  const handleCancel = () => {
    toast.info("Service request cancelled");
    navigate("/customer/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="rounded-full bg-primary/10 p-5 mb-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{statusMessage}</h1>
          <p className="text-neutral-300">
            {progress < 100
              ? `Please wait while we connect you with a professional`
              : `Found a worker! Connecting you now`}
          </p>
        </div>
        
        <div className="w-full mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-neutral-300">Searching</span>
            <span className="text-xs text-neutral-300">
              {secondsRemaining > 0 ? `${secondsRemaining}s` : "Done!"}
            </span>
          </div>
        </div>
        
        {progress < 100 && (
          <Button 
            variant="outline"
            onClick={handleCancel}
            className="w-full"
          >
            Cancel Request
          </Button>
        )}
      </div>
    </div>
  );
}

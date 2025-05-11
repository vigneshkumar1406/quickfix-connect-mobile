
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { Phone, MapPin, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function WorkerJobDetails() {
  const navigate = useNavigate();
  const [jobCompleted, setJobCompleted] = useState(false);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  
  const handleCompleteJob = () => {
    setJobCompleted(true);
    toast.success("Job marked as complete");
  };
  
  const handleSubmitBill = () => {
    if (!amount) {
      toast.error("Please enter the bill amount");
      return;
    }
    
    toast.success("Bill sent to customer");
    navigate("/worker/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">{jobCompleted ? "Submit Bill" : "Job Details"}</h1>
      <p className="text-neutral-300 mb-6">
        {jobCompleted ? "Enter the bill details" : "Customer and job information"}
      </p>
      
      {!jobCompleted ? (
        <>
          <Card className="p-4 mb-6">
            <h2 className="font-semibold mb-4">Customer Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-neutral-300 mr-2" />
                  <span>+91 ••• ••• 1234</span>
                </div>
                <Button size="sm" variant="outline">
                  Call
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-neutral-300 mr-2" />
                  <span>Adyar, Chennai</span>
                </div>
                <Button size="sm" variant="outline">
                  Map
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 mb-6">
            <h2 className="font-semibold mb-4">Job Information</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-300">Service Type:</span>
                <span className="font-medium">Plumbing Repair</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-neutral-300">Issue:</span>
                <span className="font-medium">Leaking tap</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-neutral-300">Requested Time:</span>
                <span className="font-medium">Immediate</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-neutral-300">Status:</span>
                <span className="text-accent font-medium">In Progress</span>
              </div>
            </div>
          </Card>
          
          <div className="h-48 bg-neutral-100 mb-6 rounded-lg flex items-center justify-center">
            <p className="text-neutral-300">Map View</p>
          </div>
          
          <Button 
            onClick={handleCompleteJob} 
            className="w-full"
          >
            <CheckCircle className="mr-2 w-5 h-5" />
            Mark Job as Complete
          </Button>
        </>
      ) : (
        <Card className="p-4 mb-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-type">Service Type</Label>
              <Input id="service-type" defaultValue="Plumbing Repair" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Bill Amount (₹)</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="Enter amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any notes about the service" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
              />
            </div>
            
            <Button 
              onClick={handleSubmitBill} 
              className="w-full"
            >
              Send Bill to Customer
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

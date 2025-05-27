
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Calculator, CheckCircle, Clock, FileText, 
  User, MapPin, Phone, AlertCircle, Edit
} from "lucide-react";
import { toast } from "sonner";
import BackButton from "../BackButton";

interface EstimationRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  address: string;
  description: string;
  estimatedCost: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  urgency: 'low' | 'medium' | 'high';
}

export default function WorkerEstimationCheck() {
  const navigate = useNavigate();
  const [estimationRequests, setEstimationRequests] = useState<EstimationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<EstimationRequest | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    setEstimationRequests([
      {
        id: "1",
        customerName: "John Doe",
        customerPhone: "+91 98765 43210",
        service: "Plumbing Repair",
        address: "123 Main St, Adyar, Chennai - 600020",
        description: "Leaky faucet in kitchen, needs immediate attention",
        estimatedCost: 800,
        status: "pending",
        requestedAt: "2024-01-15T10:30:00Z",
        urgency: "high"
      },
      {
        id: "2",
        customerName: "Jane Smith",
        customerPhone: "+91 87654 32109",
        service: "Electrical Work",
        address: "456 Oak Avenue, T. Nagar, Chennai - 600017",
        description: "Installation of ceiling fan in bedroom",
        estimatedCost: 1200,
        status: "pending",
        requestedAt: "2024-01-15T09:15:00Z",
        urgency: "medium"
      },
      {
        id: "3",
        customerName: "Mike Johnson",
        customerPhone: "+91 76543 21098",
        service: "AC Service",
        address: "789 Pine Road, Velachery, Chennai - 600042",
        description: "AC not cooling properly, regular maintenance required",
        estimatedCost: 600,
        status: "approved",
        requestedAt: "2024-01-14T15:45:00Z",
        urgency: "low"
      }
    ]);
  }, []);

  const handleViewDetails = (request: EstimationRequest) => {
    setSelectedRequest(request);
  };

  const handleApproveEstimation = (requestId: string) => {
    setEstimationRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' } : req
      )
    );
    toast.success("Estimation approved successfully!");
    setSelectedRequest(null);
  };

  const handleRejectEstimation = (requestId: string) => {
    setEstimationRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' } : req
      )
    );
    toast.info("Estimation rejected");
    setSelectedRequest(null);
  };

  const handleModifyEstimation = (requestId: string) => {
    toast.info("Opening estimation editor...");
    navigate(`/worker/estimation-edit/${requestId}`);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (selectedRequest) {
    return (
      <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => setSelectedRequest(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Estimation Details</h1>
        
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{selectedRequest.service}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(selectedRequest.urgency)}`}>
                {selectedRequest.urgency.toUpperCase()}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">{selectedRequest.customerName}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">{selectedRequest.customerPhone}</span>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                <span className="text-sm">{selectedRequest.address}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-gray-600">{selectedRequest.description}</p>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Cost</span>
                <span className="text-xl font-bold text-primary">₹{selectedRequest.estimatedCost}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm">
                Requested {new Date(selectedRequest.requestedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
        
        {selectedRequest.status === 'pending' && (
          <div className="space-y-3">
            <Button 
              onClick={() => handleApproveEstimation(selectedRequest.id)}
              className="w-full"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Estimation
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => handleModifyEstimation(selectedRequest.id)}
              className="w-full"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modify Estimation
            </Button>
            
            <Button 
              variant="destructive"
              onClick={() => handleRejectEstimation(selectedRequest.id)}
              className="w-full"
            >
              Reject Estimation
            </Button>
          </div>
        )}
        
        {selectedRequest.status !== 'pending' && (
          <Card className="p-4">
            <div className={`flex items-center justify-center p-3 rounded-lg ${getStatusColor(selectedRequest.status)}`}>
              <span className="font-medium capitalize">
                Estimation {selectedRequest.status}
              </span>
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Estimation Requests</h1>
      <p className="text-neutral-300 mb-6">Review and approve customer estimation requests</p>
      
      <div className="space-y-4">
        {estimationRequests.map((request) => (
          <Card key={request.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{request.service}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status.toUpperCase()}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{request.customerName}</span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">₹{request.estimatedCost}</span>
                <span className="text-xs text-gray-500">
                  {new Date(request.requestedAt).toLocaleDateString()}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleViewDetails(request)}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </Card>
        ))}
        
        {estimationRequests.length === 0 && (
          <Card className="p-8 text-center">
            <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold mb-2">No Estimation Requests</h3>
            <p className="text-sm text-gray-600">
              You'll see customer estimation requests here when they're submitted.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

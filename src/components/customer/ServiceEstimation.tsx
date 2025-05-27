
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, Calculator, Clock, Users, MapPin, 
  FileText, Send, CheckCircle, AlertCircle 
} from "lucide-react";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EstimationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function ServiceEstimation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [estimationItems, setEstimationItems] = useState<EstimationItem[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [laborCost, setLaborCost] = useState(0);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [billCreated, setBillCreated] = useState(false);

  useEffect(() => {
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
      
      // Pre-populate with basic service estimation
      const serviceType = location.state.bookingDetails.service;
      const baseEstimation = getBaseEstimation(serviceType);
      setEstimationItems(baseEstimation);
      setLaborCost(getBaseLaborCost(serviceType));
    }
  }, [location.state]);

  const getBaseEstimation = (serviceType: string): EstimationItem[] => {
    const estimations: Record<string, EstimationItem[]> = {
      "Plumbing": [
        { id: "1", description: "Basic plumbing inspection", quantity: 1, unitPrice: 200, total: 200 },
        { id: "2", description: "Material cost (estimated)", quantity: 1, unitPrice: 300, total: 300 }
      ],
      "Electrical": [
        { id: "1", description: "Electrical diagnosis", quantity: 1, unitPrice: 250, total: 250 },
        { id: "2", description: "Basic repair materials", quantity: 1, unitPrice: 200, total: 200 }
      ],
      "Home Cleaning": [
        { id: "1", description: "Standard cleaning service", quantity: 1, unitPrice: 500, total: 500 },
        { id: "2", description: "Cleaning supplies", quantity: 1, unitPrice: 100, total: 100 }
      ],
      "AC Service": [
        { id: "1", description: "AC cleaning and maintenance", quantity: 1, unitPrice: 800, total: 800 },
        { id: "2", description: "Filter replacement", quantity: 1, unitPrice: 200, total: 200 }
      ]
    };

    return estimations[serviceType] || [
      { id: "1", description: "Service inspection", quantity: 1, unitPrice: 200, total: 200 },
      { id: "2", description: "Basic materials", quantity: 1, unitPrice: 150, total: 150 }
    ];
  };

  const getBaseLaborCost = (serviceType: string): number => {
    const laborCosts: Record<string, number> = {
      "Plumbing": 400,
      "Electrical": 500,
      "Home Cleaning": 300,
      "AC Service": 600,
      "Carpentry": 450,
      "Painting": 350
    };

    return laborCosts[serviceType] || 350;
  };

  const addEstimationItem = () => {
    const newItem: EstimationItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setEstimationItems([...estimationItems, newItem]);
  };

  const updateEstimationItem = (id: string, field: keyof EstimationItem, value: any) => {
    setEstimationItems(items => 
      items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const removeEstimationItem = (id: string) => {
    setEstimationItems(items => items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return estimationItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() + laborCost) * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + laborCost + calculateTax();
  };

  const handleCreateBill = async () => {
    if (estimationItems.some(item => !item.description.trim())) {
      toast.error("Please fill in all item descriptions");
      return;
    }

    setIsCreatingBill(true);

    try {
      // Simulate bill creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const billData = {
        bookingDetails,
        estimationItems,
        laborCost,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        additionalNotes,
        createdAt: new Date().toISOString(),
        billNumber: `QB${Date.now()}`
      };

      // Store bill data (in real app, send to backend)
      localStorage.setItem('quickfix_latest_bill', JSON.stringify(billData));

      setBillCreated(true);
      toast.success("Bill created and sent successfully!");

      // Send to customer and admin (simulate)
      setTimeout(() => {
        toast.success("Bill sent to customer via SMS/Email");
      }, 1000);

      setTimeout(() => {
        toast.success("Bill sent to administrator");
      }, 2000);

    } catch (error) {
      toast.error("Failed to create bill. Please try again.");
    } finally {
      setIsCreatingBill(false);
    }
  };

  const handleProceedToBooking = () => {
    const estimationData = {
      ...bookingDetails,
      estimation: {
        items: estimationItems,
        laborCost,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        additionalNotes
      }
    };

    navigate("/customer/finding-service", { state: { bookingDetails: estimationData } });
  };

  if (!bookingDetails) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <h2 className="text-xl font-bold mb-2">No Booking Details</h2>
        <p className="text-gray-600 mb-4">Please select a service first</p>
        <Button onClick={() => navigate("/customer/book-service")}>
          Book a Service
        </Button>
      </div>
    );
  }

  if (billCreated) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center animate-fade-in">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-bold mb-2">Bill Created Successfully!</h2>
        <p className="text-gray-600 mb-6">
          The bill has been sent to the customer and administrator.
        </p>
        <div className="space-y-3">
          <Button onClick={handleProceedToBooking} className="w-full">
            Proceed with Booking
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/customer/dashboard")}
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Service Estimation</h1>
      <p className="text-neutral-300 mb-6">Create detailed estimate for the service</p>

      {/* Service Details */}
      <Card className="p-4 mb-4">
        <h3 className="font-semibold mb-2 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Service Details
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{bookingDetails.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium capitalize">{bookingDetails.bookingType}</span>
          </div>
          <div className="flex items-start justify-between">
            <span className="text-gray-600">Address:</span>
            <span className="font-medium text-right max-w-48 text-xs">{bookingDetails.address}</span>
          </div>
        </div>
      </Card>

      {/* Estimation Items */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Estimation Breakdown</h3>
          <Button size="sm" variant="outline" onClick={addEstimationItem}>
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {estimationItems.map((item, index) => (
            <div key={item.id} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Item {index + 1}</Label>
                {estimationItems.length > 1 && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => removeEstimationItem(item.id)}
                    className="text-red-500 h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                )}
              </div>
              
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateEstimationItem(item.id, 'description', e.target.value)}
                className="text-sm"
              />
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateEstimationItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Price</Label>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateEstimationItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Total</Label>
                  <Input
                    value={`₹${item.total}`}
                    readOnly
                    className="text-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Labor Cost */}
        <div className="mt-4 pt-3 border-t">
          <div className="flex items-center justify-between">
            <Label>Labor Cost</Label>
            <Input
              type="number"
              value={laborCost}
              onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
              className="w-24 text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Bill Summary */}
      <Card className="p-4 mb-4">
        <h3 className="font-semibold mb-3">Bill Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Labor Cost:</span>
            <span>₹{laborCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (18% GST):</span>
            <span>₹{calculateTax().toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total:</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Additional Notes */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-2 block">Additional Notes</Label>
        <Textarea
          placeholder="Add any additional notes or terms..."
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={handleCreateBill} 
          disabled={isCreatingBill}
          className="w-full"
        >
          {isCreatingBill ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Creating Bill...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Create & Send Bill
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleProceedToBooking}
          className="w-full"
        >
          Skip Estimation & Book Now
        </Button>
      </div>
    </div>
  );
}

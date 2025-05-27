
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  FileText, Send, CheckCircle, User, MapPin, Phone, 
  Calculator, Clock, Plus, Minus, Edit
} from "lucide-react";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface JobDetails {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  address: string;
  description: string;
  completedAt: string;
}

export default function WorkerBillGeneration() {
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [laborCost, setLaborCost] = useState(0);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);
  const [billGenerated, setBillGenerated] = useState(false);

  useEffect(() => {
    // Mock job details - in real app, this would come from props or API
    setJobDetails({
      id: "JOB123",
      customerName: "John Doe",
      customerPhone: "+91 98765 43210",
      service: "Plumbing Repair",
      address: "123 Main St, Adyar, Chennai - 600020",
      description: "Fixed leaky faucet in kitchen",
      completedAt: new Date().toISOString()
    });

    // Pre-populate with basic items
    setBillItems([
      {
        id: "1",
        description: "Faucet washer replacement",
        quantity: 2,
        unitPrice: 50,
        total: 100
      },
      {
        id: "2",
        description: "Pipe sealant",
        quantity: 1,
        unitPrice: 150,
        total: 150
      }
    ]);

    setLaborCost(400);
  }, []);

  const addBillItem = () => {
    const newItem: BillItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setBillItems([...billItems, newItem]);
  };

  const updateBillItem = (id: string, field: keyof BillItem, value: any) => {
    setBillItems(items => 
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

  const removeBillItem = (id: string) => {
    setBillItems(items => items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return billItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() + laborCost) * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + laborCost + calculateTax();
  };

  const handleGenerateBill = async () => {
    if (billItems.some(item => !item.description.trim())) {
      toast.error("Please fill in all item descriptions");
      return;
    }

    setIsGeneratingBill(true);

    try {
      // Simulate bill generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const billData = {
        jobDetails,
        billItems,
        laborCost,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        additionalNotes,
        generatedAt: new Date().toISOString(),
        billNumber: `WB${Date.now()}`
      };

      // Store bill data (in real app, send to backend)
      localStorage.setItem('quickfix_worker_bill', JSON.stringify(billData));

      setBillGenerated(true);
      toast.success("Bill generated successfully!");

      // Send to customer and admin (simulate)
      setTimeout(() => {
        toast.success("Bill sent to customer via SMS/Email");
      }, 1000);

      setTimeout(() => {
        toast.success("Bill sent to administrator");
      }, 2000);

    } catch (error) {
      toast.error("Failed to generate bill. Please try again.");
    } finally {
      setIsGeneratingBill(false);
    }
  };

  if (!jobDetails) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h2 className="text-xl font-bold mb-2">No Job Selected</h2>
        <p className="text-gray-600 mb-4">Please complete a job first</p>
        <Button onClick={() => navigate("/worker/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (billGenerated) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center animate-fade-in">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-bold mb-2">Bill Generated Successfully!</h2>
        <p className="text-gray-600 mb-6">
          The bill has been sent to the customer and administrator.
        </p>
        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/worker/dashboard")}
            className="w-full"
          >
            Back to Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setBillGenerated(false);
              setBillItems([]);
              setLaborCost(0);
              setAdditionalNotes("");
            }}
            className="w-full"
          >
            Generate Another Bill
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
      
      <h1 className="text-2xl font-bold mb-2">Generate Bill</h1>
      <p className="text-neutral-300 mb-6">Create bill for completed job</p>

      {/* Job Details */}
      <Card className="p-4 mb-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Job Details
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            <span>{jobDetails.customerName}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-500" />
            <span>{jobDetails.customerPhone}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
            <span className="text-xs">{jobDetails.address}</span>
          </div>
          <div className="pt-2 border-t">
            <p className="font-medium">{jobDetails.service}</p>
            <p className="text-gray-600">{jobDetails.description}</p>
          </div>
        </div>
      </Card>

      {/* Bill Items */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Bill Items</h3>
          <Button size="sm" variant="outline" onClick={addBillItem}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {billItems.map((item, index) => (
            <div key={item.id} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Item {index + 1}</Label>
                {billItems.length > 1 && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => removeBillItem(item.id)}
                    className="text-red-500 h-6 w-6 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateBillItem(item.id, 'description', e.target.value)}
                className="text-sm"
              />
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateBillItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Price</Label>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateBillItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
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
          placeholder="Add any additional notes or warranty information..."
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      {/* Generate Bill Button */}
      <Button 
        onClick={handleGenerateBill} 
        disabled={isGeneratingBill}
        className="w-full"
      >
        {isGeneratingBill ? (
          <>
            <Clock className="w-4 h-4 mr-2 animate-spin" />
            Generating Bill...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Generate & Send Bill
          </>
        )}
      </Button>
    </div>
  );
}

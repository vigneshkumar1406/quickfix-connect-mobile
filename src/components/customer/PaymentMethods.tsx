
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Smartphone, Plus, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PaymentMethods() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'paytm',
    name: '',
    details: '',
    isDefault: false
  });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = () => {
    // Load from localStorage for now - in real app, this would be from API
    const saved = localStorage.getItem(`payment_methods_${user?.id}`);
    if (saved) {
      setPaymentMethods(JSON.parse(saved));
    } else {
      // Default Paytm method
      const defaultMethods = [
        {
          id: 1,
          type: "paytm",
          name: "Paytm Wallet",
          details: user?.phone || "+91 9876543210",
          isDefault: true
        }
      ];
      setPaymentMethods(defaultMethods);
      savePaymentMethods(defaultMethods);
    }
  };

  const savePaymentMethods = (methods: any[]) => {
    localStorage.setItem(`payment_methods_${user?.id}`, JSON.stringify(methods));
  };

  const addPaymentMethod = () => {
    if (!newMethod.name || !newMethod.details) {
      toast.error("Please fill all fields");
      return;
    }

    const method = {
      id: Date.now(),
      ...newMethod,
      isDefault: paymentMethods.length === 0
    };

    const updatedMethods = [...paymentMethods, method];
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    
    setNewMethod({
      type: 'paytm',
      name: '',
      details: '',
      isDefault: false
    });
    setShowAddMethod(false);
    toast.success("Payment method added successfully");
  };

  const removePaymentMethod = (id: number) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    toast.success("Payment method removed");
  };

  const setAsDefault = (id: number) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    toast.success("Default payment method updated");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Payment Methods</h1>
        </div>

        <div className="space-y-4 mb-6">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {method.type === 'paytm' ? (
                    <Smartphone className="w-6 h-6 text-blue-600 mr-3" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-gray-600 mr-3" />
                  )}
                  <div>
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.details}</p>
                    {method.isDefault && (
                      <p className="text-xs text-green-600 mt-1">Default</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAsDefault(method.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removePaymentMethod(method.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={showAddMethod} onOpenChange={setShowAddMethod}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add New Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Payment Type</Label>
                <select
                  id="type"
                  value={newMethod.type}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="paytm">Paytm</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              <div>
                <Label htmlFor="name">Method Name</Label>
                <Input
                  id="name"
                  value={newMethod.name}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., My Paytm Wallet"
                />
              </div>
              <div>
                <Label htmlFor="details">Details</Label>
                <Input
                  id="details"
                  value={newMethod.details}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="e.g., +91 9876543210 or **** 1234"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={addPaymentMethod} className="flex-1">
                  Add Method
                </Button>
                <Button variant="outline" onClick={() => setShowAddMethod(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

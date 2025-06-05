
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Hammer, Calculator, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../BackButton";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  selected: boolean;
  quantity: number;
}

export default function CarpentryServiceEstimation() {
  const navigate = useNavigate();
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([
    { id: '1', name: 'Door Fitting', price: 299, unit: 'per door', selected: false, quantity: 1 },
    { id: '2', name: 'Window Installation', price: 399, unit: 'per window', selected: false, quantity: 1 },
    { id: '3', name: 'Furniture Repair', price: 199, unit: 'per piece', selected: false, quantity: 1 },
    { id: '4', name: 'Cabinet Installation', price: 499, unit: 'per cabinet', selected: false, quantity: 1 },
    { id: '5', name: 'Shelving Work', price: 149, unit: 'per shelf', selected: false, quantity: 1 },
    { id: '6', name: 'Wooden Flooring', price: 899, unit: 'per sq ft', selected: false, quantity: 1 },
    { id: '7', name: 'Wardrobe Installation', price: 799, unit: 'per unit', selected: false, quantity: 1 },
    { id: '8', name: 'Custom Furniture', price: 1299, unit: 'per piece', selected: false, quantity: 1 },
    { id: '9', name: 'Wood Polishing', price: 249, unit: 'per piece', selected: false, quantity: 1 },
    { id: '10', name: 'Carpenter Repair', price: 299, unit: 'per hour', selected: false, quantity: 1 }
  ]);

  const handleItemToggle = (itemId: string) => {
    setServiceItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    setServiceItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const calculateGrandTotal = () => {
    return serviceItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleProceedToBooking = () => {
    const selectedItems = serviceItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    const estimationData = {
      serviceType: "Carpentry",
      items: selectedItems,
      grandTotal: calculateGrandTotal(),
      breakdown: selectedItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity
      }))
    };

    navigate("/customer/book-service", { 
      state: { estimationData } 
    });
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Hammer className="w-6 h-6 text-amber-600 mr-2" />
          <h1 className="text-2xl font-bold">Carpentry Services</h1>
        </div>
        <p className="text-gray-600">Select services and quantities for your estimate</p>
      </div>

      <div className="space-y-4 mb-6">
        {serviceItems.map((item) => (
          <Card key={item.id} className={`p-4 border-2 transition-all ${
            item.selected ? 'border-primary bg-primary/5' : 'border-gray-200'
          }`}>
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={item.selected}
                onCheckedChange={() => handleItemToggle(item.id)}
                className="mt-1"
              />
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">₹{item.price}</p>
                    <p className="text-xs text-gray-500">{item.unit}</p>
                  </div>
                </div>

                {item.selected && (
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className="font-semibold text-primary">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {serviceItems.some(item => item.selected) && (
        <Card className="p-4 mb-6 bg-primary text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              <span className="text-lg font-semibold">Grand Total</span>
            </div>
            <span className="text-2xl font-bold">₹{calculateGrandTotal()}</span>
          </div>
        </Card>
      )}

      <Button 
        onClick={handleProceedToBooking}
        className="w-full h-12 text-lg"
        disabled={!serviceItems.some(item => item.selected)}
      >
        Proceed to Booking
      </Button>

      <Card className="p-4 mt-4 bg-yellow-50 border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Prices are base rates. Final charges may vary based on complexity and materials required. All work comes with a 30-day warranty.
        </p>
      </Card>
    </div>
  );
}

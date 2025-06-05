
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Calculator, Plus, Minus, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../BackButton";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  selected: boolean;
  quantity: number;
}

interface EstimationTableViewProps {
  serviceType: string;
  items: ServiceItem[];
}

export default function EstimationTableView({ serviceType, items: initialItems }: EstimationTableViewProps) {
  const navigate = useNavigate();
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>(initialItems);

  const handleItemToggle = (itemId: string) => {
    setServiceItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setServiceItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const calculateGrandTotal = () => {
    return serviceItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleBookNow = () => {
    const selectedItems = serviceItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    const estimationData = {
      serviceType: serviceType,
      items: selectedItems,
      grandTotal: calculateGrandTotal(),
      breakdown: selectedItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity
      })),
      bookingType: "now"
    };

    navigate("/customer/book-service", { 
      state: { 
        estimationData,
        selectedService: serviceType,
        bookingType: "now"
      } 
    });
  };

  const handleBookLater = () => {
    const selectedItems = serviceItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    const estimationData = {
      serviceType: serviceType,
      items: selectedItems,
      grandTotal: calculateGrandTotal(),
      breakdown: selectedItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity
      })),
      bookingType: "later"
    };

    navigate("/customer/book-service", { 
      state: { 
        estimationData,
        selectedService: serviceType,
        bookingType: "later"
      } 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{serviceType} Services</h1>
        <p className="text-gray-600">Select services and quantities for your estimate</p>
      </div>

      {/* Table Header */}
      <Card className="mb-4">
        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 font-semibold text-sm text-gray-700 border-b pb-2">
            <div className="text-center">Select</div>
            <div className="text-center">S.No</div>
            <div className="col-span-2">Work Name</div>
            <div className="text-center">Price</div>
            <div className="text-center">Quantity</div>
            <div className="text-center">Total</div>
          </div>
          
          {/* Table Rows */}
          <div className="space-y-2 mt-4">
            {serviceItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`grid grid-cols-7 gap-2 items-center py-3 border-b border-gray-100 transition-all ${
                  item.selected ? 'bg-primary/5' : ''
                }`}
              >
                {/* Select Checkbox */}
                <div className="flex justify-center">
                  <Checkbox
                    checked={item.selected}
                    onCheckedChange={() => handleItemToggle(item.id)}
                  />
                </div>
                
                {/* S.No */}
                <div className="text-center text-sm font-medium">
                  {index + 1}
                </div>
                
                {/* Work Name */}
                <div className="col-span-2">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                </div>
                
                {/* Price */}
                <div className="text-center">
                  <span className="font-semibold text-primary">₹{item.price}</span>
                </div>
                
                {/* Quantity */}
                <div className="flex items-center justify-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || !item.selected}
                    className="w-6 h-6 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    disabled={!item.selected}
                    className="w-12 h-6 text-center text-xs p-0"
                    min="1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={!item.selected}
                    className="w-6 h-6 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Total */}
                <div className="text-center">
                  <span className="font-semibold text-primary">
                    {item.selected ? `₹${item.price * item.quantity}` : '₹0'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Grand Total */}
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

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={handleBookNow}
          className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
          disabled={!serviceItems.some(item => item.selected)}
        >
          <Zap className="w-5 h-5 mr-2" />
          Book Now
        </Button>
        
        <Button 
          onClick={handleBookLater}
          variant="outline"
          className="w-full h-12 text-lg"
          disabled={!serviceItems.some(item => item.selected)}
        >
          <Clock className="w-5 h-5 mr-2" />
          Book Later
        </Button>
      </div>

      <Card className="p-4 mt-4 bg-yellow-50 border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Prices are base rates. Final charges may vary based on complexity and materials required. All work comes with a 30-day warranty.
        </p>
      </Card>
    </div>
  );
}

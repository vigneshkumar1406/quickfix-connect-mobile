
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Minus, ShoppingCart, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Service {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  selected: boolean;
  quantity: number;
}

export default function MultipleEstimation() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "Home Cleaning",
      description: "Deep cleaning of entire house",
      basePrice: 599,
      selected: false,
      quantity: 1
    },
    {
      id: 2,
      name: "Plumbing",
      description: "Pipe leak repair and fixture installation",
      basePrice: 399,
      selected: false,
      quantity: 1
    },
    {
      id: 3,
      name: "Electrical",
      description: "Wiring and electrical repairs",
      basePrice: 299,
      selected: false,
      quantity: 1
    },
    {
      id: 4,
      name: "Painting",
      description: "Interior wall painting service",
      basePrice: 799,
      selected: false,
      quantity: 1
    },
    {
      id: 5,
      name: "AC Service",
      description: "AC cleaning and maintenance",
      basePrice: 499,
      selected: false,
      quantity: 1
    },
    {
      id: 6,
      name: "Carpentry",
      description: "Furniture repair and assembly",
      basePrice: 349,
      selected: false,
      quantity: 1
    }
  ]);

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const toggleService = (id: number) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, selected: !service.selected } : service
      )
    );
  };

  const updateQuantity = (id: number, increment: boolean) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id
          ? {
              ...service,
              quantity: increment
                ? service.quantity + 1
                : Math.max(1, service.quantity - 1)
            }
          : service
      )
    );
  };

  const selectedServices = services.filter(service => service.selected);
  const subtotal = selectedServices.reduce(
    (total, service) => total + service.basePrice * service.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + tax;

  const handleGetEstimate = () => {
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address) {
      toast.error("Please fill in all customer details");
      return;
    }

    toast.success("Estimation request submitted for multiple services!");
    console.log("Estimation request:", {
      services: selectedServices,
      customerDetails,
      pricing: { subtotal, tax, total }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Multiple Service Estimation</h1>
        </div>

        {/* Service Selection */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold">Select Services</h2>
          {services.map((service) => (
            <Card key={service.id} className={`p-4 transition-all ${service.selected ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={service.selected}
                  onCheckedChange={() => toggleService(service.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{service.name}</h3>
                    <Badge variant="secondary">₹{service.basePrice}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  
                  {service.selected && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(service.id, false)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {service.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(service.id, true)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-sm font-medium">
                        ₹{service.basePrice * service.quantity}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Customer Details */}
        {selectedServices.length > 0 && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-4">Customer Details</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="customer-name">Full Name *</Label>
                <Input
                  id="customer-name"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="customer-phone">Phone Number *</Label>
                <Input
                  id="customer-phone"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 xxxxx xxxxx"
                />
              </div>
              <div>
                <Label htmlFor="customer-address">Address *</Label>
                <Input
                  id="customer-address"
                  value={customerDetails.address}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter complete address"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Order Summary */}
        {selectedServices.length > 0 && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Order Summary
            </h3>
            <div className="space-y-2">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span>{service.name} × {service.quantity}</span>
                  <span>₹{service.basePrice * service.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Action Button */}
        {selectedServices.length > 0 && (
          <Button onClick={handleGetEstimate} className="w-full">
            <Calculator className="w-4 h-4 mr-2" />
            Get Combined Estimation
          </Button>
        )}

        {selectedServices.length === 0 && (
          <Card className="p-8 text-center">
            <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold mb-2">Select Services</h3>
            <p className="text-sm text-gray-600">
              Choose multiple services to get a combined estimation
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

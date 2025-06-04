
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PaymentMethods() {
  const navigate = useNavigate();
  const [paymentMethods] = useState([
    {
      id: 1,
      type: "paytm",
      name: "Paytm Wallet",
      details: "Linked to +91 9876543210",
      isDefault: true
    },
    {
      id: 2,
      type: "card",
      name: "Credit Card",
      details: "**** **** **** 1234",
      isDefault: false
    }
  ]);

  const addPaymentMethod = () => {
    toast.info("Add payment method functionality will be implemented soon");
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

        <div className="space-y-4">
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
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </Card>
          ))}

          <Button onClick={addPaymentMethod} className="w-full" variant="outline">
            Add New Payment Method
          </Button>
        </div>
      </div>
    </div>
  );
}

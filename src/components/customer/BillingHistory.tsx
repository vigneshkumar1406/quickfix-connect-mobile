
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function BillingHistory() {
  const navigate = useNavigate();
  const [bills] = useState([
    {
      id: 1,
      service: "Plumbing Repair",
      amount: 350,
      date: "2024-01-15",
      status: "paid",
      invoiceNumber: "INV-001"
    },
    {
      id: 2,
      service: "Electrical Work",
      amount: 450,
      date: "2024-01-10",
      status: "paid",
      invoiceNumber: "INV-002"
    },
    {
      id: 3,
      service: "AC Service",
      amount: 400,
      date: "2024-01-20",
      status: "pending",
      invoiceNumber: "INV-003"
    }
  ]);

  const downloadInvoice = (invoiceNumber: string) => {
    toast.success(`Downloading invoice ${invoiceNumber}`);
  };

  const getStatusColor = (status: string) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Billing History</h1>
        </div>

        <div className="space-y-4">
          {bills.map((bill) => (
            <Card key={bill.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{bill.service}</h3>
                  <p className="text-sm text-gray-600">Invoice: {bill.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">{new Date(bill.date).toLocaleDateString()}</p>
                </div>
                <Badge className={getStatusColor(bill.status)}>
                  {bill.status}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">₹{bill.amount}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => downloadInvoice(bill.invoiceNumber)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

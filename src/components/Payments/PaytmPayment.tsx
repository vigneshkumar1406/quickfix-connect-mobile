
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PaytmPaymentProps {
  amount: number;
  description: string;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}

// Your Paytm MID
const PAYTM_MID = "zYpUGe55389849298154";

const PaytmPayment = ({ amount, description, onSuccess, onFailure }: PaytmPaymentProps) => {
  const [loading, setLoading] = useState(false);

  const handlePaytmPayment = async () => {
    setLoading(true);
    
    try {
      // Generate unique order ID
      const orderId = `ORDER_${Date.now()}`;
      
      const paytmConfig = {
        root: "",
        flow: "DEFAULT",
        data: {
          orderId: orderId,
          token: "", // This should come from your backend
          tokenType: "TXN_TOKEN",
          amount: amount.toString(),
        },
        merchant: {
          mid: PAYTM_MID,
          redirect: false
        },
        handler: {
          notifyMerchant: function(eventName: string, data: any) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
            
            if (eventName === "APP_CLOSED") {
              console.log("Payment cancelled by user");
              setLoading(false);
              if (onFailure) onFailure({ message: "Payment cancelled" });
            }
          }
        }
      };

      // In a real implementation, you would:
      // 1. Call your backend to create Paytm order and get transaction token
      // 2. Use the actual Paytm SDK
      // For now, we'll simulate the payment process
      
      console.log("Initiating Paytm payment with config:", paytmConfig);
      
      // Simulate payment process
      setTimeout(() => {
        setLoading(false);
        const mockResponse = {
          orderId,
          txnId: `TXN_${Date.now()}`,
          amount,
          status: "SUCCESS",
          message: "Payment successful"
        };
        
        toast.success("Paytm payment successful!");
        if (onSuccess) onSuccess(mockResponse);
      }, 2000);
      
    } catch (error) {
      setLoading(false);
      console.error("Paytm payment error:", error);
      toast.error("Payment failed. Please try again.");
      if (onFailure) onFailure(error);
    }
  };

  return (
    <Button 
      onClick={handlePaytmPayment} 
      disabled={loading} 
      className="w-full bg-blue-600 hover:bg-blue-700"
    >
      {loading ? 'Processing...' : `Pay ₹${amount} via Paytm`}
    </Button>
  );
};

export default PaytmPayment;

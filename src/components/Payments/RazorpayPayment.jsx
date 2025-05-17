
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { paymentAPI } from '@/services/api';
import { toast } from 'sonner';

// Add this script to your index.html
// <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

const RazorpayPayment = ({ amount, description, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Step 1: Create an order
      const orderResponse = await paymentAPI.createPaymentOrder(
        amount,
        'INR',
        description
      );
      
      if (!orderResponse.success) {
        toast.error(orderResponse.message || 'Failed to create payment order');
        setLoading(false);
        if (onFailure) onFailure(orderResponse);
        return;
      }
      
      // Step 2: Initialize Razorpay payment
      const paymentResponse = await paymentAPI.initializeRazorpay(
        orderResponse.order.id,
        amount,
        'INR',
        'QuickFix',
        description,
        {
          name: 'Customer Name', 
          contact: '9876543210'
        }
      );
      
      setLoading(false);
      
      if (paymentResponse.success) {
        // Step 3: Verify the payment
        const verificationResponse = await paymentAPI.verifyPayment(
          paymentResponse.orderId,
          paymentResponse.paymentId,
          paymentResponse.signature
        );
        
        if (verificationResponse.success) {
          toast.success('Payment successful');
          if (onSuccess) onSuccess(verificationResponse);
        } else {
          toast.error(verificationResponse.message || 'Payment verification failed');
          if (onFailure) onFailure(verificationResponse);
        }
      } else {
        toast.error(paymentResponse.message || 'Payment failed');
        if (onFailure) onFailure(paymentResponse);
      }
    } catch (error) {
      setLoading(false);
      toast.error('An error occurred during payment');
      if (onFailure) onFailure({ success: false, message: error.message });
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading} 
      className="w-full"
    >
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </Button>
  );
};

export default RazorpayPayment;

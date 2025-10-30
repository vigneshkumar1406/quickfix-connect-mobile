
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const OtpLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { sendOTP, verifyOTP, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    const response = await sendOTP(phoneNumber);
    
    if (response.success) {
      setOtpSent(true);
      setResendTimer(60);
      toast.success('OTP sent successfully! Check your SMS.');
    } else {
      const errorMsg = response.message || 'Failed to send OTP';
      if (errorMsg.includes('captcha')) {
        toast.error('Please complete the reCAPTCHA verification');
      } else if (errorMsg.includes('domain')) {
        toast.error('Domain not authorized. Please contact support.');
      } else if (errorMsg.includes('rate')) {
        toast.error('Too many attempts. Please try again later.');
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    const response = await sendOTP(phoneNumber);
    
    if (response.success) {
      setResendTimer(60);
      toast.success('OTP resent successfully!');
    } else {
      toast.error(response.message || 'Failed to resend OTP');
    }
  };
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    const response = await verifyOTP(phoneNumber, otp);
    if (response.success) {
      toast.success('Login successful!');
      navigate('/customer/dashboard');
    } else {
      if (response.error?.includes('invalid')) {
        toast.error('Invalid OTP. Please check and try again.');
      } else if (response.error?.includes('expired')) {
        toast.error('OTP expired. Please request a new one.');
      } else {
        toast.error('Verification failed. Please try again.');
      }
    }
  };

  return (
    <Card className="p-6">
      {!otpSent ? (
        <form onSubmit={handleSendOtp}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <Input 
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your 10-digit number"
              maxLength={10}
              required
            />
          </div>
          
          {/* reCAPTCHA container - now visible */}
          <div className="flex justify-center mb-4">
            <div id="recaptcha-container"></div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Enter OTP</label>
            <div className="flex flex-col space-y-2">
              <Input 
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
              <p className="text-sm text-neutral-500">
                OTP sent to +91 {phoneNumber}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || loading}
              className="w-full"
            >
              {resendTimer > 0 
                ? `Resend OTP in ${resendTimer}s` 
                : 'Resend OTP'}
            </Button>
            
            <Button 
              type="button" 
              variant="link" 
              onClick={() => {
                setOtpSent(false);
                setResendTimer(0);
              }}
            >
              Change Phone Number
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};

export default OtpLogin;

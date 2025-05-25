
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';

const OtpLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { sendOTP, verifyOTP, loading } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    
    const response = await sendOTP(phoneNumber);
    if (response.success) {
      setOtpSent(true);
    }
  };
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    
    const response = await verifyOTP(phoneNumber, otp);
    if (response.success) {
      navigate('/customer/dashboard');
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
              variant="link" 
              onClick={() => setOtpSent(false)}
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


import OtpVerification from "@/components/OtpVerification";

const VerificationPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">QuickFix</h1>
        <p className="text-neutral-300">Verify your phone number</p>
      </div>
      
      <OtpVerification />
    </div>
  );
};

export default VerificationPage;

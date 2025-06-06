
import WorkerPayment from "@/components/worker/WorkerPayment";

const WorkerPaymentPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">Fixsify</h1>
      </div>
      
      <WorkerPayment />
    </div>
  );
};

export default WorkerPaymentPage;

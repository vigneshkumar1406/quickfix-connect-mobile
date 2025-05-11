
import WorkerTerms from "@/components/worker/WorkerTerms";

const WorkerTermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">QuickFix</h1>
      </div>
      
      <WorkerTerms />
    </div>
  );
};

export default WorkerTermsPage;

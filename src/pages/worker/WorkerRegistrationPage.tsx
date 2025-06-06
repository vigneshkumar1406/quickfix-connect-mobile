
import WorkerRegistration from "@/components/worker/WorkerRegistration";

const WorkerRegistrationPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">Fixsify</h1>
      </div>
      
      <WorkerRegistration />
    </div>
  );
};

export default WorkerRegistrationPage;

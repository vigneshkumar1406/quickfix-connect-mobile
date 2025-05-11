
import RoleSelector from "@/components/RoleSelector";

const RoleSelectionPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">QuickFix</h1>
        <p className="text-neutral-300">Choose how you want to use QuickFix</p>
      </div>
      
      <RoleSelector />
    </div>
  );
};

export default RoleSelectionPage;

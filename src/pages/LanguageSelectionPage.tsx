
import LanguageSelector from "@/components/LanguageSelector";

const LanguageSelectionPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">Fixsify</h1>
        <p className="text-neutral-300">Connect with skilled professionals</p>
      </div>
      
      <LanguageSelector />
    </div>
  );
};

export default LanguageSelectionPage;

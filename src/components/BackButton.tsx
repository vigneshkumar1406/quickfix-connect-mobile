
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  withLabel?: boolean;
}

export default function BackButton({ onClick, className, withLabel = false }: BackButtonProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      variant="ghost" 
      className={`flex items-center ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      {withLabel && <span className="ml-2">Back</span>}
    </Button>
  );
}

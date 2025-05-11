
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Automatically navigate to the language selection page
    navigate("/language-selection");
  }, [navigate]);

  return null;
};

export default Index;

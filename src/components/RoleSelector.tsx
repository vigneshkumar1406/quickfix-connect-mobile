
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { Hammer, User } from "lucide-react";

interface Role {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const roles: Role[] = [
  {
    id: "customer",
    title: "I'm a Customer",
    description: "Book services for your home or work",
    icon: <User className="w-8 h-8 text-primary" />,
  },
  {
    id: "worker",
    title: "I'm a Worker",
    description: "Offer your skills and earn money",
    icon: <Hammer className="w-8 h-8 text-secondary" />,
  },
];

export default function RoleSelector() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    // In a real app, you would store this in localStorage/context
    localStorage.setItem("fixsify-role", role);
    navigate("/verification");
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-2 text-center">Choose your role</h1>
      <p className="text-neutral-300 text-center mb-8">Select how you want to use Fixsify</p>
      
      <div className="grid grid-cols-1 gap-4">
        {roles.map((role) => (
          <Card
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className="p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 animate-slide-in"
          >
            <div className="flex items-center">
              <div className="mr-4 bg-neutral-100 p-4 rounded-full">{role.icon}</div>
              <div>
                <h3 className="font-semibold text-lg">{role.title}</h3>
                <p className="text-neutral-300">{role.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

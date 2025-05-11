
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

const skillsList = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Cleaning",
  "Gardening",
  "HVAC",
  "Appliance Repair",
  "Moving",
  "Electronics Repair",
];

export default function WorkerRegistration() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [otherSkill, setOtherSkill] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const navigate = useNavigate();
  
  const handleSkillToggle = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };
  
  const handleAddOtherSkill = () => {
    if (!otherSkill.trim()) return;
    if (!skills.includes(otherSkill)) {
      setSkills([...skills, otherSkill]);
      setOtherSkill("");
    }
  };
  
  const handleGetLocation = () => {
    setIsLoadingLocation(true);
    
    // Simulate geolocation
    setTimeout(() => {
      setIsLoadingLocation(false);
      setAddress("123 Main St, Chennai, Tamil Nadu, 600001");
      toast.success("Location added successfully");
    }, 1500);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !age || !address || skills.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // In a real app, send data to server
    navigate("/worker/terms");
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Registration</h1>
      <p className="text-neutral-300 mb-6">Please fill in your details</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min="18"
            max="100"
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="min-h-[80px]"
            required
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={handleGetLocation}
            disabled={isLoadingLocation}
            className="w-full"
          >
            {isLoadingLocation ? (
              "Getting location..."
            ) : (
              <>
                <MapPin className="mr-2 w-4 h-4" /> Add Current Location
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-3">
          <Label>Select Your Skills</Label>
          <div className="grid grid-cols-2 gap-2">
            {skillsList.map((skill) => (
              <div key={skill} className="flex items-start space-x-2">
                <Checkbox
                  id={`skill-${skill}`}
                  checked={skills.includes(skill)}
                  onCheckedChange={() => handleSkillToggle(skill)}
                />
                <label
                  htmlFor={`skill-${skill}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {skill}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="other-skill">Other Skills</Label>
          <div className="flex space-x-2">
            <Input
              id="other-skill"
              placeholder="Enter other skill"
              value={otherSkill}
              onChange={(e) => setOtherSkill(e.target.value)}
            />
            <Button 
              type="button" 
              onClick={handleAddOtherSkill}
              variant="outline"
            >
              Add
            </Button>
          </div>
          
          {skills.filter(s => !skillsList.includes(s)).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.filter(s => !skillsList.includes(s)).map((skill) => (
                <div key={skill} className="bg-neutral-100 px-3 py-1 rounded-full text-sm flex items-center">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className="ml-2 text-neutral-300 hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button type="submit" className="w-full">Continue</Button>
        
        <div className="text-center">
          <Button
            variant="link"
            type="button"
            onClick={() => navigate("/worker/terms")}
            className="text-neutral-300"
          >
            Skip for now
          </Button>
        </div>
      </form>
    </div>
  );
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function EditableProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    phone: "+91 98765 43210",
    email: "john.doe@email.com",
    avatar: ""
  });

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    navigate('/customer/profile');
  };

  const handleAvatarChange = () => {
    // In a real app, this would open file picker
    toast.info("Avatar update functionality will be implemented soon");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Edit Profile</h1>
        </div>

        <Card className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
                onClick={handleAvatarChange}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

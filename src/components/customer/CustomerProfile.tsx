
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Phone, Mail, MapPin, Edit, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    phone: "+91 98765 43210",
    email: "john.doe@email.com",
    address: "123 Main Street, T. Nagar, Chennai - 600017",
    joinDate: "January 2024"
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <h2 className="text-xl font-semibold">{profileData.name}</h2>
              <p className="text-sm text-gray-600">Member since {profileData.joinDate}</p>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profileData.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profileData.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profileData.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address" className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profileData.address}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <Button onClick={handleSave} className="w-full mt-6">
                Save Changes
              </Button>
            )}
          </Card>

          {/* Service Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Service Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-gray-600">Total Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹2,450</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

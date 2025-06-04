
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Smartphone, Tablet, Monitor, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function NativeDevices() {
  const navigate = useNavigate();
  const [devices] = useState([
    {
      id: 1,
      name: "iPhone 13",
      type: "mobile",
      status: "active",
      lastUsed: "2024-01-15"
    },
    {
      id: 2,
      name: "iPad Pro",
      type: "tablet",
      status: "inactive",
      lastUsed: "2024-01-10"
    }
  ]);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="w-6 h-6" />;
      case 'tablet': return <Tablet className="w-6 h-6" />;
      case 'desktop': return <Monitor className="w-6 h-6" />;
      default: return <Smartphone className="w-6 h-6" />;
    }
  };

  const addDevice = () => {
    toast.info("Device registration functionality will be implemented soon");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Native Devices</h1>
        </div>

        <div className="space-y-4">
          {devices.map((device) => (
            <Card key={device.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-gray-600 mr-3">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{device.name}</h3>
                    <p className="text-sm text-gray-600">Last used: {device.lastUsed}</p>
                  </div>
                </div>
                <Badge 
                  variant={device.status === 'active' ? 'default' : 'secondary'}
                  className={device.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {device.status}
                </Badge>
              </div>
            </Card>
          ))}

          <Button onClick={addDevice} className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add New Device
          </Button>
        </div>
      </div>
    </div>
  );
}

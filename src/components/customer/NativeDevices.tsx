
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Smartphone, Bell, Settings, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function NativeDevices() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [devices, setDevices] = useState<any[]>([]);
  const [currentDevice, setCurrentDevice] = useState<any>(null);

  useEffect(() => {
    loadDevices();
    getCurrentDevice();
  }, []);

  const loadDevices = () => {
    // Load from localStorage for demo - in real app, this would be from API
    const saved = localStorage.getItem(`devices_${user?.id}`);
    if (saved) {
      setDevices(JSON.parse(saved));
    }
  };

  const saveDevices = (deviceList: any[]) => {
    localStorage.setItem(`devices_${user?.id}`, JSON.stringify(deviceList));
  };

  const getCurrentDevice = () => {
    // Get current device info
    const deviceInfo = {
      id: 'current',
      name: getDeviceName(),
      type: getDeviceType(),
      browser: getBrowserInfo(),
      lastActive: new Date().toISOString(),
      isCurrentDevice: true,
      notificationsEnabled: 'Notification' in window && Notification.permission === 'granted'
    };
    setCurrentDevice(deviceInfo);
  };

  const getDeviceName = () => {
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) return 'Android Device';
    if (/iPhone/i.test(userAgent)) return 'iPhone';
    if (/iPad/i.test(userAgent)) return 'iPad';
    if (/Mac/i.test(userAgent)) return 'Mac';
    if (/Windows/i.test(userAgent)) return 'Windows PC';
    return 'Unknown Device';
  };

  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/Mobile/i.test(userAgent)) return 'Mobile';
    if (/Tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  };

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
  };

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      toast.success('Notifications are already enabled');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toast.success('Notifications enabled successfully');
      getCurrentDevice(); // Refresh device info
    } else {
      toast.error('Notifications permission denied');
    }
  };

  const registerCurrentDevice = () => {
    if (!currentDevice) return;

    const newDevice = {
      ...currentDevice,
      id: Date.now().toString(),
      registeredAt: new Date().toISOString(),
      isCurrentDevice: false
    };

    const updatedDevices = [...devices, newDevice];
    setDevices(updatedDevices);
    saveDevices(updatedDevices);
    toast.success('Device registered successfully');
  };

  const removeDevice = (deviceId: string) => {
    const updatedDevices = devices.filter(device => device.id !== deviceId);
    setDevices(updatedDevices);
    saveDevices(updatedDevices);
    toast.success('Device removed successfully');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

        {/* Current Device */}
        {currentDevice && (
          <Card className="p-4 mb-6 border-2 border-primary">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Smartphone className="w-6 h-6 text-primary mr-3" />
                <div>
                  <h3 className="font-semibold">{currentDevice.name}</h3>
                  <p className="text-sm text-gray-600">Current Device</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Active
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p><strong>Type:</strong> {currentDevice.type}</p>
              <p><strong>Browser:</strong> {currentDevice.browser}</p>
              <p><strong>Notifications:</strong> 
                <span className={currentDevice.notificationsEnabled ? 'text-green-600' : 'text-red-600'}>
                  {currentDevice.notificationsEnabled ? ' Enabled' : ' Disabled'}
                </span>
              </p>
            </div>

            <div className="flex space-x-2">
              {!currentDevice.notificationsEnabled && (
                <Button size="sm" onClick={enableNotifications} className="flex-1">
                  <Bell className="w-4 h-4 mr-1" />
                  Enable Notifications
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={registerCurrentDevice} className="flex-1">
                <Plus className="w-4 h-4 mr-1" />
                Register Device
              </Button>
            </div>
          </Card>
        )}

        {/* Registered Devices */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3">Registered Devices</h2>
        </div>

        {devices.length > 0 ? (
          <div className="space-y-4">
            {devices.map((device) => (
              <Card key={device.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <h3 className="font-medium">{device.name}</h3>
                      <p className="text-sm text-gray-600">{device.type}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => removeDevice(device.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Browser:</strong> {device.browser}</p>
                  <p><strong>Registered:</strong> {formatDate(device.registeredAt)}</p>
                  <p><strong>Notifications:</strong> 
                    <span className={device.notificationsEnabled ? 'text-green-600' : 'text-red-600'}>
                      {device.notificationsEnabled ? ' Enabled' : ' Disabled'}
                    </span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No registered devices</p>
            <p className="text-sm text-gray-400">
              Register your devices to receive push notifications
            </p>
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-4 mt-6 bg-blue-50">
          <div className="flex items-start">
            <Settings className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">About Device Registration</h3>
              <p className="text-sm text-blue-700">
                Register your devices to receive push notifications about service updates, 
                booking confirmations, and important alerts even when the app is closed.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
}

export default function CustomerNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Service Completed',
      message: 'Your plumbing service has been completed successfully.',
      type: 'success',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'Worker Assigned',
      message: 'Rajesh Kumar has been assigned to your electrical work.',
      type: 'info',
      time: '1 day ago',
      read: false
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'Payment of ₹450 has been received for your last service.',
      type: 'success',
      time: '2 days ago',
      read: true
    },
    {
      id: '4',
      title: 'Service Reminder',
      message: 'Your AC service is scheduled for tomorrow at 2 PM.',
      type: 'warning',
      time: '3 days ago',
      read: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 cursor-pointer transition-all ${
                !notification.read 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {notification.time}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
              </div>
            </Card>
          ))}

          {notifications.length === 0 && (
            <Card className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-semibold mb-2">No Notifications</h3>
              <p className="text-sm text-gray-600">
                You'll see notifications about your services here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

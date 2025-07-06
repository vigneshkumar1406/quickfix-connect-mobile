import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Users, Settings, BarChart3, Shield, 
  Phone, UserCheck, Calendar, LogOut 
} from "lucide-react";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeWorkers: 0,
    totalCustomers: 0,
    pendingVerifications: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total bookings
      const { count: bookingsCount } = await supabase
        .from('service_bookings')
        .select('*', { count: 'exact', head: true });

      // Get active workers
      const { count: workersCount } = await supabase
        .from('workers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'verified');

      // Get total customers
      const { count: customersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'customer');

      // Get pending verifications
      const { count: pendingCount } = await supabase
        .from('workers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_verification');

      setStats({
        totalBookings: bookingsCount || 0,
        activeWorkers: workersCount || 0,
        totalCustomers: customersCount || 0,
        pendingVerifications: pendingCount || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      title: "Call Center",
      description: "Access call center operations",
      icon: Phone,
      route: "/call-center/dashboard",
      color: "text-blue-600"
    },
    {
      title: "Worker Management",
      description: "Manage worker verifications and profiles",
      icon: UserCheck,
      route: "/admin/workers",
      color: "text-green-600"
    },
    {
      title: "Bookings Overview",
      description: "View and manage all bookings",
      icon: Calendar,
      route: "/admin/bookings",
      color: "text-purple-600"
    },
    {
      title: "Analytics",
      description: "View platform analytics and reports",
      icon: BarChart3,
      route: "/admin/analytics",
      color: "text-orange-600"
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: Settings,
      route: "/admin/settings",
      color: "text-gray-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="opacity-90">Platform Management Dashboard</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Workers</p>
                <p className="text-2xl font-bold">{stats.activeWorkers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Verifications</p>
                <p className="text-2xl font-bold">{stats.pendingVerifications}</p>
                {stats.pendingVerifications > 0 && (
                  <Badge variant="destructive" className="mt-1">
                    Needs Attention
                  </Badge>
                )}
              </div>
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={item.route}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(item.route)}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-background border rounded-lg p-3">
                    <IconComponent className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
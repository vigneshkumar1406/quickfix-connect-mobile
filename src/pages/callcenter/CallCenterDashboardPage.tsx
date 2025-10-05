import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Phone, UserPlus, Users, Search, 
  MapPin, Clock, LogOut, UserCheck 
} from "lucide-react";

export default function CallCenterDashboardPage() {
  const navigate = useNavigate();
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [availableWorkers, setAvailableWorkers] = useState<any[]>([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [workerFormData, setWorkerFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    skills: [] as string[],
    experience_years: 0
  });

  useEffect(() => {
    loadActiveBookings();
    loadAvailableWorkers();
  }, []);

  const loadActiveBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select(`
          *,
          profiles!service_bookings_customer_id_fkey(full_name, phone_number)
        `)
        .in('status', ['pending', 'assigned', 'in_progress'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActiveBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const loadAvailableWorkers = async () => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*, profiles!workers_user_id_fkey(full_name, phone_number)')
        .eq('kyc_verified', true)
        .eq('is_available', true);

      if (error) throw error;
      setAvailableWorkers(data || []);
    } catch (error) {
      console.error('Error loading workers:', error);
    }
  };

  const handleAssignWorker = async (bookingId: string, workerId: string) => {
    try {
      const { error } = await supabase
        .from('service_bookings')
        .update({ 
          worker_id: workerId,
          status: 'assigned'
        })
        .eq('id', bookingId);

      if (error) throw error;
      
      toast.success('Worker assigned successfully');
      loadActiveBookings();
    } catch (error) {
      toast.error('Failed to assign worker');
      console.error('Assignment error:', error);
    }
  };

  const handleRegisterWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: workerFormData.email,
        password: 'TempPass123!', // Temporary password
        user_metadata: {
          full_name: workerFormData.full_name,
          phone_number: workerFormData.phone_number
        }
      });

      if (authError) throw authError;

      // Create worker profile
      const { error: workerError } = await supabase
        .from('workers')
        .insert({
          user_id: authData.user.id,
          skills: workerFormData.skills,
          experience_years: workerFormData.experience_years,
          status: 'verified'
        });

      if (workerError) throw workerError;

      toast.success('Worker registered successfully');
      setIsRegisterModalOpen(false);
      setWorkerFormData({
        full_name: "",
        phone_number: "",
        email: "",
        skills: [],
        experience_years: 0
      });
      loadAvailableWorkers();
    } catch (error) {
      toast.error('Failed to register worker');
      console.error('Registration error:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const serviceTypes = [
    "Home Cleaning", "Plumbing", "Electrical", "Painting", 
    "Carpentry", "AC Service", "Appliance Repair", "Pest Control"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Phone className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Call Center Dashboard</h1>
              <p className="opacity-90">Manage bookings and assign workers</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register Worker
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Register New Worker</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRegisterWorker} className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={workerFormData.full_name}
                      onChange={(e) => setWorkerFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      value={workerFormData.phone_number}
                      onChange={(e) => setWorkerFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={workerFormData.email}
                      onChange={(e) => setWorkerFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={workerFormData.experience_years}
                      onChange={(e) => setWorkerFormData(prev => ({ ...prev, experience_years: Number(e.target.value) }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Register Worker
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
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
      </div>

      <div className="p-6">
        {/* Search Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search customer by phone number"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="flex-1"
            />
            <Button>Search</Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Bookings */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Active Bookings ({activeBookings.length})
            </h2>
            <div className="space-y-4">
              {activeBookings.map((booking) => (
                <Card key={booking.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{booking.service_type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.profiles?.full_name} • {booking.profiles?.phone_number}
                      </p>
                    </div>
                    <Badge variant={
                      booking.status === 'pending' ? 'destructive' : 
                      booking.status === 'assigned' ? 'default' : 'secondary'
                    }>
                      {booking.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{booking.address}</span>
                  </div>

                  {booking.status === 'pending' && (
                    <Select onValueChange={(workerId) => handleAssignWorker(booking.id, workerId)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign worker" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWorkers.map((worker) => (
                          <SelectItem key={worker.id} value={worker.id}>
                            {worker.profiles?.full_name} - {worker.skills.join(', ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Available Workers */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Available Workers ({availableWorkers.length})
            </h2>
            <div className="space-y-4">
              {availableWorkers.map((worker) => (
                <Card key={worker.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{worker.profiles?.full_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {worker.profiles?.phone_number}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {worker.skills.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Available
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {worker.experience_years}+ years exp
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
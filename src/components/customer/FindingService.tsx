import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../BackButton";
import { useLocation as useLocationContext } from "@/contexts/LocationContext";
import { serviceAPI } from "@/services/supabaseAPI";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, MapPin, Clock, User, Phone, Star, CheckCircle, Loader2
} from "lucide-react";

export default function FindingService() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { findNearbyWorkers } = useLocationContext();
  const [searchStep, setSearchStep] = useState(1);
  const [foundWorkers, setFoundWorkers] = useState<any[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    console.log("FindingService received state:", location.state);
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
      // Create the booking in the database
      createBooking(location.state.bookingDetails);
    }
  }, [location.state]);

  const createBooking = async (details: any) => {
    if (!user?.id) {
      toast.error("Please log in to continue");
      return;
    }

    try {
      const bookingData = {
        customer_id: user.id,
        service_type: details.service,
        description: details.description || '',
        booking_type: details.bookingType,
        scheduled_date: details.scheduledDate,
        scheduled_time: details.scheduledTime,
        customer_name: details.customerName,
        customer_phone: details.customerPhone,
        address: details.address,
        latitude: details.latitude,
        longitude: details.longitude,
        estimated_cost: details.estimatedCost || 500
      };

      const result = await serviceAPI.createBooking(bookingData);
      if (result.success) {
        setBookingId(result.data.id);
        console.log("Booking created:", result.data);
      } else {
        toast.error("Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    }
  };

  useEffect(() => {
    // Find workers process
    const timer = setTimeout(async () => {
      if (searchStep === 1 && bookingDetails) {
        setSearchStep(2);
        
        try {
          // Find nearby workers using the real API
          const result = await findNearbyWorkers(bookingDetails.service, 10);
          
          if (result.success && result.data) {
            const workersWithProfiles = result.data.map(worker => ({
              id: worker.id,
              name: worker.profiles?.full_name || 'Worker',
              rating: worker.rating || 4.5,
              experience: `${worker.experience_years || 2} years`,
              distance: `${worker.distance?.toFixed(1) || '1.2'} km`,
              specialization: bookingDetails.service,
              phone: worker.profiles?.phone_number || '+91 98765 43210',
              completedJobs: worker.total_jobs || 0,
              available: worker.available,
              user_id: worker.user_id,
              hourly_rate: worker.hourly_rate || 300,
              eta: worker.eta || Math.floor(Math.random() * 30) + 5
            }));
            
            setFoundWorkers(workersWithProfiles);
            
            setTimeout(() => {
              setSearchStep(3);
            }, 2000);
          } else {
            // Fallback to mock data if no workers found
            const mockWorkers = [
              {
                id: 1,
                name: "Rajesh Kumar",
                rating: 4.8,
                experience: "5 years",
                distance: "1.2 km",
                specialization: bookingDetails.service,
                phone: "+91 98765 43210",
                completedJobs: 150,
                available: true,
                hourly_rate: 400,
                eta: 15
              },
              {
                id: 2,
                name: "Suresh Patel",
                rating: 4.6,
                experience: "3 years", 
                distance: "2.1 km",
                specialization: bookingDetails.service,
                phone: "+91 87654 32109",
                completedJobs: 89,
                available: true,
                hourly_rate: 350,
                eta: 25
              }
            ];
            setFoundWorkers(mockWorkers);
            
            setTimeout(() => {
              setSearchStep(3);
            }, 2000);
          }
        } catch (error) {
          console.error("Error finding workers:", error);
          toast.error("Failed to find nearby workers");
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchStep, bookingDetails, findNearbyWorkers]);

  const handleSelectWorker = async (worker: any) => {
    console.log("Worker selected:", worker);
    setSelectedWorker(worker);
    setSearchStep(4);
    
    // Assign worker to booking
    if (bookingId) {
      try {
        const result = await serviceAPI.updateBooking(bookingId, {
          worker_id: worker.id,
          status: 'assigned'
        });
        
        if (result.success) {
          toast.success(`${worker.name} has accepted your booking!`);
          
          setTimeout(() => {
            navigate("/customer/tracking", { 
              state: { 
                worker, 
                bookingDetails,
                bookingId: bookingId
              } 
            });
          }, 2000);
        } else {
          toast.error("Failed to assign worker");
        }
      } catch (error) {
        console.error("Error assigning worker:", error);
        toast.error("Failed to assign worker");
      }
    } else {
      // Fallback for demo
      setTimeout(() => {
        toast.success(`${worker.name} has accepted your booking!`);
        navigate("/customer/tracking", { 
          state: { 
            worker, 
            bookingDetails,
            bookingId: Date.now() 
          } 
        });
      }, 2000);
    }
  };

  const renderSearchStep = () => {
    switch (searchStep) {
      case 1:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin">
                <Search className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Searching for service providers...</h3>
            <p className="text-neutral-300">Finding qualified professionals near you</p>
          </div>
        );
      
      case 2:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Found {foundWorkers.length} service providers</h3>
            <p className="text-neutral-300">Checking availability and sending requests...</p>
          </div>
        );
      
      case 3:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Available Service Providers</h3>
            <div className="space-y-3">
              {foundWorkers.map((worker) => (
                <Card key={worker.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleSelectWorker(worker)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="font-semibold mr-2">{worker.name}</h4>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{worker.rating}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-neutral-300">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{worker.distance} away • {worker.eta} min ETA</span>
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{worker.experience} experience</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span>{worker.completedJobs} jobs completed</span>
                        </div>
                        {worker.hourly_rate && (
                          <div className="flex items-center">
                            <span className="font-semibold">₹{worker.hourly_rate}/hr</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mb-2">
                        Available Now
                      </div>
                      <Button size="sm">Select</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Booking Confirmed!</h3>
            <p className="text-neutral-300">Connecting you with {selectedWorker?.name}...</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Finding Service Provider</h1>
      
      {bookingDetails && (
        <Card className="mb-6 p-4">
          <h3 className="font-semibold mb-2">Booking Details</h3>
          <div className="space-y-2 text-sm">
            <div><strong>Service:</strong> {bookingDetails.service}</div>
            <div><strong>Type:</strong> {bookingDetails.bookingType === "now" ? "Immediate" : "Scheduled"}</div>
            {bookingDetails.scheduledDate && (
              <div><strong>Scheduled:</strong> {bookingDetails.scheduledDate} at {bookingDetails.scheduledTime}</div>
            )}
            <div className="flex items-start">
              <strong className="mr-2">Address:</strong>
              <span className="flex-1">{bookingDetails.address}</span>
            </div>
            {bookingDetails.customerName && (
              <div><strong>Customer:</strong> {bookingDetails.customerName} ({bookingDetails.customerPhone})</div>
            )}
          </div>
        </Card>
      )}
      
      <Card className="p-6 mb-6">
        {renderSearchStep()}
      </Card>
      
      {searchStep < 3 && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate("/customer/book-service")}
          >
            Cancel Search
          </Button>
        </div>
      )}
    </div>
  );
}

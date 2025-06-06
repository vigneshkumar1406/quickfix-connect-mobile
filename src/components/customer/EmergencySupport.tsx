import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Phone, MessageCircle, AlertTriangle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export default function EmergencySupport() {
  const navigate = useNavigate();
  const [isCallActive, setIsCallActive] = useState(false);
  const handleEmergencyCall = () => {
    setIsCallActive(true);
    toast.success("Connecting to emergency support...");

    // Simulate call connection
    setTimeout(() => {
      setIsCallActive(false);
      toast.info("Call ended");
    }, 5000);
  };
  const emergencyContacts = [{
    type: "Plumbing Emergency",
    phone: "+91 98765 43210",
    available: true
  }, {
    type: "Electrical Emergency",
    phone: "+91 98765 43211",
    available: true
  }, {
    type: "General Emergency",
    phone: "+91 98765 43212",
    available: false
  }];
  return <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-blue-950">Customer Support</h1>
        </div>

        {/* Main Emergency Call */}
        <Card className="p-6 mb-6 border-red-200 bg-red-50">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-bold text-red-800 mb-2">24/7 Emergency</h2>
            <p className="text-red-600 mb-6">
              For urgent plumbing, electrical, or other emergency repairs
            </p>
            
            {isCallActive ? <div className="space-y-4">
                <div className="flex items-center justify-center text-green-600">
                  <Phone className="w-5 h-5 mr-2 animate-pulse" />
                  <span>Connecting...</span>
                </div>
                <Button variant="destructive" onClick={() => setIsCallActive(false)} className="w-full">
                  End Call
                </Button>
              </div> : <Button onClick={handleEmergencyCall} className="w-full bg-red-600 hover:bg-red-700 text-lg py-3">
                <Phone className="w-5 h-5 mr-2" />
                Call Emergency: +91 99999 00000
              </Button>}
          </div>
        </Card>

        {/* Service-Specific Emergency Numbers */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-800">Service-Specific Emergency</h3>
          {emergencyContacts.map((contact, index) => <Card key={index} className={`p-4 ${!contact.available ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{contact.type}</h4>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className={`text-xs ${contact.available ? 'text-green-600' : 'text-red-600'}`}>
                      {contact.available ? 'Available Now' : 'Currently Unavailable'}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled={!contact.available} onClick={() => toast.success(`Calling ${contact.type}...`)}>
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </Card>)}
        </div>

        {/* Chat Support */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Chat with Support</h4>
              <p className="text-sm text-gray-600">Get help via text chat</p>
            </div>
            <Button variant="outline" onClick={() => toast.info("Opening chat support...")}>
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Important Notice */}
        <Card className="p-4 mt-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Important</h4>
              <p className="text-sm text-yellow-700">
                Emergency services may have additional charges. 
                Regular service hours: 8 AM - 8 PM
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>;
}
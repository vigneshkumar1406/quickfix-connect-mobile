
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { 
  Phone, MessageCircle, Mail, ArrowLeft, 
  Clock, MapPin, Send, Headphones
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import BackButton from "./BackButton";

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    toast.success("Your message has been sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleQuickContact = (type: string) => {
    switch (type) {
      case 'call':
        window.open('tel:+918888888888', '_self');
        break;
      case 'whatsapp':
        window.open('https://wa.me/918888888888?text=Hi, I need help with QuickFix services', '_blank');
        break;
      case 'email':
        window.open('mailto:support@quickfix.com?subject=QuickFix Support Request', '_self');
        break;
      case 'sms':
        window.open('sms:+918888888888?body=Hi, I need help with QuickFix services', '_self');
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-600">Get in touch with our support team</p>
      </div>

      {/* Quick Contact Options */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card 
          className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 bg-green-50 border-green-200"
          onClick={() => handleQuickContact('call')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-green-800">Call Us</h3>
            <p className="text-sm text-green-600">+91 88888 88888</p>
          </div>
        </Card>

        <Card 
          className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 bg-blue-50 border-blue-200"
          onClick={() => handleQuickContact('whatsapp')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-blue-800">WhatsApp</h3>
            <p className="text-sm text-blue-600">Chat with us</p>
          </div>
        </Card>

        <Card 
          className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 bg-purple-50 border-purple-200"
          onClick={() => handleQuickContact('email')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-purple-800">Email</h3>
            <p className="text-sm text-purple-600">support@quickfix.com</p>
          </div>
        </Card>

        <Card 
          className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 bg-orange-50 border-orange-200"
          onClick={() => handleQuickContact('sms')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-orange-800">SMS</h3>
            <p className="text-sm text-orange-600">Text us</p>
          </div>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className="p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-semibold text-lg mb-4">Send us a message</h3>
          
          <div>
            <Input
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Input
              type="tel"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </form>
      </Card>

      {/* Business Hours & Info */}
      <Card className="p-6 mb-6">
        <h3 className="font-semibold text-lg mb-4">Business Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <h4 className="font-medium">Business Hours</h4>
              <p className="text-sm text-gray-600">
                Monday - Sunday: 6:00 AM - 10:00 PM<br />
                Emergency services: 24/7
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <h4 className="font-medium">Service Areas</h4>
              <p className="text-sm text-gray-600">
                Chennai, Bangalore, Mumbai, Delhi<br />
                and 50+ other cities
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Headphones className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <h4 className="font-medium">Customer Support</h4>
              <p className="text-sm text-gray-600">
                Average response time: 2 minutes<br />
                Available in 10+ languages
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-red-800">Emergency Services</h4>
            <p className="text-sm text-red-600">For urgent issues: +91 99999 99999</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

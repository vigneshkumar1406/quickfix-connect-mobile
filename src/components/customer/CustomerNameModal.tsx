
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { toast } from "sonner";

interface CustomerNameModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  loading?: boolean;
}

export default function CustomerNameModal({ isOpen, onSubmit, loading = false }: CustomerNameModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" closeButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <User className="w-6 h-6 mr-2 text-primary" />
            Welcome to QuickFix!
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              We'd love to know your name to personalize your experience
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerName">Your Name</Label>
            <Input
              id="customerName"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
              autoFocus
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || !name.trim()}
          >
            {loading ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

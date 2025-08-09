
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Users, Plus, Phone, X } from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface ContactBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
}

export default function ContactBookModal({ isOpen, onClose, onSelectContact }: ContactBookModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });

  useEffect(() => {
    // Load contacts from localStorage
    const savedContacts = localStorage.getItem('fixsify_contacts') || localStorage.getItem('quickfix_contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
      // migrate legacy key if needed
      localStorage.setItem('fixsify_contacts', savedContacts);
      localStorage.removeItem('quickfix_contacts');
    }
  }, []);

  const saveContacts = (updatedContacts: Contact[]) => {
    localStorage.setItem('fixsify_contacts', JSON.stringify(updatedContacts));
    localStorage.removeItem('quickfix_contacts');
    setContacts(updatedContacts);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    if (newContact.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name.trim(),
      phone: newContact.phone.trim()
    };

    const updatedContacts = [...contacts, contact];
    saveContacts(updatedContacts);
    setNewContact({ name: "", phone: "" });
    setShowAddForm(false);
    toast.success("Contact added successfully");
  };

  const handleSelectContact = (contact: Contact) => {
    onSelectContact(contact);
    onClose();
  };

  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = contacts.filter(c => c.id !== contactId);
    saveContacts(updatedContacts);
    toast.success("Contact removed");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Users className="w-6 h-6 mr-2 text-primary" />
            Select Contact
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!showAddForm ? (
            <>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="w-full"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Contact
              </Button>
              
              {contacts.length === 0 ? (
                <Card className="p-6 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No contacts saved yet</p>
                  <p className="text-sm text-gray-500">Add contacts to book services for others</p>
                </Card>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {contacts.map((contact) => (
                    <Card key={contact.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => handleSelectContact(contact)}
                        >
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-primary mr-2" />
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-gray-600">{contact.phone}</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Name</Label>
                <Input
                  id="contactName"
                  type="text"
                  placeholder="Enter contact name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  maxLength={50}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value.replace(/\D/g, '') })}
                  maxLength={10}
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  Add Contact
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewContact({ name: "", phone: "" });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

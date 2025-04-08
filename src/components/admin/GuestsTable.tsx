
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  dietary_restrictions: string | null;
  household: {
    name: string;
    invitation_code: string;
    address: string | null;
  };
  household_id: string;
}

interface Household {
  id: string;
  name: string;
  invitation_code: string;
  address: string | null;
}

interface GuestsTableProps {
  guests: Guest[];
  onDelete: () => void;
}

export const GuestsTable = ({ guests, onDelete }: GuestsTableProps) => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [editingHousehold, setEditingHousehold] = useState<string | null>(null);
  const [newHouseholdName, setNewHouseholdName] = useState("");
  const [isCreatingNewHousehold, setIsCreatingNewHousehold] = useState(false);
  
  // For editing a guest
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  
  // For editing a household directly
  const [editingHouseholdData, setEditingHouseholdData] = useState<Household | null>(null);

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    const { data, error } = await supabase
      .from('households')
      .select('id, name, invitation_code, address')
      .order('name');
    
    if (error) {
      toast.error("Error fetching households");
      return;
    }
    
    setHouseholds(data || []);
  };

  const handleDelete = async (guestId: string) => {
    try {
      // First, delete all guest_events records for this guest
      const { error: eventError } = await supabase
        .from('guest_events')
        .delete()
        .eq('guest_id', guestId);

      if (eventError) throw eventError;

      // Then delete the guest record
      const { error: guestError } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);

      if (guestError) throw guestError;
      
      toast.success("Guest deleted successfully");
      onDelete();
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast.error("Error deleting guest");
    }
  };

  const createNewHousehold = async (guestId: string) => {
    if (!newHouseholdName.trim()) {
      toast.error("Please enter a household name");
      return;
    }

    try {
      // Create new household with a random invitation code
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({ 
          name: newHouseholdName.trim(),
          invitation_code: Math.random().toString(36).substring(2, 8).toUpperCase()
        })
        .select()
        .single();

      if (householdError) throw householdError;

      // Update guest's household
      const { error: updateError } = await supabase
        .from('guests')
        .update({ household_id: household.id })
        .eq('id', guestId);

      if (updateError) throw updateError;

      toast.success("Household created and assigned successfully");
      setNewHouseholdName("");
      setIsCreatingNewHousehold(false);
      setEditingHousehold(null);
      fetchHouseholds();
      onDelete(); // Refresh guest list
    } catch (error) {
      console.error('Error creating household:', error);
      toast.error("Error creating household");
    }
  };

  const updateGuestHousehold = async (guestId: string, householdId: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ household_id: householdId })
        .eq('id', guestId);

      if (error) throw error;

      toast.success("Household updated successfully");
      setEditingHousehold(null);
      onDelete(); // Refresh guest list
    } catch (error) {
      console.error('Error updating household:', error);
      toast.error("Error updating household");
    }
  };

  // New function to update guest information
  const updateGuest = async () => {
    if (!editingGuest) return;

    try {
      const { error } = await supabase
        .from('guests')
        .update({
          first_name: editingGuest.first_name,
          last_name: editingGuest.last_name,
          email: editingGuest.email,
          phone: editingGuest.phone,
          dietary_restrictions: editingGuest.dietary_restrictions
        })
        .eq('id', editingGuest.id);

      if (error) throw error;

      toast.success("Guest updated successfully");
      setEditingGuest(null);
      onDelete(); // Refresh guest list
    } catch (error) {
      console.error('Error updating guest:', error);
      toast.error("Error updating guest");
    }
  };

  // New function to update household information
  const updateHousehold = async () => {
    if (!editingHouseholdData) return;

    try {
      const { error } = await supabase
        .from('households')
        .update({
          name: editingHouseholdData.name,
          address: editingHouseholdData.address
        })
        .eq('id', editingHouseholdData.id);

      if (error) throw error;

      toast.success("Household updated successfully");
      setEditingHouseholdData(null);
      fetchHouseholds();
      onDelete(); // Refresh guest list to show updated household information
    } catch (error) {
      console.error('Error updating household:', error);
      toast.error("Error updating household");
    }
  };

  // Function to open household edit dialog
  const openHouseholdEdit = (householdId: string) => {
    const household = households.find(h => h.id === householdId);
    if (household) {
      setEditingHouseholdData({ ...household });
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Guest</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Household</th>
              <th className="text-left p-2">Invitation Code</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id} className="border-b">
                <td className="p-2">
                  <div className="flex gap-2 items-center">
                    <span>{guest.first_name} {guest.last_name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingGuest({ ...guest })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
                <td className="p-2">{guest.email || "-"}</td>
                <td className="p-2">
                  {editingHousehold === guest.id ? (
                    isCreatingNewHousehold ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          value={newHouseholdName}
                          onChange={(e) => setNewHouseholdName(e.target.value)}
                          placeholder="Enter household name"
                          className="w-48"
                        />
                        <Button size="sm" onClick={() => createNewHousehold(guest.id)}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsCreatingNewHousehold(false);
                            setNewHouseholdName("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <Select
                          defaultValue={guest.household_id}
                          onValueChange={(value) => updateGuestHousehold(guest.id, value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select household" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border rounded-md shadow-md">
                            {households.map((household) => (
                              <SelectItem key={household.id} value={household.id}>
                                {household.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsCreatingNewHousehold(true);
                          }}
                        >
                          New
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingHousehold(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )
                  ) : (
                    <div className="flex gap-2 items-center">
                      <span>{guest.household.name}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingHousehold(guest.id)}
                      >
                        Change
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openHouseholdEdit(guest.household_id)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </td>
                <td className="p-2">{guest.household.invitation_code}</td>
                <td className="p-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(guest.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Guest Edit Dialog */}
      <Dialog open={!!editingGuest} onOpenChange={(open) => !open && setEditingGuest(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Guest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input 
                  value={editingGuest?.first_name || ''}
                  onChange={(e) => setEditingGuest(prev => prev ? {...prev, first_name: e.target.value} : null)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input 
                  value={editingGuest?.last_name || ''}
                  onChange={(e) => setEditingGuest(prev => prev ? {...prev, last_name: e.target.value} : null)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input 
                value={editingGuest?.email || ''}
                onChange={(e) => setEditingGuest(prev => prev ? {...prev, email: e.target.value || null} : null)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input 
                value={editingGuest?.phone || ''}
                onChange={(e) => setEditingGuest(prev => prev ? {...prev, phone: e.target.value || null} : null)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Dietary Restrictions</label>
              <Input 
                value={editingGuest?.dietary_restrictions || ''}
                onChange={(e) => setEditingGuest(prev => prev ? {...prev, dietary_restrictions: e.target.value || null} : null)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingGuest(null)}>Cancel</Button>
              <Button onClick={updateGuest}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Household Edit Dialog */}
      <Dialog open={!!editingHouseholdData} onOpenChange={(open) => !open && setEditingHouseholdData(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Household</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Household Name</label>
              <Input 
                value={editingHouseholdData?.name || ''}
                onChange={(e) => setEditingHouseholdData(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input 
                value={editingHouseholdData?.address || ''}
                onChange={(e) => setEditingHouseholdData(prev => prev ? {...prev, address: e.target.value || null} : null)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Invitation Code</label>
              <Input 
                value={editingHouseholdData?.invitation_code || ''}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Invitation codes cannot be modified</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingHouseholdData(null)}>Cancel</Button>
              <Button onClick={updateHousehold}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

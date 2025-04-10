
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GuestsTable } from "./guests/GuestsTable";
import { Guest } from "./types/guest";
import { GuestForm } from "./GuestForm";
import { HouseholdConsolidation } from "./guests/HouseholdConsolidation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, UserPlus, Users } from "lucide-react";
import { useWeddingEvent } from "./hooks/useWeddingEvent";

export const GuestManagement = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { weddingEventId } = useWeddingEvent();

  const fetchGuests = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('guests')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          dietary_restrictions,
          household_id,
          household:households (name, invitation_code, address)
        `)
        .order('last_name');

      if (error) throw error;
      
      setGuests(data as Guest[]);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Guest Management
        </h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchGuests}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            size="sm"
            onClick={toggleAddForm}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            {showAddForm ? 'Hide Form' : 'Add Guest'}
          </Button>
        </div>
      </div>

      <HouseholdConsolidation onSuccess={fetchGuests} />
      
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Guest</CardTitle>
            <CardDescription>Enter the details for a new guest</CardDescription>
          </CardHeader>
          <CardContent>
            <GuestForm onSuccess={fetchGuests} />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <GuestsTable guests={guests} onDelete={fetchGuests} />
      )}
    </div>
  );
};

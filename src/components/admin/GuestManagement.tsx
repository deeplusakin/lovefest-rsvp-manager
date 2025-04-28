
import React, { useState } from "react";
import { GuestsTable } from "./guests/GuestsTable";
import { GuestForm } from "./GuestForm";
import { HouseholdConsolidation } from "./guests/HouseholdConsolidation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, UserPlus, Users } from "lucide-react";
import { useWeddingEvent } from "./hooks/useWeddingEvent";
import { useGuestData } from "@/hooks/useGuestData";

interface GuestManagementProps {
  onGuestsChange?: () => void;
}

export const GuestManagement = ({ onGuestsChange }: GuestManagementProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { weddingEventId } = useWeddingEvent();
  
  // Use our centralized guest data hook
  const { guests, isLoading, fetchGuests } = useGuestData();

  const handleRefresh = async () => {
    // Force a fresh fetch from the server
    await fetchGuests(true);
    
    // Notify parent component that guests have changed
    if (onGuestsChange) {
      onGuestsChange();
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const handleGuestSuccess = () => {
    handleRefresh();
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
            onClick={handleRefresh}
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

      <HouseholdConsolidation onSuccess={handleGuestSuccess} />
      
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Guest</CardTitle>
            <CardDescription>Enter the details for a new guest</CardDescription>
          </CardHeader>
          <CardContent>
            <GuestForm onSuccess={handleGuestSuccess} />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <GuestsTable guests={guests} onDelete={handleGuestSuccess} />
      )}
    </div>
  );
};


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { useEventStats } from "@/hooks/useEventStats";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminContent } from "@/components/admin/AdminContent";

export const Admin = () => {
  const [currentTab, setCurrentTab] = useState('events');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  // Initialize data fetching only when user is authenticated
  const { events, contributions, totalContributions, isLoading, isError, fetchData, fetchEvents } = useAdminData();
  const { getEventStats } = useEventStats();

  // Check authentication status when component mounts
  useAdminAuth(() => {
    setIsAuthenticated(true);
  });

  // Only fetch data once authentication is confirmed
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleGuestTabChange = (tabId: string) => {
    // If switching from guests to RSVPs, refresh the event data
    if (currentTab === 'guests' && tabId === 'rsvps') {
      fetchEvents();
    }
    setCurrentTab(tabId);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-10">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentTab={currentTab} 
          onTabChange={handleGuestTabChange} 
          onSignOut={handleSignOut} 
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-auto pb-20">
          {/* Mobile padding to avoid content being hidden behind the mobile menu */}
          <div className="md:hidden h-16"></div>
          
          <div className="p-6 md:pt-4">
            <div className="bg-card rounded-lg shadow-sm p-6 mb-12">
              <AdminContent
                currentTab={currentTab}
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
                isError={isError}
                events={events}
                contributions={contributions}
                totalContributions={totalContributions}
                fetchData={fetchData}
                fetchEvents={fetchEvents}
                getEventStats={getEventStats}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuthContext, AdminAuthProvider } from "@/hooks/useAdminAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { useEventStats } from "@/hooks/useEventStats";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminContent } from "@/components/admin/AdminContent";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState('events');
  const navigate = useNavigate();
  
  console.time('admin-page-load');
  
  // Get auth status from context with improved logout function
  const { isAdmin, isCheckingAuth, logout } = useAdminAuthContext();
  
  // Initialize data fetching only when user is authenticated
  const { events, contributions, totalContributions, isLoading, isError, fetchData, fetchEvents } = useAdminData();
  const { getEventStats } = useEventStats();

  // Log when page is fully loaded
  useEffect(() => {
    if (!isCheckingAuth && !isLoading) {
      console.timeEnd('admin-page-load');
    }
  }, [isCheckingAuth, isLoading]);

  const handleSignOut = async () => {
    try {
      toast.loading("Signing out...");
      // Use the improved logout function from context
      await logout();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Error signing out. Please try again.");
    }
  };

  const handleGuestTabChange = (tabId: string) => {
    // If switching from guests to RSVPs, refresh the event data
    if (currentTab === 'guests' && tabId === 'rsvps') {
      fetchEvents();
    }
    setCurrentTab(tabId);
  };

  const handleRetryData = () => {
    fetchData();
  };

  // If still checking auth, show a more informative loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Verifying authentication...</p>
          <p className="text-sm text-muted-foreground">This may take a moment</p>
        </div>
      </div>
    );
  }

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
              {isError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    There was a problem loading the data. 
                  </AlertDescription>
                  <Button onClick={handleRetryData} variant="outline" className="ml-2">
                    Retry
                  </Button>
                </Alert>
              )}
              <AdminContent
                currentTab={currentTab}
                isAuthenticated={isAdmin}
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

// Wrap the dashboard with our auth provider
export const Admin = () => {
  return (
    <AdminAuthProvider>
      <AdminDashboard />
    </AdminAuthProvider>
  );
};

export default Admin;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { useEventStats } from "@/hooks/useEventStats";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminContent } from "@/components/admin/AdminContent";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export const Admin = () => {
  const [currentTab, setCurrentTab] = useState('events');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTimedOut, setAuthTimedOut] = useState(false);
  const navigate = useNavigate();
  
  console.time('admin-page-load');
  
  // Initialize auth check with callback
  const { isCheckingAuth } = useAdminAuth(() => {
    console.log('Auth confirmed, setting authenticated state');
    setIsAuthenticated(true);
    setAuthTimedOut(false); // Reset timeout state on successful auth
  });
  
  // Initialize data fetching only when user is authenticated
  const { events, contributions, totalContributions, isLoading, isError, fetchData, fetchEvents } = useAdminData();
  const { getEventStats } = useEventStats();

  // Only fetch data once authentication is confirmed
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User authenticated, fetching data');
      fetchData();
    }
  }, [isAuthenticated, fetchData]);
  
  // Handle authentication timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isCheckingAuth) {
      // Set a timeout for authentication check
      timeoutId = setTimeout(() => {
        setAuthTimedOut(true);
      }, 10000); // 10 seconds timeout
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isCheckingAuth]);
  
  // Log when page is fully loaded
  useEffect(() => {
    if (!isCheckingAuth && !isLoading) {
      console.timeEnd('admin-page-load');
    }
  }, [isCheckingAuth, isLoading]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
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

  const handleRetryAuth = () => {
    setAuthTimedOut(false);
    window.location.reload();
  };

  // If auth check times out, show retry option
  if (authTimedOut) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-md">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-center mb-4">Authentication Taking Too Long</h2>
          <p className="text-muted-foreground mb-6 text-center">
            We're having trouble verifying your admin status. This could be due to a slow connection or a temporary issue.
          </p>
          <div className="space-y-4">
            <Button onClick={handleRetryAuth} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Authentication
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
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

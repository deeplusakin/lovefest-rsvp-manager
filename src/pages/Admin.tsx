
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard as DashboardIcon, Image as ImageIcon, Users as UsersIcon, Calendar as CalendarIcon, PiggyBank as PiggyBankIcon, Settings as SettingsIcon, BarChart as BarChartIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { EventsList } from "@/components/admin/EventsList";
import { EventStatistics } from "@/components/admin/EventStatistics";
import { RSVPList } from "@/components/admin/RSVPList";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { ContributionsList } from "@/components/admin/ContributionsList";
import { ProfileSettings } from "@/components/admin/ProfileSettings";
import { GuestManagement } from "@/components/admin/GuestManagement";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { getEventStats } from "@/utils/eventStats";

export const Admin = () => {
  const [currentTab, setCurrentTab] = useState('events');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { events, contributions, totalContributions, isLoading, fetchData, fetchEvents } = useAdminData();

  // Check authentication status when component mounts
  useAdminAuth(() => {
    setIsAuthenticated(true);
    fetchData();
  });

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

  const renderContent = () => {
    switch (currentTab) {
      case 'events':
        return <EventsList events={events} onEdit={() => {}} onDelete={() => {}} />;
      case 'guests':
        return <GuestManagement onGuestsChange={fetchEvents} />;
      case 'rsvps':
        return <RSVPList events={events} getEventStats={getEventStats} />;
      case 'photos':
        return <PhotoManager />;
      case 'contributions':
        return <ContributionsList contributions={contributions} totalContributions={totalContributions} />;
      case 'profile':
        return <ProfileSettings />;
      case 'statistics':
        const firstEvent = events && events.length > 0 ? events[0] : null;
        return <EventStatistics stats={getEventStats(firstEvent)} />;
      default:
        const defaultEvent = events && events.length > 0 ? events[0] : null;
        return <EventStatistics stats={getEventStats(defaultEvent)} />;
    }
  };

  const sidebarItems = [
    { id: 'events', label: 'Events', icon: CalendarIcon },
    { id: 'guests', label: 'Guests', icon: UsersIcon },
    { id: 'rsvps', label: 'RSVPs', icon: DashboardIcon },
    { id: 'photos', label: 'Photos', icon: ImageIcon },
    { id: 'contributions', label: 'Contributions', icon: PiggyBankIcon },
    { id: 'statistics', label: 'Statistics', icon: BarChartIcon },
    { id: 'profile', label: 'Profile', icon: SettingsIcon },
  ];

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pt-10">
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile menu */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-background p-4 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Menu <span className="ml-2">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background">
              <DropdownMenuLabel>Admin Dashboard</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sidebarItems.map((item) => (
                <DropdownMenuItem key={item.id} onClick={() => handleGuestTabChange(item.id)}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 border-r bg-card min-h-screen">
          <div className="p-6 flex flex-col h-full">
            <div>
              <h3 className="font-semibold text-lg">Admin Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Wedding Management
              </p>
              <div className="space-y-1">
                {sidebarItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "justify-start w-full",
                      currentTab === item.id ? "bg-secondary" : "hover:bg-secondary",
                    )}
                    onClick={() => handleGuestTabChange(item.id)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-auto pt-6">
              <Button
                variant="ghost"
                className="justify-start w-full"
                onClick={handleSignOut}
              >
                <SettingsIcon className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-auto pb-20">
          {/* Mobile padding to avoid content being hidden behind the mobile menu */}
          <div className="md:hidden h-16"></div>
          
          <div className="p-6 md:pt-4">
            <div className="bg-card rounded-lg shadow-sm p-6 mb-12">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

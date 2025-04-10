
import { useState, useEffect } from "react";
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

export const Admin = () => {
  const [currentTab, setCurrentTab] = useState('events');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { events, contributions, totalContributions, isLoading, fetchData } = useAdminData();

  // Check authentication status when component mounts
  useAdminAuth(() => {
    setIsAuthenticated(true);
    fetchData();
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getEventStats = (event) => {
    const totalInvited = event.guest_events?.length || 0;
    const responded = event.guest_events?.filter(ge => ge.status !== 'invited').length || 0;
    const attending = event.guest_events?.filter(ge => ge.status === 'attending').length || 0;
    const notAttending = event.guest_events?.filter(ge => ge.status === 'not_attending').length || 0;

    return {
      totalInvited,
      responded,
      attending,
      notAttending
    };
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'events':
        return <EventsList events={events} onEdit={() => {}} onDelete={() => {}} />;
      case 'guests':
        return <GuestManagement />;
      case 'rsvps':
        return <RSVPList events={events} getEventStats={getEventStats} />;
      case 'photos':
        return <PhotoManager />;
      case 'contributions':
        return <ContributionsList contributions={contributions} totalContributions={totalContributions} />;
      case 'profile':
        return <ProfileSettings />;
      case 'statistics':
        return <EventStatistics stats={getEventStats(events[0] || { guest_events: [] })} />;
      default:
        return <EventStatistics stats={getEventStats(events[0] || { guest_events: [] })} />;
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
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Menu <span className="ml-2">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Admin Dashboard</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sidebarItems.map((item) => (
              <DropdownMenuItem key={item.id} onClick={() => setCurrentTab(item.id)}>
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="hidden md:flex flex-col pr-6 w-64 flex-shrink-0">
          <div className="space-y-3">
            <div className="pb-2">
              <h3 className="font-semibold text-lg">Admin Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Wedding Management
              </p>
            </div>
            <div className="flex flex-col space-y-1">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "justify-start",
                    currentTab === item.id ? "bg-secondary" : "hover:bg-secondary",
                  )}
                  onClick={() => setCurrentTab(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-auto pb-4">
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
        <div className="flex-1">
          <div className="py-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

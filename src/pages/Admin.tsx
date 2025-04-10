import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Shell } from "@/components/Shell";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { DashboardIcon, ImageIcon, UsersIcon, CalendarIcon, PiggyBankIcon, SettingsIcon, BarChartIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { EventsList } from "@/components/admin/EventsList";
import { EventStatistics } from "@/components/admin/EventStatistics";
import { RSVPList } from "@/components/admin/RSVPList";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { ContributionsList } from "@/components/admin/ContributionsList";
import { ProfileSettings } from "@/components/admin/ProfileSettings";
import { GuestManagement } from "@/components/admin/GuestManagement";

export const Admin = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('events');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Redirecting to login...</div>;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'events':
        return <EventsList />;
      case 'guests':
        return <GuestManagement />;
      case 'rsvps':
        return <RSVPList />;
      case 'photos':
        return <PhotoManager />;
      case 'contributions':
        return <ContributionsList />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <EventStatistics />;
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

  return (
    <Shell>
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Menu <Icons.chevronDown className="ml-2 h-4 w-4" />
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
            <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="hidden md:flex flex-col pr-6 w-64 flex-shrink-0">
        <div className="space-y-3">
          <div className="pb-2">
            <h3 className="font-semibold text-lg">Admin Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              {siteConfig.name} Management
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start w-full">
                <Icons.user className="mr-2 h-4 w-4" />
                {session?.user?.name}
                <Icons.chevronDown className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1">
        <div className="py-6">
          {renderContent()}
        </div>
      </div>
    </Shell>
  );
};

export default Admin;


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

interface SidebarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  onSignOut: () => void;
}

export const Sidebar = ({ currentTab, onTabChange, onSignOut }: SidebarProps) => {
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
    <>
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
              <DropdownMenuItem key={item.id} onClick={() => onTabChange(item.id)}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>Logout</DropdownMenuItem>
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
                  onClick={() => onTabChange(item.id)}
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
              onClick={onSignOut}
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

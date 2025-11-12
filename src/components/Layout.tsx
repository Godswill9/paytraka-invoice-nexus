import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { isAuthenticated, logout } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated() && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [navigate, location]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/login');
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="sticky top-0 z-50 h-14 border-b border-border bg-card flex items-center px-4 gap-2">
            <SidebarTrigger />
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-2">
                <img 
                  src="https://einvoice.firs.gov.ng/favicon.png" 
                  alt="FIRS" 
                  className="h-6 w-6"
                />
                <span className="text-sm text-muted-foreground hidden sm:inline">FIRS Compliant</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </header>
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

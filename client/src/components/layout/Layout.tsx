import { ReactNode, useEffect } from "react";
import SideNavigation from "@/components/layout/SideNavigation";
import MobileHeader from "@/components/layout/MobileHeader";
import Footer from "@/components/layout/Footer";
import { useUI } from "@/context/UIContext";
import { useLocation } from "wouter";
import { trackPageView } from "@/firebase/analytics";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const { sidebarOpen, isMobile, closeSidebar } = useUI();
  const [location] = useLocation();

  // Track page views for analytics
  useEffect(() => {
    trackPageView(location, title);
  }, [location, title]);

  // Close mobile sidebar when navigating
  useEffect(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [location, isMobile, closeSidebar]);

  return (
    <div className="flex min-h-screen">
      <SideNavigation />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
        <MobileHeader />
        
        <div className="p-6 space-y-6">
          {children}
        </div>
        
        <Footer />
      </main>
    </div>
  );
};

export default Layout;

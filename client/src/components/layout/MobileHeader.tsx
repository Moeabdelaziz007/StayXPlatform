import { useUI } from "@/context/UIContext";
import { Button } from "@/components/ui/button";

const MobileHeader = () => {
  const { toggleSidebar } = useUI();

  return (
    <div className="md:hidden flex items-center justify-between px-4 h-16 bg-[#1E1E1E] border-b border-[#2A2A2A]">
      <h1 className="text-xl font-bold font-poppins">
        <span className="text-neon-green neon-text">Stay</span>X
      </h1>
      <Button 
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="text-gray-light hover:text-neon-green transition-colors"
      >
        <i className="ri-menu-line text-2xl"></i>
      </Button>
    </div>
  );
};

export default MobileHeader;

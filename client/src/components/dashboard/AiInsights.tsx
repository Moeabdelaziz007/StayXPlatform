import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { trackFeatureUsage } from "@/firebase/analytics";

interface InsightItemProps {
  title: string;
  icon: string;
  description: string;
  progress?: {
    value: number;
    label: string;
  };
  action?: {
    label: string;
    onClick: () => void;
  };
}

const InsightItem = ({ title, icon, description, progress, action }: InsightItemProps) => {
  return (
    <div className="bg-[#2A2A2A] rounded-lg p-4">
      <h4 className="font-medium mb-2 flex items-center">
        <i className={`${icon} text-neon-green mr-2`}></i>
        {title}
      </h4>
      <p className="text-sm text-gray-medium mb-3">{description}</p>
      
      {progress && (
        <div className="mt-2">
          <div className="h-2 w-full bg-[#121212] rounded-full overflow-hidden">
            <div 
              className="h-full bg-neon-green rounded-full" 
              style={{ width: `${progress.value}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>{progress.label}</span>
            <span>{progress.value}%</span>
          </div>
        </div>
      )}
      
      {action && (
        <div className="flex mt-3">
          <Button 
            variant="link" 
            className="text-xs text-neon-green hover:underline p-0 h-auto"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

const AiInsights = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Card className="bg-[#1E1E1E] rounded-xl p-6 border border-[#2A2A2A] space-dots">
        <Skeleton className="h-8 w-1/3 bg-[#2A2A2A] mb-4" />
        <Skeleton className="h-4 w-full bg-[#2A2A2A] mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-32 w-full bg-[#2A2A2A] rounded-lg" />
          <Skeleton className="h-32 w-full bg-[#2A2A2A] rounded-lg" />
          <Skeleton className="h-32 w-full bg-[#2A2A2A] rounded-lg" />
          <Skeleton className="h-32 w-full bg-[#2A2A2A] rounded-lg" />
        </div>
      </Card>
    );
  }
  
  const handleGenerateReport = () => {
    trackFeatureUsage('ai_report_generation');
    // In a real app, this would trigger an AI process
  };
  
  const handleViewRecommendations = () => {
    trackFeatureUsage('view_ai_recommendations');
    // Navigate to recommendations page
  };

  return (
    <Card className="bg-[#1E1E1E] rounded-xl p-6 border border-[#2A2A2A] space-dots">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-neon-green bg-opacity-10 flex items-center justify-center mr-4">
          <i className="ri-brain-line text-neon-green"></i>
        </div>
        <h3 className="text-xl font-medium">Network Intelligence Report</h3>
      </div>
      
      <p className="text-gray-medium mb-6">Based on your profile and connections, our AI has generated these insights:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightItem 
          title="Connection Quality"
          icon="ri-user-star-line"
          description="Your network has high-value connections in blockchain development and DeFi."
          progress={{
            value: 85,
            label: "High Value"
          }}
        />
        
        <InsightItem 
          title="Network Diversity"
          icon="ri-group-line"
          description="Increasing diversity in tech sectors would strengthen your network."
          progress={{
            value: 62,
            label: "Medium Diversity"
          }}
        />
        
        <InsightItem 
          title="Growth Opportunity"
          icon="ri-focus-3-line"
          description="Connect with more investment advisors to expand your financial knowledge."
          action={{
            label: "View Recommendations",
            onClick: handleViewRecommendations
          }}
        />
        
        <InsightItem 
          title="Engagement Analysis"
          icon="ri-line-chart-line"
          description="Your profile response rate is above average at 78%. Keep it up!"
          progress={{
            value: 78,
            label: "Above Average"
          }}
        />
      </div>
      
      <Button 
        onClick={handleGenerateReport}
        className="mt-6 mx-auto block bg-neon-green bg-opacity-10 hover:bg-opacity-20 text-neon-green font-medium px-4 py-2 rounded-lg transition-all duration-200"
      >
        Generate Full Report
      </Button>
    </Card>
  );
};

export default AiInsights;

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    positive: boolean;
    text: string;
  };
  className?: string;
}

const StatsCard = ({ title, value, icon, trend, className }: StatsCardProps) => {
  return (
    <Card className={cn(
      "card bg-[#1E1E1E] rounded-xl p-6 border border-[#2A2A2A] hover:border-neon-green transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <span className="text-neon-green bg-neon-green bg-opacity-10 p-1.5 rounded-lg">
          <i className={icon}></i>
        </span>
      </div>
      <p className="text-3xl font-bold mb-2">{value}</p>
      {trend && (
        <div className="flex items-center text-sm">
          <span className={cn(
            "flex items-center",
            trend.positive ? "text-green-400" : "text-red-400"
          )}>
            <i className={cn(
              "mr-1",
              trend.positive ? "ri-arrow-up-line" : "ri-arrow-down-line"
            )}></i>
            {trend.value}
          </span>
          <span className="text-gray-medium ml-2">{trend.text}</span>
        </div>
      )}
    </Card>
  );
};

export default StatsCard;

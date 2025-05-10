import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackFeatureUsage } from "@/firebase/analytics";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  features: string[];
  ctaText: string;
  ctaIcon: string;
  primary?: boolean;
  onAction: () => void;
}

const FeatureCard = ({
  title,
  description,
  icon,
  features,
  ctaText,
  ctaIcon,
  primary = false,
  onAction
}: FeatureCardProps) => {
  return (
    <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] rounded-xl p-6 border border-[#2A2A2A] overflow-hidden relative">
      {/* Background icon */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <i className={`${icon} text-9xl text-neon-green`}></i>
      </div>
      
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-gray-medium mb-4 z-10 relative">{description}</p>
      
      <ul className="space-y-2 mb-4 text-sm">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <i className="ri-check-line text-neon-green mr-2"></i>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button
        onClick={onAction}
        className={
          primary
            ? "text-dark bg-neon-green hover:bg-opacity-90 font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
            : "border border-neon-green text-neon-green hover:bg-neon-green hover:bg-opacity-10 font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
        }
      >
        <i className={`${ctaIcon} mr-2`}></i>
        {ctaText}
      </Button>
    </div>
  );
};

const UpcomingFeatures = () => {
  const handleGetNotified = () => {
    trackFeatureUsage('crypto_wallet_notification');
    // In a real app, this would subscribe the user to notifications
  };

  const handleJoinWaitlist = () => {
    trackFeatureUsage('ai_matching_waitlist');
    // In a real app, this would add the user to the waitlist
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-poppins">Coming Soon</h2>
        <Badge className="bg-neon-green text-dark text-xs font-bold px-2 py-1 rounded-full">
          BETA
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard
          title="Crypto Wallet Integration"
          description="Connect your crypto wallets and showcase your digital assets within your profile."
          icon="ri-bitcoin-line"
          features={[
            "Multi-chain wallet support",
            "Privacy controls for asset visibility",
            "Crypto achievement badges"
          ]}
          ctaText="Get Notified"
          ctaIcon="ri-notification-line"
          primary={true}
          onAction={handleGetNotified}
        />
        
        <FeatureCard
          title="Advanced AI Matching"
          description="Our next-gen AI algorithm will provide deeper insights and more precise connection matches."
          icon="ri-rocket-line"
          features={[
            "Sentiment analysis on shared interests",
            "Predictive compatibility metrics",
            "Connection quality scoring"
          ]}
          ctaText="Join Waitlist"
          ctaIcon="ri-seedling-line"
          onAction={handleJoinWaitlist}
        />
      </div>
    </section>
  );
};

export default UpcomingFeatures;

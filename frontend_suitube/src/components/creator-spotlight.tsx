import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coins, Heart, TrendingUp } from "lucide-react";

export default function CreatorSpotlight() {
  const spotlightCreators = [
    {
      name: "Alex Chen",
      role: "Blockchain Educator",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      earnings: 15420,
      metric: "This month's earnings",
      icon: Coins,
      iconColor: "text-yellow-300",
    },
    {
      name: "Sarah Kim",
      role: "DeFi Expert",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      earnings: 8950,
      metric: "Most appreciated creator",
      icon: Heart,
      iconColor: "text-red-300",
    },
    {
      name: "Marcus Johnson",
      role: "NFT Artist",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      earnings: 340,
      metric: "This month's rising star",
      icon: TrendingUp,
      iconColor: "text-green-300",
      isPercentage: true,
    },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 hexagon-pattern">
      <div className="absolute inset-0 gradient-overlay" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white mb-8">
          <h3 className="text-3xl font-bold mb-4">Sui Spotlight</h3>
          <p className="text-xl opacity-90">Celebrating creators who are building the future of video</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {spotlightCreators.map((creator, index) => (
            <Card key={index} className="bg-white bg-opacity-10 backdrop-blur-lg border-0 text-white text-center">
              <CardContent className="p-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={creator.avatar} />
                  <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <h4 className="text-lg font-semibold">{creator.name}</h4>
                <p className="text-sm opacity-80 mb-2">{creator.role}</p>
                
                <div className="flex items-center justify-center space-x-2">
                  <creator.icon className={`h-5 w-5 ${creator.iconColor}`} />
                  <span className="font-bold">
                    {creator.isPercentage ? `+${creator.earnings}%` : `${creator.earnings.toLocaleString()} SUI`}
                  </span>
                </div>
                
                <p className="text-xs opacity-70 mt-2">{creator.metric}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

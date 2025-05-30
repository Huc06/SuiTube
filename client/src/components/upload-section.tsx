import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Coins, Shield } from "lucide-react";

export default function UploadSection() {
  const features = [
    {
      icon: Upload,
      title: "Upload Instantly",
      description: "Drag and drop your videos for instant IPFS storage",
      color: "bg-blue-600 bg-opacity-10 text-blue-600",
    },
    {
      icon: Coins,
      title: "Earn Rewards",
      description: "Get paid in SUI tokens for views, tips, and engagement",
      color: "bg-teal-500 bg-opacity-10 text-teal-500",
    },
    {
      icon: Shield,
      title: "Own Your Content",
      description: "True ownership with blockchain verification",
      color: "bg-purple-500 bg-opacity-10 text-purple-500",
    },
  ];

  return (
    <section className="bg-white py-12 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Create?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Upload your content to the decentralized web and start earning SUI tokens
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <Button
          size="lg"
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Start Creating Now
        </Button>
      </div>
    </section>
  );
}

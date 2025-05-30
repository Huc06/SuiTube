import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoCard from "@/components/video-card";
import ShortsCard from "@/components/shorts-card";
import CreatorSpotlight from "@/components/creator-spotlight";
import UploadSection from "@/components/upload-section";
import { mockVideos, mockShorts, mockUsers } from "@/lib/mock-data";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  const filterTabs = [
    { label: "All", active: true },
    { label: "Most Tipped", active: false },
    { label: "Trending on Sui", active: false },
    { label: "Gaming", active: false },
    { label: "Crypto Education", active: false },
    { label: "DeFi", active: false },
  ];

  const handleVideoClick = (videoId: number) => {
    setLocation(`/video/${videoId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white hexagon-pattern">
        <div className="absolute inset-0 gradient-overlay" />
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Welcome to the Future of Video</h2>
            <p className="text-sm sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-4">
              Decentralized, rewarding, and powered by Sui blockchain
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                size="lg"
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 text-sm sm:text-base"
                onClick={() => setLocation('/creator-dashboard')}
              >
                Start Creating
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 text-sm sm:text-base"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto py-3 sm:py-4 scrollbar-hide">
            {filterTabs.map((tab) => (
              <Button
                key={tab.label}
                size="sm"
                variant={tab.active ? "default" : "secondary"}
                className={`whitespace-nowrap rounded-full text-xs sm:text-sm flex-shrink-0 ${
                  tab.active
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Shorts Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">Shorts</h3>
              <Badge className="blockchain-glow text-white text-xs font-medium hidden sm:inline-flex">
                Blockchain Powered
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
            {mockShorts.map((short) => (
              <ShortsCard
                key={short.id}
                video={short}
                onClick={() => setLocation('/shorts')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Video Grid */}
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">Recommended</h3>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Powered by</span>
              <span className="text-xs sm:text-sm font-medium text-blue-600">Sui Network</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {mockVideos.map((video) => {
              const creator = mockUsers.find(user => user.id === video.creatorId);
              return creator ? (
                <VideoCard
                  key={video.id}
                  video={video}
                  creator={creator}
                  onClick={() => handleVideoClick(video.id)}
                />
              ) : null;
            })}
          </div>
        </div>
      </section>

      {/* Creator Spotlight */}
      <CreatorSpotlight />

      {/* Upload Section */}
      <UploadSection />
    </div>
  );
}

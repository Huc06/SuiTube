import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoCard from "@/components/video-card";
import ShortsCard from "@/components/shorts-card";
import CreatorSpotlight from "@/components/creator-spotlight";
import UploadSection from "@/components/upload-section";
import { mockVideos, mockShorts, mockUsers } from "@/lib/mock-data";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

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
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 animate-glow"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ textShadow: '0 0 16px #a78bfa, 0 0 32px #2563eb' }}
            >
              Welcome to the Future of Video
            </motion.h2>
            <motion.p
              className="text-sm sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Decentralized, rewarding, and powered by Sui blockchain
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Button
                size="lg"
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 text-sm sm:text-base relative overflow-hidden group shadow-lg"
                onClick={() => setLocation('/creator-dashboard')}
              >
                <span className="relative z-10">Start Creating</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 transition duration-300 rounded-full animate-glow" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-white text-blue-600 font-semibold rounded-full hover:bg-white hover:text-blue-600 text-sm sm:text-base relative overflow-hidden group shadow-lg"
              >
                <span className="relative z-10">Learn More</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-30 transition duration-300 rounded-full animate-glow" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto py-3 sm:py-4 scrollbar-hide">
            {filterTabs.map((tab) => (
              <motion.div
                key={tab.label}
                whileHover={{ scale: 1.08, boxShadow: '0 0 12px #818cf8' }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  size="sm"
                  variant={tab.active ? "default" : "secondary"}
                  className={`whitespace-nowrap rounded-full text-xs sm:text-sm flex-shrink-0 transition-all duration-200 border-2 ${
                    tab.active
                      ? "bg-blue-600 text-white border-blue-400 shadow-lg animate-glow"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-transparent"
                  }`}
                >
                  {tab.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shorts Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center animate-float">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 gradient-text animate-glow">Shorts</h3>
              <Badge className="blockchain-glow text-white text-xs font-medium hidden sm:inline-flex animate-glow">
                Blockchain Powered
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
            {mockShorts.map((short, idx) => (
              <motion.div
                key={short.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
              >
                <ShortsCard
                  video={short}
                  onClick={() => setLocation('/shorts')}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Video Grid */}
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 gradient-text animate-glow">Recommended</h3>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Powered by</span>
              <span className="text-xs sm:text-sm font-medium text-blue-600">Sui Network</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {mockVideos.map((video, idx) => {
              const creator = mockUsers.find(user => user.id === video.creatorId);
              return creator ? (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.07, duration: 0.6 }}
                  whileHover={{ scale: 1.04, boxShadow: '0 8px 32px #818cf8' }}
                >
                  <VideoCard
                    video={video}
                    creator={creator}
                    onClick={() => handleVideoClick(video.id)}
                  />
                </motion.div>
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

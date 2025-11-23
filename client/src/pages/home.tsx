import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/video-card";
import UploadSection from "@/components/upload-section";
import { mockUsers } from "@/lib/mock-data";
import { useLocation } from "wouter";
import { useVideos } from "@/hooks/use-videos";
import { transformVideos } from "@/lib/api-transform";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";


export default function Home() {
  const [, setLocation] = useLocation();
  
  // Fetch videos from API
  const { data: apiVideos = [], isLoading, error, refetch } = useVideos({ limit: 20 });
  
  // Debug logging
  useEffect(() => {
    console.log('[Home] Videos data:', apiVideos);
    console.log('[Home] Videos count:', apiVideos.length);
    console.log('[Home] Is loading:', isLoading);
    console.log('[Home] Error:', error);
    
    // Auto-refetch if no videos and not loading
    if (!isLoading && apiVideos.length === 0 && !error) {
      console.log('[Home] No videos found, refetching...');
      setTimeout(() => refetch(), 1000);
    }
  }, [apiVideos, isLoading, error, refetch]);
  
  // Transform API videos to frontend format
  const videos = transformVideos(apiVideos, mockUsers);
  const regularVideos = videos.filter(v => !v.isShort);
  const shorts = videos.filter(v => v.isShort);

  const [activeTab, setActiveTab] = useState("Recent");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const tags = ["#funny", "#walrus", "#reaction", "#cute", "#mood"];
  
  const tabs = [
    { label: "Recent", value: "Recent" },
    { label: "Most Tipped", value: "Most Tipped" },
    { label: "Most Remixed", value: "Most Remixed" },
  ];

  const handleVideoClick = (video: any, apiVideo: any) => {
    // Use CID from API instead of transformed numeric ID
    const videoCid = apiVideo?.cid || apiVideo?.id || video.walrusHash;
    if (videoCid) {
      setLocation(`/video/${videoCid}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
      <section className="border-b border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search videos or #tags..."
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-transparent bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              style={{
                backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #3b82f6, #f97316)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            />
          </div>
        </div>
      </section>

      {/* Tag Filters */}
      <section className="border-b border-gray-200 py-3">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {tags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`rounded-full ${
                  selectedTag === tag
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.value
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Video Grid */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 12 }).map((_, idx) => (
                <Skeleton key={idx} className="aspect-square w-full rounded-lg" />
              ))
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <Alert className="max-w-md mx-auto bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">
                    <p className="font-semibold mb-2">Error loading videos</p>
                    <p className="text-sm">{error.message}</p>
                    <p className="text-xs mt-2 text-gray-600">
                      API URL: {import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}
                    </p>
                    <p className="text-xs text-gray-600">
                      Fetched {apiVideos.length} videos from API
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            ) : regularVideos.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 mb-4">No videos available yet</p>
                <Button 
                  onClick={() => {
                    const uploadSection = document.getElementById('upload-section');
                    uploadSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-blue-600 text-white"
                >
                  Upload Your First Video
                </Button>
              </div>
            ) : (
              regularVideos.map((video, idx) => {
                const creator = mockUsers.find(user => user.walletAddress === video.walrusHash?.split('...')[0]) || mockUsers[0];
                const apiVideo = apiVideos[idx];
                return (
                  <div
                    key={video.id}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleVideoClick(video, apiVideo)}
                  >
                    <VideoCard
                      video={video}
                      creator={creator}
                      onClick={() => handleVideoClick(video, apiVideo)}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <div id="upload-section">
        <UploadSection />
      </div>
    </div>
  );
}

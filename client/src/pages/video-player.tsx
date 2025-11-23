import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Volume2, Maximize, ThumbsUp, Share2, Coins, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { mockUsers } from "@/lib/mock-data";
import { useVideo, useTrackView } from "@/hooks/use-videos";
import { transformVideo } from "@/lib/api-transform";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api";

export default function VideoPlayer() {
  const [match, params] = useRoute("/video/:id");
  const [, setLocation] = useLocation();
  const account = useCurrentAccount();
  const trackView = useTrackView();
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  
  if (!match || !params?.id) {
    setLocation("/");
    return null;
  }

  const videoId = params.id;
  const { data: apiVideo, isLoading, error } = useVideo(videoId);
  
  // Track view when video loads
  useEffect(() => {
    if (apiVideo && videoId) {
      trackView.mutate({
        videoId,
        viewerAddress: account?.address,
      });
    }
  }, [apiVideo, videoId, account?.address, trackView]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Skeleton className="w-full h-96 mb-4" />
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (error || !apiVideo) {
    setLocation("/");
    return null;
  }

  const video = transformVideo(apiVideo);
  const creator = mockUsers.find(u => u.walletAddress === apiVideo.owner) || mockUsers[0];

  if (!creator) {
    setLocation("/");
    return null;
  }

  // Use CID (from API) instead of transformed ID for streaming
  // Backend expects CID, not numeric ID
  const videoCid = apiVideo.cid || apiVideo.id;
  const streamUrl = apiClient.getVideoStreamUrl(videoCid);
  
  // Fallback to direct Walrus URL if streaming fails
  const directWalrusUrl = apiVideo.videoUrl || `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${videoCid}`;
  
  console.log('[VideoPlayer] Stream URL:', streamUrl);
  console.log('[VideoPlayer] Direct Walrus URL:', directWalrusUrl);
  console.log('[VideoPlayer] Video CID:', videoCid);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 text-gray-600 hover:text-gray-900"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Video Player */}
        <div className="mb-6">
          <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            {video.videoUrl ? (
              <>
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-sm">Loading video from Walrus...</p>
                    </div>
                  </div>
                )}
                {videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                    <Alert className="max-w-md bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {videoError}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                <video
                  controls
                  className="w-full h-full"
                  style={{ display: 'block', backgroundColor: '#000' }}
                  poster={video.thumbnailUrl || ""}
                  preload="auto"
                  playsInline
                  crossOrigin="anonymous"
                  onLoadedData={() => {
                    setIsVideoLoading(false);
                    console.log('[VideoPlayer] ✅ Video loaded successfully');
                  }}
                  onError={(e) => {
                    setIsVideoLoading(false);
                    const error = e.currentTarget.error;
                    const errorMsg = error 
                      ? `Error ${error.code}: ${error.message}` 
                      : 'Failed to load video';
                    setVideoError(errorMsg);
                    console.error("❌ [VideoPlayer] Video load error:", {
                      code: error?.code,
                      message: error?.message,
                      errorCodes: {
                        MEDIA_ERR_ABORTED: 1,
                        MEDIA_ERR_NETWORK: 2,
                        MEDIA_ERR_DECODE: 3,
                        MEDIA_ERR_SRC_NOT_SUPPORTED: 4,
                      },
                      streamUrl,
                      directWalrusUrl,
                      videoCid,
                    });
                  }}
                  onLoadStart={() => {
                    setIsVideoLoading(true);
                    console.log('🔄 [VideoPlayer] Starting to load video from:', streamUrl);
                  }}
                  onCanPlay={() => {
                    setIsVideoLoading(false);
                    console.log('▶️ [VideoPlayer] Video can play');
                  }}
                  onLoadedMetadata={() => {
                    console.log('📊 [VideoPlayer] Metadata loaded');
                  }}
                  onProgress={(e) => {
                    if (e.currentTarget.buffered.length > 0) {
                      const buffered = e.currentTarget.buffered.end(0);
                      const duration = e.currentTarget.duration;
                      const percent = (buffered / duration) * 100;
                      console.log(`📈 [VideoPlayer] Buffered: ${percent.toFixed(1)}%`);
                    }
                  }}
                  onWaiting={() => {
                    console.log('⏳ [VideoPlayer] Waiting for data...');
                  }}
                  onPlaying={() => {
                    console.log('▶️ [VideoPlayer] Video is playing');
                  }}
                >
                  {/* Try direct Walrus URL first (better CORS support, same as test-video.html) */}
                  <source src={directWalrusUrl} type="video/mp4" />
                  {/* Fallback to streaming endpoint if direct URL fails */}
                  <source src={streamUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                  <p>If video doesn't play, try opening this URL directly:</p>
                  <a href={directWalrusUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {directWalrusUrl}
                  </a>
                </video>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-2">Video not available</p>
                  <p className="text-sm text-gray-400">Video URL is missing or not uploaded to Walrus</p>
                  {apiVideo.cid && (
                    <p className="text-xs text-gray-500 mt-2">CID: {apiVideo.cid}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span>{video.views?.toLocaleString()} views</span>
                  <span>Dec 15, 2023</span>
                </div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={creator.avatar || ""} />
                    <AvatarFallback>{creator.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{creator.username}</p>
                    <p className="text-sm text-gray-600">{creator.subscribers?.toLocaleString()} subscribers</p>
                  </div>
                  <Button className="bg-gray-900 text-white hover:bg-gray-800">
                    Subscribe
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="flex items-center space-x-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{video.likes?.toLocaleString()}</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                <Button className="bg-blue-600 text-white flex items-center space-x-2">
                  <Coins className="h-4 w-4" />
                  <span>Tip Creator</span>
                </Button>
              </div>
            </div>
            
            {/* Video Description */}
            <div className="bg-gray-50 mt-4 rounded-lg p-4">
              <p className="text-gray-700">
                {video.description || "No description available."}
              </p>
            </div>
          </div>
        </div>

        {/* Related Videos */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Related Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Related videos - TODO: implement with API */}
            {[].map((relatedVideo: any) => {
              const relatedCreator = mockUsers.find(u => u.id === relatedVideo.creatorId);
              return relatedCreator ? (
                <Card key={relatedVideo.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setLocation(`/video/${relatedVideo.id}`)}>
                  <div className="relative aspect-video bg-gray-900">
                    <img
                      src={relatedVideo.thumbnailUrl || ""}
                      alt={relatedVideo.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {Math.floor((relatedVideo.duration || 0) / 60)}:{((relatedVideo.duration || 0) % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">
                      {relatedVideo.title}
                    </h4>
                    <p className="text-sm text-gray-600">{relatedCreator.username}</p>
                    <p className="text-sm text-gray-500">
                      {relatedVideo.views?.toLocaleString()} views
                    </p>
                  </CardContent>
                </Card>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

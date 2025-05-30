import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Volume2, Maximize, ThumbsUp, Share2, Coins } from "lucide-react";
import { useLocation } from "wouter";
import { mockVideos, mockUsers } from "@/lib/mock-data";

export default function VideoPlayer() {
  const [match, params] = useRoute("/video/:id");
  const [, setLocation] = useLocation();
  
  if (!match || !params?.id) {
    setLocation("/");
    return null;
  }

  const videoId = parseInt(params.id);
  const video = mockVideos.find(v => v.id === videoId);
  const creator = video ? mockUsers.find(u => u.id === video.creatorId) : null;

  if (!video || !creator) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Video Player */}
        <Card className="mb-6">
          <div className="relative aspect-video bg-gray-900 rounded-t-xl overflow-hidden">
            <img
              src={video.thumbnailUrl || ""}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <div className="flex items-center space-x-4 text-white">
                <Button size="sm" className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm hover:bg-opacity-30">
                  <Play className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <div className="bg-white bg-opacity-30 h-1 rounded-full">
                    <div className="bg-blue-600 h-1 rounded-full" style={{ width: "35%" }} />
                  </div>
                </div>
                <span className="text-sm">12:34 / {Math.floor((video.duration || 0) / 60)}:{((video.duration || 0) % 60).toString().padStart(2, '0')}</span>
                <Button size="sm" variant="ghost" className="p-2 text-white hover:bg-white hover:bg-opacity-20">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="p-2 text-white hover:bg-white hover:bg-opacity-20">
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Decentralized Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center space-x-2">
                <div className="hexagon scale-50" />
                <span>Decentralized Stream</span>
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span>{video.views?.toLocaleString()} views</span>
                  <span>Dec 15, 2023</span>
                  <div className="flex items-center space-x-1">
                    <div className="hexagon scale-50" />
                    <span>Stored on IPFS</span>
                  </div>
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
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center space-x-2">
                  <Coins className="h-4 w-4" />
                  <span>Tip Creator</span>
                </Button>
              </div>
            </div>
            
            {/* Video Description */}
            <Card className="bg-gray-50 mt-4">
              <CardContent className="p-4">
                <p className="text-gray-700">
                  {video.description || "Learn everything you need to know about building on the Sui blockchain. This comprehensive guide covers smart contracts, Move programming language, and how to get started with your first DApp."}
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Related Videos */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Related Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVideos.filter(v => v.id !== video.id).slice(0, 3).map((relatedVideo) => {
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

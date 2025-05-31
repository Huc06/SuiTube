import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, MessageCircle, Share, Coins } from "lucide-react";
import { useLocation } from "wouter";
import { mockShorts, mockUsers } from "@/lib/mock-data";
import SavedVideos from "@/components/Saved-videos";

export default function Shorts() {
  const [, setLocation] = useLocation();
  const [currentShort, setCurrentShort] = useState(0);
  const [shorts] = useState(mockShorts);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && currentShort > 0) {
        setCurrentShort(currentShort - 1);
      } else if (e.key === "ArrowDown" && currentShort < shorts.length - 1) {
        setCurrentShort(currentShort + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentShort, shorts.length]);

  const current = shorts[currentShort];
  const creator = mockUsers.find(user => user.id === current?.creatorId);

  if (!current || !creator) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">No shorts available</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-black h-screen relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Video Content */}
      <div className="h-full relative flex items-center justify-center bg-gray-900">
        <img
          src={current.thumbnailUrl || ""}
          alt={current.title}
          className="w-full h-full object-cover"
        />

        {/* Video Info */}
        <div className="absolute bottom-20 left-4 right-16 z-10 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={creator.avatar || ""} />
              <AvatarFallback>{creator.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">@{creator.username}</span>
            <Button
              size="sm"
              variant="outline"
              className="border-white text-white bg-transparent hover:bg-white hover:text-black"
            >
              Follow
            </Button>
          </div>
          
          <p className="text-sm mb-2">{current.description}</p>
          
          <div className="flex items-center space-x-2">
            <div className="hexagon scale-50" />
            <span className="text-xs">Stored on IPFS</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-20 right-4 z-10 flex flex-col items-center space-y-6 text-white">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-white hover:bg-transparent"
          >
            <Heart className="h-6 w-6" />
            <span className="text-xs">{(current.likes || 0).toLocaleString()}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-white hover:bg-transparent"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-xs">89</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-white hover:bg-transparent"
          >
            <Share className="h-6 w-6" />
            <span className="text-xs">Share</span>
          </Button>
          
          <Button
            size="sm"
            className="flex flex-col items-center space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full animate-glow"
          >
            <Coins className="h-5 w-5" />
            <span className="text-xs">Tip</span>
          </Button>
          <SavedVideos />
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 flex flex-col space-y-1">
        {shorts.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-8 rounded-full ${
              index === currentShort ? "bg-white" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

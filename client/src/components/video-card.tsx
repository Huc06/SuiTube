import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Coins } from "lucide-react";
import { formatDuration, formatViews, formatTimeAgo } from "@/lib/utils";
import type { Video, User } from "@shared/schema";

interface VideoCardProps {
  video: Video;
  creator: User;
  onClick?: () => void;
}

export default function VideoCard({ video, creator, onClick }: VideoCardProps) {
  return (
    <Card className="video-card-hover bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg dark:hover:shadow-xl cursor-pointer group" onClick={onClick}>
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-900">
        <img
          src={video.thumbnailUrl || ""}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Duration */}
        <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
          {formatDuration(video.duration || 0)}
        </div>
        
        {/* IPFS Badge */}
        <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
          <Badge className="text-xs bg-green-500 text-white flex items-center space-x-1 px-1.5 sm:px-2 py-0.5">
            <div className="hexagon scale-50" />
            <span className="hidden sm:inline">Stored on IPFS</span>
            <span className="sm:hidden">IPFS</span>
          </Badge>
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <Play className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 ml-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-2 sm:p-4">
        <div className="flex space-x-2 sm:space-x-3">
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
            <AvatarImage src={creator.avatar || ""} />
            <AvatarFallback className="text-xs sm:text-sm">{creator.username.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
              {video.title}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{creator.username}</p>
            
            <div className="flex items-center flex-wrap gap-x-2 sm:gap-x-4 mt-1 sm:mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="truncate">{formatViews(video.views || 0)} views</span>
              <span className="hidden xs:inline">{formatTimeAgo(video.createdAt!)}</span>
              <div className="flex items-center space-x-1">
                <Coins className="h-3 w-3 text-teal-500 flex-shrink-0" />
                <span className="truncate">{video.suiRewards} SUI</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



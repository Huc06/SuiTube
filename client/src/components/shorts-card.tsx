import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatViews } from "@/lib/utils";

export interface Video {
  id: string;
  title: string;
  thumbnailUrl?: string;
  duration?: string | number;
  views?: number;
  // Thêm các trường khác nếu cần
}

interface ShortsCardProps {
  video: Video;
  onClick?: () => void;
}

export default function ShortsCard({ video, onClick }: ShortsCardProps) {
  return (
    <Card className="video-card-hover bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-xl cursor-pointer group" onClick={onClick}>
      <div className="relative aspect-[9/16] bg-gray-900">
        <img
          src={video.thumbnailUrl || ""}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Duration */}
        <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
          0:{video.duration}
        </div>
        
        {/* IPFS Badge */}
        <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
          <Badge className="text-xs bg-blue-500 text-white flex items-center space-x-1 px-1.5 sm:px-2 py-0.5">
            <div className="hexagon scale-50" />
            <span className="hidden sm:inline">walrus</span>
            <span className="sm:hidden">W</span>
          </Badge>
        </div>
      </div>
      
      <div className="p-2 sm:p-3">
        <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
          {video.title}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {formatViews(video.views || 0)} views
        </p>
      </div>
    </Card>
  );
}


export async function getTuskyFilesByVault(vaultId: string): Promise<Video[]> {
  const TUSKY_API_URL = "https://api.tusky.io";
  const TUSKY_API_KEY = "abad7807-d55e-49f3-af26-2edc3349ec5f"; // Thay bằng apiKey của bạn

  const response = await fetch(`${TUSKY_API_URL}/files?vaultId=${vaultId}`, {
    headers: {
      "Api-Key": TUSKY_API_KEY,
    },
  });
  if (!response.ok) throw new Error("Tusky GET files failed");
  const data = await response.json();
  // data.items là mảng file, bạn cần map sang Video nếu cần
  return data.items.map((item: any) => ({
    id: item.id,
    title: item.name,
    thumbnailUrl: "", // Nếu có trường thumbnail thì lấy, không thì để rỗng
    duration: "",     // Nếu có trường duration thì lấy, không thì để rỗng
    views: 0,         // Nếu có trường views thì lấy, không thì để 0
  }));
}



import { formatDuration } from "@/lib/utils";
import type { TransformedVideo } from "@/lib/api-transform";

interface VideoCardProps {
  video: TransformedVideo;
  onClick?: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <div 
      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group"
      onClick={onClick}
    >
      <img
        src={video.thumbnailUrl || ""}
        alt={video.title}
        className="w-full h-full object-cover"
      />
      
      {/* Duration Badge */}
      {video.duration && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>
      )}
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
    </div>
  );
}

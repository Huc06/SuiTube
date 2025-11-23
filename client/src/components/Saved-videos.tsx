import { useEffect, useState } from "react";
import ShortsCard, { Video } from "./shorts-card";
import { useVideos } from "@/hooks/use-videos";
import { transformVideos } from "@/lib/api-transform";
import { mockUsers } from "@/lib/mock-data";

interface SavedVideosProps {
  renderItem?: (video: Video, idx: number) => React.ReactNode;
}

export default function SavedVideos({ renderItem }: SavedVideosProps) {
  // Fetch shorts from API
  const { data: apiVideos = [] } = useVideos({ limit: 20 });
  const apiShorts = apiVideos.filter(v => v.isShort);
  const videos = transformVideos(apiShorts, mockUsers);


  return (
    <>
      {videos.map((video, idx) =>
        renderItem ? renderItem(video, idx) : (
          <div key={video.id} className="col-span-1">
            <ShortsCard video={video} />
          </div>
        )
      )}
    </>
  );
}
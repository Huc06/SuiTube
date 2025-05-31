import { useEffect, useState } from "react";
import ShortsCard, { Video, getTuskyFilesByVault } from "./shorts-card";

export default function SavedVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const VAULT_ID = "3c35c95c-27dd-437c-a39c-7d697aed643e"; // Thay bằng vaultId thật của bạn

  useEffect(() => {
    getTuskyFilesByVault(VAULT_ID).then(setVideos).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {videos.map(video => (
        <ShortsCard key={video.id} video={video} />
      ))}
    </div>
  );
}
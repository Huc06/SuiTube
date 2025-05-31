import { useEffect, useState } from "react";
import ShortsCard, { Video, getTuskyFilesByVault } from "./shorts-card";

export default function SavedVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const VAULT_ID = "b62fe52a-9473-4cbe-828e-60b1209b46be"; // Thay bằng vaultId thật của bạn

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
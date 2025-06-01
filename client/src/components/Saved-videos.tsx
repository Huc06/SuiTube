import { useEffect, useState } from "react";
import ShortsCard, { Video, getTuskyFilesByVault } from "./shorts-card";

interface SavedVideosProps {
  renderItem?: (video: Video, idx: number) => React.ReactNode;
}

export default function SavedVideos({ renderItem }: SavedVideosProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const VAULT_ID = "b62fe52a-9473-4cbe-828e-60b1209b46be"; // Thay bằng vaultId thật của bạn

  useEffect(() => {
    getTuskyFilesByVault(VAULT_ID).then(setVideos).catch(console.error);
  }, []);


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
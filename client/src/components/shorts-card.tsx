import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { formatViews } from "@/lib/utils";
import axios from 'axios';
import shortsThumbnail from "./images/shorts-thumbnail.png";

export interface Video {
  id: string;
  title: string;
  thumbnailUrl?: string;
  duration?: string | number;
  views?: number;
  // Add other fields if needed
}

interface ShortsCardProps {
  video: Video;
  onClick?: () => void;
}

export default function ShortsCard({ video, onClick }: ShortsCardProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  async function handleView() {
    const url = await getTuskyFileUrl(video.id);
    setVideoUrl(url);
  }

  return (
    <Card className="video-card-hover bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-xl cursor-pointer group w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto" onClick={onClick}>
      <div className="relative aspect-[9/16] bg-gray-900">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full object-cover rounded"
            style={{ maxHeight: '100%' }}
          />
        ) : (
          <img
            src={shortsThumbnail}          
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        )}
        
        {/* Duration */}
        <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
          0:{video.duration}
        </div>
        
        {/* IPFS Badge */}
        {/* <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
          <Badge className="text-xs bg-blue-500 text-white flex items-center space-x-1 px-1.5 sm:px-2 py-0.5">
            <div className="hexagon scale-50" />
            <span className="hidden sm:inline">walrus</span>
            <span className="sm:hidden">W</span>
          </Badge>
        </div> */}
      </div>
      
      <div className="p-2 sm:p-3">
        <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate whitespace-nowrap leading-tight">
          {video.title}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {formatViews(video.views || 0)} views
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              getTuskyFileData(video.id);
            }}
            className="px-2 py-1 bg-blue-500 text-white rounded w-full sm:w-auto"
          >
            Download
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView();
            }}
            className="px-2 py-1 bg-green-500 text-white rounded w-full sm:w-auto"
          >
            Xem
          </button>
        </div>
      </div>
    </Card>
  );
}


export async function getTuskyFilesByVault(vaultId: string): Promise<Video[]> {
  const TUSKY_API_URL = "https://api.tusky.io";
  const TUSKY_API_KEY = "abad7807-d55e-49f3-af26-2edc3349ec5f"; 

  const response = await fetch(`${TUSKY_API_URL}/files?vaultId=${vaultId}`, {
    headers: {
      "Api-Key": TUSKY_API_KEY,
    },
  });
  if (!response.ok) throw new Error("Tusky GET files failed");
  const data = await response.json();
  console.log(data);
  // data.items is an array of files, you need to map to Video if needed
  return data.items.map((item: any) => ({
    id: item.id,
    title: item.name,
    thumbnailUrl: "", // If there is a thumbnail field, use it, otherwise leave empty
    duration: "",     // If there is a duration field, use it, otherwise leave empty
    views: 0,         // If there is a views field, use it, otherwise set to 0
  }));
}

async function getTuskyFileData(id: string) {
  const options = {
    method: 'GET',
    url: `https://api.tusky.io/files/${id}/data`,
    headers: {
      'Api-Key': 'abad7807-d55e-49f3-af26-2edc3349ec5f',
    },
    responseType: 'arraybuffer' as const,
  };

  try {
    const response = await axios.request(options);
    let filename = 'downloaded-file.webm';
    const disposition = response.headers['content-disposition'];
    if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];
    }
    const mimeType = response.headers['content-type'] || 'application/octet-stream';
    const blob = new Blob([response.data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
}

async function getTuskyFileUrl(id: string): Promise<string> {
  const options = {
    method: 'GET',
    url: `https://api.tusky.io/files/${id}/data`,
    headers: {
      'Api-Key': 'abad7807-d55e-49f3-af26-2edc3349ec5f',
    },
    responseType: 'arraybuffer' as const,
  };

  try {
    const response = await axios.request(options);
    const mimeType = response.headers['content-type'] || 'video/webm';
    const blob = new Blob([response.data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error("Download error:", error);
    return "";
  }
}



import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type Video, type UploadVideoResponse } from '@/lib/api';

/**
 * Hook to fetch all videos
 */
export function useVideos(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => apiClient.getVideos(params),
    staleTime: 0, // Always refetch for now (temporary)
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch video by ID
 */
export function useVideo(id: string | null) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => (id ? apiClient.getVideoById(id) : null),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to fetch videos by owner
 */
export function useVideosByOwner(ownerAddress: string | null, limit?: number) {
  return useQuery({
    queryKey: ['videos', 'owner', ownerAddress, limit],
    queryFn: () =>
      ownerAddress ? apiClient.getVideosByOwner(ownerAddress, limit) : [],
    enabled: !!ownerAddress,
    staleTime: 30000,
  });
}

/**
 * Hook to upload video
 */
export function useUploadVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      metadata,
      onProgress,
    }: {
      file: File;
      metadata: {
        title: string;
        description?: string;
        owner?: string;
      };
      onProgress?: (progress: number) => void;
    }) => apiClient.uploadVideo(file, metadata, onProgress),
    onSuccess: () => {
      // Invalidate videos query to refetch
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

/**
 * Hook to track video view
 */
export function useTrackView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      videoId,
      viewerAddress,
    }: {
      videoId: string;
      viewerAddress?: string;
    }) => apiClient.trackView(videoId, viewerAddress),
    onSuccess: (data, variables) => {
      // Update video in cache
      queryClient.setQueryData(['video', variables.videoId], (old: Video | null) => {
        if (old) {
          return { ...old, views: data.views };
        }
        return old;
      });
      // Invalidate videos list to refetch
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}


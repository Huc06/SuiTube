import { Button } from "@/components/ui/button";
import { useWalletAdapter } from "@/lib/WalletAdapter";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useUploadVideo } from "@/hooks/use-videos";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export default function UploadSection() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isShort, setIsShort] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isVideoDragActive, setIsVideoDragActive] = useState(false);
  const [isThumbnailDragActive, setIsThumbnailDragActive] = useState(false);

  const { walletAddress } = useWalletAdapter();
  const { toast } = useToast();
  const uploadVideo = useUploadVideo();
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[UploadSection] Submit upload form", {
      title,
      description,
      videoFile,
      thumbnailFile,
      isShort,
    });
    
    try {
      if (!walletAddress) {
        toast({
          title: "Wallet Required",
          description: "Please connect your Sui wallet to upload videos",
          variant: "destructive",
        });
        return;
      }
      
      if (!title || !description || !videoFile) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields and select a video",
          variant: "destructive",
        });
        return;
      }

      // Upload to Walrus via backend API
      console.log("[UploadSection] Uploading file to Walrus", {
        videoFile,
        thumbnailFile,
      });
      
      const result = await uploadVideo.mutateAsync({
        file: videoFile,
        metadata: {
          title,
          description,
          owner: walletAddress,
        },
        thumbnailFile,
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
      });

      console.log("[UploadSection] File uploaded to Walrus", result);
      
      toast({
        title: "Upload Successful!",
        description: `Video "${title}" uploaded successfully. Blob ID: ${result.cid}`,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreview(null);
      setThumbnailPreview(null);
      setUploadProgress(0);
    } catch (err: any) {
      console.error("[UploadSection] Error in handleAddVideo", err);
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setVideoPreview(null);
  }, [videoFile]);

  useEffect(() => {
    if (thumbnailFile) {
      const url = URL.createObjectURL(thumbnailFile);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setThumbnailPreview(null);
  }, [thumbnailFile]);

  const handleVideoDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsVideoDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    }
  };

  const handleThumbnailDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsThumbnailDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file);
    }
  };

  return (
    <section className="bg-white py-10 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold mb-2">
            Create
          </p>
          <h3 className="text-3xl font-bold text-gray-900">Create Your Video</h3>
          <p className="text-gray-600">
            Upload your content to Walrus and start earning SUI tokens.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.6fr,1fr]">
          <div className="space-y-6">
            <label
              htmlFor="video-upload"
              onDragOver={(e) => {
                e.preventDefault();
                setIsVideoDragActive(true);
              }}
              onDragLeave={() => setIsVideoDragActive(false)}
              onDrop={handleVideoDrop}
              className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 transition ${
                isVideoDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {videoPreview ? (
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-72 object-contain rounded-xl bg-black"
                />
              ) : (
                <>
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <Upload className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    Drop your video here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    MP4, MOV up to 500MB
                  </p>
                </>
              )}
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Thumbnail
                </p>
                <label
                  htmlFor="thumbnail-upload"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsThumbnailDragActive(true);
                  }}
                  onDragLeave={() => setIsThumbnailDragActive(false)}
                  onDrop={handleThumbnailDrop}
                  className={`flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition ${
                    isThumbnailDragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-gray-500 mb-2" />
                      <span className="text-sm text-gray-600">
                        Drop thumbnail or click to upload
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG up to 5MB
                      </span>
                    </>
                  )}
                </label>
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setThumbnailFile(e.target.files?.[0] || null)
                  }
                />
              </div>

              <div className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Details
                </p>
                <div className="space-y-1 text-sm text-gray-500">
                  <p>• Upload instantly to Walrus</p>
                  <p>• Earn SUI rewards from tips and engagement</p>
                  <p>• Own your content on-chain</p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleAddVideo}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg"
          >
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-800">
                Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your video a title"
                maxLength={100}
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {title.length}/100
              </p>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-800">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your video (optional)"
                maxLength={500}
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {description.length}/500
              </p>
            </div>
            <div className="mb-6 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <Switch checked={isShort} onCheckedChange={setIsShort} id="isShort" />
              <div>
                <label htmlFor="isShort" className="font-medium text-sm text-gray-800">
                  Short Video
                </label>
                <p className="text-xs text-gray-500">
                  Toggle on for vertical short-form content
                </p>
              </div>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full mt-4"
              disabled={uploadVideo.isPending || !videoFile || !title || !description}
            >
              {uploadVideo.isPending
                ? `Uploading... ${uploadProgress > 0 ? `${uploadProgress}%` : ""}`
                : "Create"}
            </Button>
            {uploadVideo.isError && (
              <div className="text-red-500 mt-2 text-sm">
                {uploadVideo.error instanceof Error
                  ? uploadVideo.error.message
                  : "Upload failed. Please try again."}
              </div>
            )}
            {uploadVideo.isSuccess && uploadVideo.data && (
              <div className="text-green-600 mt-4 text-sm">
                <p>Upload successful!</p>
                <p className="text-xs mt-1">
                  Blob ID: <span className="font-mono break-all">{uploadVideo.data.cid}</span>
                </p>
                <p className="text-xs">
                  <a
                    href={uploadVideo.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View on Walrus
                  </a>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

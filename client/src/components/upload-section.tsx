import { Button } from "@/components/ui/button";
import { Upload, Coins, Shield } from "lucide-react";
import { useWalletAdapter } from "@/lib/WalletAdapter";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { useUploadVideo } from "@/hooks/use-videos";
import { useToast } from "@/hooks/use-toast";

export default function UploadSection() {
  const features = [
    {
      icon: Upload,
      title: "Upload Instantly",
      description: "Drag and drop your videos for instant walrus storage",
      color: "bg-blue-600 bg-opacity-10 text-blue-600",
    },
    {
      icon: Coins,
      title: "Earn Rewards",
      description: "Get paid in SUI tokens for views, tips, and engagement",
      color: "bg-teal-500 bg-opacity-10 text-teal-500",
    },
    {
      icon: Shield,
      title: "Own Your Content",
      description: "True ownership with blockchain verification",
      color: "bg-purple-500 bg-opacity-10 text-purple-500",
    },
  ];

  // --- State for form ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cid, setCid] = useState("");
  const [isShort, setIsShort] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // --- Wallet Adapter ---
  const { walletAddress } = useWalletAdapter();
  const { toast } = useToast();
  const uploadVideo = useUploadVideo();
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[UploadSection] Submit upload form", { title, description, file, isShort });
    
    try {
      if (!walletAddress) {
        toast({
          title: "Wallet Required",
          description: "Please connect your Sui wallet to upload videos",
          variant: "destructive",
        });
        return;
      }
      
      if (!title || !description || !file) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Upload to Walrus via backend API
      console.log("[UploadSection] Uploading file to Walrus", file);
      
      const result = await uploadVideo.mutateAsync({
        file,
        metadata: {
          title,
          description,
          owner: walletAddress,
        },
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
      setFile(null);
      setCid("");
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

  return (
    <section className="bg-white py-12 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-glow" />
          </motion.div>
          <motion.h3
            className="text-3xl font-bold text-gray-900 mb-4 gradient-text animate-glow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Ready to Create?
          </motion.h3>
          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Upload your content to the decentralized web and start earning SUI tokens
          </motion.p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ scale: 1.08, boxShadow: '0 0 16px #818cf8' }}
            >
              <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 animate-float`}> 
                <feature.icon className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 gradient-text animate-glow">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        {/* --- Upload Form --- */}
        {showForm && (
          <motion.form
            onSubmit={handleAddVideo}
            className="max-w-xl mx-auto bg-gray-50 rounded-xl p-6 shadow mb-8 text-left"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-xl font-semibold mb-4 gradient-text animate-glow">Upload Video</h4>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Title</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Video title" />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Video File</label>
              <Input type="file" accept="video/*" onChange={e => { setFile(e.target.files?.[0] || null); console.log("[UploadSection] File selected", e.target.files?.[0]); }} />
            </div>
            <div className="mb-4 flex items-center gap-2">
              <Switch checked={isShort} onCheckedChange={setIsShort} id="isShort" />
              <label htmlFor="isShort" className="font-medium">Is Short Video?</label>
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
              className="w-full"
              disabled={uploadVideo.isPending || !file || !title || !description}
            >
              {uploadVideo.isPending
                ? `Uploading... ${uploadProgress > 0 ? `${uploadProgress}%` : ''}`
                : "Upload Video to Walrus"}
            </Button>
            {uploadVideo.isError && (
              <div className="text-red-500 mt-2">
                {uploadVideo.error instanceof Error
                  ? uploadVideo.error.message
                  : 'Upload failed. Please try again.'}
              </div>
            )}
            {uploadVideo.isSuccess && uploadVideo.data && (
              <div className="text-green-600 mt-2">
                <p>Upload successful!</p>
                <p className="text-sm mt-1">
                  Blob ID: <span className="font-mono text-xs">{uploadVideo.data.cid}</span>
                </p>
                <p className="text-sm">
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
          </motion.form>
        )}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          <Button
            size="lg"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden group animate-glow"
            onClick={() => { setShowForm(true); console.log("[UploadSection] Clicked Start Creating Now"); }}
          >
            <span className="relative z-10">Start Creating Now</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 transition duration-300 rounded-full animate-glow" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

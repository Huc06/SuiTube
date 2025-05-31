import { Button } from "@/components/ui/button";
import { Upload, Coins, Shield } from "lucide-react";
import { useWalletAdapter } from "@/lib/WalletAdapter";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

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
  const { addVideo, walletAddress, txResult } = useWalletAdapter();


  // Only get objectId, without module/type
  const VIDEO_LIST_ID = import.meta.env.VITE_VIDEO_LIST_ID || "0x4fd44795dd9757b592bafdfc31f028bfa55d3566ebf435a4e85a89edb2ef87fa";

  const TUSKY_API_URL = "https://api.tusky.io";
  const TUSKY_API_KEY = "abad7807-d55e-49f3-af26-2edc3349ec5f";
  const TUSKY_VAULT_ID = "b62fe52a-9473-4cbe-828e-60b1209b46be"; 

  async function uploadToTusky(file: File): Promise<string> {
    const response = await fetch(`${TUSKY_API_URL}/uploads?vaultId=${TUSKY_VAULT_ID}&filename=${encodeURIComponent(file.name)}`, {
      method: "POST",
      headers: {
        "Api-Key": TUSKY_API_KEY,
        "Content-Type": "application/offset+octet-stream",
        "Content-Length": file.size.toString(),
      },
      body: file,
    });
    if (!response.ok) throw new Error("Tusky upload failed");
    const location = response.headers.get("location");
    if (!location) throw new Error("No location header from Tusky");
    // location dạng: /uploads/{id}
    return location.split("/").pop()!;
  }

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!walletAddress) throw new Error("Please connect your Sui wallet");
      if (!title || !description || !file) throw new Error("Please fill in all information");
      // 1. Upload file lên Tusky
      const tuskyFileId = await uploadToTusky(file);
      // 2. Gọi addVideo với cid là tuskyFileId
      await addVideo({
        title,
        desc: description,
        cid: tuskyFileId,
        owner: walletAddress,
        isShort,
        videoListId: VIDEO_LIST_ID,
      });
    } catch (err: any) {
      // error will be updated by txResult
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
              <Input type="file" accept="video/*" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
            <div className="mb-4 flex items-center gap-2">
              <Switch checked={isShort} onCheckedChange={setIsShort} id="isShort" />
              <label htmlFor="isShort" className="font-medium">Is Short Video?</label>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={txResult.loading}>
              {txResult.loading ? "Sending transaction..." : "Upload Video to Sui"}
            </Button>
            {txResult.error && <div className="text-red-500 mt-2">{txResult.error}</div>}
            {txResult.success && (
              <div className="text-green-600 mt-2">
                Transaction successful!<br />
                Transaction Block:
                <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto mt-1">
                  {txResult.txId ? (
                    <a
                      href={`https://testnet.suivision.xyz/txblock/${txResult.txId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {txResult.txId}
                    </a>
                  ) : txResult.rawResponse?.digest ? (
                    <a
                      href={`https://testnet.suivision.xyz/txblock/${txResult.rawResponse.digest}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {txResult.rawResponse.digest}
                    </a>
                  ) : (
                    JSON.stringify(txResult.rawResponse, null, 2)
                  )}
                </pre>
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
            onClick={() => setShowForm(true)}
          >
            <span className="relative z-10">Start Creating Now</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 transition duration-300 rounded-full animate-glow" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

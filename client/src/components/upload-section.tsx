import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Coins, Shield } from "lucide-react";
import { useWalletAdapter } from "@/lib/WalletAdapter";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function UploadSection() {
  const features = [
    {
      icon: Upload,
      title: "Upload Instantly",
      description: "Drag and drop your videos for instant IPFS storage",
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

  // --- Wallet Adapter ---
  const { addVideo, walletAddress, txResult } = useWalletAdapter();


  // Only get objectId, without module/type
  const VIDEO_LIST_ID = import.meta.env.VITE_VIDEO_LIST_ID || "0x4fd44795dd9757b592bafdfc31f028bfa55d3566ebf435a4e85a89edb2ef87fa";

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!walletAddress) throw new Error("Please connect your Sui wallet");
      if (!title || !description || !cid) throw new Error("Please fill in all information");
      await addVideo({
        title,
        desc: description,
        cid,
        owner: walletAddress,
        isShort,
        videoListId: VIDEO_LIST_ID, // Ensure it's objectId
      });
    } catch (err: any) {
      // error will be updated by txResult
    }
  };

  return (
    <section className="bg-white py-12 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Create?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Upload your content to the decentralized web and start earning SUI tokens
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* --- Upload Form --- */}
        {showForm && (
          <form onSubmit={handleAddVideo} className="max-w-xl mx-auto bg-gray-50 rounded-xl p-6 shadow mb-8 text-left">
            <h4 className="text-xl font-semibold mb-4">Upload Video</h4>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Title</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Video title" />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">IPFS CID</label>
              <Input value={cid} onChange={e => setCid(e.target.value)} placeholder="Qm..." />
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
          </form>
        )}
        
        <Button
          size="lg"
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          onClick={() => setShowForm(true)}
        >
          Start Creating Now
        </Button>
      </div>
    </section>
  );
}

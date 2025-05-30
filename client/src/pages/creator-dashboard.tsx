import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Coins, Users, HardDrive, CloudUpload, BarChart3 } from "lucide-react";
import { mockVideos, mockUsers } from "@/lib/mock-data";

export default function CreatorDashboard() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const stats = {
    totalViews: 47823,
    suiEarnings: 1234.56,
    subscribers: 8567,
    storageUsed: 2.4,
    storageTotal: 3,
  };

  const recentVideos = mockVideos.slice(0, 3);

  const handleFileUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Studio</h1>
          <p className="text-gray-600">Manage your content and track your earnings on the decentralized web</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-green-600">+12.5%</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">SUI Earnings</p>
                  <p className="text-2xl font-bold gradient-text">{stats.suiEarnings}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full text-white">
                  <Coins className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-green-600">+28.3%</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.subscribers.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-green-600">+15.7%</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">IPFS Storage</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.storageUsed} GB</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <HardDrive className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-blue-600">
                  {Math.round((stats.storageUsed / stats.storageTotal) * 100)}% used
                </span>
                <span className="text-sm text-gray-500 ml-2">of {stats.storageTotal} GB plan</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload New Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition-colors">
              <CloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Drag and drop your video here</h3>
              <p className="text-gray-600 mb-4">or click to browse files</p>
              <Button
                onClick={handleFileUpload}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                disabled={isUploading}
              >
                Select File
              </Button>
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="hexagon scale-50" />
                <span>Automatically stored on IPFS via Walrus</span>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-6">
                <Progress value={uploadProgress} className="mb-2" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Uploading to IPFS...</span>
                  <span className="text-blue-600 font-medium">{uploadProgress}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Videos */}
        <Card>
          <CardHeader>
            <CardTitle>Your Recent Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentVideos.map((video) => {
                    const creator = mockUsers.find(user => user.id === video.creatorId);
                    return (
                      <tr key={video.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={video.thumbnailUrl || ""}
                              alt={video.title}
                              className="w-16 h-10 object-cover rounded"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{video.title}</div>
                              <div className="text-sm text-gray-500">2 days ago</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {video.views?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium gradient-text">
                            {video.suiRewards} SUI
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-green-100 text-green-800 flex items-center space-x-1 w-fit">
                            <div className="hexagon scale-25" />
                            <span>On IPFS</span>
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                          <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0">
                            Edit
                          </Button>
                          <Button variant="link" className="text-gray-600 hover:text-gray-900 p-0">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Analytics
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

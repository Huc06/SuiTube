import { Link } from "wouter";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Header() {
  const currentAccount = useCurrentAccount();

  const formatAddress = (address: string) => {
    return `0x${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-green-500">
              SuiTube
            </h1>
          </Link>

          {/* Right Side - Create Button & Wallet */}
          <div className="flex items-center space-x-4">
            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6"
              onClick={() => {
                const uploadSection = document.getElementById('upload-section');
                uploadSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Create
            </Button>
            
            {currentAccount ? (
              <div className="text-sm font-mono text-gray-700">
                {formatAddress(currentAccount.address)}
              </div>
            ) : (
              <ConnectButton className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-4 py-2 text-sm" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ConnectButton, useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Menu, Video, Bell, Wallet, LogOut } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

export default function Header() {
  const [location] = useLocation();
  const isMobile = useMobile();
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            {isMobile && (
              <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2 min-w-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Video className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                SuiTube
              </h1>
              <Badge variant="secondary" className="bg-blue-600 text-white text-xs hidden sm:inline-flex">
                BETA
              </Badge>
            </Link>
          </div>

          {/* Search Bar - Desktop Only */}
          {!isMobile && (
            <div className="flex-1 max-w-md lg:max-w-2xl mx-4 lg:mx-8">
              <div className="relative flex">
                <Input
                  type="text"
                  placeholder="Search videos, creators..."
                  className="w-full rounded-l-full border-r-0 focus:ring-2 focus:ring-blue-600 text-sm"
                />
                <Button
                  size="sm"
                  className="rounded-l-none rounded-r-full border-l-0 bg-gray-100 text-gray-600 hover:bg-gray-200 px-3"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Search Icon */}
          {isMobile && (
            <Button variant="ghost" size="sm" className="p-1 sm:p-2">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Wallet Connection */}
            <div className="flex items-center">
              {currentAccount ? (
                <div className="flex items-center space-x-2">
                  {/* Desktop Wallet Info */}
                  {!isMobile && (
                    <div className="wallet-connected text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2">
                      <Wallet className="h-3 w-3" />
                      <span className="hidden sm:inline">
                        {formatAddress(currentAccount.address)}
                      </span>
                      <span className="sm:hidden">
                        {currentAccount.address.slice(0, 4)}...
                      </span>
                    </div>
                  )}
                  
                  {/* Mobile Wallet Icon */}
                  {isMobile && (
                    <Button variant="ghost" size="sm" className="p-1">
                      <Wallet className="h-4 w-4 text-blue-600" />
                    </Button>
                  )}
                  
                  {/* Disconnect Button */}
                  {!isMobile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => disconnect()}
                      className="p-1 sm:p-2"
                    >
                      <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center">
                  {!isMobile ? (
                    <ConnectButton className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-3 py-1.5 rounded-full font-medium" />
                  ) : (
                    <ConnectButton className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium" />
                  )}
                </div>
              )}
            </div>

            {/* Notifications - Hidden on very small screens */}
            <Button variant="ghost" size="sm" className="relative p-1 sm:p-2 hidden xs:inline-flex">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
            </Button>

            {/* Profile Avatar */}
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
              <AvatarFallback className="text-xs sm:text-sm">
                {currentAccount ? currentAccount.address.slice(2, 4).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}

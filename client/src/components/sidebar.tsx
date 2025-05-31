import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  TrendingUp,
  Play,
  Heart,
  BarChart3,
  Coins,
  Upload,
  Box,
  History,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const navigationItems = [
    { label: "Home", href: "/", icon: Home, active: location === "/" },
    { label: "Trending", href: "/trending", icon: TrendingUp },
    { label: "Shorts", href: "/shorts", icon: Play, badge: "NEW" },
    { label: "Subscriptions", href: "/subscriptions", icon: Heart },
  ];

  const blockchainItems = [
    { label: "Rewards", href: "/rewards", icon: Coins },
    { label: "Creator Studio", href: "/creator-dashboard", icon: BarChart3 },
    { label: "walrus Storage", href: "/storage", icon: Box },
  ];

  const libraryItems = [
    { label: "History", href: "/history", icon: History },
    { label: "Liked videos", href: "/liked", icon: ThumbsUp },
  ];

  return (
    <aside
      className={`${isCollapsed ? "w-16" : "w-48 lg:w-64"} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-14 sm:top-16 transition-all duration-300`}
    >
      <nav className="flex-1 px-2 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto">
        {/* Toggle Button */}
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="p-2"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            )}
          </Button>
        </div>
        {/* Main Navigation */}
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={item.active ? "secondary" : "ghost"}
              className={`w-full justify-start text-xs sm:text-sm flex items-center gap-2 ${
                item.active
                  ? "bg-gray-100 dark:bg-gray-800 text-blue-600"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="font-medium truncate">{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-auto text-xs bg-blue-600 text-white hidden lg:inline-flex">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          </Link>
        ))}

        <hr className="my-2 sm:my-4 border-gray-200 dark:border-gray-700" />

        {/* Blockchain Section */}
        <div className="space-y-1 sm:space-y-2">
          {!isCollapsed && (
            <h3 className="px-1 sm:px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:block">
              Blockchain
            </h3>
          )}
          {blockchainItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start text-xs sm:text-sm flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Button>
            </Link>
          ))}
        </div>

        <hr className="my-2 sm:my-4 border-gray-200 dark:border-gray-700" />

        {/* My Rewards Section */}
        {!isCollapsed && (
          <div className="space-y-1 sm:space-y-2">
            <h3 className="px-1 sm:px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:block">
              My Rewards
            </h3>
            <div className="px-2 sm:px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">SUI Balance</span>
                <span className="font-bold gradient-text text-xs sm:text-sm">1,234.56</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">Earned this month</div>
            </div>
          </div>
        )}

        <hr className="my-4" />

        {/* Library Section */}
        <div className="space-y-2">
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Library
            </h3>
          )}
          {libraryItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}

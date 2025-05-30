import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Play, PlusCircle, Heart, Wallet } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { label: "Home", href: "/", icon: Home, active: location === "/" },
    { label: "Shorts", href: "/shorts", icon: Play, active: location === "/shorts" },
    { label: "Upload", href: "/creator-dashboard", icon: PlusCircle, active: location === "/creator-dashboard" },
    { label: "Library", href: "/library", icon: Heart, active: location === "/library" },
    { label: "Wallet", href: "/wallet", icon: Wallet, active: location === "/wallet" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40 safe-area-bottom">
      <div className="grid grid-cols-5 h-12 sm:h-16">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={`h-full w-full flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 rounded-none px-1 ${
                item.active 
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-xs font-medium truncate leading-tight">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
}

import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, PlusCircle } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems: Array<
    | { label: string; href: string; icon: typeof Home }
    | { label: string; onClick: () => void; icon: typeof PlusCircle }
  > = [
    { label: "Home", href: "/", icon: Home },
    {
      label: "Create",
      onClick: () => {
        const uploadSection = document.getElementById("upload-section");
        uploadSection?.scrollIntoView({ behavior: "smooth" });
      },
      icon: PlusCircle,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40 safe-area-bottom">
      <div
        className="grid h-12 sm:h-16"
        style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
      >
        {navItems.map((item, idx) => {
          const Content = (
            <Button
              key={item.label}
              variant="ghost"
              className={`h-full w-full flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 rounded-none px-1 ${
                "href" in item && location === item.href
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-xs font-medium truncate leading-tight">{item.label}</span>
            </Button>
          );

          if ("href" in item) {
            return (
              <Link key={item.href} href={item.href}>
                {Content}
              </Link>
            );
          }

          return (
            <button
              key={idx}
              className="h-full w-full"
              onClick={(event) => {
                event.preventDefault();
                item.onClick();
              }}
            >
              {Content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

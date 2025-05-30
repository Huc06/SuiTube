import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import BottomNavigation from "@/components/bottom-navigation";
import Home from "@/pages/home";
import Shorts from "@/pages/shorts";
import CreatorDashboard from "@/pages/creator-dashboard";
import VideoPlayer from "@/pages/video-player";
import NotFound from "@/pages/not-found";
import { useMobile } from "@/hooks/use-mobile";

// Networks that can be used
const networks = {
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
};

function Router() {
  const isMobile = useMobile();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        {!isMobile && <Sidebar />}
        <main className={`flex-1 ${isMobile ? 'pb-16' : 'pb-4'} transition-all duration-300`}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/shorts" component={Shorts} />
            <Route path="/creator-dashboard" component={CreatorDashboard} />
            <Route path="/video/:id" component={VideoPlayer} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      {isMobile && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;

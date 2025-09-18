import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import TouristApp from "./pages/TouristApp";
import AdminDashboard from "./pages/AdminDashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{
    type: 'tourist' | 'admin' | null;
    data: any;
  }>({ type: null, data: null });

  const handleLogin = (userType: 'tourist' | 'admin', userData: any) => {
    setUser({ type: userType, data: userData });
  };

  const handleLogout = () => {
    setUser({ type: null, data: null });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {!user.type ? (
              <>
                <Route path="/" element={<AuthPage onLogin={handleLogin} />} />
                <Route path="/demo" element={<Index />} />
                <Route path="*" element={<AuthPage onLogin={handleLogin} />} />
              </>
            ) : user.type === 'tourist' ? (
              <>
                <Route path="/" element={<TouristApp user={user.data} onLogout={handleLogout} />} />
                <Route path="*" element={<TouristApp user={user.data} onLogout={handleLogout} />} />
              </>
            ) : (
              <>
                <Route path="/" element={<AdminDashboard user={user.data} onLogout={handleLogout} />} />
                <Route path="*" element={<AdminDashboard user={user.data} onLogout={handleLogout} />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

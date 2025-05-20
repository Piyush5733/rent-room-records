
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RentProvider } from "@/context/RentContext";
import Index from "./pages/Index";
import RoomPage from "./pages/RoomPage";
import AddRentPage from "./pages/AddRentPage";
import EditRoomPage from "./pages/EditRoomPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RentProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/room/:id" element={<RoomPage />} />
            <Route path="/room/:id/add-rent" element={<AddRentPage />} />
            <Route path="/room/:id/edit" element={<EditRoomPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </RentProvider>
  </QueryClientProvider>
);

export default App;

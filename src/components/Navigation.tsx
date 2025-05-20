
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  title?: string;
  showBackButton?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-10 border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2 text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {isHomePage ? (
            <div className="flex items-center">
              <span className="font-bold text-lg text-primary">Rent Tracker</span>
            </div>
          ) : (
            <h1 className="text-lg font-medium">{title}</h1>
          )}
        </div>

        {!isHomePage && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-gray-700"
          >
            <Home className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navigation;

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-contexts";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-accent-blue border-t-transparent" />
          <p className="text-lg text-text-primary font-medium">
            Authenticating
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
};
